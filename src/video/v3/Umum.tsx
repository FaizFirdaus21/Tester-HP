import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { font, sorot } from "./gaya";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const eIn = Easing.bezier(0.16, 1, 0.3, 1);
export const eIO = Easing.bezier(0.65, 0, 0.35, 1);
export const L = (f: number, a: number, b: number, x: number, y: number, e = eIn) => interpolate(f, [a, b], [x, y], { ...clamp, easing: e });

// Teks naskah gaya Reels: tebal, putih, garis tepi gelap, kata sorotan kuning, muncul kata per kata.
export const Naskah: React.FC<{ teks: string; mulai?: number; y?: number; ukuran?: number; kps?: number }> = ({
  teks,
  mulai = 0,
  y = 1200,
  ukuran = 62,
  kps = 3,
}) => {
  const f = useCurrentFrame();
  const kata = teks.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: y,
        textAlign: "center",
        fontFamily: font.utama,
        fontWeight: 800,
        fontSize: ukuran,
        lineHeight: 1.16,
        color: "#fff",
        WebkitTextStroke: "10px rgba(10,10,20,0.85)",
        paintOrder: "stroke fill",
        textShadow: "0 6px 18px rgba(0,0,0,0.45)",
        textWrap: "balance",
      }}
    >
      {kata.map((k, i) => {
        const t = f - mulai - (i * 30) / kps;
        const p = interpolate(t, [0, 6], [0, 1], { ...clamp, easing: eIn });
        const s = k.includes("*");
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.24em",
              opacity: p,
              transform: `translateY(${(1 - p) * 20}px) scale(${0.85 + 0.15 * p})`,
              color: s ? sorot : undefined,
            }}
          >
            {k.replace(/\*/g, "")}
          </span>
        );
      })}
    </div>
  );
};

// Lapisan parallax: bergeser sesuai "kedalaman" relatif terhadap gerak kamera.
export const Lapis: React.FC<{ dalam: number; kx: number; ky: number; zoom?: number; blur?: number; children: React.ReactNode }> = ({
  dalam,
  kx,
  ky,
  zoom = 1,
  blur = 0,
  children,
}) => {
  const k = 1 / dalam;
  const s = 1 + (zoom - 1) * k;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${s}) translate(${-kx * k}px, ${-ky * k}px)`,
        transformOrigin: "50% 50%",
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Lingkaran bokeh (cahaya tidak fokus) yang melayang pelan.
export const Bokeh: React.FC<{ warna: string[]; jumlah?: number; seed?: number; area?: [number, number, number, number]; o?: number }> = ({
  warna,
  jumlah = 16,
  seed = 1,
  area = [0, 0, 1080, 1920],
  o = 0.5,
}) => {
  const f = useCurrentFrame();
  const r = (i: number) => {
    const x = Math.sin((i + 1) * 91.17 * seed) * 43758.5453;
    return x - Math.floor(x);
  };
  return (
    <AbsoluteFill>
      {Array.from({ length: jumlah }).map((_, i) => {
        const d = 40 + r(i + 3) * 160;
        const x = area[0] + r(i) * (area[2] - area[0]) + Math.sin(f / 40 + i) * 12;
        const y = area[1] + r(i + 7) * (area[3] - area[1]) + Math.cos(f / 50 + i) * 10;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - d / 2,
              top: y - d / 2,
              width: d,
              height: d,
              borderRadius: "50%",
              background: warna[i % warna.length],
              opacity: o * (0.35 + 0.65 * r(i + 11)),
              filter: `blur(${4 + r(i + 5) * 10}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Butiran film halus + vignette agar terasa seperti kamera.
export const Sinema: React.FC<{ vignette?: number }> = ({ vignette = 0.55 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,${vignette}) 100%)` }} />
      <svg width="1080" height="1920" style={{ position: "absolute", opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id={`g${f % 6}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} />
        </filter>
        <rect width="1080" height="1920" filter={`url(#g${f % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

// Angka besar yang menghitung.
export const AngkaBesar: React.FC<{ teks: string; y: number; ukuran?: number; warna?: string; o?: number; s?: number }> = ({
  teks,
  y,
  ukuran = 220,
  warna = "#fff",
  o = 1,
  s = 1,
}) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: font.utama,
      fontWeight: 800,
      fontSize: ukuran,
      letterSpacing: "-0.03em",
      color: warna,
      opacity: o,
      transform: `scale(${s})`,
      fontVariantNumeric: "tabular-nums",
      textShadow: "0 12px 40px rgba(0,0,0,0.35)",
      lineHeight: 1,
    }}
  >
    {teks}
  </div>
);

export const Label: React.FC<{ x: number; y: number; teks: string; warna?: string; latar?: string; ukuran?: number; o?: number; rata?: "left" | "center" }> = ({
  x,
  y,
  teks,
  warna = "#fff",
  latar = "rgba(10,12,24,0.55)",
  ukuran = 30,
  o = 1,
  rata = "left",
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: rata === "center" ? "translateX(-50%)" : undefined,
      padding: "10px 20px",
      borderRadius: 999,
      background: latar,
      color: warna,
      fontFamily: font.mono,
      fontWeight: 600,
      fontSize: ukuran,
      opacity: o,
      whiteSpace: "nowrap",
      backdropFilter: "blur(6px)",
    }}
  >
    {teks}
  </div>
);
