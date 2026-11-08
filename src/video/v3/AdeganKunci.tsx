import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { font, sorot } from "./gaya";
import { L, Naskah, Sinema, eIO } from "./Umum";

export const LUBANG_KUNCI = "M 50 0 A 26 26 0 0 1 66 46 L 78 120 L 22 120 L 34 46 A 26 26 0 0 1 50 0 Z"; // viewBox 0 0 100 120

const svgKunci = (warna: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 120'><path d='${LUBANG_KUNCI}' fill='${warna}'/></svg>`)}")`;

// Pintu gelap dengan cahaya dari balik lubang kunci. Kamera mendekat.
export const AdeganKunci: React.FC = () => {
  const f = useCurrentFrame();
  const s = L(f, 0, 75, 1, 1.9, eIO);
  const nyala = L(f, 4, 14, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#120d14" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 42%" }}>
        {/* tekstur pintu kayu gelap */}
        <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, #1d1418 0 180px, #22181c 180px 184px)" }} />
        <div style={{ position: "absolute", left: 140, top: 160, width: 800, height: 600, border: "10px solid #2a1e22", borderRadius: 10 }} />
        <div style={{ position: "absolute", left: 140, top: 900, width: 800, height: 760, border: "10px solid #2a1e22", borderRadius: 10 }} />
        {/* plat kunci kuningan */}
        <div style={{ position: "absolute", left: 440, top: 640, width: 200, height: 360, borderRadius: 100, background: "linear-gradient(135deg, #c9a24a, #7a5a1c)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }} />
        {/* cahaya dari lubang kunci */}
        <div
          style={{
            position: "absolute",
            left: 490,
            top: 700,
            width: 100,
            height: 120,
            WebkitMaskImage: svgKunci("#fff"),
            maskImage: svgKunci("#fff"),
            background: "#fff4d6",
            opacity: 0.35 + 0.65 * nyala,
            boxShadow: "0 0 80px 30px rgba(255,220,150,0.8)",
          }}
        />
        <div style={{ position: "absolute", left: 360, top: 600, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,220,150,0.45), transparent 65%)", opacity: nyala }} />
      </AbsoluteFill>
      <Naskah mulai={8} y={1180} ukuran={70} teks="Nah, ini sebenarnya ada *penjelasannya.*" />
      <Sinema vignette={0.7} />
    </AbsoluteFill>
  );
};

// Penutup: lubang kunci terbuka dari gelap, memperlihatkan logo.
export const AdeganOutro: React.FC = () => {
  const f = useCurrentFrame();
  const buka = L(f, 0, 22, 0.15, 30, eIO);
  const teks = L(f, 14, 26, 0, 1);
  const tag = L(f, 20, 32, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#0b0910" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 45%, #ffcf86 0%, #ff8f5a 45%, #b5476f 100%)",
          WebkitMaskImage: svgKunci("#fff"),
          maskImage: svgKunci("#fff"),
          WebkitMaskSize: `${100 * buka}px ${120 * buka}px`,
          maskSize: `${100 * buka}px ${120 * buka}px`,
          WebkitMaskPosition: "center 42%",
          maskPosition: "center 42%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, textAlign: "center", fontFamily: font.utama, color: "#fff" }}>
        <div style={{ fontWeight: 800, fontSize: 150, letterSpacing: "-0.04em", opacity: teks, transform: `scale(${1.2 - 0.2 * teks})`, textShadow: "0 12px 40px rgba(80,20,40,0.4)" }}>
          intip<span style={{ color: "#2b1630" }}>dompet</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 52, opacity: tag, transform: `translateY(${(1 - tag) * 24}px)`, color: "#2b1630" }}>
          Urusan uang, kita <span style={{ background: sorot, padding: "0 12px", borderRadius: 10 }}>intip.</span>
        </div>
      </div>
      <Sinema vignette={0.4} />
    </AbsoluteFill>
  );
};
