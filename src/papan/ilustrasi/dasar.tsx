// Bahan dasar ilustrasi kapur: bidang berwarna dengan arsiran, garis kapur, dan penghalus bentuk.
import React from "react";
import { Coret, Titik, keJalur, lingkaran } from "../Komponen";
import { k } from "../tema";

export const SUDAH = -9999; // tampil penuh (gambar diam)

/** Penghalus Chaikin: sudut tajam jadi lengkung lembut seperti gambar tangan. */
export const halus = (pts: Titik[], tutup = true, ulang = 2): Titik[] => {
  let p = pts;
  for (let r = 0; r < ulang; r++) {
    const q: Titik[] = [];
    const n = tutup ? p.length : p.length - 1;
    if (!tutup) q.push(p[0]);
    for (let i = 0; i < n; i++) {
      const a = p[i];
      const b = p[(i + 1) % p.length];
      q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    if (!tutup) q.push(p[p.length - 1]);
    p = q;
  }
  return tutup ? [...p, p[0]] : p;
};

/** Titik relatif (satuan s) ke titik mutlak di sekitar pusat (cx, cy). */
export const skala = (cx: number, cy: number, s: number) => (pts: [number, number][]): Titik[] => pts.map(([x, y]) => [cx + x * s, cy + y * s]);

/** Bidang berwarna: isian tipis + arsiran kapur diagonal, dengan filter kapur. */
export const Bidang: React.FC<{ pts: Titik[]; warna?: string; isi?: number; arsir?: number; sudut?: number; jarak?: number }> = ({
  pts,
  warna = k.putih,
  isi = 0.3,
  arsir = 0,
  sudut = 40,
  jarak = 13,
}) => {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - 4;
  const y0 = Math.min(...ys) - 4;
  const w = Math.max(...xs) - x0 + 8;
  const h = Math.max(...ys) - y0 + 8;
  const d = keJalur(pts) + " Z";
  return (
    <svg style={{ position: "absolute", left: x0, top: y0, overflow: "visible", filter: "url(#kapur)" }} width={w} height={h}>
      <defs>
        <pattern id={`ars${id}`} width={jarak} height={jarak} patternUnits="userSpaceOnUse" patternTransform={`rotate(${sudut})`}>
          <line x1={0} y1={0} x2={0} y2={jarak} stroke={warna} strokeWidth={3.2} />
        </pattern>
      </defs>
      <g transform={`translate(${-x0} ${-y0})`}>
        {isi > 0 ? <path d={d} fill={warna} fillOpacity={isi} /> : null}
        {arsir > 0 ? <path d={d} fill={`url(#ars${id})`} opacity={arsir} /> : null}
      </g>
    </svg>
  );
};

/** Garis kapur diam (tanpa batang kapur). */
export const Gr: React.FC<{ pts: Titik[]; warna?: string; tebal?: number }> = ({ pts, warna = k.putih, tebal = 5 }) => (
  <Coret pts={pts} mulai={SUDAH} warna={warna} tebal={tebal} kapur={false} />
);

/** Bentuk lengkap: bidang + garis tepi. */
export const Bentuk: React.FC<{ pts: Titik[]; warna?: string; garis?: string; isi?: number; arsir?: number; tebal?: number; sudut?: number }> = ({
  pts,
  warna = k.putih,
  garis = k.putih,
  isi = 0.3,
  arsir = 0,
  tebal = 5,
  sudut,
}) => (
  <>
    <Bidang pts={pts} warna={warna} isi={isi} arsir={arsir} sudut={sudut} />
    <Gr pts={pts} warna={garis} tebal={tebal} />
  </>
);

export const bulat = (cx: number, cy: number, rx: number, ry = rx, seed = 1): Titik[] => lingkaran(cx, cy, rx, ry, seed);
/** Elips rapat (tanpa ujung yang melewati awal), untuk bidang isi. */
export const elips = (cx: number, cy: number, rx: number, ry = rx): Titik[] =>
  Array.from({ length: 41 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Titik;
  });
export const persegi = (x: number, y: number, w: number, h: number): Titik[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
  [x, y],
];
export const persegiBulat = (x: number, y: number, w: number, h: number, r: number): Titik[] => {
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
  pts.push(pts[0]);
  return pts;
};
