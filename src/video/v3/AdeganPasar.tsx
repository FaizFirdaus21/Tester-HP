import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { font, sorot } from "./gaya";
import { Bokeh, L, Lapis, Naskah, Sinema, eIO } from "./Umum";

// Los pasar: atap tenda bergaris dengan tepi bergelombang, meja dagangan, papan harga.
const Los: React.FC<{ x: number; y: number; w: number; warna: [string, string]; papan: string; dagangan: string[]; gelap?: number }> = ({
  x,
  y,
  w,
  warna,
  papan,
  dagangan,
  gelap = 0,
}) => {
  const garis = 8;
  const lebarGaris = w / garis;
  const tinggiAtap = w * 0.32;
  const gelombang = Array.from({ length: garis }, (_, i) => `Q ${x + lebarGaris * (i + 0.5)} ${y + tinggiAtap + 26} ${x + lebarGaris * (i + 1)} ${y + tinggiAtap}`).join(" ");
  return (
    <g>
      {/* tiang */}
      <rect x={x + 14} y={y + tinggiAtap} width={14} height={w * 0.9} fill="#3b2a2a" />
      <rect x={x + w - 28} y={y + tinggiAtap} width={14} height={w * 0.9} fill="#3b2a2a" />
      {/* atap bergaris */}
      {Array.from({ length: garis }).map((_, i) => (
        <path
          key={i}
          d={`M ${x + w / 2 + (i - garis / 2) * lebarGaris * 0.55} ${y} L ${x + w / 2 + (i + 1 - garis / 2) * lebarGaris * 0.55} ${y} L ${x + lebarGaris * (i + 1)} ${y + tinggiAtap} L ${x + lebarGaris * i} ${y + tinggiAtap} Z`}
          fill={warna[i % 2]}
        />
      ))}
      <path d={`M ${x} ${y + tinggiAtap} ${gelombang} Z`} fill={warna[0]} />
      {/* papan harga tergantung */}
      <rect x={x + w / 2 - 1} y={y + tinggiAtap + 20} width={2} height={50} fill="#222" />
      <rect x={x + w / 2 - 95} y={y + tinggiAtap + 66} width={190} height={78} rx={10} fill="#1d2b22" />
      <text x={x + w / 2} y={y + tinggiAtap + 118} textAnchor="middle" fontFamily={font.utama} fontWeight={800} fontSize={34} fill="#f4f1e6">
        {papan} <tspan fill="#ff6b5a">▲</tspan>
      </text>
      {/* meja & dagangan */}
      <rect x={x + 10} y={y + tinggiAtap + w * 0.62} width={w - 20} height={30} rx={6} fill="#7a4b2c" />
      <rect x={x + 30} y={y + tinggiAtap + w * 0.62 + 30} width={w - 60} height={w * 0.3} fill="#5a3620" />
      {dagangan.map((c, i) => {
        const n = dagangan.length;
        const cx = x + 40 + ((w - 80) * (i + 0.5)) / n;
        return <ellipse key={i} cx={cx} cy={y + tinggiAtap + w * 0.62 - 26} rx={(w - 80) / n / 2} ry={40} fill={c} />;
      })}
      {gelap > 0 ? <rect x={x - 5} y={y - 5} width={w + 10} height={w * 1.4} fill="#2b1840" opacity={gelap} /> : null}
    </g>
  );
};

export const AdeganPasar: React.FC<{ mode?: "judul" | "pagi" }> = ({ mode = "judul" }) => {
  const f = useCurrentFrame();
  const kx = L(f, 0, 100, -40, 50, eIO);
  const zoom = L(f, 0, 100, 1, 1.12, eIO);
  const terang = mode === "pagi";
  const judul = [
    { t: "INFLASI", m: 4, u: 170 },
    { t: "TERKENDALI,", m: 10, u: 130 },
    { t: "KOK BELANJA", m: 20, u: 104 },
  ];
  return (
    <AbsoluteFill style={{ background: terang ? "linear-gradient(#8fc9ff 0%, #ffd9a8 55%, #ffb36b 100%)" : "linear-gradient(#5a4b8f 0%, #c36b8a 38%, #ff9a6b 62%, #ffc98a 100%)" }}>
      {/* matahari */}
      <Lapis dalam={6} kx={kx} ky={0} zoom={zoom}>
        <div style={{ position: "absolute", left: 600, top: terang ? 380 : 760, width: 300, height: 300, borderRadius: "50%", background: "#fff3c4", boxShadow: "0 0 180px 80px rgba(255,214,150,0.65)" }} />
      </Lapis>
      {/* siluet kota jauh */}
      <Lapis dalam={4} kx={kx} ky={0} zoom={zoom}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <path d="M -100 1150 L -100 980 L 60 980 L 60 900 L 160 900 L 160 1010 L 260 1010 L 260 860 Q 330 760 400 860 L 400 1000 L 520 1000 L 520 930 L 640 930 L 640 1020 L 760 1020 L 760 880 L 880 880 L 880 990 L 1200 990 L 1200 1150 Z" fill={terang ? "#d7a98a" : "#8a5d8f"} opacity={0.9} />
          <rect x={322} y={700} width={10} height={70} fill={terang ? "#d7a98a" : "#8a5d8f"} />
        </svg>
      </Lapis>
      {/* deretan los pasar */}
      <Lapis dalam={2} kx={kx} ky={0} zoom={zoom}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <rect x={-200} y={1300} width={1480} height={700} fill={terang ? "#b98a6a" : "#6b4a5a"} />
          <Los x={-180} y={960} w={420} warna={["#e8473c", "#f7efe2"]} papan="CABAI" dagangan={["#d8261c", "#e83a2a", "#c41f17"]} gelap={terang ? 0 : 0.18} />
          <Los x={300} y={1000} w={380} warna={["#2f9c6a", "#f7efe2"]} papan="BAWANG" dagangan={["#c9798a", "#b65a73", "#d48a98"]} gelap={terang ? 0 : 0.18} />
          <Los x={740} y={950} w={420} warna={["#2f6fc0", "#f7efe2"]} papan="TELUR" dagangan={["#f2e2c8", "#e9d3b0", "#f6ead8"]} gelap={terang ? 0 : 0.18} />
        </svg>
      </Lapis>
      {/* lampu gantung dekat kamera, tidak fokus */}
      <Lapis dalam={0.8} kx={kx} ky={0} zoom={zoom} blur={5}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <path d="M -100 140 Q 540 300 1180 120" stroke="#2a1d1d" strokeWidth={5} fill="none" />
          {Array.from({ length: 9 }).map((_, i) => {
            const t = i / 8;
            const x = -100 + 1280 * t;
            const y = 140 + Math.sin(t * Math.PI) * 150 - t * 20 + 26;
            return <circle key={i} cx={x} cy={y} r={22} fill="#ffe7a6" />;
          })}
        </svg>
      </Lapis>
      {!terang ? <Bokeh warna={["#ffd28a", "#ff9a6b", "#fff1c9"]} jumlah={14} area={[0, 100, 1080, 700]} o={0.45} seed={2} /> : null}
      {mode === "judul" ? (
        <div style={{ position: "absolute", top: 300, left: 70, right: 70, fontFamily: font.utama, fontWeight: 800, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.03em", textShadow: "0 10px 40px rgba(60,20,40,0.45)" }}>
          {judul.map((j) => {
            const p = L(f, j.m, j.m + 12, 0, 1);
            return (
              <div key={j.t} style={{ fontSize: j.u, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
                {j.t}
              </div>
            );
          })}
          {(() => {
            const p = L(f, 30, 44, 0, 1);
            return (
              <div style={{ fontSize: 104, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
                MAKIN <span style={{ color: sorot, display: "inline-block", transform: `rotate(${(1 - p) * -8}deg) scale(${1 + 0.3 * (1 - p)})` }}>MAHAL?</span>
              </div>
            );
          })()}
        </div>
      ) : (
        <Naskah teks="Sekarang kamu jadi *tahu,* kan?" mulai={6} y={520} ukuran={96} />
      )}
      <Sinema vignette={0.45} />
    </AbsoluteFill>
  );
};
