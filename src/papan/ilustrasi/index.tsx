// Ilustrasi kapur dari kode untuk carousel dan video Papan Kapur (tanpa gambar AI).
// Satu objek = fungsi (cx, cy, s) -> daftar coretan. <Ilustrasi> menata 1–3 objek berdampingan
// di sebuah kotak, dengan label di bawah tiap objek dan panah kapur kecil di antaranya.
import React from "react";
import { Coret, Panah, Titik, Tulis, garis, ikonBank, lingkaran } from "../Komponen";
import { k } from "../tema";

const SUDAH = -9999;
export type Gores = { pts: Titik[]; warna?: string; tebal?: number };

// ---------------------------------------------------------------- bentuk dasar
export const kotak = (x: number, y: number, w: number, h: number, seed: number): Titik[] => [
  ...garis(x, y, x + w, y, seed, 2),
  ...garis(x + w, y, x + w, y + h, seed + 1, 2),
  ...garis(x + w, y + h, x, y + h, seed + 2, 2),
  ...garis(x, y + h, x, y + 4, seed + 3, 2),
];
export const kotakBulat = (x: number, y: number, w: number, h: number, r: number): Titik[] => {
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
export const centang = (x: number, y: number, s = 1): Titik[] => [
  [x, y],
  [x + 22 * s, y + 30 * s],
  [x + 70 * s, y - 40 * s],
];
const garisLurus = (a: Titik, b: Titik): Titik[] => [a, b];

// ---------------------------------------------------------------- objek (pusat cx,cy; tinggi kira-kira s)
const OBJEK: Record<string, (cx: number, cy: number, s: number) => Gores[]> = {
  orang: (cx, cy, s) => {
    const h = s / 2;
    return [
      { pts: lingkaran(cx, cy - h * 0.7, s * 0.13, s * 0.13, 3) },
      { pts: garisLurus([cx, cy - h * 0.44], [cx, cy + h * 0.25]) },
      { pts: [[cx - s * 0.24, cy - h * 0.05], [cx, cy - h * 0.3], [cx + s * 0.24, cy - h * 0.05]] },
      { pts: [[cx - s * 0.18, cy + h], [cx, cy + h * 0.25], [cx + s * 0.18, cy + h]] },
    ];
  },
  emas: (cx, cy, s) => {
    const batang = (x: number, y: number, w: number): Titik[] => [
      [x - w / 2, y + w * 0.22],
      [x - w * 0.36, y - w * 0.12],
      [x + w * 0.36, y - w * 0.12],
      [x + w / 2, y + w * 0.22],
      [x - w / 2, y + w * 0.22],
    ];
    const w = s * 0.5;
    return [
      { pts: batang(cx - w * 0.52, cy + s * 0.2, w), warna: k.kuning },
      { pts: batang(cx + w * 0.52, cy + s * 0.2, w), warna: k.kuning },
      { pts: batang(cx, cy - s * 0.1, w), warna: k.kuning },
    ];
  },
  kartu: (cx, cy, s) => [
    { pts: kotakBulat(cx - s * 0.5, cy - s * 0.32, s, s * 0.64, s * 0.07) },
    { pts: garis(cx - s * 0.5, cy - s * 0.12, cx + s * 0.5, cy - s * 0.12, 4, 1), tebal: 12 },
    { pts: kotak(cx - s * 0.38, cy + s * 0.04, s * 0.18, s * 0.13, 5), warna: k.kuning },
  ],
  uang: (cx, cy, s) => [
    { pts: kotak(cx - s * 0.5, cy - s * 0.28, s, s * 0.56, 6) },
    { pts: lingkaran(cx, cy, s * 0.14, s * 0.14, 7), warna: k.hijauTerang },
    { pts: garis(cx - s * 0.4, cy - s * 0.18, cx - s * 0.28, cy - s * 0.18, 8, 1) },
    { pts: garis(cx + s * 0.28, cy + s * 0.18, cx + s * 0.4, cy + s * 0.18, 9, 1) },
  ],
  hp: (cx, cy, s) => [
    { pts: kotakBulat(cx - s * 0.28, cy - s * 0.5, s * 0.56, s, s * 0.09) },
    { pts: kotakBulat(cx - s * 0.2, cy - s * 0.42, s * 0.17, s * 0.22, s * 0.04) },
    { pts: kotak(cx - s * 0.09, cy + s * 0.27, s * 0.18, s * 0.09, 7), warna: k.kuning },
  ],
  bank: (cx, cy, s) => ikonBank(cx, cy, s, 5).map((pts) => ({ pts })),
  amplop: (cx, cy, s) => [
    { pts: kotak(cx - s * 0.5, cy - s * 0.31, s, s * 0.62, 11) },
    { pts: [[cx - s * 0.5, cy - s * 0.31], [cx, cy + s * 0.03], [cx + s * 0.5, cy - s * 0.31]] },
  ],
  koin: (cx, cy, s) => [0, 1, 2].map((i) => ({ pts: lingkaran(cx, cy + s * 0.25 - i * s * 0.22, s * 0.4, s * 0.14, 20 + i), warna: k.kuning })),
  grafik: (cx, cy, s) => {
    const h = s / 2;
    return [
      { pts: [[cx - h, cy - h], [cx - h, cy + h], [cx + h, cy + h]] },
      { pts: [[cx - h * 0.8, cy + h * 0.6], [cx - h * 0.2, cy + h * 0.1], [cx + h * 0.2, cy + h * 0.3], [cx + h * 0.85, cy - h * 0.7]], warna: k.kuning, tebal: 9 },
    ];
  },
  kalender: (cx, cy, s) => {
    const h = s / 2;
    return [
      { pts: kotak(cx - h, cy - h * 0.8, s, s * 0.9, 31) },
      { pts: garis(cx - h, cy - h * 0.45, cx + h, cy - h * 0.45, 32, 1) },
      ...[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => ({ pts: lingkaran(cx - h * 0.65 + c * h * 0.43, cy - h * 0.12 + r * h * 0.3, 7, 7, r * 4 + c) }))),
    ];
  },
  perisai: (cx, cy, s) => {
    const h = s / 2;
    return [
      { pts: [[cx, cy - h], [cx + h * 0.8, cy - h * 0.7], [cx + h * 0.7, cy + h * 0.2], [cx, cy + h], [cx - h * 0.7, cy + h * 0.2], [cx - h * 0.8, cy - h * 0.7], [cx, cy - h]] },
      { pts: centang(cx - h * 0.35, cy + h * 0.05, s / 200), warna: k.hijauTerang, tebal: 10 },
    ];
  },
  centang: (cx, cy, s) => [{ pts: centang(cx - s * 0.25, cy + s * 0.05, s / 120), warna: k.hijauTerang, tebal: 14 }],
  silang: (cx, cy, s) => [
    { pts: garis(cx - s * 0.35, cy - s * 0.35, cx + s * 0.35, cy + s * 0.35, 51, 3), warna: k.merah, tebal: 12 },
    { pts: garis(cx + s * 0.35, cy - s * 0.35, cx - s * 0.35, cy + s * 0.35, 52, 3), warna: k.merah, tebal: 12 },
  ],
  rumah: (cx, cy, s) => [
    { pts: [[cx - s * 0.5, cy - s * 0.05], [cx, cy - s * 0.5], [cx + s * 0.5, cy - s * 0.05]] },
    { pts: kotak(cx - s * 0.38, cy - s * 0.05, s * 0.76, s * 0.55, 61) },
    { pts: kotak(cx - s * 0.1, cy + s * 0.18, s * 0.2, s * 0.32, 62), warna: k.kuning },
  ],
};

export const JENIS_ILUSTRASI = Object.keys(OBJEK);

/** Satu objek. Jenis "angka:3,75%" digambar sebagai angka besar kuning. */
export const Objek: React.FC<{ jenis: string; cx: number; cy: number; s: number }> = ({ jenis, cx, cy, s }) => {
  if (jenis.startsWith("angka:")) {
    return <Tulis x={cx} y={cy} teks={jenis.slice(6)} ukuran={s * 0.62} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" tebalFilter />;
  }
  const f = OBJEK[jenis];
  if (!f) {
    console.warn(`[ilustrasi] jenis "${jenis}" tidak dikenal; pilihan: ${JENIS_ILUSTRASI.join(", ")}, angka:<teks>`);
    return null;
  }
  return (
    <>
      {f(cx, cy, s).map((g, i) => (
        <Coret key={i} pts={g.pts} mulai={SUDAH} warna={g.warna ?? k.putih} tebal={g.tebal ?? Math.max(5, s * 0.022)} kapur={false} />
      ))}
    </>
  );
};

/** 1–3 objek berdampingan dalam kotak (x, y, w, h), label di bawah tiap objek, panah kapur di antaranya. */
export const Ilustrasi: React.FC<{ x: number; y: number; w: number; h: number; objek: string[]; label?: string[]; panah?: boolean }> = ({ x, y, w, h, objek, label = [], panah }) => {
  const n = Math.max(1, Math.min(objek.length, 3));
  const lebarSel = w / n;
  const adaLabel = label.some(Boolean);
  const tinggiObjek = h - (adaLabel ? 90 : 0);
  const s = Math.min(tinggiObjek * 0.82, lebarSel * (n === 1 ? 0.62 : n === 2 ? 0.78 : 0.72));
  // objek + label dipusatkan bersama di dalam kotak, label tepat di bawah objek
  const tinggiIsi = s + (adaLabel ? 90 : 0);
  const cy = y + (h - tinggiIsi) / 2 + s / 2;
  const yLabel = cy + s / 2 + 52;
  return (
    <>
      {objek.slice(0, n).map((j, i) => {
        const cx = x + lebarSel * (i + 0.5);
        return (
          <React.Fragment key={i}>
            <Objek jenis={j} cx={cx} cy={cy} s={s} />
            {label[i] ? <Tulis x={cx} y={yLabel} teks={label[i]} ukuran={44} warna={k.biru} mulai={SUDAH} rata="center" /> : null}
            {panah && i < n - 1 ? (
              <Panah x1={cx + s * 0.42} y1={cy} x2={x + lebarSel * (i + 1.5) - s * 0.42} y2={cy} tinggi={30} mulai={SUDAH} lama={1} warna={k.putih} tebal={5} />
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
};
