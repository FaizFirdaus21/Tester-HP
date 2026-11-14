// Kerangka bersama Reels Papan Kapur 7 blok (hook · penjelasan · perumpamaan · efek · akibat · solusi · CTA).
// Dipakai mulai Reels 15–16 Nov. Paylater dan "gaya hidup ikut naik" masih memakai salinan lokal (sudah terjadwal).
//
// Tata letak papan: A(0,0) B(1,0) C(0,1) D(1,1) E(0,2) F(1,2), G = baris 3 selebar 2 kolom.
// Kamera: 2,5D di pembuka, di perumpamaan (C), dan tarikan mundur ke CTA.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Coret, FilterKapur, Titik, garis, p01 } from "./Komponen";
import { KunciKamera, Papan } from "./Papan";
import { d, font, sel } from "./tema";
import { SuaraVO } from "../catatan/Komponen";
import { BarisSubtitel, DataVO, jadwalVO, padaFrasa, peringatkan, perkiraanVO, rapatkanVO, subtitelDariBlok } from "../catatan/Jadwal";

export type Naskah = { blok: { teks: string }[] };

export const A = sel(0, 0);
export const B = sel(1, 0);
export const C = sel(0, 1);
export const D = sel(1, 1);
export const E = sel(0, 2);
export const F = sel(1, 2);
export const G = { x: 1080, y0: 5760 };

const PINDAH = 0.3; // perpindahan kamera total 0,6 s (aturan 14 Nov)

/** Jadwal + kamera + fungsi waktu frasa untuk satu Reels. */
export const buatReels = (vo: DataVO, naskah: Naskah) => {
  const VO = rapatkanVO(vo, { jeda: 0.4 });
  const J = jadwalVO(VO, { b0: 0, b1: 1, b2: 2, b3: 3, b4: 4, b5: 5, b6: 6, akhir: "selesai" }, perkiraanVO(naskah as never), { awal: 0.4, ekor: 1.4 });
  const T = J.T;
  const MULAI = [T.b0, T.b1, T.b2, T.b3, T.b4, T.b5, T.b6];
  const batas = (i: number) => (i + 1 < MULAI.length ? MULAI[i + 1] - PINDAH : T.akhir);
  /** Frame saat `frasa` diucapkan di blok i; peringatan bila elemen (`lama` frame) belum selesai saat kamera pindah. */
  const W = (i: number, frasa: string, geser = 0, lama = 0) => {
    const f = d(padaFrasa(J, i, naskah.blok[i].teks, frasa, geser));
    if (f + lama > d(batas(i))) peringatkan(`blok ${i} "${frasa}": selesai di frame ${f + lama}, kamera pindah di ${d(batas(i))}`);
    return f;
  };
  const fokus = (s: { x: number; y0: number }) => ({ x: s.x, y: s.y0 + 880 });
  const kamera: KunciKamera[] = [
    // frame 0 tegak dan utuh: hook harus terbaca sejak frame pertama (aturan 14 Nov)
    { f: 0, ...fokus(A), s: 1.0 },
  ];
  const bagian = [A, B, C, D, E, F];
  for (let i = 1; i < bagian.length; i++) {
    kamera.push({ f: d(MULAI[i] - PINDAH), ...fokus(bagian[i - 1]), s: 1.05, ry: i % 2 ? 2 : -2 });
    if (i === 2) {
      kamera.push({ f: d(MULAI[i] + PINDAH), ...fokus(bagian[i]), s: 1.02, rx: 10, ry: 9, rz: 1 });
      kamera.push({ f: d(MULAI[i] + 2.4), ...fokus(bagian[i]), s: 1.0 });
    } else {
      kamera.push({ f: d(MULAI[i] + PINDAH), ...fokus(bagian[i]), s: 1.0, ry: i % 2 ? -3 : 3 });
    }
  }
  kamera.push({ f: d(T.b6 - PINDAH), ...fokus(F), s: 1.05 });
  kamera.push({ f: d(T.b6 + 0.9), x: 1080, y: 3600, s: 0.42, rx: 20, ry: -10, rz: -1.5 });
  kamera.push({ f: d(T.b6 + 2.0), x: G.x, y: G.y0 + 880, s: 0.6, rx: 4 });
  kamera.push({ f: d(T.akhir), x: G.x, y: G.y0 + 900, s: 0.64, rx: 0, ry: 2 });
  /** Frame judul bagian i mulai ditulis: saat kamera berangkat, supaya papan tidak kosong saat kamera tiba. */
  const tiba = (i: number) => d(MULAI[i] - PINDAH);
  return { VO, J, T, W, tiba, kamera, durasi: d(T.akhir) };
};

// ---------------------------------------------------------------- bentuk kecil
export const kotak = (x: number, y: number, w: number, h: number, seed: number): Titik[] => [
  ...garis(x, y, x + w, y, seed, 2),
  ...garis(x + w, y, x + w, y + h, seed + 1, 2),
  ...garis(x + w, y + h, x, y + h, seed + 2, 2),
  ...garis(x, y + h, x, y + 4, seed + 3, 2),
];
export const persegi = (x: number, y: number, w: number, h: number): Titik[] => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
export const centang = (x: number, y: number, s = 1): Titik[] => [[x, y], [x + 22 * s, y + 30 * s], [x + 70 * s, y - 40 * s]];
export const pesawat = (x: number, y: number, s: number): Titik[][] => [
  [[x, y + 60 * s], [x + 260 * s, y], [x + 120 * s, y + 150 * s], [x + 95 * s, y + 90 * s], [x, y + 60 * s]],
  [[x + 95 * s, y + 90 * s], [x + 260 * s, y]],
];
/** Ikon simpan (bookmark). */
export const bookmark = (x: number, y: number, s: number): Titik[] => [[x, y], [x + 120 * s, y], [x + 120 * s, y + 170 * s], [x + 60 * s, y + 120 * s], [x, y + 170 * s], [x, y]];
/** Busur (melingkar) dari sudut a0 ke a1 (radian). */
export const busur = (cx: number, cy: number, r: number, a0: number, a1: number, n = 24): Titik[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as Titik;
  });

/** Ilustrasi diam yang muncul (fade + naik sedikit). Koordinat anak = koordinat papan. */
export const Muncul: React.FC<{ mulai: number; children: React.ReactNode }> = ({ mulai, children }) => {
  const fr = useCurrentFrame();
  const p = p01(fr, mulai, 10);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: 0, top: (1 - p) * 24, opacity: p }}>{children}</div>;
};

/** Checklist kapur: kotak digambar saat frasa `f`, centang hijau saat frasa `c`. */
export const Checklist: React.FC<{ x: number; y: number; jarak: number; baris: { kotak: number; centang: number; teks: React.ReactNode }[] }> = ({ x, y, jarak, baris }) => (
  <>
    {baris.map((r, i) => {
      const yy = y + i * jarak;
      return (
        <React.Fragment key={i}>
          <Coret pts={kotak(x, yy - 40, 80, 80, 50 + i)} mulai={r.kotak} lama={10} tebal={5} kapur={false} />
          {r.teks}
          <Coret pts={centang(x + 15, yy - 5, 1.1)} mulai={r.centang} lama={8} warna="#A8E0B0" tebal={9} />
        </React.Fragment>
      );
    })}
  </>
);

// ---------------------------------------------------------------- subtitel
const BarisSub: React.FC<{ teks: string; lama: number; langsung?: boolean }> = ({ teks, lama, langsung }) => {
  const fr = useCurrentFrame();
  const o = Math.min(langsung ? 1 : p01(fr, 0, 4), 1 - p01(fr, lama - 3, 3));
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1300, height: 180, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: font.sans, fontWeight: 650, fontSize: 44, lineHeight: 1.3, color: "#fbfaf4", opacity: o, textShadow: "0 2px 3px rgba(0,0,0,0.8), 0 0 24px rgba(0,0,0,0.65)" }}>
      {teks}
    </div>
  );
};

/** Video lengkap: papan + kamera + subtitel (TEKS_TAMPIL per blok, "" = tanpa subtitel) + suara VO. */
export const ReelsPapan: React.FC<{ r: ReturnType<typeof buatReels>; teksTampil: string[]; subtitel?: boolean; children: React.ReactNode }> = ({ r, teksTampil, subtitel = true, children }) => {
  // Subtitel aktif sejak frame 0 (aturan 14 Nov): potongan pertama ditarik ke detik 0 dan tampil tanpa fade.
  const sub: BarisSubtitel[] = subtitelDariBlok(r.J, teksTampil, 38)
    .filter((s) => s.selesai - s.mulai > 0.2)
    .map((s, i) => (i === 0 ? { ...s, mulai: 0 } : s));
  const layar = subtitel ? (
    <>
      {sub.map((s, i) => {
        const lama = Math.max(1, d(s.selesai) - d(s.mulai));
        return (
          <Sequence key={i} from={d(s.mulai)} durationInFrames={lama} layout="none">
            <BarisSub teks={s.teks} lama={lama} langsung={s.mulai === 0} />
          </Sequence>
        );
      })}
    </>
  ) : null;
  return (
    <AbsoluteFill style={{ background: "#0f0d0b" }}>
      <FilterKapur />
      <Papan kunci={r.kamera} layar={layar}>
        {children}
      </Papan>
      {r.J.ada ? <SuaraVO vo={r.VO} awal={r.J.awal} /> : null}
    </AbsoluteFill>
  );
};
