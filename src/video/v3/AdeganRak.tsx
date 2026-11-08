import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { font, sorot } from "./gaya";
import { L, Naskah, Sinema, eIO } from "./Umum";

// Lorong supermarket perspektif satu titik. Kamera naik dari papan "inflasi rendah"
// di bawah ke label harga di rak paling atas.
const WARNA = ["#e94b3c", "#f2b134", "#3aa3d9", "#6cc070", "#f27aa8", "#8e6ad8", "#ffffff", "#f59a3b"];

const Rak: React.FC<{ sisi: -1 | 1 }> = ({ sisi }) => {
  // rak di sisi kiri/kanan, 6 tingkat, menyempit ke titik hilang (540, 700)
  const tingkat = 6;
  const atas = -300;
  const bawah = 2200;
  const xLuar = sisi < 0 ? -40 : 1120;
  const xDalam = sisi < 0 ? 400 : 680;
  return (
    <g>
      {Array.from({ length: tingkat }).map((_, i) => {
        const y0 = atas + ((bawah - atas) * i) / tingkat;
        const y1 = atas + ((bawah - atas) * (i + 1)) / tingkat;
        const yd0 = 700 + (y0 - 700) * 0.28;
        const yd1 = 700 + (y1 - 700) * 0.28;
        const papan = `M ${xLuar} ${y1 - 40} L ${xDalam} ${yd1 - 12} L ${xDalam} ${yd1} L ${xLuar} ${y1} Z`;
        const n = 7;
        return (
          <g key={i}>
            <path d={`M ${xLuar} ${y0} L ${xDalam} ${yd0} L ${xDalam} ${yd1} L ${xLuar} ${y1} Z`} fill="#dfe6ea" />
            {Array.from({ length: n }).map((_, k) => {
              const t0 = k / n;
              const t1 = (k + 0.8) / n;
              const xa = xLuar + (xDalam - xLuar) * t0;
              const xb = xLuar + (xDalam - xLuar) * t1;
              const ya1 = y1 - 40 + (yd1 - 12 - (y1 - 40)) * t0;
              const yb1 = y1 - 40 + (yd1 - 12 - (y1 - 40)) * t1;
              const tinggi = (y1 - y0) * 0.62 * (1 - 0.72 * t0);
              const tinggiB = (y1 - y0) * 0.62 * (1 - 0.72 * t1);
              return <path key={k} d={`M ${xa} ${ya1} L ${xb} ${yb1} L ${xb} ${yb1 - tinggiB} L ${xa} ${ya1 - tinggi} Z`} fill={WARNA[(i * 3 + k) % WARNA.length]} />;
            })}
            <path d={papan} fill="#9aa8b0" />
          </g>
        );
      })}
    </g>
  );
};

export const AdeganRak: React.FC = () => {
  const f = useCurrentFrame();
  const ky = L(f, 10, 120, 520, -260, eIO); // crane naik
  const beda = L(f, 40, 56, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#cfd8dc" }}>
      <AbsoluteFill style={{ transform: `translateY(${-ky}px)` }}>
        <svg width={1080} height={2600} style={{ position: "absolute", top: -340 }}>
          <rect x={0} y={-400} width={1080} height={3200} fill="#e9eef0" />
          {/* lantai mengilap */}
          <path d="M -200 2600 L 470 1040 L 610 1040 L 1280 2600 Z" fill="#cfd6d9" />
          <path d="M 520 1040 L 560 1040 L 640 2600 L 440 2600 Z" fill="#ffffff" opacity={0.5} />
          {/* lampu neon */}
          {Array.from({ length: 6 }).map((_, i) => {
            const t = i / 6;
            const y = -300 + 1000 * Math.pow(t, 0.7);
            const w = 300 * (1 - t * 0.85);
            return <rect key={i} x={540 - w / 2} y={y} width={w} height={22 * (1 - t * 0.8)} rx={8} fill="#ffffff" style={{ filter: "drop-shadow(0 0 18px #e8fbff)" }} />;
          })}
          <Rak sisi={-1} />
          <Rak sisi={1} />
        </svg>
        {/* papan kecil di bawah: inflasi rendah */}
        <div style={{ position: "absolute", left: 560, top: 1500, transform: "rotate(3deg)", padding: "18px 28px", background: "#2f9c6a", color: "#fff", fontFamily: font.utama, fontWeight: 800, fontSize: 44, borderRadius: 14, boxShadow: "0 14px 30px rgba(0,0,0,0.25)" }}>
          inflasi rendah ▼
        </div>
        {/* label harga di rak paling atas */}
        <div style={{ position: "absolute", left: 120, top: 120, transform: "rotate(-3deg)", padding: "22px 34px", background: sorot, color: "#2b1b0a", fontFamily: font.utama, fontWeight: 800, fontSize: 64, borderRadius: 14, boxShadow: "0 18px 36px rgba(0,0,0,0.3)", lineHeight: 1 }}>
          <div style={{ fontSize: 26, fontFamily: font.mono, fontWeight: 700 }}>HARGA</div>
          tetap di atas ▲
        </div>
      </AbsoluteFill>
      {/* teks besar */}
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", fontFamily: font.utama, fontWeight: 800, color: "#fff", fontSize: 96, lineHeight: 1, WebkitTextStroke: "12px #16202a", paintOrder: "stroke fill", opacity: beda, transform: `scale(${1.25 - 0.25 * beda})` }}>
        inflasi rendah <span style={{ color: sorot }}>≠</span>
        <br />
        harga murah
      </div>
      <Naskah mulai={12} y={1190} teks="Tapi jangan salah paham. Inflasi yang rendah *bukan* *berarti* harga barang kembali murah." />
      <Sinema vignette={0.35} />
    </AbsoluteFill>
  );
};
