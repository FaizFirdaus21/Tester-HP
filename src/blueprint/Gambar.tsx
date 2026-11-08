// Primitif gambar teknik: kertas grid, garis dimensi, callout, blok judul.
import React from "react";
import { bp, fon } from "./tema";

let idPola = 0;
export const KertasGrid: React.FC<{ x?: number; y?: number; w: number; h: number; sel?: number }> = ({ x = 0, y = 0, w, h, sel = 24 }) => {
  const id = React.useMemo(() => `grid${idPola++}`, []);
  return (
    <>
      <defs>
        <pattern id={`${id}k`} width={sel} height={sel} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M ${sel} 0 L 0 0 0 ${sel}`} fill="none" stroke={bp.grid} strokeWidth={1} />
        </pattern>
        <pattern id={`${id}b`} width={sel * 5} height={sel * 5} patternUnits="userSpaceOnUse" x={x} y={y}>
          <rect width={sel * 5} height={sel * 5} fill={`url(#${id}k)`} />
          <path d={`M ${sel * 5} 0 L 0 0 0 ${sel * 5}`} fill="none" stroke={bp.gridTebal} strokeWidth={1.5} />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={bp.biru} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}b)`} />
    </>
  );
};

export const Teks: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  ukuran?: number;
  warna?: string;
  rata?: "start" | "middle" | "end";
  mono?: boolean;
  tebal?: number;
  o?: number;
  spasi?: number;
}> = ({ x, y, children, ukuran = 22, warna = bp.garis, rata = "start", mono = true, tebal, o = 1, spasi }) => (
  <text
    x={x}
    y={y}
    fontFamily={mono ? fon.mono : fon.judul}
    fontWeight={tebal ?? (mono ? 500 : 600)}
    fontSize={ukuran}
    fill={warna}
    textAnchor={rata}
    opacity={o}
    letterSpacing={spasi}
    style={{ fontVariantNumeric: "tabular-nums" }}
  >
    {children}
  </text>
);

// Garis dimensi dengan garis bantu, ujung panah, dan label di tengah.
export const Dimensi: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  offset?: number; // jarak garis dimensi dari objek (tegak lurus)
  warna?: string;
  ukuran?: number;
  o?: number;
  sisiLabel?: 1 | -1;
}> = ({ x1, y1, x2, y2, label, offset = 40, warna = bp.garis, ukuran = 22, o = 1, sisiLabel = 1 }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const ax = x1 + nx * offset;
  const ay = y1 + ny * offset;
  const bx = x2 + nx * offset;
  const by = y2 + ny * offset;
  const ux = dx / L;
  const uy = dy / L;
  const panah = (px: number, py: number, s: number) =>
    `M ${px} ${py} L ${px + s * (ux * 14 + nx * 5)} ${py + s * (uy * 14 + ny * 5)} L ${px + s * (ux * 14 - nx * 5)} ${py + s * (uy * 14 - ny * 5)} Z`;
  const sudut = (Math.atan2(dy, dx) * 180) / Math.PI;
  const tegak = Math.abs(sudut) > 45 && Math.abs(sudut) < 135;
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const geser = sisiLabel * (ukuran * 0.9);
  return (
    <g opacity={o}>
      <path
        d={`M ${x1 + nx * 6} ${y1 + ny * 6} L ${x1 + nx * (offset + 10)} ${y1 + ny * (offset + 10)} M ${x2 + nx * 6} ${y2 + ny * 6} L ${x2 + nx * (offset + 10)} ${y2 + ny * (offset + 10)}`}
        stroke={warna}
        strokeWidth={1.5}
        opacity={0.75}
      />
      <path d={`M ${ax} ${ay} L ${bx} ${by}`} stroke={warna} strokeWidth={2} />
      {L > 34 ? (
        <>
          <path d={panah(ax, ay, 1)} fill={warna} />
          <path d={panah(bx, by, -1)} fill={warna} />
        </>
      ) : null}
      <g transform={`translate(${mx + nx * geser} ${my + ny * geser}) rotate(${tegak ? -90 : 0})`}>
        <Teks x={0} y={ukuran * 0.35} ukuran={ukuran} warna={warna} rata="middle">
          {label}
        </Teks>
      </g>
    </g>
  );
};

// Callout: garis penunjuk bersiku + label.
export const Callout: React.FC<{ dari: [number, number]; ke: [number, number]; label: string; ukuran?: number; warna?: string; o?: number; titik?: boolean }> = ({
  dari,
  ke,
  label,
  ukuran = 22,
  warna = bp.garis,
  o = 1,
  titik = true,
}) => {
  const kanan = ke[0] >= dari[0];
  const ujung = ke[0] + (kanan ? 1 : -1) * (label.length * ukuran * 0.62 + 16);
  return (
    <g opacity={o}>
      {titik ? <circle cx={dari[0]} cy={dari[1]} r={5} fill={warna} /> : null}
      <path d={`M ${dari[0]} ${dari[1]} L ${ke[0]} ${ke[1]} L ${ujung} ${ke[1]}`} stroke={warna} strokeWidth={1.8} fill="none" />
      <Teks x={ke[0] + (kanan ? 8 : -8)} y={ke[1] - 10} ukuran={ukuran} warna={warna} rata={kanan ? "start" : "end"}>
        {label}
      </Teks>
    </g>
  );
};

// Blok judul gambar teknik (pojok lembar).
export const BlokJudul: React.FC<{ x: number; y: number; baris: string[]; lebar?: number; tinggiBaris?: number; ukuran?: number; o?: number }> = ({
  x,
  y,
  baris,
  lebar = 360,
  tinggiBaris = 44,
  ukuran = 22,
  o = 1,
}) => (
  <g opacity={o}>
    <rect x={x} y={y} width={lebar} height={tinggiBaris * baris.length} fill={bp.biru} stroke={bp.garis} strokeWidth={2.5} />
    {baris.map((b, i) => (
      <g key={i}>
        {i > 0 ? <path d={`M ${x} ${y + i * tinggiBaris} L ${x + lebar} ${y + i * tinggiBaris}`} stroke={bp.garis} strokeWidth={1.5} /> : null}
        <Teks x={x + 16} y={y + i * tinggiBaris + tinggiBaris * 0.66} ukuran={ukuran}>
          {b}
        </Teks>
      </g>
    ))}
  </g>
);
