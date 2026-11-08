// Mesin wireframe 3D mini: titik 3D -> rotasi -> proyeksi perspektif -> garis SVG.
import React from "react";

export type V3 = [number, number, number];
export type Garis3D = [V3, V3];

export type Pandang = { rotX: number; rotY: number; rotZ?: number; jarak?: number; skala?: number };

const rad = (d: number) => (d * Math.PI) / 180;

export const putar = ([x, y, z]: V3, p: Pandang): V3 => {
  const cy = Math.cos(rad(p.rotY));
  const sy = Math.sin(rad(p.rotY));
  let x1 = x * cy + z * sy;
  let z1 = -x * sy + z * cy;
  const cx = Math.cos(rad(p.rotX));
  const sx = Math.sin(rad(p.rotX));
  const y1 = y * cx - z1 * sx;
  z1 = y * sx + z1 * cx;
  const cz = Math.cos(rad(p.rotZ ?? 0));
  const sz = Math.sin(rad(p.rotZ ?? 0));
  const x2 = x1 * cz - y1 * sz;
  const y2 = x1 * sz + y1 * cz;
  x1 = x2;
  return [x1, y2, z1];
};

export const proyeksi = (v: V3, p: Pandang): [number, number, number] => {
  const [x, y, z] = putar(v, p);
  const d = p.jarak ?? 1400;
  const k = (d / (d + z)) * (p.skala ?? 1);
  return [x * k, y * k, z];
};

// y positif = ke bawah (koordinat layar)
export const kotak = (w: number, h: number, d: number, [ox, oy, oz]: V3 = [0, 0, 0]): Garis3D[] => {
  const x = [ox - w / 2, ox + w / 2];
  const y = [oy - h, oy];
  const z = [oz - d / 2, oz + d / 2];
  const v = (i: number, j: number, k: number): V3 => [x[i], y[j], z[k]];
  const g: Garis3D[] = [];
  for (const j of [0, 1])
    for (const k of [0, 1]) g.push([v(0, j, k), v(1, j, k)]);
  for (const i of [0, 1])
    for (const k of [0, 1]) g.push([v(i, 0, k), v(i, 1, k)]);
  for (const i of [0, 1])
    for (const j of [0, 1]) g.push([v(i, j, 0), v(i, j, 1)]);
  return g;
};

// Silinder tegak (koin, tutup botol). Alas di oy.
export const silinder = (r: number, h: number, seg = 20, [ox, oy, oz]: V3 = [0, 0, 0], tiang = 8): Garis3D[] => {
  const g: Garis3D[] = [];
  const titik = (a: number, y: number): V3 => [ox + r * Math.cos(a), y, oz + r * Math.sin(a)];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const b = ((i + 1) / seg) * Math.PI * 2;
    g.push([titik(a, oy), titik(b, oy)]);
    g.push([titik(a, oy - h), titik(b, oy - h)]);
    if (i % Math.max(1, Math.round(seg / tiang)) === 0) g.push([titik(a, oy), titik(a, oy - h)]);
  }
  return g;
};

// Benda putar sepanjang tulang belakang (spine) 3D: cabai, botol.
// jari(t) = jari-jari pada posisi t (0..1) di sepanjang spine.
export const putaran = (spine: (t: number) => V3, jari: (t: number) => number, cincin = 16, seg = 14, garisMemanjang = 8): Garis3D[] => {
  const g: Garis3D[] = [];
  const bingkai = (t: number) => {
    const p = spine(t);
    const q = spine(Math.min(1, t + 0.01));
    const p0 = spine(Math.max(0, t - 0.01));
    let tx = q[0] - p0[0];
    let ty = q[1] - p0[1];
    let tz = q[2] - p0[2];
    const n = Math.hypot(tx, ty, tz) || 1;
    tx /= n;
    ty /= n;
    tz /= n;
    // vektor tegak lurus
    let ux = -ty;
    let uy = tx;
    let uz = 0;
    const un = Math.hypot(ux, uy, uz) || 1;
    ux /= un;
    uy /= un;
    uz /= un;
    const wx = ty * uz - tz * uy;
    const wy = tz * ux - tx * uz;
    const wz = tx * uy - ty * ux;
    return { p, u: [ux, uy, uz] as V3, w: [wx, wy, wz] as V3 };
  };
  const titik = (t: number, a: number): V3 => {
    const { p, u, w } = bingkai(t);
    const r = jari(t);
    return [
      p[0] + r * (Math.cos(a) * u[0] + Math.sin(a) * w[0]),
      p[1] + r * (Math.cos(a) * u[1] + Math.sin(a) * w[1]),
      p[2] + r * (Math.cos(a) * u[2] + Math.sin(a) * w[2]),
    ];
  };
  for (let c = 0; c <= cincin; c++) {
    const t = c / cincin;
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      const b = ((i + 1) / seg) * Math.PI * 2;
      g.push([titik(t, a), titik(t, b)]);
    }
  }
  for (let i = 0; i < garisMemanjang; i++) {
    const a = (i / garisMemanjang) * Math.PI * 2;
    for (let c = 0; c < cincin * 2; c++) {
      g.push([titik(c / (cincin * 2), a), titik((c + 1) / (cincin * 2), a)]);
    }
  }
  return g;
};

export const Wire: React.FC<{
  garis: Garis3D[];
  pandang: Pandang;
  warna?: string;
  tebal?: number;
  putus?: string;
  opacity?: number;
}> = ({ garis, pandang, warna = "#fff", tebal = 2.5, putus, opacity = 1 }) => {
  const d = garis
    .map(([a, b]) => {
      const [x1, y1] = proyeksi(a, pandang);
      const [x2, y2] = proyeksi(b, pandang);
      return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
    })
    .join("");
  return <path d={d} stroke={warna} strokeWidth={tebal} fill="none" strokeLinecap="round" strokeDasharray={putus} opacity={opacity} />;
};
