import React from "react";
import { m } from "../tema/malam";

// Tipo: maskot intipdompet. Titik asal (0,0) = tengah bawah kaki.
// Tinggi total kira-kira 490 unit pada skala 1.
export type Mata = "normal" | "kedip" | "kedipSatu" | "senang" | "tanya" | "seru" | "lirik";

export type TipoProps = {
  mata?: Mata;
  lihatX?: number; // -1..1, arah pandangan
  lihatY?: number; // -1..1
  lenganKiri?: number; // derajat, 0 = turun, positif = naik ke samping
  lenganKanan?: number;
  antena?: number; // 0..1, kecerahan antena (1 = oranye penuh)
  warnaVisor?: string;
};

const Lengan: React.FC<{ sisi: -1 | 1; sudut: number }> = ({ sisi, sudut }) => (
  // berputar dari bahu
  <g transform={`translate(${sisi * 109} -176) rotate(${-sisi * sudut})`}>
    <rect x={-23} y={-10} width={46} height={100} rx={23} fill={m.putih} />
  </g>
);

export const Tipo: React.FC<TipoProps> = ({
  mata = "normal",
  lihatX = 0,
  lihatY = 0,
  lenganKiri = 0,
  lenganKanan = 0,
  antena = 1,
  warnaVisor = m.langit,
}) => {
  const ex = lihatX * 16;
  const ey = lihatY * 10;
  const mataY = -311 + ey;
  return (
    <g>
      <rect x={-62} y={-44} width={44} height={44} rx={12} fill={m.putih} />
      <rect x={18} y={-44} width={44} height={44} rx={12} fill={m.putih} />
      <Lengan sisi={-1} sudut={lenganKiri} />
      <Lengan sisi={1} sudut={lenganKanan} />
      <rect x={-96} y={-214} width={192} height={178} rx={48} fill={m.putih} />
      <circle cx={0} cy={-126} r={26} fill={warnaVisor} />
      <rect x={-120} y={-396} width={240} height={170} rx={64} fill={m.putih} />
      <rect x={-88} y={-360} width={176} height={98} rx={44} fill={warnaVisor} />
      {mata === "normal" || mata === "lirik" ? (
        <>
          <circle cx={-36 + ex} cy={mataY} r={17} fill={m.putih} />
          <circle cx={36 + ex} cy={mataY} r={17} fill={m.putih} />
        </>
      ) : null}
      {mata === "kedip" ? (
        <>
          <rect x={-53 + ex} y={mataY - 4} width={34} height={8} rx={4} fill={m.putih} />
          <rect x={19 + ex} y={mataY - 4} width={34} height={8} rx={4} fill={m.putih} />
        </>
      ) : null}
      {mata === "kedipSatu" ? (
        <>
          <circle cx={-36 + ex} cy={mataY} r={17} fill={m.putih} />
          <path
            d={`M ${20 + ex} ${mataY + 4} Q ${36 + ex} ${mataY - 14} ${52 + ex} ${mataY + 4}`}
            fill="none"
            stroke={m.putih}
            strokeWidth={10}
            strokeLinecap="round"
          />
        </>
      ) : null}
      {mata === "senang" ? (
        <g fill="none" stroke={m.putih} strokeWidth={10} strokeLinecap="round">
          <path d={`M ${-52 + ex} ${mataY + 6} Q ${-36 + ex} ${mataY - 16} ${-20 + ex} ${mataY + 6}`} />
          <path d={`M ${20 + ex} ${mataY + 6} Q ${36 + ex} ${mataY - 16} ${52 + ex} ${mataY + 6}`} />
        </g>
      ) : null}
      {mata === "tanya" || mata === "seru" ? (
        <text
          x={0}
          y={-282}
          textAnchor="middle"
          fontFamily='"Fredoka", sans-serif'
          fontWeight={600}
          fontSize={84}
          fill={m.putih}
        >
          {mata === "tanya" ? "?" : "!"}
        </text>
      ) : null}
      <rect x={-7} y={-452} width={14} height={60} rx={7} fill={m.putih} />
      <circle cx={0} cy={-462} r={24} fill={m.oranye} opacity={0.35 + 0.65 * antena} />
    </g>
  );
};

// Kedip otomatis yang deterministik: tutup mata 4 frame setiap `jeda` frame.
export const kedipOtomatis = (frame: number, jeda = 75, offset = 20): Mata =>
  (frame + offset) % jeda < 4 ? "kedip" : "normal";
