// Reels "Cicilan paylater kecil, kok gajian langsung habis?" (tayang 13 Nov 2026, 19.00) — template Papan Kapur.
// Naskah: produksi/20261112-paylater-1212/naskah-vo.json. Satu blok = satu bagian papan:
//   A hook · B penjelasan (batas 3,75% + bank bisa tutup) · C perumpamaan (sketsa garansi HP) · D efek · E akibat · F solusi · G CTA (lebar 2 kolom)
//
// Sinkron: padaFrasa + jangkar jeda kalimat dari audio. vo-waktu.json di folder ini dibuat dengan:
//   python3 scripts/sinkron_vo.py produksi/20261112-paylater-1212 src/produksi/paylater-1212/vo-waktu.json
// Tanpa audio, waktu diperkirakan dari jumlah kata naskah (perkiraanVO).
//
// Aturan papan: batang kapur hanya saat mencoret/melingkari/menggambar/menandai (Coret, Panah, atau Tulis kapur).
// Efek 2,5D tiga kali saja: kamera miring di pembuka, kamera miring di perumpamaan, dan tarikan mundur ke CTA.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import naskah from "../../../produksi/20261112-paylater-1212/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, FilterKapur, Panah, Titik, Tulis, garis, ikonBank, lingkaran, p01 } from "../../papan/Komponen";
import { KunciKamera, Papan } from "../../papan/Papan";
import { d, font, k, sel } from "../../papan/tema";
import { SuaraVO } from "../../catatan/Komponen";
import { BENDA, Bentuk, Objek, Orang } from "../../papan/ilustrasi";
import { BarisSubtitel, DataVO, jadwalVO, padaFrasa, peringatkan, perkiraanVO, rapatkanVO, subtitelDariBlok } from "../../catatan/Jadwal";

// ---------------------------------------------------------------- jadwal
const VO = rapatkanVO(vo as DataVO, { jeda: 0.4 });
const J = jadwalVO(
  VO,
  { b0: 0, b1: 1, b2: 2, b3: 3, b4: 4, b5: 5, b6: 6, akhir: "selesai" },
  perkiraanVO(naskah),
  { awal: 0.4, ekor: 1.4 }, // slogan selesai ditulis lalu tertahan ±0,5 s
);
const T = J.T;
const MULAI = [T.b0, T.b1, T.b2, T.b3, T.b4, T.b5, T.b6];
export const DURASI_PAYLATER = d(T.akhir);

const PINDAH = 0.45; // detik kamera berangkat sebelum blok berikutnya / tiba sesudahnya
// Batas aman tiap bagian: kamera mulai pindah PINDAH detik sebelum blok berikutnya.
const batasBagian = (i: number) => (i + 1 < MULAI.length ? MULAI[i + 1] - PINDAH : T.akhir);

/** Frame saat `frasa` diucapkan di blok i. `lama` (frame) = berapa lama elemen tergambar; diberi peringatan bila
 *  belum selesai saat kamera sudah pindah dari bagiannya. */
const W = (i: number, frasa: string, geser = 0, lama = 0) => {
  const f = d(padaFrasa(J, i, naskah.blok[i].teks, frasa, geser));
  if (f + lama > d(batasBagian(i))) peringatkan(`blok ${i} "${frasa}"${geser ? ` ${geser > 0 ? "+" : ""}${geser}s` : ""}: selesai di frame ${f + lama}, kamera pindah di ${d(batasBagian(i))}`);
  return f;
};

// ---------------------------------------------------------------- bagian papan
const A = sel(0, 0);
const B = sel(1, 0);
const C = sel(0, 1);
const D = sel(1, 1);
const E = sel(0, 2);
const F = sel(1, 2);
const G = { x: 1080, y0: 5760 }; // baris terakhir, lebar 2 kolom

// ---------------------------------------------------------------- kamera
const fokus = (s: { x: number; y0: number }) => ({ x: s.x, y: s.y0 + 880 });
const KAMERA: KunciKamera[] = (() => {
  const kunci: KunciKamera[] = [
    // 2,5D #1: pembuka miring lalu tegak
    { f: 0, ...fokus(A), y: A.y0 + 840, s: 1.14, rx: 12, ry: -16, rz: -2 },
    { f: d(T.b0 + 1.0), ...fokus(A), s: 1.0 },
  ];
  const bagian = [A, B, C, D, E, F];
  for (let i = 1; i < bagian.length; i++) {
    const asal = bagian[i - 1];
    const tuju = bagian[i];
    kunci.push({ f: d(MULAI[i] - PINDAH), ...fokus(asal), s: 1.05, ry: i % 2 ? 2 : -2 });
    if (i === 2) {
      // 2,5D #2: perumpamaan HP, kamera datang miring lalu pelan-pelan tegak
      kunci.push({ f: d(MULAI[i] + PINDAH), ...fokus(tuju), s: 1.02, rx: 10, ry: 9, rz: 1 });
      kunci.push({ f: d(MULAI[i] + 2.4), ...fokus(tuju), s: 1.0 });
    } else {
      kunci.push({ f: d(MULAI[i] + PINDAH), ...fokus(tuju), s: 1.0, ry: i % 2 ? -3 : 3 });
    }
  }
  // 2,5D #3: mundur memperlihatkan seluruh papan dalam posisi miring, lalu turun ke CTA
  kunci.push({ f: d(T.b6 - PINDAH), ...fokus(F), s: 1.05 });
  kunci.push({ f: d(T.b6 + 0.9), x: 1080, y: 3600, s: 0.42, rx: 20, ry: -10, rz: -1.5 });
  kunci.push({ f: d(T.b6 + 2.0), x: G.x, y: G.y0 + 880, s: 0.6, rx: 4 });
  kunci.push({ f: d(T.akhir), x: G.x, y: G.y0 + 900, s: 0.64, rx: 0, ry: 2 });
  return kunci;
})();

// ---------------------------------------------------------------- bentuk kecil
const kotak = (x: number, y: number, w: number, h: number, seed: number): Titik[] => [
  ...garis(x, y, x + w, y, seed, 2),
  ...garis(x + w, y, x + w, y + h, seed + 1, 2),
  ...garis(x + w, y + h, x, y + h, seed + 2, 2),
  ...garis(x, y + h, x, y + 4, seed + 3, 2),
];
const centang = (x: number, y: number, s = 1): Titik[] => [
  [x, y],
  [x + 22 * s, y + 30 * s],
  [x + 70 * s, y - 40 * s],
];
// Persegi panjang bersudut bulat (badan HP), searah jarum jam dari kiri atas.
const kotakBulat = (x: number, y: number, w: number, h: number, r: number): Titik[] => {
  const pts: Titik[] = [];
  const sudut = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 6; i++) {
      const a = a0 + (i / 6) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  sudut(x + w - r, y + r, -Math.PI / 2);
  sudut(x + w - r, y + h - r, 0);
  sudut(x + r, y + h - r, Math.PI / 2);
  sudut(x + r, y + r, Math.PI);
  pts.push([x + w - r, y + 2]);
  return pts;
};
// Kotak diputar (bingkai cap).
const kotakPutar = (cx: number, cy: number, w: number, h: number, derajat: number): Titik[] => {
  const a = (derajat * Math.PI) / 180;
  const p = (dx: number, dy: number): Titik => [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
  return [p(-w / 2, -h / 2), p(w / 2, -h / 2), p(w / 2, h / 2), p(-w / 2, h / 2), p(-w / 2, -h / 2 + 6)];
};
const zigzag = (x1: number, x2: number, y: number, n: number, amp: number): Titik[] =>
  Array.from({ length: n + 1 }, (_, i) => [x1 + ((x2 - x1) * i) / n, y + (i % 2 ? amp : -amp)] as Titik);
// Pesawat kertas sederhana.
const pesawat = (x: number, y: number, s: number): Titik[][] => [
  [
    [x, y + 60 * s],
    [x + 260 * s, y],
    [x + 120 * s, y + 150 * s],
    [x + 95 * s, y + 90 * s],
    [x, y + 60 * s],
  ],
  [
    [x + 95 * s, y + 90 * s],
    [x + 260 * s, y],
  ],
];

// ---------------------------------------------------------------- isi papan
/** Ilustrasi diam yang muncul (fade + naik sedikit) pada frame `mulai`. Koordinat anak tetap koordinat papan. */
const Muncul: React.FC<{ mulai: number; children: React.ReactNode }> = ({ mulai, children }) => {
  const fr = useCurrentFrame();
  const p = p01(fr, mulai, 10);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: 0, top: (1 - p) * 24, opacity: p }}>{children}</div>;
};

// Struk kapur dengan tepi bawah bergerigi.
const struk = (x: number, y: number, w: number, h: number): Titik[] => {
  const gigi = 8;
  const bawah: Titik[] = Array.from({ length: gigi * 2 + 1 }, (_, i) => [x + w - (w * i) / (gigi * 2), y + h - (i % 2 ? 10 : 0)] as Titik);
  return [[x, y], [x + w, y], ...bawah, [x, y]];
};
const B_ = BENDA;

const IsiPapan: React.FC = () => (
  <>
    {/* ===== A: hook ===== */}
    <Tulis x={A.x} y={A.y0 + 300} teks="cicilan kecil," ukuran={84} mulai={d(0.15)} perHuruf={1.6} rata="center" />
    <Tulis x={A.x} y={A.y0 + 440} teks="gajian" ukuran={170} gaya="tebal" warna={k.kuning} mulai={W(0, "gajian", -0.3)} perHuruf={2.4} rata="center" tebalFilter />
    <Muncul mulai={W(0, "gajian", -0.3)}>
      <B_.uang cx={A.x - 70} cy={A.y0 + 700} s={380} teks="GAJI" />
    </Muncul>
    <Coret pts={garis(A.x0 + 250, A.y0 + 590, A.x0 + 700, A.y0 + 810, 3, 4)} mulai={W(0, "habis", -0.4)} lama={8} warna={k.merah} tebal={12} />
    <Coret pts={garis(A.x0 + 700, A.y0 + 590, A.x0 + 250, A.y0 + 810, 4, 4)} mulai={W(0, "habis", -0.4) + 8} lama={8} warna={k.merah} tebal={12} kapur={false} />
    <Coret
      pts={[
        [A.x0 + 800, A.y0 + 640],
        [A.x0 + 810, A.y0 + 570],
        [A.x0 + 880, A.y0 + 540],
        [A.x0 + 950, A.y0 + 570],
        [A.x0 + 955, A.y0 + 640],
        [A.x0 + 900, A.y0 + 700],
        [A.x0 + 880, A.y0 + 750],
        [A.x0 + 880, A.y0 + 800],
      ]}
      mulai={W(0, "kok", -0.2)}
      lama={10}
      warna={k.merah}
      tebal={16}
    />
    <Coret pts={lingkaran(A.x0 + 880, A.y0 + 865, 9, 9, 2)} mulai={W(0, "kok", -0.2) + 10} lama={3} warna={k.merah} tebal={14} kapur={false} />
    <Tulis x={A.x} y={A.y0 + 1020} teks="langsung habis?" ukuran={110} gaya="hias" warna={k.merah} mulai={W(0, "kok", -0.1, 18)} perHuruf={1.1} rata="center" />

    {/* ===== B: data OJK ===== */}
    <Tulis x={B.x} y={B.y0 + 260} teks="Data OJK · September 2026" ukuran={50} gaya="tipis" warna={k.biru} mulai={W(1, "Data OJK")} perHuruf={1} rata="center" />
    <Tulis x={B.x} y={B.y0 + 440} teks="Rp31,5" ukuran={230} gaya="tebal" warna={k.kuning} mulai={W(1, "tiga puluh satu", -0.2)} perHuruf={4} rata="center" tebalFilter />
    <Tulis x={B.x} y={B.y0 + 610} teks="triliun" ukuran={100} gaya="tebal" mulai={W(1, "triliun", -0.3)} perHuruf={2} rata="center" />
    <Coret pts={garis(B.x - 260, B.y0 + 680, B.x + 260, B.y0 + 672, 5, 3)} mulai={W(1, "triliun")} lama={10} warna={k.kuning} tebal={8} kapur={false} />
    <Tulis x={B.x} y={B.y0 + 750} teks="utang paylater di bank" ukuran={58} mulai={W(1, "utang paylater")} perHuruf={1.2} rata="center" />
    {[0, 1, 2].map((i) => (
      <Muncul key={i} mulai={W(1, "dari tiga") + i * 5}>
        <B_.kartu cx={B.x - 40 + i * 40} cy={B.y0 + 930 - i * 34} s={230} />
      </Muncul>
    ))}
    <Tulis x={B.x} y={B.y0 + 1120} teks="34,5 juta rekening" ukuran={74} gaya="tebal" warna={k.kuning} mulai={W(1, "juta rekening", -0.4)} perHuruf={1.5} rata="center" />

    {/* ===== C: perumpamaan langganan ===== */}
    <Tulis x={C.x} y={C.y0 + 230} teks="Mirip langganan streaming" ukuran={78} gaya="hias" warna={k.biru} mulai={W(2, "mirip langganan")} perHuruf={1.4} rata="center" />
    <Muncul mulai={W(2, "Satu terasa", -0.3)}>
      <B_.hp cx={C.x0 + 260} cy={C.y0 + 560} s={340} teks="1 app" />
    </Muncul>
    <Tulis x={C.x0 + 260} y={C.y0 + 790} teks="ringan" ukuran={60} warna={k.hijauTerang} mulai={W(2, "ringan")} perHuruf={2} rata="center" />
    <Muncul mulai={W(2, "Lima sekaligus", -0.3)}>
      <B_.hp cx={C.x0 + 720} cy={C.y0 + 560} s={340} teks="5 app" />
    </Muncul>
    {[0, 1, 2, 3, 4].map((i) => (
      <Muncul key={i} mulai={W(2, "Lima sekaligus") + i * 3}>
        <Bentuk pts={[[C.x0 + 660 + (i % 3) * 45, C.y0 + 610 + Math.floor(i / 3) * 45], [C.x0 + 695 + (i % 3) * 45, C.y0 + 610 + Math.floor(i / 3) * 45], [C.x0 + 695 + (i % 3) * 45, C.y0 + 645 + Math.floor(i / 3) * 45], [C.x0 + 660 + (i % 3) * 45, C.y0 + 645 + Math.floor(i / 3) * 45], [C.x0 + 660 + (i % 3) * 45, C.y0 + 610 + Math.floor(i / 3) * 45]]} warna={k.merah} garis={k.merah} isi={0.5} tebal={4} />
      </Muncul>
    ))}
    <Tulis x={C.x0 + 720} y={C.y0 + 790} teks="tiap bulan" ukuran={60} gaya="tebal" warna={k.merah} mulai={W(2, "tiap bulan", -0.3)} perHuruf={1.6} rata="center" />
    <Panah x1={C.x0 + 720} y1={C.y0 + 840} x2={C.x0 + 640} y2={C.y0 + 960} tinggi={30} mulai={W(2, "kerasa", -0.3)} lama={10} warna={k.merah} tebal={6} />
    <Muncul mulai={W(2, "kerasa")}>
      <B_.uang cx={C.x0 + 520} cy={C.y0 + 1010} s={200} teks="Rp" />
    </Muncul>
    <Tulis x={C.x0 + 740} y={C.y0 + 1010} teks="kerasa!" ukuran={70} gaya="hias" warna={k.merah} mulai={W(2, "kerasa", 0.1)} perHuruf={2} />

    {/* ===== D: efek menumpuk ===== */}
    <Tulis x={D.x} y={D.y0 + 240} teks="numpuk tanpa terasa" ukuran={84} gaya="tebal" mulai={W(3, "gampang menumpuk", -0.4)} perHuruf={1.4} rata="center" />
    {[0, 1, 2, 3].map((i) => (
      <Muncul key={i} mulai={W(3, "Cicilan kecil") + i * 9}>
        <Bentuk pts={struk(D.x0 + 120 + i * 22, D.y0 + 860 - i * 130, 330, 120)} warna={k.putih} isi={0.12} tebal={5} />
        <Tulis x={D.x0 + 285 + i * 22} y={D.y0 + 915 - i * 130} teks="Rp200 rb" ukuran={52} gaya="tebal" warna={k.kuning} mulai={-9999} rata="center" />
      </Muncul>
    ))}
    <Muncul mulai={W(3, "apalagi", -0.2)}>
      <B_.kalender cx={D.x0 + 770} cy={D.y0 + 620} s={280} teks="DES" />
    </Muncul>
    <Coret pts={lingkaran(D.x0 + 770, D.y0 + 620, 190, 190, 5)} mulai={W(3, "dua belas", -0.2)} lama={14} warna={k.merah} tebal={7} />
    <Tulis x={D.x0 + 770} y={D.y0 + 880} teks="12.12" ukuran={110} gaya="tebal" warna={k.merah} mulai={W(3, "dua belas")} perHuruf={2.5} rata="center" tebalFilter />
    <Tulis x={D.x} y={D.y0 + 1110} teks="beberapa aplikasi sekaligus" ukuran={50} gaya="tipis" warna={k.biru} mulai={W(3, "beberapa aplikasi")} perHuruf={1} rata="center" />

    {/* ===== E: akibat — contoh hitungan + SLIK ===== */}
    <Tulis x={E.x0 + 110} y={E.y0 + 220} teks="Contoh:" ukuran={84} gaya="hias" warna={k.biru} mulai={W(4, "Contohnya")} perHuruf={2} />
    <Tulis x={E.x} y={E.y0 + 360} teks="5 × Rp200 rb" ukuran={96} gaya="tebal" mulai={W(4, "lima cicilan")} perHuruf={2} rata="center" />
    <Tulis x={E.x} y={E.y0 + 480} teks="= Rp1 jt / bulan" ukuran={96} gaya="tebal" warna={k.kuning} mulai={W(4, "sejuta", -0.2)} perHuruf={1.8} rata="center" tebalFilter />
    <Muncul mulai={W(4, "seperlima", -0.4)}>
      <Bentuk pts={lingkaran(E.x0 + 290, E.y0 + 720, 130, 130, 3)} warna={k.hijauTerang} garis={k.putih} isi={0.18} tebal={6} />
    </Muncul>
    <Muncul mulai={W(4, "seperlima")}>
      <Bentuk
        pts={[[E.x0 + 290, E.y0 + 720], ...Array.from({ length: 13 }, (_, i) => { const a = -Math.PI / 2 + (i / 12) * (Math.PI * 2) / 5; return [E.x0 + 290 + Math.cos(a) * 130, E.y0 + 720 + Math.sin(a) * 130] as Titik; }), [E.x0 + 290, E.y0 + 720]]}
        warna={k.merah}
        garis={k.merah}
        isi={0.55}
        tebal={6}
      />
      <Tulis x={E.x0 + 470} y={E.y0 + 650} teks="1/5" ukuran={80} gaya="tebal" warna={k.merah} mulai={-9999} />
    </Muncul>
    <Tulis x={E.x0 + 290} y={E.y0 + 900} teks="gaji Rp5 jt" ukuran={52} mulai={W(4, "gaji lima")} perHuruf={1.4} rata="center" />
    <Muncul mulai={W(4, "Telat bayar", -0.2)}>
      <B_.bank cx={E.x0 + 790} cy={E.y0 + 700} s={250} teks="SLIK OJK" />
    </Muncul>
    <Tulis x={E.x0 + 790} y={E.y0 + 880} teks="telat bayar tercatat" ukuran={42} warna={k.biru} mulai={W(4, "tercatat", -0.3)} perHuruf={1} rata="center" />
    <Muncul mulai={W(4, "ka pe er", -0.4)}>
      <Objek jenis="rumah" cx={E.x0 + 720} cy={E.y0 + 1010} s={130} />
    </Muncul>
    <Tulis x={E.x0 + 800} y={E.y0 + 1010} teks="KPR?" ukuran={70} gaya="tebal" warna={k.merah} mulai={W(4, "ka pe er")} perHuruf={2} />
    <Tulis x={E.x0 + 290} y={E.y0 + 1130} teks="(contoh hitungan)" ukuran={36} gaya="tipis" warna={k.biru} mulai={W(4, "Contohnya", 0.5)} perHuruf={0.8} rata="center" />

    {/* ===== F: solusi ===== */}
    <Tulis x={F.x0 + 110} y={F.y0 + 260} teks="Sebelum checkout:" ukuran={100} gaya="hias" warna={k.kuning} mulai={W(5, "Sebelum checkout")} perHuruf={1.6} />
    {[
      { t: "jumlahkan semua cicilan", f: "jumlahkan", c: "Cukup" },
      { t: "cukup 1 aplikasi", f: "Cukup", c: "Dan bayar" },
      { t: "bayar sebelum jatuh tempo", f: "Dan bayar", c: "jatuh tempo" },
    ].map((r, i) => {
      const y = F.y0 + 470 + i * 200;
      return (
        <React.Fragment key={i}>
          <Coret pts={kotak(F.x0 + 110, y - 40, 80, 80, 50 + i)} mulai={W(5, r.f, -0.3)} lama={10} tebal={5} kapur={false} />
          <Tulis x={F.x0 + 230} y={y} teks={r.t} ukuran={58} mulai={W(5, r.f)} perHuruf={1.2} />
          <Coret pts={centang(F.x0 + 125, y - 5, 1.1)} mulai={W(5, r.c, i === 2 ? 0 : -0.1, 8)} lama={8} warna={k.hijauTerang} tebal={9} />
        </React.Fragment>
      );
    })}
    <Muncul mulai={W(5, "Dan bayar", 0, 10)}>
      <Orang cx={F.x + 260} cy={F.y0 + 1060} s={220} pose="jempol" ekspresi="senyum" baju={k.biru} />
    </Muncul>

    {/* ===== G: CTA (kamera mundur, huruf besar) ===== */}
    <Tulis x={G.x} y={G.y0 + 300} teks="Punya berapa paylater?" ukuran={138} gaya="tebal" mulai={Math.max(W(6, "Kamu punya"), d(T.b6 + 1.6))} perHuruf={1.6} rata="center" />
    <Muncul mulai={W(6, "berapa aplikasi", -0.2)}>
      <B_.gelembung cx={G.x + 120} cy={G.y0 + 545} s={500} teks="__ aplikasi" />
    </Muncul>
    <Tulis x={G.x} y={G.y0 + 800} teks="tulis di komen ↓" ukuran={110} gaya="hias" warna={k.kuning} mulai={W(6, "Tulis angkanya")} perHuruf={1.8} rata="center" />
    <Tulis x={G.x - 170} y={G.y0 + 980} teks="kirim ke teman" ukuran={110} mulai={W(6, "Kirim")} perHuruf={1.6} rata="center" />
    {pesawat(G.x + 270, G.y0 + 900, 0.9).map((pts, j) => (
      <Coret key={j} pts={pts} mulai={W(6, "Kirim", 0.2) + j * 14} lama={14} tebal={7} kapur={j === 0} />
    ))}
    <Tulis x={G.x} y={G.y0 + 1130} teks="IntipDompet" ukuran={150} gaya="tebal" mulai={W(6, "IntipDompet")} perHuruf={2} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1235} teks="Biar dompetmu nggak kaget." ukuran={96} gaya="hias" warna={k.kuning} mulai={W(6, "Biar dompetmu")} perHuruf={1.5} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1320} teks="konten edukasi · data OJK, Sep 2026" ukuran={54} gaya="tipis" warna={k.biru} mulai={W(6, "IntipDompet", 0.3)} perHuruf={0.5} rata="center" />
  </>
);

// ---------------------------------------------------------------- subtitel (bentuk tulisan, bukan ejaan VO)
// Blok 0 tanpa subtitel: hook sudah tertulis besar.
const TEKS_TAMPIL = [
  "",
  "Data OJK: per September, utang paylater di bank tembus Rp31,5 triliun, dari 34,5 juta rekening.",
  "Paylater itu mirip langganan streaming. Satu terasa ringan. Lima sekaligus, tagihannya kerasa tiap bulan.",
  "Cicilan kecil dari beberapa aplikasi gampang menumpuk tanpa terasa, apalagi pas promo 12.12.",
  "Contohnya, 5 cicilan Rp200 ribu, jadi Rp1 juta sebulan, atau seperlima gaji Rp5 juta. Telat bayar juga tercatat di SLIK OJK, dan bisa bikin pengajuan KPR lebih susah.",
  "Sebelum checkout, jumlahkan dulu semua cicilan aktifmu. Cukup pakai satu aplikasi. Dan bayar sebelum jatuh tempo.",
  "Kamu punya berapa aplikasi paylater aktif? Tulis angkanya di komen. Kirim ke teman yang udah siap checkout 12.12.",
];
const SUB: BarisSubtitel[] = subtitelDariBlok(J, TEKS_TAMPIL, 38).filter((s) => s.selesai - s.mulai > 0.2);

const BarisSub: React.FC<{ teks: string; lama: number }> = ({ teks, lama }) => {
  const fr = useCurrentFrame();
  const o = Math.min(p01(fr, 0, 4), 1 - p01(fr, lama - 3, 3));
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1300, height: 180, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: font.sans, fontWeight: 650, fontSize: 44, lineHeight: 1.3, color: "#fbfaf4", opacity: o, textShadow: "0 2px 3px rgba(0,0,0,0.8), 0 0 24px rgba(0,0,0,0.65)" }}>
      {teks}
    </div>
  );
};
const Subtitel: React.FC = () => (
  <>
    {SUB.map((s, i) => {
      const lama = Math.max(1, d(s.selesai) - d(s.mulai));
      return (
        <Sequence key={i} from={d(s.mulai)} durationInFrames={lama} layout="none">
          <BarisSub teks={s.teks} lama={lama} />
        </Sequence>
      );
    })}
  </>
);

export const PaylaterReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <AbsoluteFill style={{ background: "#0f0d0b" }}>
    <FilterKapur />
    <Papan kunci={KAMERA} layar={subtitel ? <Subtitel /> : null}>
      <IsiPapan />
    </Papan>
    {J.ada ? <SuaraVO vo={VO} awal={J.awal} /> : null}
  </AbsoluteFill>
);
