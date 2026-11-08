// Gambar-gambar detail pada lembar blueprint. Semua koordinat lokal sel (0..1080, 0..1920).
import React from "react";
import { easeMasuk, lerp } from "../../komponen/Panggung";
import { BlokJudul, Callout, Dimensi, Teks } from "../../blueprint/Gambar";
import { bp, fon, persen, rupiah } from "../../blueprint/tema";
import { Garis3D, Pandang, V3, Wire, kotak, proyeksi, putaran, silinder } from "../../blueprint/Wire3D";
import { seg } from "./linimasa";

type P = { f: number }; // frame global
const lokal = (f: number, id: string) => f - seg(id).mulai;

// Teks besar yang "diplot" dari kiri ke kanan.
const Plot: React.FC<{ x: number; y: number; teks: React.ReactNode; ukuran: number; p: number; warna?: string; rata?: "start" | "middle"; lebar?: number }> = ({
  x,
  y,
  teks,
  ukuran,
  p,
  warna = bp.garis,
  rata = "start",
  lebar = 1000,
}) => {
  const id = React.useId().replace(/:/g, "");
  const x0 = rata === "middle" ? x - lebar / 2 : x;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x0 - 10} y={y - ukuran * 1.1} width={(lebar + 20) * p} height={ukuran * 1.4} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <text x={x} y={y} fontFamily={fon.judul} fontWeight={700} fontSize={ukuran} fill={warna} textAnchor={rata} letterSpacing="0.01em">
          {teks}
        </text>
      </g>
      {p > 0.02 && p < 0.98 ? <rect x={x0 + lebar * p - 3} y={y - ukuran * 0.95} width={6} height={ukuran * 1.1} fill={bp.redline} /> : null}
    </g>
  );
};

const Cap: React.FC<{ x: number; y: number; teks: string; o?: number }> = ({ x, y, teks, o = 1 }) => (
  <Teks x={x} y={y} ukuran={20} warna={bp.pudar} o={o}>
    {teks}
  </Teks>
);

const translate = (g: Garis3D[], [dx, dy, dz]: V3): Garis3D[] =>
  g.map(([a, b]) => [
    [a[0] + dx, a[1] + dy, a[2] + dz],
    [b[0] + dx, b[1] + dy, b[2] + dz],
  ]);

// Cabai 3D: tulang belakang melengkung, ujung meruncing, tangkai.
const cabai = (panjang = 300): Garis3D[] => {
  const spine = (t: number): V3 => [-panjang / 2 + panjang * t, Math.pow(t, 2.2) * panjang * 0.22 - Math.sin(t * Math.PI) * panjang * 0.04, 0];
  const jari = (t: number) => panjang * 0.085 * Math.pow(Math.min(1, t * 9), 0.45) * Math.pow(1 - t, 0.75) + (t > 0.97 ? 0 : 1.5);
  const badan = putaran(spine, jari, 14, 14, 10);
  const pangkal = spine(0);
  const tangkai: Garis3D[] = [
    [pangkal, [pangkal[0] - panjang * 0.08, pangkal[1] - panjang * 0.04, 0]],
    [[pangkal[0] - panjang * 0.08, pangkal[1] - panjang * 0.04, 0], [pangkal[0] - panjang * 0.13, pangkal[1] - panjang * 0.12, 0]],
  ];
  const kelopak = silinder(panjang * 0.07, panjang * 0.02, 12, [pangkal[0] + 4, pangkal[1] + 6, 0], 6).map(
    ([a, b]) => [[a[1] - pangkal[1] + pangkal[0], -(a[0] - pangkal[0]) + pangkal[1], a[2]], [b[1] - pangkal[1] + pangkal[0], -(b[0] - pangkal[0]) + pangkal[1], b[2]]] as Garis3D,
  );
  return [...badan, ...tangkai, ...kelopak];
};

const Grup: React.FC<{ x: number; y: number; children: React.ReactNode; s?: number; o?: number }> = ({ x, y, children, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    {children}
  </g>
);

const titik2D = (v: V3, p: Pandang, x: number, y: number): [number, number] => {
  const [a, b] = proyeksi(v, p);
  return [x + a, y + b];
};

// ------------------------------------------------------------ JUDUL (sel 0,0)
export const DetailJudul: React.FC<P> = ({ f }) => {
  const t = f;
  const baris = [
    { teks: "INFLASI", y: 560, u: 230, mulai: 4 },
    { teks: "TERKENDALI,", y: 770, u: 200, mulai: 12 },
    { teks: "KOK BELANJA", y: 940, u: 150, mulai: 22 },
  ];
  const koin = silinder(110, 26, 32, [0, 0, 0], 32);
  const rotY = t * 4;
  return (
    <g>
      <Cap x={96} y={300} teks="DWG. INF-01 · DETAIL 00 · JUDUL" />
      {baris.map((b) => (
        <Plot key={b.teks} x={96} y={b.y} teks={b.teks} ukuran={b.u} p={lerp(t, b.mulai, b.mulai + 14, 0, 1)} />
      ))}
      <Plot
        x={96}
        y={1110}
        ukuran={150}
        p={lerp(t, 32, 46, 0, 1)}
        teks={
          <>
            MAKIN <tspan fill={bp.redline}>MAHAL?</tspan>
          </>
        }
      />
      <Dimensi x1={96} y1={360} x2={984} y2={360} label="W 888" offset={-10} o={lerp(t, 40, 52, 0, 1)} />
      <Dimensi x1={60} y1={1130} x2={60} y2={390} label="H 740" offset={0} o={lerp(t, 44, 56, 0, 1)} />
      <Grup x={860} y={1290} o={lerp(t, 30, 44, 0, 1)}>
        <Wire garis={koin} pandang={{ rotX: 70, rotY, rotZ: 0 }} tebal={2} />
      </Grup>
      <Callout dari={[790, 1290]} ke={[560, 1360]} label="KOIN Rp1.000 · Ø 24" o={lerp(t, 46, 56, 0, 1)} />
    </g>
  );
};

// ------------------------------------------------------------ KERANJANG (sel 1,0)
const keranjang = (): Garis3D[] => {
  const g: Garis3D[] = [];
  const atas = { w: 520, d: 300, y: -300 };
  const bawah = { w: 420, d: 220, y: 0 };
  const sudut = (l: typeof atas): V3[] => [
    [-l.w / 2, l.y, -l.d / 2],
    [l.w / 2, l.y, -l.d / 2],
    [l.w / 2, l.y, l.d / 2],
    [-l.w / 2, l.y, l.d / 2],
  ];
  const A = sudut(atas);
  const B = sudut(bawah);
  for (let i = 0; i < 4; i++) {
    g.push([A[i], A[(i + 1) % 4]]);
    g.push([B[i], B[(i + 1) % 4]]);
    g.push([A[i], B[i]]);
  }
  // bilah anyaman
  for (let k = 1; k < 6; k++) {
    const t = k / 6;
    const l = { w: atas.w + (bawah.w - atas.w) * t, d: atas.d + (bawah.d - atas.d) * t, y: atas.y + (bawah.y - atas.y) * t };
    const S = sudut(l);
    for (let i = 0; i < 4; i++) g.push([S[i], S[(i + 1) % 4]]);
  }
  // gagang
  const n = 16;
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (i / n);
    const b = Math.PI * ((i + 1) / n);
    g.push([
      [-atas.w / 2 + 40 + (atas.w - 80) * (0.5 - 0.5 * Math.cos(a)), atas.y - Math.sin(a) * 220, 0],
      [-atas.w / 2 + 40 + (atas.w - 80) * (0.5 - 0.5 * Math.cos(b)), atas.y - Math.sin(b) * 220, 0],
    ]);
  }
  return g;
};

const botol = (): Garis3D[] =>
  putaran(
    (t) => [0, -t * 330, 0],
    (t) => (t < 0.62 ? 48 : t < 0.8 ? 48 - (t - 0.62) * 170 : 18),
    12,
    14,
    8,
  );
const telur = (): Garis3D[] => putaran((t) => [0, -t * 120, 0], (t) => 46 * Math.sin(Math.PI * t) * (1 - 0.18 * t), 8, 14, 8);

export const DetailKeranjang: React.FC<P> = ({ f }) => {
  const t = lokal(f, "keranjang");
  const rotY = -32 + t * 0.22;
  const pd: Pandang = { rotX: 16, rotY, jarak: 1600, skala: 1.08 };
  const X = 580;
  const Y = 1080;
  const isi: { g: Garis3D[]; pos: V3; label: string; mulai: number }[] = [
    { g: kotak(170, 230, 120), pos: [-150, -250, 10], label: "01 BERAS", mulai: 20 },
    { g: botol(), pos: [40, -250, -30], label: "02 MINYAK", mulai: 32 },
    { g: telur(), pos: [170, -260, 50], label: "03 TELUR", mulai: 44 },
    { g: cabai(220), pos: [60, -330, 90], label: "04 CABAI", mulai: 56 },
  ];
  const naik = lerp(t, 60, 150, 0, 1);
  return (
    <g>
      <Cap x={96} y={300} teks="DETAIL 01 · KERANJANG BELANJA · ISO" />
      <Grup x={X} y={Y} o={lerp(t, 0, 16, 0, 1)}>
        <Wire garis={keranjang()} pandang={pd} />
        {isi.map((it) => (
          <Wire key={it.label} garis={translate(it.g, it.pos)} pandang={pd} tebal={2} opacity={lerp(t, it.mulai - 14, it.mulai, 0, 1)} />
        ))}
      </Grup>
      {isi.map((it, i) => {
        const [x, y] = titik2D([it.pos[0], it.pos[1] - 60, it.pos[2]], pd, X, Y);
        const kiri = i % 2 === 0;
        return (
          <g key={it.label}>
            <Callout dari={[x, y]} ke={[kiri ? x - 160 : x + 150, y - 150 - i * 30]} label={`${it.label} ▲`} o={lerp(t, it.mulai, it.mulai + 10, 0, 1)} />
          </g>
        );
      })}
      {/* garis dimensi harga yang terus memanjang ke atas */}
      <Dimensi x1={980} y1={1080} x2={980} y2={1080 - 620 * naik} label="HARGA ▲" offset={0} warna={bp.redline} o={lerp(t, 60, 70, 0, 1)} />
    </g>
  );
};

// ------------------------------------------------------------ GAUGE (sel 2,0)
export const DetailGauge: React.FC<P> = ({ f }) => {
  const t = lokal(f, "gauge");
  const tNah = lokal(f, "nah");
  const miring = lerp(t, 0, 50, 62, 12);
  const pd: Pandang = { rotX: miring, rotY: 0, jarak: 1800 };
  const X = 540;
  const Y = 760;
  const R = 360;
  const MAKS = 6;
  const v = lerp(t, 26, 86, 0, 3.23);
  const pt = (val: number, r: number): V3 => {
    const a = Math.PI - (val / MAKS) * Math.PI;
    return [r * Math.cos(a), -r * Math.sin(a), 0];
  };
  const busur = (dari: number, ke: number, r: number, n = 48): Garis3D[] =>
    Array.from({ length: n }, (_, i) => [pt(dari + ((ke - dari) * i) / n, r), pt(dari + ((ke - dari) * (i + 1)) / n, r)] as Garis3D);
  const tick: Garis3D[] = [];
  for (let i = 0; i <= MAKS * 4; i++) {
    const val = i / 4;
    tick.push([pt(val, R), pt(val, R - (i % 4 === 0 ? 46 : 22))]);
  }
  const arsir: Garis3D[] = [];
  for (let k = 0; k <= 26; k++) {
    const val = 1.5 + (2 * k) / 26;
    arsir.push([pt(val, R + 20), pt(Math.min(3.5, val + 0.12), R + 62)]);
  }
  const jarum: Garis3D[] = [[[0, 0, 0], pt(v, R - 70)]];
  const munculNah = lerp(tNah, 30, 60, 0, 1);
  return (
    <g opacity={Math.max(munculNah, t >= 0 ? 1 : 0)}>
      <Cap x={96} y={300} teks="DETAIL 02 · ALAT UKUR INFLASI TAHUNAN" />
      <Grup x={X} y={Y}>
        <Wire garis={[...busur(0, MAKS, R), ...busur(0, MAKS, R + 84), ...tick]} pandang={pd} />
        <Wire garis={[...busur(1.5, 3.5, R + 20), ...busur(1.5, 3.5, R + 62), ...arsir]} pandang={pd} tebal={1.6} opacity={lerp(t, 60, 74, 0, 1)} />
        <Wire garis={jarum} pandang={pd} warna={bp.redline} tebal={8} />
        <Wire garis={silinder(30, 10, 24, [0, 0, 0], 8).map(([a, b]) => [[a[0], a[2], -a[1]], [b[0], b[2], -b[1]]] as Garis3D)} pandang={pd} />
      </Grup>
      {[0, 3, 6].map((val) => {
        const [x, y] = titik2D(pt(val, R - 90), pd, X, Y);
        return (
          <Teks key={val} x={x} y={y + 8} ukuran={26} rata="middle" warna={bp.pudar}>
            {val}
          </Teks>
        );
      })}
      {(() => {
        const [x, y] = titik2D(pt(2.5, R + 70), pd, X, Y);
        return <Callout dari={[x, y]} ke={[x + 120, y - 110]} label="TOL. 2,5 ± 1,0 (SASARAN BI)" o={lerp(t, 66, 78, 0, 1)} />;
      })()}
      <text x={X} y={1010} textAnchor="middle" fontFamily={fon.judul} fontWeight={700} fontSize={190} fill={bp.garis} style={{ fontVariantNumeric: "tabular-nums" }} opacity={lerp(t, 20, 30, 0, 1)}>
        {persen(v)}
      </text>
      <Teks x={X} y={1066} ukuran={26} rata="middle" o={lerp(t, 30, 40, 0, 1)}>
        INFLASI YoY · OKTOBER 2026
      </Teks>
      <Cap x={96} y={1130} teks="SUMBER: BPS, RILIS 2 NOV 2026" o={lerp(t, 40, 50, 0, 1)} />
    </g>
  );
};

// ------------------------------------------------------------ JANGKA SORONG (sel 2,1)
export const DetailJangka: React.FC<P> = ({ f }) => {
  const t = lokal(f, "jangka");
  const SK = 210; // px per 1%
  const X0 = 170;
  const Y = 620;
  const nilai = t < 34 ? 3.23 : lerp(t, 34, 62, 3.23, 0.22);
  const xJ = X0 + nilai * SK;
  const kedalaman = 26;
  const garis3d = (d: string) => (
    <>
      <path d={d} stroke={bp.garis} strokeWidth={1.4} fill="none" opacity={0.5} transform={`translate(${kedalaman} ${-kedalaman})`} />
      <path d={d} stroke={bp.garis} strokeWidth={3} fill={bp.biru} />
    </>
  );
  const rahangTetap = `M ${X0 - 90} ${Y - 90} L ${X0} ${Y - 90} L ${X0} ${Y + 380} L ${X0 - 40} ${Y + 430} L ${X0 - 90} ${Y + 380} Z`;
  const rahangGeser = (x: number) => `M ${x} ${Y - 90} L ${x + 150} ${Y - 90} L ${x + 150} ${Y + 110} L ${x + 40} ${Y + 110} L ${x + 40} ${Y + 430} L ${x} ${Y + 380} Z`;
  return (
    <g>
      <Cap x={96} y={300} teks="DETAIL 03 · JANGKA SORONG · YoY vs MoM" />
      {garis3d(`M ${X0 - 90} ${Y - 90} L 1020 ${Y - 90} L 1020 ${Y} L ${X0 - 90} ${Y} Z`)}
      {Array.from({ length: 4 * 4 + 1 }).map((_, i) => (
        <path key={i} d={`M ${X0 + (i * SK) / 4} ${Y - 90} L ${X0 + (i * SK) / 4} ${Y - 90 + (i % 4 === 0 ? 46 : 24)}`} stroke={bp.garis} strokeWidth={2} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Teks key={i} x={X0 + i * SK} y={Y - 110} ukuran={30} rata="middle" warna={bp.pudar}>
          {i}%
        </Teks>
      ))}
      {garis3d(rahangTetap)}
      {t >= 34 ? <path d={rahangGeser(X0 + 3.23 * SK)} stroke={bp.garis} strokeWidth={2} fill="none" strokeDasharray="10 8" opacity={0.7} /> : null}
      {garis3d(rahangGeser(xJ))}
      <Dimensi x1={X0} y1={Y + 430} x2={X0 + 3.23 * SK} y2={Y + 430} label="YoY 3,23" offset={-50} ukuran={30} o={lerp(t, 8, 20, 0, 1)} />
      <Dimensi x1={X0} y1={Y + 430} x2={xJ} y2={Y + 430} label={`MoM ${persen(nilai).replace("%", "")}`} offset={-130} ukuran={30} warna={bp.redline} o={lerp(t, 36, 46, 0, 1)} sisiLabel={-1} />
      <Cap x={96} y={1130} teks="SUMBER: BPS, OKTOBER 2026" o={lerp(t, 20, 30, 0, 1)} />
    </g>
  );
};

// ------------------------------------------------------------ BEDA (sel 1,1)
export const DetailBeda: React.FC<P> = ({ f }) => {
  const t = lokal(f, "beda");
  const cap = lerp(t, 24, 36, 0, 1);
  const awan = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const b = ((i + 1) / 14) * Math.PI * 2;
    const r = 150;
    const m = (a + b) / 2;
    return `${i === 0 ? `M ${540 + r * Math.cos(a)} ${680 + r * Math.sin(a)}` : ""} Q ${540 + (r + 34) * Math.cos(m)} ${680 + (r + 34) * Math.sin(m)} ${540 + r * Math.cos(b)} ${680 + r * Math.sin(b)}`;
  }).join(" ");
  return (
    <g>
      <Cap x={96} y={300} teks="CATATAN REVISI · Δ1" />
      <Plot x={540} y={500} rata="middle" lebar={900} ukuran={150} teks="INFLASI RENDAH" p={lerp(t, 4, 20, 0, 1)} />
      <g transform={`translate(540 680) scale(${1.8 - 0.8 * cap}) translate(-540 -680)`} opacity={cap}>
        <path d={awan} stroke={bp.redline} strokeWidth={4} fill="none" />
        <text x={540} y={760} textAnchor="middle" fontFamily={fon.judul} fontWeight={700} fontSize={250} fill={bp.redline}>
          ≠
        </text>
      </g>
      <Plot x={540} y={990} rata="middle" lebar={900} ukuran={150} teks="HARGA MURAH" p={lerp(t, 34, 50, 0, 1)} />
      <path d="M 120 1040 L 160 970 L 200 1040 Z" stroke={bp.redline} strokeWidth={3} fill="none" opacity={lerp(t, 50, 60, 0, 1)} />
      <Teks x={160} y={1028} ukuran={26} rata="middle" warna={bp.redline} o={lerp(t, 50, 60, 0, 1)}>
        1
      </Teks>
    </g>
  );
};

// ------------------------------------------------------------ CABAI (sel 0,1)
export const DetailCabai: React.FC<P> = ({ f }) => {
  const t = lokal(f, "cabai");
  const G = 170;
  const H = 350;
  const pd: Pandang = { rotX: 14, rotY: -18, jarak: 2200 };
  const X = 540;
  const Y = 1040;
  const PX = 8.4; // px per Rp1.000
  const xs = [-320, 0, 320];
  const w = 200;
  const d = 140;
  const tumbuh = [lerp(t, 6, 40, 0, 1), lerp(t, 56, 90, 0, 1), lerp(t, G + 20, G + 54, 0, 1)];
  const atasMerah = [0, lerp(t, 90, 112, 0, 1), lerp(t, G + 54, G + 74, 0, 1)];
  const harga = [40, 50, 50];
  const kolom = (i: number): Garis3D[] => {
    const h40 = 40 * PX * tumbuh[i];
    return kotak(w, h40, d, [xs[i], 0, 0]);
  };
  const kolomMerah = (i: number): Garis3D[] => (atasMerah[i] > 0 ? kotak(w, 10 * PX * atasMerah[i], d, [xs[i], -40 * PX, 0]) : []);
  const tinggi = (i: number) => (40 * tumbuh[i] + 10 * atasMerah[i]) * PX;
  const puncak = (i: number) => titik2D([xs[i], -tinggi(i), 0], pd, X, Y);
  const datar = lerp(t, G + 80, G + 100, 0, 1);
  const hantu = lerp(t, H + 14, H + 34, 0, 1);
  const cap = lerp(t, H + 70, H + 82, 0, 1);
  return (
    <g>
      <Cap x={96} y={300} teks="DETAIL 04 · ELEVASI HARGA CABAI / KG · CONTOH ILUSTRASI" />
      <Grup x={X} y={Y}>
        {/* lantai */}
        <Wire garis={kotak(1000, 0, 360, [0, 0, 0]).slice(0, 4)} pandang={pd} tebal={1.5} opacity={0.6} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Wire garis={kolom(i)} pandang={pd} />
            <Wire garis={kolomMerah(i)} pandang={pd} warna={bp.redline} tebal={3} />
          </g>
        ))}
        {hantu > 0 ? <Wire garis={kotak(w + 30, 40 * PX, d + 30, [xs[2], 0, 0])} pandang={pd} putus="10 9" opacity={hantu} tebal={2} /> : null}
      </Grup>
      {/* cabai 3D berputar di atas tiap kolom */}
      {[0, 1, 2].map((i) => {
        const [x, y] = puncak(i);
        const o = tumbuh[i] > 0.9 ? lerp(tumbuh[i], 0.9, 1, 0, 1) : 0;
        return (
          <Grup key={i} x={x} y={y - 80} o={o}>
            <Wire garis={cabai(300)} pandang={{ rotX: 18, rotY: t * 3 + i * 70, rotZ: -10, jarak: 1500 }} tebal={2.2} />
          </Grup>
        );
      })}
      {[0, 1, 2].map((i) => {
        const [x, y] = puncak(i);
        return (
          <text key={i} x={x} y={y - 190} textAnchor="middle" fontFamily={fon.judul} fontWeight={700} fontSize={64} fill={bp.garis} opacity={lerp(tumbuh[i], 0.6, 1, 0, 1)}>
            {rupiah((40 + (i === 0 ? 0 : 10 * atasMerah[i])) * 1000 * Math.min(1, tumbuh[i] * 1.2))}
          </text>
        );
      })}
      {["TAHUN LALU", "TAHUN INI", "BULAN DEPAN"].map((l, i) => {
        const [x, y] = titik2D([xs[i], 0, d / 2], pd, X, Y);
        return (
          <Teks key={l} x={x} y={y + 50} ukuran={26} rata="middle">
            {l}
          </Teks>
        );
      })}
      {(() => {
        const [x1, y1] = titik2D([xs[1] + w / 2, -40 * PX, d / 2], pd, X, Y);
        const [, y2] = titik2D([xs[1] + w / 2, -50 * PX, d / 2], pd, X, Y);
        return <Dimensi x1={x1} y1={y1} x2={x1} y2={y2} label="+25%" offset={-40} warna={bp.redline} o={lerp(t, 112, 124, 0, 1)} />;
      })()}
      {(() => {
        const [x1, y1] = puncak(1);
        const [x2, y2] = puncak(2);
        return (
          <g opacity={datar}>
            <path d={`M ${x1 + 100} ${y1} L ${x1 + 100 + (x2 - x1 - 200) * datar} ${y2}`} stroke={bp.redline} strokeWidth={3} strokeDasharray="12 8" />
            <Teks x={(x1 + x2) / 2} y={y1 - 30} ukuran={28} rata="middle" warna={bp.redline}>
              Δ 0 · INFLASI 0%
            </Teks>
          </g>
        );
      })()}
      {(() => {
        const [x, y] = titik2D([xs[2], -40 * PX, -d / 2], pd, X, Y);
        return (
          <g opacity={hantu}>
            <Callout dari={[x + 100, y]} ke={[x + 40, y + 120]} label="Rp40.000 ?" />
          </g>
        );
      })()}
      <g transform={`translate(800 990) rotate(-10) scale(${1.6 - 0.6 * cap})`} opacity={cap}>
        <rect x={-190} y={-52} width={380} height={104} fill="none" stroke={bp.redline} strokeWidth={5} />
        <rect x={-178} y={-40} width={356} height={80} fill="none" stroke={bp.redline} strokeWidth={2} />
        <text x={0} y={22} textAnchor="middle" fontFamily={fon.judul} fontWeight={700} fontSize={64} fill={bp.redline} letterSpacing="0.06em">
          BELUM TENTU
        </text>
      </g>
    </g>
  );
};

// ------------------------------------------------------------ SALAH PAHAM (sel 1,2)
export const DetailSalah: React.FC<P> = ({ f }) => {
  const t = lokal(f, "salah");
  return (
    <g>
      <Cap x={96} y={300} teks="CATATAN REVISI · Δ2" />
      <Plot x={540} y={620} rata="middle" lebar={900} ukuran={120} teks="INILAH YANG SERING" p={lerp(t, 0, 12, 0, 1)} />
      <Plot x={540} y={800} rata="middle" lebar={900} ukuran={150} teks="DISALAHPAHAMI." p={lerp(t, 8, 22, 0, 1)} warna={bp.redline} />
      <Dimensi x1={60} y1={840} x2={1020} y2={840} label="KESALAHPAHAMAN UMUM" offset={-50} o={lerp(t, 20, 30, 0, 1)} sisiLabel={-1} />
    </g>
  );
};

// ------------------------------------------------------------ RAMP: harga = elevasi, inflasi = sudut (sel 2,2)
const elev = (u: number) => 70 + 470 * (1 - Math.pow(1 - u, 2.4));
const xr = (u: number) => -400 + 680 * u;
export const DetailRamp: React.FC<P> = ({ f }) => {
  const t = lokal(f, "ramp");
  const tk = lokal(f, "kesimpulan");
  const putY = -30 + Math.max(0, t) * 0.05 + Math.max(0, tk) * 0.02;
  const pd: Pandang = { rotX: 18, rotY: putY, jarak: 2200 };
  const X = 500;
  const Y = 1090;
  const gambar = lerp(t, 6, 110, 0.02, 1);
  const n = 40;
  const pita: Garis3D[] = [];
  for (let i = 0; i < n; i++) {
    const u0 = (i / n) * gambar;
    const u1 = ((i + 1) / n) * gambar;
    for (const z of [-70, 70]) pita.push([[xr(u0), -elev(u0), z], [xr(u1), -elev(u1), z]]);
    if (i % 2 === 0) pita.push([[xr(u0), -elev(u0), -70], [xr(u0), -elev(u0), 70]]);
    if (i % 5 === 0) pita.push([[xr(u0), -elev(u0), 70], [xr(u0), 0, 70]]);
  }
  const lantai: Garis3D[] = [];
  for (let i = 0; i <= 8; i++) lantai.push([[-420 + i * 105, 0, -140], [-420 + i * 105, 0, 140]]);
  for (let k = 0; k <= 2; k++) lantai.push([[-420, 0, -140 + k * 140], [420, 0, -140 + k * 140]]);
  // penanda (kubus) di posisi u
  const fase2 = 130;
  const u = tk >= fase2 ? lerp(tk, fase2, fase2 + 60, 0.35, 0.97) : tk >= 0 ? 0.97 : gambar;
  const kubus = kotak(46, 46, 46, [xr(u), -elev(u), 0]);
  const du = 0.01;
  const sudut = (Math.atan2(elev(Math.min(1, u + du)) - elev(Math.max(0, u - du)), xr(Math.min(1, u + du)) - xr(Math.max(0, u - du))) * 180) / Math.PI;
  const [mx, my] = titik2D([xr(u), -elev(u) - 46, 0], pd, X, Y);
  const [ax, ay] = titik2D([xr(Math.max(0, u - 0.06)), -elev(Math.max(0, u - 0.06)), 0], pd, X, Y);
  const [bx, by] = titik2D([xr(Math.min(1, u + 0.06)), -elev(Math.min(1, u + 0.06)), 0], pd, X, Y);
  const sLayar = Math.atan2(by - ay, bx - ax);
  const kesimpulan = tk >= 0;
  const [dx0, dy0] = titik2D([xr(0), -elev(0), 0], pd, X, Y);
  const [dx1, dy1] = titik2D([xr(1), -elev(1), 0], pd, X, Y);
  return (
    <g>
      <Cap x={96} y={300} teks={kesimpulan ? "DETAIL 05 · REV. B · KESIMPULAN" : "DETAIL 05 · HARGA = ELEVASI · INFLASI = SUDUT θ"} />
      <Grup x={X} y={Y}>
        <Wire garis={lantai} pandang={pd} tebal={1.4} opacity={0.55} />
        <Wire garis={pita} pandang={pd} tebal={2.2} />
        <Wire garis={kubus} pandang={pd} warna={bp.redline} tebal={3} />
      </Grup>
      {/* panah kemiringan + busur sudut */}
      <g transform={`translate(${mx} ${my}) rotate(${(sLayar * 180) / Math.PI})`}>
        <rect x={-150} y={-4} width={300} height={8} rx={4} fill={bp.redline} />
        <path d="M 150 -16 L 180 0 L 150 16 Z" fill={bp.redline} />
      </g>
      <path d={`M ${mx + 110} ${my} A 110 110 0 0 0 ${mx + 110 * Math.cos(sLayar)} ${my + 110 * Math.sin(sLayar)}`} stroke={bp.redline} strokeWidth={2.5} fill="none" />
      <path d={`M ${mx} ${my} L ${mx + 150} ${my}`} stroke={bp.garis} strokeWidth={1.5} strokeDasharray="6 6" />
      <Teks x={mx + 130} y={my - 20} ukuran={30} warna={bp.redline}>
        θ {Math.max(0, Math.round(sudut))}°
      </Teks>
      {!kesimpulan ? (
        <>
          <Teks x={96} y={400} ukuran={58} mono={false} tebal={700} o={lerp(t, 20, 32, 0, 1)}>
            HARGA = ELEVASI
          </Teks>
          <Teks x={96} y={470} ukuran={58} mono={false} tebal={700} warna={bp.redline} o={lerp(t, 40, 52, 0, 1)}>
            INFLASI = SUDUT KEMIRINGAN θ
          </Teks>
        </>
      ) : (
        <>
          <g opacity={lerp(tk, 18, 30, 0, 1)}>
            <path d={`M 60 ${dy0} L 1020 ${dy0 + (dy1 - dy0) * 0}`} stroke={bp.garis} strokeWidth={2} strokeDasharray="14 10" />
            <Teks x={70} y={dy0 + 40} ukuran={24} warna={bp.pudar}>
              DATUM · HARGA AWAL
            </Teks>
          </g>
          <Dimensi x1={Math.min(dx1 + 60, 940)} y1={dy0} x2={Math.min(dx1 + 60, 940)} y2={dy1} label="TETAP TINGGI" offset={0} warna={bp.redline} o={lerp(tk, 34, 46, 0, 1)} />
          <Teks x={96} y={400} ukuran={58} mono={false} tebal={700} o={lerp(tk, 40, 52, 0, 1)}>
            HARGA: TETAP TINGGI
          </Teks>
          <Teks x={96} y={470} ukuran={58} mono={false} tebal={700} warna={bp.redline} o={lerp(tk, fase2 + 20, fase2 + 32, 0, 1)}>
            KENAIKAN: MAKIN LANDAI
          </Teks>
          {void dx0}
        </>
      )}
    </g>
  );
};

// ------------------------------------------------------------ PANGAN (sel 2,3)
export const DetailPangan: React.FC<P> = ({ f }) => {
  const t = lokal(f, "pangan");
  const pd: Pandang = { rotX: 20, rotY: -34 + Math.max(0, t) * 0.08, jarak: 2000 };
  const X = 560;
  const Y = 1060;
  const SK = 100;
  const a = lerp(t, 14, 50, 0, 3.23);
  const b = lerp(t, 34, 80, 0, 5.81);
  const balok = (x: number, v: number) => kotak(190, v * SK, 190, [x, 0, 0]);
  const [ax, ay] = titik2D([-170, -a * SK, 0], pd, X, Y);
  const [bx, by] = titik2D([170, -b * SK, 0], pd, X, Y);
  return (
    <g>
      <Cap x={96} y={300} teks="DETAIL 06 · INFLASI YoY PER KELOMPOK · OKT 2026" />
      <Grup x={X} y={Y}>
        <Wire garis={[...kotak(700, 0, 360, [0, 0, 0]).slice(0, 4)]} pandang={pd} tebal={1.4} opacity={0.55} />
        <Wire garis={balok(-170, a)} pandang={pd} />
        <Wire garis={balok(170, b)} pandang={pd} warna={bp.redline} tebal={3} />
      </Grup>
      <Grup x={bx} y={by - 40} o={lerp(t, 80, 92, 0, 1)}>
        <Wire garis={cabai(200)} pandang={{ rotX: 12, rotY: t * 2.5, rotZ: -6, jarak: 1400 }} tebal={2} />
      </Grup>
      <Teks x={ax} y={ay - 60} ukuran={64} mono={false} tebal={700} rata="middle">
        {persen(a)}
      </Teks>
      <Teks x={bx} y={by - 130} ukuran={64} mono={false} tebal={700} rata="middle" warna={bp.redline}>
        {persen(b)}
      </Teks>
      {(() => {
        const [x, y] = titik2D([-170, 0, 95], pd, X, Y);
        const [x2, y2] = titik2D([170, 0, 95], pd, X, Y);
        return (
          <>
            <Teks x={x} y={y + 50} ukuran={26} rata="middle">
              UMUM
            </Teks>
            <Teks x={x2} y={y2 + 50} ukuran={26} rata="middle" warna={bp.redline}>
              PANGAN BERGEJOLAK
            </Teks>
          </>
        );
      })()}
      <Cap x={96} y={1150} teks="SUMBER: BPS & BANK INDONESIA, OKTOBER 2026" o={lerp(t, 40, 50, 0, 1)} />
    </g>
  );
};

// ------------------------------------------------------------ DOMPET exploded view (sel 1,3)
export const DetailDompet: React.FC<P> = ({ f }) => {
  const t = lokal(f, "dompet");
  const e = lerp(t, 10, 60, 0, 1, easeMasuk);
  const pd: Pandang = { rotX: 30, rotY: -36 + Math.max(0, t) * 0.08, jarak: 2000 };
  const X = 600;
  const Y = 1000;
  const lapisan: { g: Garis3D[]; dy: number; label: string }[] = [
    { g: kotak(520, 26, 320, [0, 0, 0]), dy: 0, label: "A · CANGKANG BELAKANG" },
    { g: [...kotak(480, 14, 280, [0, 0, 0]), ...kotak(200, 14, 120, [-110, -14, -50])], dy: -1, label: "B · SLOT KARTU" },
    { g: [...silinder(40, 10, 20, [-60, 0, 40], 6), ...silinder(40, 10, 20, [40, 0, -20], 6), ...silinder(34, 10, 20, [140, 0, 60], 6)], dy: -2, label: "C · KOIN" },
    { g: kotak(520, 26, 320, [0, 0, 0]), dy: -3, label: "D · CANGKANG DEPAN" },
  ];
  const jarak = 150;
  return (
    <g>
      <Cap x={96} y={300} teks="DETAIL 07 · DOMPET · EXPLODED VIEW" />
      <Grup x={X} y={Y}>
        <Wire
          garis={[
            [[-260, 40, -160], [-260, -3 * jarak * e - 60, -160]],
            [[260, 40, 160], [260, -3 * jarak * e - 60, 160]],
          ]}
          pandang={pd}
          putus="14 10"
          tebal={1.4}
          opacity={0.7}
        />
        {lapisan.map((l, i) => (
          <Wire key={i} garis={translate(l.g, [0, l.dy * jarak * e, 0])} pandang={pd} warna={i === 2 ? bp.redline : bp.garis} tebal={i === 2 ? 3 : 2.4} />
        ))}
      </Grup>
      {lapisan.map((l, i) => {
        const [x, y] = titik2D([260, l.dy * jarak * e - 10, 0], pd, X, Y);
        return <Callout key={i} dari={[x, y]} ke={[x + 60, y - 40]} label={l.label} o={lerp(t, 50 + i * 6, 60 + i * 6, 0, 1)} ukuran={20} />;
      })}
      {/* detail B: lingkaran pembesar */}
      {(() => {
        const [x, y] = titik2D([40, -2 * jarak * e, -20], pd, X, Y);
        const o = lerp(t, 70, 84, 0, 1);
        return (
          <g opacity={o}>
            <circle cx={x} cy={y} r={70} fill="none" stroke={bp.garis} strokeWidth={2} strokeDasharray="8 6" />
            <path d={`M ${x - 50} ${y - 50} L 300 520`} stroke={bp.garis} strokeWidth={1.5} />
            <circle cx={230} cy={460} r={110} fill={bp.biru} stroke={bp.garis} strokeWidth={3} />
            <circle cx={195} cy={480} r={34} fill="none" stroke={bp.redline} strokeWidth={3} />
            <circle cx={270} cy={440} r={30} fill="none" stroke={bp.redline} strokeWidth={3} />
            <Teks x={230} y={610} ukuran={22} rata="middle">
              DETAIL B (2:1) · ISI MENIPIS
            </Teks>
          </g>
        );
      })()}
    </g>
  );
};

// ------------------------------------------------------------ BLOK JUDUL LEMBAR (baris 4)
export const DetailPenutup: React.FC<P> = ({ f }) => {
  const t = lokal(f, "penutup");
  return (
    <g>
      <rect x={60} y={260} width={960} height={700} fill={bp.biru} stroke={bp.garis} strokeWidth={4} />
      <path d="M 60 640 L 1020 640 M 60 760 L 1020 760 M 60 860 L 1020 860 M 540 760 L 540 960" stroke={bp.garis} strokeWidth={2} />
      <Plot x={540} y={480} rata="middle" lebar={900} ukuran={170} teks="INTIPDOMPET" p={t < 0 ? 1 : lerp(t, 0, 14, 0, 1)} />
      <Teks x={540} y={580} ukuran={56} mono={false} tebal={600} rata="middle" o={t < 0 ? 1 : lerp(t, 10, 20, 0, 1)}>
        URUSAN UANG, KITA <tspan fill={bp.redline}>INTIP.</tspan>
      </Teks>
      <Teks x={90} y={712} ukuran={24}>
        DWG. INF-01 · INFLASI TERKENDALI, KOK BELANJA MAKIN MAHAL?
      </Teks>
      <Teks x={90} y={822} ukuran={24}>
        SUMBER: BPS · BANK INDONESIA · OKTOBER 2026
      </Teks>
      <Teks x={90} y={920} ukuran={24}>
        SKALA 1:1
      </Teks>
      <Teks x={570} y={920} ukuran={24}>
        LEMBAR 01/01
      </Teks>
    </g>
  );
};

// Catatan umum di pojok lembar (terlihat saat kamera mundur).
export const CatatanUmum: React.FC = () => (
  <g>
    <BlokJudul x={60} y={260} lebar={960} tinggiBaris={64} ukuran={26} baris={["CATATAN UMUM", "1. INFLASI = KECEPATAN KENAIKAN HARGA", "2. INFLASI RENDAH ≠ HARGA TURUN", "3. SASARAN BI 2026: 2,5 ± 1%", "4. DATA: BPS & BANK INDONESIA, OKT 2026"]} />
  </g>
);
