import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { font, persen } from "./gaya";
import { L, Naskah, Sinema, eIO } from "./Umum";

const Halaman: React.FC<{ bulan: string; warna: string; children?: React.ReactNode }> = ({ bulan, warna, children }) => (
  <div style={{ position: "absolute", inset: 0, background: "#fffdf8", borderRadius: 18, overflow: "hidden", boxShadow: "inset 0 -6px 0 #e6dfd2" }}>
    <div style={{ height: 150, background: warna, color: "#fff", fontFamily: font.utama, fontWeight: 800, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "0.04em" }}>
      {bulan}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, padding: "26px 30px" }}>
      {Array.from({ length: 31 }).map((_, i) => (
        <div key={i} style={{ fontFamily: font.utama, fontWeight: 700, fontSize: 30, color: i % 7 === 6 ? "#d23a2a" : "#3a3a3a", textAlign: "center", height: 52 }}>
          {i + 1}
        </div>
      ))}
    </div>
    {children}
  </div>
);

// Kalender meja: halaman September terbalik, Oktober 2026 dengan coretan +0,22%.
export const AdeganKalender: React.FC = () => {
  const f = useCurrentFrame();
  const balik = L(f, 6, 30, 0, 1, eIO);
  const coret = L(f, 34, 56, 0, 1);
  const angka = L(f, 34, 60, 0, 0.22);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #f0d2a8 0%, #d79a62 60%, #a8683a 100%)" }}>
      {/* benda di meja, tidak fokus */}
      <div style={{ position: "absolute", left: -60, top: 160, width: 300, height: 300, borderRadius: "50%", background: "#fff", filter: "blur(10px)", opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 860, top: 1180, width: 40, height: 520, borderRadius: 20, background: "#f2c23a", transform: "rotate(28deg)", filter: "blur(6px)" }} />
      <AbsoluteFill style={{ transform: `scale(${L(f, 0, 100, 1, 1.08, eIO)}) rotate(-4deg)`, perspective: 1600 }}>
        <div style={{ position: "absolute", left: 170, top: 330, width: 740, height: 780 }}>
          <div style={{ position: "absolute", inset: 0, transform: "translate(18px, 26px)", background: "rgba(80,40,10,0.35)", borderRadius: 18, filter: "blur(16px)" }} />
          <Halaman bulan="OKTOBER 2026" warna="#d2453a">
            <div style={{ position: "absolute", left: 360, top: 330, width: 330, height: 260 }}>
              <svg width={330} height={260} style={{ position: "absolute", overflow: "visible" }}>
                <ellipse cx={165} cy={130} rx={160} ry={110} fill="none" stroke="#e2342a" strokeWidth={8} strokeDasharray={1100} strokeDashoffset={1100 * (1 - coret)} transform="rotate(-6 165 130)" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: font.utama, color: "#e2342a", opacity: coret, transform: "rotate(-6deg)" }}>
                <div style={{ fontWeight: 800, fontSize: 92, lineHeight: 1 }}>+{persen(angka)}</div>
                <div style={{ fontWeight: 700, fontSize: 32 }}>bulanan</div>
              </div>
            </div>
          </Halaman>
          {/* halaman september yang dibalik ke atas */}
          {balik < 1 ? (
            <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0%", transform: `rotateX(${balik * 175}deg)`, backfaceVisibility: "hidden" }}>
              <Halaman bulan="SEPTEMBER 2026" warna="#3a6fb8" />
            </div>
          ) : null}
          {/* cincin kalender */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 60 + i * 88, top: -30, width: 26, height: 64, borderRadius: 13, background: "linear-gradient(90deg,#888,#eee,#888)" }} />
          ))}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 220, fontFamily: font.mono, fontWeight: 600, fontSize: 28, color: "#5a3416", opacity: L(f, 50, 62, 0, 1) }}>
        bandingkan: 3,23% tahunan
      </div>
      <Naskah mulai={14} y={1220} teks="Sementara itu, inflasi bulanan hanya *0,22* *persen.*" ukuran={66} />
      <Sinema vignette={0.45} />
    </AbsoluteFill>
  );
};
