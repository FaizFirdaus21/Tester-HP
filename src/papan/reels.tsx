// Kerangka bersama Reels Papan Kapur 7 blok (hook · penjelasan · perumpamaan · efek · akibat · solusi · CTA).
// Dipakai mulai Reels 15–16 Nov. Paylater dan "gaya hidup ikut naik" masih memakai salinan lokal (sudah terjadwal).
//
// Tata letak papan: A(0,0) B(1,0) C(0,1) D(1,1) E(0,2) F(1,2), G = baris 3 selebar 2 kolom.
// Kamera: 2,5D di pembuka, di perumpamaan (C), dan tarikan mundur ke CTA.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
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

const PINDAH_BAWAAN = 0.3; // perpindahan kamera total 0,6 s (aturan 14 Nov)

type Sel = { x: number; y0: number };
export type OpsiReels = {
  /** Bagian papan untuk blok 0..n-2 (blok terakhir = CTA). Bawaan v1 (7 blok): A–F. */
  bagian?: Sel[];
  /** Posisi CTA (selebar 2 kolom). Bawaan v1: baris 3. */
  cta?: Sel;
  /** Akhir video kembali ke bingkai hook (A) supaya frame terakhir menyambung ke frame 0 saat diputar ulang. */
  loop?: boolean;
  /** Detik kamera berangkat sebelum blok berikutnya (perpindahan total = 2×). Bawaan 0,3. */
  pindah?: number;
  /** CTA satu sel layar (kamera langsung pindah, tanpa tarikan mundur 2 s). Bawaan false (CTA lebar 2 kolom). */
  ctaSel?: boolean;
  /** Ukuran subtitel (px). Bawaan 44. */
  subUkuran?: number;
  /** Efek suara di detik 0 (path di public/), mis. "sfx/tak-kapur.wav". */
  sfx?: string;
};

/** Reels v2 (5 blok, mulai 17 Nov): hook, inti, perumpamaan+akibat, solusi, CTA di baris 2, akhir menyambung ke hook. */
export const TATA_V2: OpsiReels = { bagian: [A, B, C, D], cta: { x: 1080, y0: 3840 }, loop: true };

/** Reels v3 (3 blok, 15–25 s, mulai 19 Nov; docs/sprint-7-hari.md): A angka raksasa (hook), B fakta + efek, C aksi + CTA.
 *  Kamera pindah 0,4 s, CTA satu sel tanpa tarikan mundur, subtitel besar, SFX di detik 0, akhir kembali ke hook. */
export const TATA_V3: OpsiReels = { bagian: [A, B], cta: { x: C.x, y0: C.y0 }, loop: true, pindah: 0.2, ctaSel: true, subUkuran: 58, sfx: "sfx/tak-kapur.wav" };

const KEMBALI_V2 = 0.6; // detik kamera kembali dari CTA ke hook di akhir (loop)

/** Jadwal + kamera + fungsi waktu frasa untuk satu Reels. */
export const buatReels = (vo: DataVO, naskah: Naskah, opsi: OpsiReels = {}) => {
  const PINDAH = opsi.pindah ?? PINDAH_BAWAAN;
  const KEMBALI = opsi.ctaSel ? 2 * PINDAH : KEMBALI_V2;
  const bagian = opsi.bagian ?? [A, B, C, D, E, F];
  const cta = opsi.cta ?? G;
  const n = bagian.length + 1;
  if (naskah.blok.length !== n) peringatkan(`naskah ${naskah.blok.length} blok, tata papan untuk ${n} blok`);
  const isyarat: Record<string, number | "selesai"> = { akhir: "selesai" };
  for (let i = 0; i < n; i++) isyarat[`b${i}`] = i;
  const VO = rapatkanVO(vo, { jeda: 0.4 });
  const J = jadwalVO(VO, isyarat as never, perkiraanVO(naskah as never), { awal: 0.4, ekor: 1.4 + (opsi.loop ? KEMBALI : 0) });
  const T = J.T as Record<string, number>;
  const MULAI = Array.from({ length: n }, (_, i) => T[`b${i}`]);
  const akhir = T.akhir;
  const batas = (i: number) => (i + 1 < MULAI.length ? MULAI[i + 1] - PINDAH : akhir - (opsi.loop ? KEMBALI : 0));
  /** Frame saat `frasa` diucapkan di blok i; peringatan bila elemen (`lama` frame) belum selesai saat kamera pindah. */
  const W = (i: number, frasa: string, geser = 0, lama = 0) => {
    const f = d(padaFrasa(J, i, naskah.blok[i].teks, frasa, geser));
    if (f + lama > d(batas(i))) peringatkan(`blok ${i} "${frasa}": selesai di frame ${f + lama}, kamera pindah di ${d(batas(i))}`);
    return f;
  };
  const fokus = (s: Sel) => ({ x: s.x, y: s.y0 + 880 });
  const kamera: KunciKamera[] = [
    // frame 0 tegak dan utuh: hook harus terbaca sejak frame pertama (aturan 14 Nov)
    { f: 0, ...fokus(A), s: 1.0 },
  ];
  for (let i = 1; i < bagian.length; i++) {
    kamera.push({ f: d(MULAI[i] - PINDAH), ...fokus(bagian[i - 1]), s: 1.05, ry: i % 2 ? 2 : -2 });
    if (i === 2) {
      kamera.push({ f: d(MULAI[i] + PINDAH), ...fokus(bagian[i]), s: 1.02, rx: 10, ry: 9, rz: 1 });
      kamera.push({ f: d(MULAI[i] + 2.4), ...fokus(bagian[i]), s: 1.0 });
    } else {
      kamera.push({ f: d(MULAI[i] + PINDAH), ...fokus(bagian[i]), s: 1.0, ry: i % 2 ? -3 : 3 });
    }
  }
  const tc = MULAI[n - 1];
  if (opsi.ctaSel) {
    // v3: CTA satu sel, perpindahan biasa; akhir: CTA tertahan lalu kembali ke hook
    kamera.push({ f: d(tc - PINDAH), ...fokus(bagian[bagian.length - 1]), s: 1.05, ry: 2 });
    kamera.push({ f: d(tc + PINDAH), ...fokus(cta), s: 1.0, ry: -2 });
    kamera.push({ f: d(akhir - KEMBALI), ...fokus(cta), s: 1.04 });
    kamera.push({ f: d(akhir) - 1, ...fokus(A), s: 1.0 });
    const tiba = (i: number) => d(MULAI[i] - PINDAH);
    return { VO, J, T, MULAI, W, tiba, kamera, cta, opsi, durasi: d(akhir) };
  }
  const tengahY = (cta.y0 + 1920) / 2;
  kamera.push({ f: d(tc - PINDAH), ...fokus(bagian[bagian.length - 1]), s: 1.05 });
  kamera.push({ f: d(tc + 0.9), x: 1080, y: tengahY, s: 0.42, rx: 20, ry: -10, rz: -1.5 });
  kamera.push({ f: d(tc + 2.0), x: cta.x, y: cta.y0 + 880, s: 0.6, rx: 4 });
  if (opsi.loop) {
    kamera.push({ f: d(akhir - KEMBALI), x: cta.x, y: cta.y0 + 900, s: 0.64, rx: 0, ry: 2 });
    kamera.push({ f: d(akhir) - 1, ...fokus(A), s: 1.0 });
  } else {
    kamera.push({ f: d(akhir), x: cta.x, y: cta.y0 + 900, s: 0.64, rx: 0, ry: 2 });
  }
  /** Frame judul bagian i mulai ditulis: saat kamera berangkat, supaya papan tidak kosong saat kamera tiba. */
  const tiba = (i: number) => d(MULAI[i] - PINDAH);
  return { VO, J, T, MULAI, W, tiba, kamera, cta, opsi, durasi: d(akhir) };
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
const BarisSub: React.FC<{ teks: string; lama: number; langsung?: boolean; ukuran?: number }> = ({ teks, lama, langsung, ukuran = 44 }) => {
  const fr = useCurrentFrame();
  const o = Math.min(langsung ? 1 : p01(fr, 0, 4), 1 - p01(fr, lama - 3, 3));
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1300, height: 180, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: font.sans, fontWeight: ukuran > 44 ? 750 : 650, fontSize: ukuran, lineHeight: ukuran > 44 ? 1.2 : 1.3, color: "#fbfaf4", opacity: o, textShadow: "0 2px 3px rgba(0,0,0,0.8), 0 0 24px rgba(0,0,0,0.65)" }}>
      {teks}
    </div>
  );
};

/** Video lengkap: papan + kamera + subtitel (TEKS_TAMPIL per blok, "" = tanpa subtitel) + suara VO. */
export const ReelsPapan: React.FC<{ r: ReturnType<typeof buatReels>; teksTampil: string[]; subtitel?: boolean; children: React.ReactNode }> = ({ r, teksTampil, subtitel = true, children }) => {
  // Subtitel aktif sejak frame 0 (aturan 14 Nov): potongan pertama ditarik ke detik 0 dan tampil tanpa fade.
  const ukuranSub = r.opsi.subUkuran ?? 44;
  // baris subtitel lebih pendek bila hurufnya lebih besar
  const sub: BarisSubtitel[] = subtitelDariBlok(r.J, teksTampil, Math.round((38 * 44) / ukuranSub))
    .filter((s) => s.selesai - s.mulai > 0.2)
    .map((s, i) => (i === 0 ? { ...s, mulai: 0 } : s));
  const layar = subtitel ? (
    <>
      {sub.map((s, i) => {
        const lama = Math.max(1, d(s.selesai) - d(s.mulai));
        return (
          <Sequence key={i} from={d(s.mulai)} durationInFrames={lama} layout="none">
            <BarisSub teks={s.teks} lama={lama} langsung={s.mulai === 0} ukuran={ukuranSub} />
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
      {r.opsi.sfx ? <Audio src={staticFile(r.opsi.sfx)} volume={0.55} /> : null}
    </AbsoluteFill>
  );
};
