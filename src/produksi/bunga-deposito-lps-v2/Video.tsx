// Deposito v2 (pilot struktur edukatif 7 blok) dengan template Papan Kapur.
// Naskah: produksi/20261109-bunga-deposito-lps/naskah-vo-v2.json. Satu blok = satu bagian papan:
//   A hook · B penjelasan (batas 3,75% + bank bisa tutup) · C perumpamaan (sketsa garansi HP) · D efek · E akibat · F solusi · G CTA (lebar 2 kolom)
//
// Sinkron: padaFrasa + jangkar jeda kalimat dari audio. vo-waktu.json di folder ini dibuat dengan:
//   python3 scripts/sinkron_vo.py produksi/20261109-bunga-deposito-lps/vo-waktu-v2.json src/produksi/bunga-deposito-lps-v2/vo-waktu.json
// Tanpa audio, waktu diperkirakan dari jumlah kata naskah (perkiraanVO).
//
// Aturan papan: batang kapur hanya saat mencoret/melingkari/menggambar/menandai (Coret, Panah, atau Tulis kapur).
// Efek 2,5D tiga kali saja: kamera miring di pembuka, kamera miring saat sketsa HP, dan tarikan mundur ke CTA.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import naskah from "../../../produksi/20261109-bunga-deposito-lps/naskah-vo-v2.json";
import vo from "./vo-waktu.json";
import { Coret, FilterKapur, Panah, Titik, Tulis, garis, ikonBank, lingkaran, p01 } from "../../papan/Komponen";
import { KunciKamera, Papan } from "../../papan/Papan";
import { d, font, k, sel } from "../../papan/tema";
import { SuaraVO } from "../../catatan/Komponen";
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
export const DURASI_DEPOSITO_V2 = d(T.akhir);

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
const IsiPapan: React.FC = () => {
  const gx = (v: number) => B.x0 + 160 + (v / 6) * 760; // garis bilangan 0–6 %
  const gy = B.y0 + 720;
  return (
    <>
      {/* ===== A: hook ===== */}
      <Tulis x={A.x} y={A.y0 + 400} teks="Deposito" ukuran={150} gaya="tebal" mulai={d(0.2)} perHuruf={2} rata="center" />
      <Tulis x={A.x - 90} y={A.y0 + 770} teks="6%" ukuran={400} gaya="tebal" warna={k.kuning} mulai={-6} perHuruf={5} rata="center" tebalFilter />
      <Tulis x={A.x0 + 830} y={A.y0 + 1050} teks="(contoh)" ukuran={44} gaya="tipis" warna={k.biru} mulai={d(0.6)} perHuruf={1} rata="center" miring={-6} />
      <Coret pts={garis(A.x0 + 230, A.y0 + 1000, A.x0 + 720, A.y0 + 990, 3, 4)} mulai={d(0.75)} lama={10} warna={k.kuning} tebal={11} kapur={false} />
      <Coret
        pts={[
          [A.x0 + 800, A.y0 + 690],
          [A.x0 + 810, A.y0 + 620],
          [A.x0 + 880, A.y0 + 590],
          [A.x0 + 950, A.y0 + 620],
          [A.x0 + 955, A.y0 + 690],
          [A.x0 + 900, A.y0 + 750],
          [A.x0 + 880, A.y0 + 800],
          [A.x0 + 880, A.y0 + 850],
        ]}
        mulai={W(0, "aman", -0.2)}
        lama={10}
        warna={k.merah}
        tebal={16}
      />
      <Coret pts={lingkaran(A.x0 + 880, A.y0 + 915, 9, 9, 2)} mulai={W(0, "aman", -0.2) + 10} lama={3} warna={k.merah} tebal={14} kapur={false} />
      <Tulis x={A.x} y={A.y0 + 1130} teks="uangmu aman?" ukuran={120} gaya="hias" warna={k.merah} mulai={W(0, "uangmu", -0.1)} perHuruf={2} rata="center" />

      {/* ===== B: penjelasan — batas LPS + 14 BPR ===== */}
      <Tulis x={B.x} y={B.y0 + 290} teks="LPS cuma menjamin bunga sampai" ukuran={58} mulai={W(1, "El pe es")} perHuruf={1.2} rata="center" />
      <Tulis x={B.x} y={B.y0 + 450} teks="3,75%" ukuran={220} gaya="tebal" warna={k.kuning} mulai={W(1, "tiga koma", -0.2)} perHuruf={4} rata="center" tebalFilter />
      <Tulis x={B.x} y={B.y0 + 590} teks="per tahun · bank umum" ukuran={46} gaya="tipis" warna={k.biru} mulai={W(1, "setahun", -0.3)} perHuruf={1.2} rata="center" />
      <Coret pts={garis(gx(0) - 20, gy, gx(6) + 60, gy, 5, 2)} mulai={W(1, "simpanan")} lama={16} kapur={false} />
      {[0, 3.75, 6].map((v, i) => (
        <React.Fragment key={v}>
          <Coret pts={garis(gx(v), gy - 22, gx(v), gy + 22, 10 + i, 1)} mulai={W(1, "simpanan") + 16 + i * 4} lama={5} kapur={false} />
          <Tulis x={gx(v)} y={gy + 62} teks={v === 3.75 ? "3,75%" : `${v}%`} ukuran={44} mulai={W(1, "simpanan") + 18 + i * 4} perHuruf={1} rata="center" />
        </React.Fragment>
      ))}
      <Coret pts={garis(gx(0), gy - 4, gx(3.75), gy - 4, 21, 1)} mulai={W(1, "maksimal")} lama={14} tebal={16} warna={k.kuning} />
      <Tulis x={(gx(0) + gx(3.75)) / 2} y={gy - 56} teks="batas LPS" ukuran={44} warna={k.kuning} mulai={W(1, "maksimal") + 10} perHuruf={1.4} rata="center" />
      <Coret pts={garis(gx(3.75), gy - 4, gx(6), gy - 4, 22, 1)} mulai={W(1, "setahun")} lama={10} tebal={16} warna={k.merah} kapur={false} />
      <Tulis x={(gx(3.75) + gx(6)) / 2} y={gy - 56} teks="tidak dijamin" ukuran={40} warna={k.merah} mulai={W(1, "setahun") + 8} perHuruf={1.2} rata="center" />
      <Tulis x={B.x} y={gy + 125} teks="berlaku s.d. 31 Jan 2027" ukuran={38} gaya="tipis" warna={k.biru} mulai={W(1, "setahun", 0.4)} perHuruf={1} rata="center" />
      {/* bank kecil dengan pintu tertutup dan papan TUTUP */}
      {ikonBank(B.x - 120, B.y0 + 985, 210, 17).map((pts, j) => (
        <Coret key={j} pts={pts} mulai={W(1, "Dan bank", -0.2) + j * 2} lama={8} tebal={5} kapur={j === 0} />
      ))}
      <Coret pts={kotak(B.x - 150, B.y0 + 1000, 60, 80, 18)} mulai={W(1, "Dan bank", -0.2) + 14} lama={8} tebal={4} kapur={false} />
      <Coret pts={garis(B.x + 30, B.y0 + 940, B.x + 140, B.y0 + 900, 19, 1)} mulai={W(1, "bisa tutup", -0.3)} lama={5} tebal={3} kapur={false} />
      <Coret pts={kotakPutar(B.x + 212, B.y0 + 946, 230, 86, -8)} mulai={W(1, "bisa tutup", -0.2)} lama={10} warna={k.merah} tebal={6} />
      <Tulis x={B.x + 210} y={B.y0 + 960} teks="TUTUP" ukuran={60} gaya="tebal" warna={k.merah} mulai={W(1, "bisa tutup")} perHuruf={1.6} rata="center" miring={-8} />
      <Tulis x={B.x} y={B.y0 + 1150} teks="bank bisa tutup" ukuran={64} gaya="tebal" mulai={W(1, "Dan bank")} perHuruf={1.4} rata="center" />

      {/* ===== C: perumpamaan — sketsa garansi HP ===== */}
      <Tulis x={C.x} y={C.y0 + 220} teks="Mirip garansi HP" ukuran={92} gaya="hias" warna={k.biru} mulai={W(2, "Mirip")} perHuruf={1.6} rata="center" />
      <Coret pts={kotakBulat(C.x0 + 330, C.y0 + 330, 420, 760, 60)} mulai={W(2, "Mirip", 0.2)} lama={22} tebal={7} />
      <Coret pts={kotakBulat(C.x0 + 380, C.y0 + 380, 130, 170, 26)} mulai={W(2, "Mirip", 0.2) + 22} lama={10} tebal={5} kapur={false} />
      <Coret pts={lingkaran(C.x0 + 445, C.y0 + 430, 26, 26, 3)} mulai={W(2, "Mirip", 0.2) + 30} lama={6} tebal={4} kapur={false} />
      <Coret pts={lingkaran(C.x0 + 445, C.y0 + 500, 22, 22, 4)} mulai={W(2, "Mirip", 0.2) + 34} lama={6} tebal={4} kapur={false} />
      {/* stiker segel */}
      <Coret pts={kotak(C.x0 + 470, C.y0 + 860, 140, 70, 7)} mulai={W(2, "Segelnya", -0.2)} lama={10} tebal={5} warna={k.kuning} />
      <Tulis x={C.x0 + 540} y={C.y0 + 895} teks="segel" ukuran={36} warna={k.kuning} mulai={W(2, "Segelnya")} perHuruf={1.4} rata="center" />
      <Coret pts={zigzag(C.x0 + 455, C.x0 + 625, C.y0 + 895, 7, 22)} mulai={W(2, "dibongkar")} lama={8} warna={k.merah} tebal={7} />
      {/* cap: menutupi seluruh HP, bukan hanya segelnya */}
      <Coret pts={kotakPutar(C.x - 10, C.y0 + 595, 760, 170, -14)} mulai={W(2, "garansi seluruh")} lama={14} warna={k.merah} tebal={8} />
      <Tulis x={C.x} y={C.y0 + 680} teks="GARANSI HANGUS" ukuran={92} gaya="tebal" warna={k.merah} mulai={W(2, "garansi seluruh", 0.2)} perHuruf={1.4} rata="center" miring={-14} tebalFilter />
      <Tulis x={C.x} y={C.y0 + 1150} teks="seluruh HP, bukan cuma segelnya" ukuran={46} gaya="tipis" warna={k.biru} mulai={W(2, "garansi seluruh", 0.8, 32)} perHuruf={1} rata="center" />

      {/* ===== D: efek ===== */}
      <Tulis x={D.x} y={D.y0 + 300} teks="bunga + cashback" ukuran={86} mulai={W(3, "bunga plus")} perHuruf={1.4} rata="center" />
      <Tulis x={D.x} y={D.y0 + 450} teks="> 3,75%" ukuran={140} gaya="tebal" warna={k.kuning} mulai={W(3, "lewat batas")} perHuruf={3} rata="center" tebalFilter />
      <Panah x1={D.x + 10} y1={D.y0 + 540} x2={D.x - 10} y2={D.y0 + 690} tinggi={20} mulai={W(3, "lewat batas", 0.6)} lama={12} warna={k.putih} tebal={6} />
      <Coret pts={kotak(D.x0 + 230, D.y0 + 720, 620, 190, 31)} mulai={W(3, "simpanan itu", -0.2)} lama={14} tebal={6} kapur={false} />
      <Tulis x={D.x} y={D.y0 + 815} teks="pokok + bunga" ukuran={90} gaya="tebal" mulai={W(3, "simpanan itu")} perHuruf={1.6} rata="center" />
      <Coret pts={garis(D.x0 + 220, D.y0 + 720, D.x0 + 860, D.y0 + 910, 41, 4)} mulai={W(3, "nggak dijamin")} lama={8} warna={k.merah} tebal={10} />
      <Coret pts={garis(D.x0 + 860, D.y0 + 720, D.x0 + 220, D.y0 + 910, 42, 4)} mulai={W(3, "nggak dijamin") + 8} lama={8} warna={k.merah} tebal={10} kapur={false} />
      <Tulis x={D.x} y={D.y0 + 1000} teks="tidak dijamin, termasuk pokok" ukuran={58} gaya="tebal" warna={k.merah} mulai={W(3, "sama sekali")} perHuruf={1.1} rata="center" />
      <Tulis x={D.x} y={D.y0 + 1120} teks="cashback dihitung bunga (aturan LPS)" ukuran={40} gaya="tipis" warna={k.biru} mulai={W(3, "cashback-nya", 0.3)} perHuruf={0.8} rata="center" />

      {/* ===== E: akibat ===== */}
      <Tulis x={E.x0 + 110} y={E.y0 + 250} teks="Contoh:" ukuran={84} gaya="hias" warna={k.biru} mulai={W(4, "Contohnya")} perHuruf={2} />
      <Coret pts={kotak(E.x0 + 110, E.y0 + 360, 470, 300, 51)} mulai={W(4, "taruh", -0.2)} lama={14} tebal={6} />
      <Coret
        pts={[
          [E.x0 + 112, E.y0 + 362],
          [E.x0 + 345, E.y0 + 520],
          [E.x0 + 578, E.y0 + 362],
        ]}
        mulai={W(4, "taruh", -0.2) + 14}
        lama={8}
        tebal={4}
        kapur={false}
      />
      <Tulis x={E.x0 + 345} y={E.y0 + 600} teks="Rp10 juta" ukuran={78} gaya="tebal" warna={k.kuning} mulai={W(4, "sepuluh juta")} perHuruf={1.8} rata="center" />
      <Tulis x={E.x0 + 345} y={E.y0 + 790} teks="bank umum · bunga 6% · contoh" ukuran={40} warna={k.biru} mulai={W(4, "bunga enam")} perHuruf={1.2} rata="center" />
      {/* bank dengan pintu tertutup */}
      {ikonBank(E.x0 + 820, E.y0 + 500, 250, 61).map((pts, j) => (
        <Coret key={j} pts={pts} mulai={W(4, "Kalau banknya", -0.3) + j * 2} lama={8} tebal={5} kapur={j === 0} />
      ))}
      <Coret pts={garis(E.x0 + 700, E.y0 + 620, E.x0 + 940, E.y0 + 470, 63, 3)} mulai={W(4, "tutup")} lama={6} warna={k.merah} tebal={8} kapur={false} />
      <Coret pts={garis(E.x0 + 700, E.y0 + 470, E.x0 + 940, E.y0 + 620, 64, 3)} mulai={W(4, "tutup") + 6} lama={6} warna={k.merah} tebal={8} kapur={false} />
      <Tulis x={E.x0 + 820} y={E.y0 + 720} teks="TUTUP" ukuran={56} gaya="tebal" warna={k.merah} mulai={W(4, "tutup", 0.1)} perHuruf={1.6} rata="center" />
      <Coret pts={lingkaran(E.x0 + 345, E.y0 + 520, 300, 220, 8)} mulai={W(4, "bisa saja")} lama={14} warna={k.merah} tebal={6} />
      <Tulis x={E.x} y={E.y0 + 930} teks="bisa saja nggak diganti LPS" ukuran={64} gaya="tebal" warna={k.merah} mulai={W(4, "bisa saja", 0.2)} perHuruf={1.3} rata="center" />
      <Tulis x={E.x} y={E.y0 + 1080} teks="contoh hitungan, bukan data bank tertentu" ukuran={36} gaya="tipis" warna={k.biru} mulai={W(4, "Contohnya", 0.8)} perHuruf={0.6} rata="center" />

      {/* ===== F: solusi ===== */}
      <Tulis x={F.x0 + 110} y={F.y0 + 280} teks="Cek 2 hal:" ukuran={116} gaya="hias" warna={k.kuning} mulai={W(5, "cek dua hal")} perHuruf={2} />
      <Coret pts={kotak(F.x0 + 110, F.y0 + 450, 80, 80, 50)} mulai={W(5, "Bunga plus", -0.3)} lama={10} tebal={5} kapur={false} />
      <Tulis x={F.x0 + 230} y={F.y0 + 470} teks="bunga + cashback" ukuran={66} mulai={W(5, "Bunga plus")} perHuruf={1.3} />
      <Tulis x={F.x0 + 230} y={F.y0 + 570} teks="≤ 3,75%" ukuran={92} gaya="tebal" warna={k.kuning} mulai={W(5, "tiga koma")} perHuruf={2.2} tebalFilter />
      <Tulis x={F.x0 + 600} y={F.y0 + 585} teks="bank umum" ukuran={44} gaya="tipis" warna={k.biru} mulai={W(5, "di bank umum")} perHuruf={1} />
      <Tulis x={F.x0 + 230} y={F.y0 + 670} teks="≤ 6,25%" ukuran={76} gaya="tebal" warna={k.kuning} mulai={W(5, "enam koma")} perHuruf={2} />
      <Tulis x={F.x0 + 540} y={F.y0 + 680} teks="BPR" ukuran={44} gaya="tipis" warna={k.biru} mulai={W(5, "di be pe er")} perHuruf={1.2} />
      <Coret pts={centang(F.x0 + 125, F.y0 + 485, 1.1)} mulai={W(5, "di be pe er", 0.4)} lama={8} warna={k.hijauTerang} tebal={9} />
      <Coret pts={kotak(F.x0 + 110, F.y0 + 790, 80, 80, 60)} mulai={W(5, "Dan yang", -0.3)} lama={10} tebal={5} kapur={false} />
      <Tulis x={F.x0 + 230} y={F.y0 + 810} teks="dijamin maks." ukuran={66} mulai={W(5, "Dan yang")} perHuruf={1.3} />
      <Tulis x={F.x0 + 230} y={F.y0 + 920} teks="Rp2 miliar / bank" ukuran={92} gaya="tebal" warna={k.kuning} mulai={W(5, "dua miliar")} perHuruf={1.8} tebalFilter />
      <Coret pts={centang(F.x0 + 125, F.y0 + 825, 1.1)} mulai={W(5, "per bank", 0.1)} lama={8} warna={k.hijauTerang} tebal={9} />
      <Tulis x={F.x} y={F.y0 + 1090} teks="cek: kalkulator 3T LPS" ukuran={46} gaya="tipis" warna={k.biru} mulai={W(5, "Dan yang", -0.2)} perHuruf={1} rata="center" />
      <Coret pts={garis(F.x - 240, F.y0 + 1128, F.x + 240, F.y0 + 1124, 71, 3)} mulai={W(5, "Dan yang", -0.2) + 22} lama={10} warna={k.biru} tebal={4} kapur={false} />

      {/* ===== G: CTA (kamera mundur, huruf besar) ===== */}
      <Tulis x={G.x} y={G.y0 + 320} teks="Bunga berapa?" ukuran={190} gaya="tebal" mulai={Math.max(W(6, "Kamu pernah"), d(T.b6 + 1.6))} perHuruf={2} rata="center" />
      <Coret pts={kotak(G.x - 260, G.y0 + 470, 520, 230, 81)} mulai={W(6, "berapa persen", -0.2)} lama={14} warna={k.kuning} tebal={8} />
      <Tulis x={G.x} y={G.y0 + 590} teks="__ %" ukuran={170} gaya="tebal" warna={k.kuning} mulai={W(6, "berapa persen")} perHuruf={3} rata="center" />
      <Tulis x={G.x} y={G.y0 + 800} teks="tulis di komen ↓" ukuran={120} gaya="hias" warna={k.kuning} mulai={W(6, "Tulis angkanya")} perHuruf={1.8} rata="center" />
      <Tulis x={G.x - 170} y={G.y0 + 980} teks="kirim ke teman" ukuran={110} mulai={W(6, "Kirim")} perHuruf={1.6} rata="center" />
      {pesawat(G.x + 270, G.y0 + 900, 0.9).map((pts, j) => (
        <Coret key={j} pts={pts} mulai={W(6, "Kirim", 0.2) + j * 14} lama={14} tebal={7} kapur={j === 0} />
      ))}
      <Tulis x={G.x} y={G.y0 + 1130} teks="IntipDompet" ukuran={150} gaya="tebal" mulai={W(6, "IntipDompet")} perHuruf={2} rata="center" />
      <Tulis x={G.x} y={G.y0 + 1235} teks="Biar dompetmu nggak kaget." ukuran={96} gaya="hias" warna={k.kuning} mulai={W(6, "Biar dompetmu")} perHuruf={1.5} rata="center" />
      <Tulis x={G.x} y={G.y0 + 1320} teks="konten edukasi, bukan ajakan membeli" ukuran={54} gaya="tipis" warna={k.biru} mulai={W(6, "IntipDompet", 0.3)} perHuruf={0.5} rata="center" />
    </>
  );
};

// ---------------------------------------------------------------- subtitel (bentuk tulisan, bukan ejaan VO)
// Blok 0 tanpa subtitel: hook sudah tertulis besar.
const TEKS_TAMPIL = [
  "",
  "LPS cuma menjamin simpanan di bank umum yang bunganya maksimal 3,75% setahun. Dan bank memang bisa tutup.",
  "Mirip garansi HP. Segelnya dibongkar sedikit saja, garansi seluruh HP-nya hangus.",
  "Simpanan juga begitu: bunga plus cashback-nya lewat batas, simpanan itu nggak dijamin sama sekali, termasuk pokoknya.",
  "Contohnya, kamu taruh Rp10 juta di bank umum dengan bunga 6%. Kalau banknya tutup, Rp10 juta itu bisa saja nggak diganti LPS.",
  "Sebelum taruh uang, cek dua hal. Bunga plus cashback-nya nggak lebih dari 3,75% di bank umum, atau 6,25% di BPR. Dan yang dijamin cuma sampai Rp2 miliar per bank.",
  "Kamu pernah lihat deposito bunga berapa persen? Tulis angkanya di komen. Kirim ke teman yang lagi nyari deposito bunga tinggi.",
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

export const BungaDepositoLPSv2: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <AbsoluteFill style={{ background: "#0f0d0b" }}>
    <FilterKapur />
    <Papan kunci={KAMERA} layar={subtitel ? <Subtitel /> : null}>
      <IsiPapan />
    </Papan>
    {J.ada ? <SuaraVO vo={VO} awal={J.awal} /> : null}
  </AbsoluteFill>
);
