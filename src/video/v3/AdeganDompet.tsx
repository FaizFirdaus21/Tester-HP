import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { L, Naskah, Sinema, eIO } from "./Umum";

// Malam, lampu meja menyorot dompet yang dibuka: isinya tinggal sedikit.
export const AdeganDompet: React.FC = () => {
  const f = useCurrentFrame();
  const buka = L(f, 12, 40, 0, 1, eIO);
  const zoom = L(f, 0, 150, 1.0, 1.16, eIO);
  const kedip = 0.92 + 0.08 * Math.sin(f / 3.3) * Math.sin(f / 7.1);
  return (
    <AbsoluteFill style={{ background: "#07080d" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 48%" }}>
        {/* meja */}
        <div style={{ position: "absolute", left: -100, right: -100, top: 700, bottom: -100, background: "linear-gradient(#2a1a10, #120b07)" }} />
        {/* kerucut cahaya lampu */}
        <div style={{ position: "absolute", left: 140, top: 120, width: 800, height: 1200, background: "radial-gradient(ellipse at 50% 70%, rgba(255,214,150,0.55), rgba(255,190,120,0.15) 45%, transparent 70%)", opacity: kedip }} />
        {/* lampu meja */}
        <div style={{ position: "absolute", left: 600, top: 140, width: 300, height: 140, borderRadius: "150px 150px 30px 30px", background: "linear-gradient(#2f3640, #171b21)", transform: "rotate(-18deg)" }} />
        <div style={{ position: "absolute", left: 640, top: 250, width: 200, height: 40, borderRadius: "50%", background: "#fff1c9", filter: "blur(6px)", transform: "rotate(-18deg)", opacity: kedip }} />
        {/* struk lama di bawah dompet (callback) */}
        <div style={{ position: "absolute", left: 230, top: 880, width: 300, height: 420, background: "#efeadf", transform: "rotate(-14deg)", opacity: 0.55, boxShadow: "0 20px 30px rgba(0,0,0,0.5)" }} />
        {/* dompet */}
        <div style={{ position: "absolute", left: 270, top: 820, width: 560, height: 360, perspective: 1400 }}>
          <div style={{ position: "absolute", inset: 0, transform: "translate(20px, 30px)", background: "rgba(0,0,0,0.6)", filter: "blur(22px)", borderRadius: 40 }} />
          {/* bagian dalam */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 36, background: "linear-gradient(#5a3420, #3a1f12)", boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)" }}>
            <div style={{ position: "absolute", left: 40, top: 40, right: 40, height: 70, borderRadius: 14, background: "#2c170d", boxShadow: "inset 0 8px 16px rgba(0,0,0,0.6)" }} />
            {/* sisa isi: satu lembar & dua koin */}
            <div style={{ position: "absolute", left: 70, top: 120, width: 300, height: 120, borderRadius: 10, background: "linear-gradient(135deg,#b9d7a8,#8fb87d)", transform: `translateY(${(1 - buka) * 40}px) rotate(-4deg)` }} />
            <div style={{ position: "absolute", left: 390, top: 160, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff4c0, #c9a24a 60%, #8a6a24)" }} />
            <div style={{ position: "absolute", left: 440, top: 200, width: 66, height: 66, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #f2f2f2, #b9b9b9 60%, #7a7a7a)" }} />
          </div>
          {/* tutup dompet terbuka ke atas */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 360,
              borderRadius: 36,
              background: "linear-gradient(#7a4a2c, #5a3420)",
              transformOrigin: "50% 0%",
              transform: `rotateX(${buka * 150}deg)`,
              border: "4px dashed rgba(255,220,180,0.35)",
              backfaceVisibility: "hidden",
            }}
          />
        </div>
      </AbsoluteFill>
      <Naskah mulai={12} y={1200} teks="Jadi, meskipun inflasi melambat, bukan berarti daya beli masyarakat *otomatis* *membaik.*" />
      <Sinema vignette={0.75} />
    </AbsoluteFill>
  );
};
