import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BlokJudul, Callout, Dimensi, KertasGrid, Teks } from "../blueprint/Gambar";
import { bp } from "../blueprint/tema";

// BIT-01: robot lepas landas dalam gaya gambar teknik (blueprint).
// Loop 30 frame: jongkok, lepas landas sambil berputar sekali, melayang, turun lagi ke landasan.
export const BLUEPRINT_DURASI = 30;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const PAD_Y = 1240;
const CX = 540;
const TINGGI = 260;
// skala gambar: 490 px = 180 satuan (H 180), lebar 395 px = 145 satuan (W 145)
const SATUAN = 180 / 490;

const gerak = (f: number) => {
  const jongkok = interpolate(f, [0, 3, 6], [0, 1, 0], { ...clamp, easing: easeInOut });
  const naik = interpolate(f, [3, 16], [0, 1], { ...clamp, easing: easeOut });
  const turun = interpolate(f, [24, 30], [0, 1], { ...clamp, easing: easeInOut });
  const layang = f >= 16 && f <= 24 ? Math.sin(((f - 16) / 8) * Math.PI) * 14 : 0;
  const y = -TINGGI * naik * (1 - turun) - layang;
  const putar = interpolate(f, [4, 17], [0, 360], { ...clamp, easing: easeInOut });
  const sx = 1 + 0.07 * jongkok;
  const sy = 1 - 0.1 * jongkok;
  const dorong = interpolate(f, [3, 6, 15, 22], [0, 1, 1, 0.35], clamp) * (1 - turun);
  return { y, putar, sx, sy, dorong };
};

// Titik-titik kerangka robot (asal = tengah bawah kaki), untuk kotak pembatas yang ikut berputar.
const KERANGKA: [number, number][] = [
  [-197, -190], [197, -190], [-197, -88], [197, -88],
  [-150, -396], [150, -396], [-150, -226], [150, -226],
  [-62, 0], [62, 0], [0, -490],
];

const Robot: React.FC = () => {
  const s = { stroke: bp.garis, strokeWidth: 3, fill: bp.biru } as const;
  return (
    <g>
      <rect x={-62} y={-44} width={44} height={44} rx={10} {...s} />
      <rect x={18} y={-44} width={44} height={44} rx={10} {...s} />
      <rect x={-197} y={-190} width={50} height={102} rx={25} {...s} />
      <rect x={147} y={-190} width={50} height={102} rx={25} {...s} />
      <path d="M -147 -150 L -110 -150 M 147 -150 L 110 -150" stroke={bp.garis} strokeWidth={3} />
      <rect x={-110} y={-214} width={220} height={178} rx={44} {...s} />
      <circle cx={0} cy={-126} r={26} {...s} />
      <path d="M -14 -126 L 14 -126 M 0 -140 L 0 -112" stroke={bp.garis} strokeWidth={1.5} />
      <rect x={-150} y={-396} width={300} height={170} rx={60} {...s} />
      <rect x={-112} y={-362} width={224} height={102} rx={44} {...s} strokeDasharray="10 7" />
      <circle cx={-42} cy={-311} r={17} {...s} />
      <circle cx={42} cy={-311} r={17} {...s} />
      <rect x={-6} y={-452} width={12} height={56} {...s} />
      <circle cx={0} cy={-466} r={24} {...s} />
      <path d="M 0 -496 L 0 -436 M -30 -466 L 30 -466" stroke={bp.garis} strokeWidth={1.2} opacity={0.7} />
    </g>
  );
};

export const RobotBlueprint: React.FC = () => {
  const f = useCurrentFrame();
  const g = gerak(f);
  const pusat = -220; // poros putar di tengah badan
  const rad = (g.putar * Math.PI) / 180;
  const titik = KERANGKA.map(([x, y]) => {
    const yy = y * g.sy - pusat;
    const xx = x * g.sx;
    return [CX + xx * Math.cos(rad) - yy * Math.sin(rad), PAD_Y + g.y + pusat + xx * Math.sin(rad) + yy * Math.cos(rad)] as const;
  });
  const minX = Math.min(...titik.map((p) => p[0]));
  const maxX = Math.max(...titik.map((p) => p[0]));
  const minY = Math.min(...titik.map((p) => p[1]));
  const maxY = Math.max(...titik.map((p) => p[1]));
  const H = Math.round((maxY - minY) * SATUAN);
  const W = Math.round((maxX - minX) * (145 / 395));
  const ujungAntena = titik[10];
  const kakiY = PAD_Y + g.y;
  const api = g.dorong;

  return (
    <AbsoluteFill style={{ backgroundColor: bp.biru }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <KertasGrid w={1080} h={1920} />
        {/* landasan */}
        <path d={`M 290 ${PAD_Y} L 790 ${PAD_Y}`} stroke={bp.garis} strokeWidth={3} />
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={i} d={`M ${300 + i * 31} ${PAD_Y} L ${284 + i * 31} ${PAD_Y + 18}`} stroke={bp.garis} strokeWidth={1.5} />
        ))}
        <Teks x={540} y={PAD_Y + 56} ukuran={20} rata="middle" warna={bp.pudar}>
          PAD / DATUM 0
        </Teks>
        {/* api: garis putus-putus */}
        {api > 0.02 ? (
          <g transform={`translate(${CX} ${kakiY}) rotate(${g.putar}, 0, ${pusat})`}>
            <path
              d={`M -70 4 Q -80 ${60 + 120 * api} 0 ${110 + 190 * api} Q 80 ${60 + 120 * api} 70 4 Z`}
              fill="none"
              stroke={bp.garis}
              strokeWidth={2.5}
              strokeDasharray="12 9"
            />
            <path d={`M -30 4 Q -34 ${40 + 60 * api} 0 ${60 + 110 * api} Q 34 ${40 + 60 * api} 30 4 Z`} fill="none" stroke={bp.garis} strokeWidth={1.5} strokeDasharray="6 6" />
          </g>
        ) : null}
        {/* robot */}
        <g transform={`translate(${CX} ${kakiY}) rotate(${g.putar}, 0, ${pusat})`}>
          <g transform={`scale(${g.sx} ${g.sy})`}>
            <Robot />
          </g>
        </g>
        {/* kotak pembatas tipis */}
        <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} fill="none" stroke={bp.garis} strokeWidth={1} strokeDasharray="4 8" opacity={0.5} />
        {/* dimensi yang mengikuti robot */}
        <Dimensi x1={minX} y1={maxY} x2={minX} y2={minY} label={`H ${H}`} offset={60} />
        <Dimensi x1={minX} y1={minY} x2={maxX} y2={minY} label={`W ${W}`} offset={-50} sisiLabel={1} />
        <Dimensi x1={maxX + 10} y1={PAD_Y} x2={maxX + 10} y2={maxY} label={`ALT ${Math.round((PAD_Y - maxY) * SATUAN)}`} offset={-70} o={PAD_Y - maxY > 30 ? 1 : 0} />
        <Callout dari={[ujungAntena[0], ujungAntena[1]]} ke={[ujungAntena[0] + 150, ujungAntena[1] - 90]} label="ANT. TIP" />
        {api > 0.02 ? <Callout dari={[CX + 40, kakiY + 90 * api]} ke={[CX + 230, kakiY + 140]} label="THRUST" titik={false} /> : null}
        {/* blok judul */}
        <BlokJudul x={656} y={1430} baris={["BIT-01", "LIFT-OFF", "SCALE 1:1"]} lebar={330} />
        <Teks x={96} y={300} ukuran={20} warna={bp.pudar}>
          SHEET 01/01 · DIM. IN MM
        </Teks>
      </svg>
    </AbsoluteFill>
  );
};
