// Dunia template Buku Catatan: halaman di atas meja kayu, kamera, properti kabur, vignette.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { JARAK_GARIS, PH, PW, c } from "./tema";

export type KunciKamera = { f: number; x: number; y: number; s: number; r?: number };

const eKamera = Easing.bezier(0.65, 0, 0.35, 1);
export const kameraPada = (fr: number, kunci: KunciKamera[]): Required<KunciKamera> => {
  if (fr <= kunci[0].f) return { r: 0, ...kunci[0] };
  for (let i = 0; i < kunci.length - 1; i++) {
    const a = kunci[i];
    const b = kunci[i + 1];
    if (fr <= b.f) {
      const p = interpolate(fr, [a.f, b.f], [0, 1], { easing: eKamera, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const m = (u: number, v: number) => u + (v - u) * p;
      return { f: fr, x: m(a.x, b.x), y: m(a.y, b.y), s: Math.exp(m(Math.log(a.s), Math.log(b.s))), r: m(a.r ?? 0, b.r ?? 0) };
    }
  }
  return { r: 0, ...kunci[kunci.length - 1] };
};

// Properti meja (kabur karena dekat kamera). Posisi dalam koordinat halaman; `dalam` > 1 = lebih dekat kamera.
export type Properti = { jenis: "pensil" | "penggaris" | "cangkir"; x: number; y: number; putar?: number; dalam?: number; kabur?: number };

const Pensil: React.FC = () => (
  <svg width={1400} height={70} viewBox="0 0 1400 70" style={{ display: "block" }}>
    <defs>
      <linearGradient id="kayuPensil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e2bf86" />
        <stop offset="0.5" stopColor="#c9a26a" />
        <stop offset="1" stopColor="#9c7646" />
      </linearGradient>
    </defs>
    <path d="M 120 10 L 1300 10 L 1300 60 L 120 60 Z" fill="url(#kayuPensil)" />
    <path d="M 120 10 L 0 35 L 120 60 Z" fill="#e8cfa4" />
    <path d="M 36 27 L 0 35 L 36 43 Z" fill="#3b3631" />
    <rect x={1300} y={8} width={70} height={54} fill="#b9b2a6" />
    <rect x={1370} y={10} width={30} height={50} rx={10} fill="#d98c86" />
  </svg>
);

const Penggaris: React.FC = () => (
  <svg width={1600} height={130} viewBox="0 0 1600 130" style={{ display: "block" }}>
    <rect x={0} y={0} width={1600} height={130} rx={8} fill="#c4a274" />
    <rect x={0} y={0} width={1600} height={14} fill="#d8bb8d" />
    {Array.from({ length: 160 }, (_, i) => (
      <rect key={i} x={10 + i * 10} y={14} width={2} height={i % 10 === 0 ? 46 : i % 5 === 0 ? 32 : 20} fill="#6e5232" />
    ))}
  </svg>
);

const Cangkir: React.FC = () => (
  <svg width={620} height={620} viewBox="0 0 620 620" style={{ display: "block" }}>
    <circle cx={310} cy={310} r={300} fill="#e9dfcc" />
    <circle cx={310} cy={310} r={250} fill="#d9cdb6" />
    <circle cx={310} cy={310} r={205} fill="#f2ebdd" />
    <circle cx={310} cy={310} r={180} fill={c.kopi} />
    <circle cx={270} cy={270} r={60} fill="#6a4628" opacity={0.6} />
  </svg>
);

export const Meja: React.FC<{
  kamera: KunciKamera[];
  properti?: Properti[];
  halaman: React.ReactNode; // isi halaman (koordinat halaman 0..PW, 0..PH)
  layar?: React.ReactNode; // lapisan layar (di atas vignette): indeks, sobekan, sapuan
}> = ({ kamera, properti = [], halaman, layar }) => {
  const fr = useCurrentFrame();
  const k = kameraPada(fr, kamera);
  const k1 = kameraPada(fr - 1, kamera);
  // motion blur searah gerak kamera
  const vx = (k.x - k1.x) * k.s;
  const vy = (k.y - k1.y) * k.s;
  const vz = Math.abs(Math.log(k.s / k1.s)) * 500;
  const bx = Math.min(40, Math.max(0, Math.abs(vx) / 3 - 1)) + vz * 0.04;
  const by = Math.min(40, Math.max(0, Math.abs(vy) / 3 - 1)) + vz * 0.04;
  const kabur = bx > 0.4 || by > 0.4;
  const t = (dalam = 1) => `translate(540px, 960px) rotate(${k.r}deg) scale(${k.s * dalam}) translate(${-k.x}px, ${-k.y}px)`;
  return (
    <AbsoluteFill style={{ background: c.kayu, overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id="gerakKamera" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} />
          </filter>
          <filter id="tintaBasah">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={4} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={2.2} />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{ filter: kabur ? "url(#gerakKamera)" : undefined }}>
        {/* meja kayu di luar halaman */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", transform: t() }}>
          <div style={{ position: "absolute", left: -3000, top: -3000, width: PW + 6000, height: PH + 6000, backgroundImage: `url(${staticFile("catatan/kayu-meja.png")})`, backgroundSize: "600px 600px" }} />
          {/* halaman */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: PW,
              height: PH,
              background: c.kertas,
              backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent ${JARAK_GARIS - 2}px, ${c.garisBuku} ${JARAK_GARIS - 2}px, ${c.garisBuku} ${JARAK_GARIS}px)`,
              boxShadow: "0 30px 80px rgba(20,10,0,0.55), 0 0 0 2px rgba(80,60,40,0.25)",
            }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${staticFile("catatan/serat-kertas.png")})`, backgroundSize: "512px 512px", opacity: 0.32, mixBlendMode: "multiply" }} />
            {/* noda cincin kopi samar */}
            <div style={{ position: "absolute", left: 860, top: 120, width: 300, height: 300, borderRadius: "50%", border: "14px solid rgba(150,110,60,0.13)", filter: "blur(2px)" }} />
            <div style={{ position: "absolute", left: 1880, top: 3020, width: 240, height: 240, borderRadius: "50%", border: "10px solid rgba(150,110,60,0.10)", filter: "blur(2px)" }} />
            {halaman}
          </div>
        </div>
        {/* properti dekat kamera: kabur dan bergeser lebih cepat (parallax) */}
        {properti.map((pr, i) => (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", transform: t(pr.dalam ?? 1.25) }}>
            <div
              style={{
                position: "absolute",
                left: pr.x,
                top: pr.y,
                transform: `translate(-50%, -50%) rotate(${pr.putar ?? 0}deg)`,
                filter: `blur(${pr.kabur ?? 9}px) drop-shadow(0 30px 30px rgba(20,10,0,0.45))`,
                opacity: 0.95,
              }}
            >
              {pr.jenis === "pensil" ? <Pensil /> : pr.jenis === "penggaris" ? <Penggaris /> : <Cangkir />}
            </div>
          </div>
        ))}
      </AbsoluteFill>
      {/* cahaya lampu meja: tengah terang, tepi coklat gelap */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 55% at 50% 46%, rgba(255,246,225,0.12) 0%, rgba(255,246,225,0) 48%, rgba(70,50,30,0.3) 74%, rgba(52,38,25,0.74) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "rgba(150,105,40,0.07)", mixBlendMode: "multiply", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 50% 38% at 50% 44%, rgba(255,236,190,0.10), transparent 70%)", mixBlendMode: "screen", pointerEvents: "none" }} />
      {layar}
    </AbsoluteFill>
  );
};
