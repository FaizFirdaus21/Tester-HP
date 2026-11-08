import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { formatAngka, font, sudut, warna } from "../brand";

export type TitikData = { label: string; nilai: number };

type Props = {
  data: TitikData[];
  lebar: number;
  tinggi: number;
  mulai: number; // frame saat batang pertama mulai tumbuh
  jedaAntarBatang?: number;
};

// Grafik batang yang tumbuh dari dasar satu per satu.
// Sumbu nilai selalu mulai dari nol (aturan merek: jangan potong sumbu).
export const GrafikBatang: React.FC<Props> = ({ data, lebar, tinggi, mulai, jedaAntarBatang = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ruangLabelBawah = 60;
  const ruangNilaiAtas = 70;
  const dasar = tinggi - ruangLabelBawah;
  const tinggiMaks = dasar - ruangNilaiAtas;
  const maks = Math.max(...data.map((d) => d.nilai)) || 1;
  const slot = lebar / data.length;
  const lebarBatang = Math.min(110, slot * 0.66);

  const teksTerpanjang = Math.max(...data.map((d) => formatAngka(d.nilai).length));
  const ukuranNilai = Math.min(32, (slot * 0.95) / (teksTerpanjang * 0.6));

  const garisGrid = [0.25, 0.5, 0.75, 1].map((f) => dasar - tinggiMaks * f);

  return (
    <svg width={lebar} height={tinggi} viewBox={`0 0 ${lebar} ${tinggi}`}>
      {garisGrid.map((y) => (
        <line key={y} x1={0} x2={lebar} y1={y} y2={y} stroke={warna.garis} strokeWidth={2} />
      ))}
      {data.map((d, i) => {
        const prog = spring({ frame: frame - mulai - i * jedaAntarBatang, fps, config: { damping: 18, mass: 0.8 } });
        const h = (d.nilai / maks) * tinggiMaks * prog;
        const x = i * slot + (slot - lebarBatang) / 2;
        const nilaiTampil = d.nilai * prog;
        const terakhir = i === data.length - 1;
        const opNilai = interpolate(prog, [0.2, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <g key={d.label}>
            <rect x={x} y={dasar - h} width={lebarBatang} height={Math.max(h, 0)} rx={sudut.kecil} fill={warna.biru} />
            {terakhir && prog > 0.95 ? (
              <rect
                x={i * slot + slot * 0.04}
                y={dasar - h - 16 - ukuranNilai * 1.15}
                width={slot * 0.92}
                height={ukuranNilai * 1.4}
                rx={10}
                fill={warna.kuningKoin}
              />
            ) : null}
            <text
              x={i * slot + slot / 2}
              y={dasar - h - 16 - ukuranNilai * 0.1}
              textAnchor="middle"
              fontFamily={font.mono}
              fontWeight={500}
              fontSize={ukuranNilai}
              fill={warna.tinta}
              opacity={opNilai}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatAngka(Math.round(nilaiTampil))}
            </text>
            <text
              x={i * slot + slot / 2}
              y={dasar + 42}
              textAnchor="middle"
              fontFamily={font.mono}
              fontSize={28}
              fill={warna.tintaPudar}
            >
              {d.label}
            </text>
          </g>
        );
      })}
      <line x1={0} x2={lebar} y1={dasar} y2={dasar} stroke={warna.tintaPudar} strokeWidth={3} />
    </svg>
  );
};
