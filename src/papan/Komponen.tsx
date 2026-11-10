// Komponen template Papan Kapur: coretan kapur yang tergambar, tulisan kapur huruf demi huruf,
// batang kapur yang mengikuti ujung tulisan, debu kapur yang jatuh, dan "angkat" 2,5D.
// Semua posisi dalam koordinat PAPAN.
import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { font, k } from "./tema";

const jepit = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const p01 = (fr: number, mulai: number, lama: number, e: (t: number) => number = Easing.linear) =>
  interpolate(fr, [mulai, mulai + Math.max(1, lama)], [0, 1], { ...jepit, easing: e });

export const acak = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ---------------------------------------------------------------- filter kapur
/** Pasang sekali di akar komposisi. `kapur` = butiran + tepi kasar; `kapurTebal` = untuk angka besar. */
export const FilterKapur: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      {[
        { id: "kapur", butir: 1.1, ambang: 2.15, kasar: 2.2 },
        { id: "kapurTebal", butir: 0.8, ambang: 2.05, kasar: 3.2 },
      ].map((f) => (
        <filter key={f.id} id={f.id} x="-12%" y="-25%" width="124%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={4} result="geser" />
          <feDisplacementMap in="SourceGraphic" in2="geser" scale={f.kasar} xChannelSelector="R" yChannelSelector="G" result="kasar" />
          <feTurbulence type="fractalNoise" baseFrequency={f.butir} numOctaves={1} seed={9} result="butir" />
          {/* alfa dari derau: sebagian titik berlubang, seperti kapur di permukaan papan yang tidak rata */}
          <feColorMatrix in="butir" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 ${f.ambang}`} result="topeng" />
          <feComposite in="kasar" in2="topeng" operator="in" result="berbutir" />
          <feGaussianBlur in="berbutir" stdDeviation={0.3} result="halus" />
          {/* bayangan tipis: kapur menempel di papan dan punya sedikit tebal */}
          <feGaussianBlur in="berbutir" stdDeviation={1.6} result="kabur" />
          <feOffset in="kabur" dx={2.4} dy={3.2} result="geserBayang" />
          <feColorMatrix in="geserBayang" type="matrix" values="0 0 0 0 0  0 0 0 0 0.03  0 0 0 0 0.02  0 0 0 0.5 0" result="bayangan" />
          {/* halo debu kapur di sekitar goresan */}
          <feGaussianBlur in="berbutir" stdDeviation={7} result="kaburLebar" />
          <feColorMatrix in="kaburLebar" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.2 0" result="halo" />
          {/* volume: cahaya spekular dari kiri atas di atas permukaan kapur yang bergelombang */}
          <feGaussianBlur in="berbutir" stdDeviation={1.1} result="tinggi" />
          <feSpecularLighting in="tinggi" surfaceScale={2.4} specularConstant={0.7} specularExponent={16} lightingColor="#ffffff" result="kilap">
            <feDistantLight azimuth={225} elevation={48} />
          </feSpecularLighting>
          <feComposite in="kilap" in2="berbutir" operator="in" result="kilapKapur" />
          <feColorMatrix in="kilapKapur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.35 0" result="kilapLembut" />
          <feMerge>
            <feMergeNode in="bayangan" />
            <feMergeNode in="halo" />
            <feMergeNode in="halus" />
            <feMergeNode in="halus" />
            <feMergeNode in="kilapLembut" />
          </feMerge>
        </filter>
      ))}
    </defs>
  </svg>
);

// ---------------------------------------------------------------- titik & path tangan
export type Titik = [number, number];

const goyang = (seed: number, i: number, amp: number) => (acak(seed * 13 + i) - 0.5) * 2 * amp;

export const garis = (x1: number, y1: number, x2: number, y2: number, seed = 1, amp = 3): Titik[] => {
  const n = 18;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const lengkung = Math.sin(t * Math.PI) * amp * 1.2;
    return [x1 + (x2 - x1) * t + goyang(seed, i, amp * 0.3), y1 + (y2 - y1) * t + goyang(seed, i + 50, amp * 0.5) - lengkung];
  });
};

export const lingkaran = (cx: number, cy: number, rx: number, ry: number, seed = 1): Titik[] => {
  const n = 64;
  const lebih = 0.14;
  const a0 = -2.5 + acak(seed) * 0.5;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const a = a0 + t * Math.PI * 2 * (1 + lebih);
    const r = 1 + 0.05 * Math.sin(a * 2 + seed) + 0.03 * Math.sin(a * 5 + seed * 3) - 0.05 * t;
    return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r + t * ry * 0.08];
  });
};

/** Busur dari (x1,y1) ke (x2,y2), melengkung setinggi `tinggi` (positif = ke atas). */
export const busur = (x1: number, y1: number, x2: number, y2: number, tinggi: number): Titik[] => {
  const n = 30;
  const my = Math.min(y1, y2) - tinggi;
  const k1: Titik = [x1 + (x2 - x1) * 0.1, my];
  const k2: Titik = [x2 - (x2 - x1) * 0.1, my];
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [
      u * u * u * x1 + 3 * u * u * t * k1[0] + 3 * u * t * t * k2[0] + t * t * t * x2,
      u * u * u * y1 + 3 * u * u * t * k1[1] + 3 * u * t * t * k2[1] + t * t * t * y2,
    ];
  });
};

export const keJalur = (pts: Titik[]) => pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

const kumulatif = (pts: Titik[]) => {
  const c = [0];
  for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return c;
};

const titikPada = (pts: Titik[], cum: number[], p: number): Titik => {
  const L = cum[cum.length - 1] * p;
  let i = 1;
  while (i < cum.length - 1 && cum[i] < L) i++;
  const seg = cum[i] - cum[i - 1] || 1;
  const t = (L - cum[i - 1]) / seg;
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
};

// ---------------------------------------------------------------- batang kapur & debu
/** Batang kapur kecil dengan bayangan; ujungnya tepat di titik (x,y). */
export const BatangKapur: React.FC<{ x: number; y: number; warna?: string; tampak: number; skala?: number }> = ({ x, y, warna = k.putih, tampak, skala = 1 }) => {
  if (tampak <= 0) return null;
  const angkat = (1 - tampak) * 50;
  const L = 160 * skala;
  const T = 30 * skala;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, opacity: tampak, pointerEvents: "none", zIndex: 50 }}>
      {/* bayangan di papan: makin jauh dan kabur saat kapur diangkat */}
      <div style={{ position: "absolute", left: (14 + angkat * 0.5) * skala, top: (20 + angkat * 0.7) * skala, width: L, height: T * 0.9, borderRadius: T, background: "rgba(5,15,10,0.5)", filter: `blur(${(6 + angkat * 0.25) * skala}px)`, transform: "rotate(-36deg)", transformOrigin: "0 50%" }} />
      <div style={{ position: "absolute", left: 0, top: -T / 2 - angkat, width: L, height: T, transform: "rotate(-36deg)", transformOrigin: "0 50%" }}>
        {/* badan silinder */}
        <div style={{ position: "absolute", inset: 0, borderRadius: `${T * 0.3}px ${T / 2}px ${T / 2}px ${T * 0.3}px`, background: `linear-gradient(180deg, #ffffff 0%, ${warna} 30%, ${warna} 55%, #9a9d93 100%)`, boxShadow: `inset -${12 * skala}px 0 ${14 * skala}px rgba(0,0,0,0.15)` }} />
        {/* serat kapur */}
        <div style={{ position: "absolute", inset: 0, borderRadius: T / 2, background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 3px, transparent 3px 9px)" }} />
        {/* ujung aus yang menempel ke papan */}
        <div style={{ position: "absolute", left: -T * 0.18, top: T * 0.08, width: T * 0.55, height: T * 0.84, borderRadius: "50%", background: "radial-gradient(circle at 60% 40%, #ffffff, #d9dbd2 70%)" }} />
        {/* debu yang menempel di ujung */}
        <div style={{ position: "absolute", left: 0, top: 0, width: T * 1.4, height: T, borderRadius: T / 2, background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.45), transparent 70%)" }} />
      </div>
    </div>
  );
};

/** Debu kapur yang jatuh dari jejak ujung kapur (deterministik dari riwayat posisi ujung). */
const Debu: React.FC<{ ujungPada: (fr: number) => Titik | null; fr: number; warna: string; seed: number }> = ({ ujungPada, fr, warna, seed }) => {
  const butir: React.ReactNode[] = [];
  for (let umur = 1; umur <= 16; umur++) {
    const f0 = fr - umur;
    const t = ujungPada(f0);
    if (!t) continue;
    for (let j = 0; j < 2; j++) {
      const r = acak(seed * 31 + f0 * 7 + j);
      if (r > 0.55) continue;
      const vx = (acak(seed + f0 * 3 + j * 11) - 0.5) * 1.6;
      const x = t[0] + vx * umur;
      const y = t[1] + 0.35 * umur * umur * 0.5 + 4;
      const ukuran = 2 + acak(f0 + j * 5) * 3;
      butir.push(<div key={`${umur}-${j}`} style={{ position: "absolute", left: x, top: y, width: ukuran, height: ukuran, borderRadius: "50%", background: warna, opacity: 0.7 * (1 - umur / 16) }} />);
    }
  }
  return <>{butir}</>;
};

// ---------------------------------------------------------------- coretan
export const Coret: React.FC<{
  pts: Titik[];
  mulai: number;
  lama?: number;
  warna?: string;
  tebal?: number;
  kapur?: boolean; // tampilkan batang kapur di ujung
}> = ({ pts, mulai, lama = 14, warna = k.putih, tebal = 7, kapur = true }) => {
  const fr = useCurrentFrame();
  const cum = useMemo(() => kumulatif(pts), [pts]);
  const jalur = useMemo(() => keJalur(pts), [pts]);
  const p = p01(fr, mulai, lama, Easing.bezier(0.35, 0, 0.6, 1));
  if (p <= 0) return null;
  const ujungPada = (f: number): Titik | null => {
    const q = p01(f, mulai, lama, Easing.bezier(0.35, 0, 0.6, 1));
    return q > 0 && q < 1 ? titikPada(pts, cum, q) : null;
  };
  const ujung = titikPada(pts, cum, p);
  const tampakKapur = kapur ? Math.min(p01(fr, mulai - 4, 4), 1 - p01(fr, mulai + lama, 6)) : 0;
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const pad = tebal * 3;
  const x0 = Math.min(...xs) - pad;
  const y0 = Math.min(...ys) - pad;
  return (
    <>
      <svg style={{ position: "absolute", left: x0, top: y0, overflow: "visible", filter: "url(#kapur)" }} width={Math.max(...xs) - x0 + pad} height={Math.max(...ys) - y0 + pad}>
        <path
          d={jalur}
          transform={`translate(${-x0} ${-y0})`}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - p}
          stroke={warna}
          strokeWidth={tebal}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.92}
        />
      </svg>
      {kapur ? <Debu ujungPada={ujungPada} fr={fr} warna={warna} seed={Math.round(pts[0][0] + pts[0][1])} /> : null}
      <BatangKapur x={ujung[0]} y={ujung[1]} warna={warna} tampak={tampakKapur} />
    </>
  );
};

export const Panah: React.FC<{ x1: number; y1: number; x2: number; y2: number; tinggi?: number; mulai: number; lama?: number; warna?: string; tebal?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  tinggi = 80,
  mulai,
  lama = 16,
  warna = k.putih,
  tebal = 6,
}) => {
  const pts = useMemo(() => busur(x1, y1, x2, y2, tinggi), [x1, y1, x2, y2, tinggi]);
  const a = pts[pts.length - 3];
  const ang = Math.atan2(y2 - a[1], x2 - a[0]);
  const s = 30;
  const kepala: Titik[] = [
    [x2 - Math.cos(ang - 0.5) * s, y2 - Math.sin(ang - 0.5) * s],
    [x2, y2],
    [x2 - Math.cos(ang + 0.5) * s, y2 - Math.sin(ang + 0.5) * s],
  ];
  return (
    <>
      <Coret pts={pts} mulai={mulai} lama={lama} warna={warna} tebal={tebal} />
      <Coret pts={kepala} mulai={mulai + lama} lama={5} warna={warna} tebal={tebal} kapur={false} />
    </>
  );
};

// ---------------------------------------------------------------- tulisan kapur
type Gaya = "tangan" | "tebal" | "tipis" | "hias";
const gayaHuruf: Record<Gaya, { family: string; weight: number }> = {
  tangan: { family: font.tangan, weight: 400 },
  tebal: { family: font.tangan, weight: 700 },
  tipis: { family: font.tangan, weight: 300 },
  hias: { family: font.hias, weight: 400 },
};

let kanvasUkur: CanvasRenderingContext2D | null = null;
const ukurLebar = (teks: string, ukuran: number, g: Gaya) => {
  if (!kanvasUkur) kanvasUkur = document.createElement("canvas").getContext("2d");
  const h = gayaHuruf[g];
  kanvasUkur!.font = `${h.weight} ${ukuran}px ${h.family}`;
  return kanvasUkur!.measureText(teks).width;
};

/** Satu baris tulisan kapur, muncul huruf demi huruf dengan batang kapur di ujungnya. */
export const Tulis: React.FC<{
  x: number;
  y: number; // garis tengah teks
  teks: string;
  ukuran?: number;
  gaya?: Gaya;
  warna?: string;
  mulai: number;
  perHuruf?: number; // frame per huruf
  rata?: "left" | "center" | "right";
  miring?: number;
  tebalFilter?: boolean;
  // Batang kapur hanya untuk momen tertentu. Tulisan biasa muncul tanpa kapur supaya tidak mengganggu.
  kapur?: boolean;
}> = ({ x, y, teks, ukuran = 80, gaya = "tangan", warna = k.putih, mulai, perHuruf = 2, rata = "left", miring = 0, tebalFilter, kapur = false }) => {
  const fr = useCurrentFrame();
  const huruf = Array.from(teks);
  const lebarAwal = useMemo(() => huruf.map((_, i) => ukurLebar(huruf.slice(0, i).join(""), ukuran, gaya)), [teks, ukuran, gaya]);
  const lebarTotal = useMemo(() => ukurLebar(teks, ukuran, gaya), [teks, ukuran, gaya]);
  const kiri = rata === "center" ? x - lebarTotal / 2 : rata === "right" ? x - lebarTotal : x;
  const lama = huruf.length * perHuruf;
  if (fr < mulai) return null;

  const ujungPada = (f: number): Titik | null => {
    const q = (f - mulai) / perHuruf;
    if (q <= 0 || q >= huruf.length) return null;
    const i = Math.floor(q);
    const w = (lebarAwal[i + 1] ?? lebarTotal) - lebarAwal[i];
    const dx = lebarAwal[i] + w * (q - i);
    // naik turun sedikit mengikuti bentuk huruf
    const dy = Math.sin(q * 5.3) * ukuran * 0.16 + ukuran * 0.05;
    const rad = (miring * Math.PI) / 180;
    return [kiri + dx * Math.cos(rad) - dy * Math.sin(rad), y + dx * Math.sin(rad) + dy * Math.cos(rad)];
  };
  const ujung = ujungPada(fr);
  const tampakKapur = kapur ? Math.min(p01(fr, mulai - 4, 4), 1 - p01(fr, mulai + lama, 6)) : 0;
  const h = gayaHuruf[gaya];
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: kiri,
          top: y,
          transform: `translateY(-50%) rotate(${miring}deg)`,
          transformOrigin: "0 50%",
          fontFamily: h.family,
          fontWeight: h.weight,
          fontSize: ukuran,
          lineHeight: 1.15,
          whiteSpace: "pre",
          color: warna,
          filter: `url(#${tebalFilter ? "kapurTebal" : "kapur"})`,
          fontVariantNumeric: "lining-nums",
        }}
      >
        {huruf.map((ch, i) => {
          const p = p01(fr, mulai + i * perHuruf, perHuruf + 1);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                visibility: p <= 0 ? "hidden" : undefined,
                clipPath: p >= 1 ? undefined : `inset(-25% ${(1 - p) * 100}% -25% 0)`,
                // tangan manusia: tiap huruf sedikit miring, naik-turun, dan tekanan kapurnya beda
                transform: `translateY(${(acak(i * 3 + x) - 0.5) * ukuran * 0.06}px) rotate(${(acak(i * 7 + y) - 0.5) * 5}deg) scale(${0.96 + acak(i * 11 + x) * 0.08})`,
                opacity: 0.84 + acak(i * 5 + y) * 0.16,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      {kapur ? <Debu ujungPada={ujungPada} fr={fr} warna={warna} seed={Math.round(x + y)} /> : null}
      {ujung || tampakKapur > 0 ? (
        <BatangKapur x={(ujung ?? ujungPada(Math.min(fr, mulai + lama - 1)) ?? [kiri + lebarTotal, y])[0]} y={(ujung ?? [0, y + ukuran * 0.05])[1]} warna={warna} tampak={tampakKapur} skala={Math.max(0.7, Math.min(1.3, ukuran / 110))} />
      ) : null}
    </>
  );
};

export const lamaTulis = (teks: string, perHuruf = 2) => Array.from(teks).length * perHuruf;

// ---------------------------------------------------------------- 2,5D
/**
 * "Angkat": isi terangkat dari papan seperti kartu, dengan bayangan yang membesar
 * dan sedikit miring 3D. Dipakai sesekali untuk momen penting.
 */
export const Angkat: React.FC<{ mulai: number; selesai?: number; children: React.ReactNode; x: number; y: number; w: number; h: number; miringX?: number; miringY?: number }> = ({
  mulai,
  selesai,
  children,
  x,
  y,
  w,
  h,
  miringX = 14,
  miringY = -10,
}) => {
  const fr = useCurrentFrame();
  const naik = p01(fr, mulai, 18, Easing.bezier(0.3, 0, 0.2, 1));
  const turun = selesai ? p01(fr, selesai, 18, Easing.bezier(0.5, 0, 0.5, 1)) : 0;
  const a = naik * (1 - turun);
  const goyangan = Math.sin(fr / 26) * 2.5 * a;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {/* bayangan di papan */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${a * 30}px, ${a * 46}px) scale(${1 + a * 0.02})`, background: "rgba(0,0,0,0.42)", borderRadius: 18, filter: `blur(${4 + a * 22}px)`, opacity: a }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `perspective(1400px) translateZ(${a * 140}px) rotateX(${a * miringX + goyangan}deg) rotateY(${a * miringY - goyangan * 0.6}deg)`,
          transformOrigin: "50% 60%",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- ikon kapur
/** Gedung bank: atap segitiga + 4 tiang + alas. Mengembalikan beberapa coretan. */
export const ikonBank = (cx: number, cy: number, s: number, seed: number): Titik[][] => {
  const w = s;
  const h = s * 0.9;
  const atap: Titik[] = [
    [cx - w / 2, cy - h * 0.25],
    [cx, cy - h / 2],
    [cx + w / 2, cy - h * 0.25],
    [cx - w / 2, cy - h * 0.25],
  ];
  const tiang = [0, 1, 2, 3].map((i) => garis(cx - w * 0.35 + (i * w * 0.7) / 3, cy - h * 0.18, cx - w * 0.35 + (i * w * 0.7) / 3, cy + h * 0.32, seed + i, 1));
  const alas = garis(cx - w / 2, cy + h * 0.4, cx + w / 2, cy + h * 0.4, seed + 9, 1);
  return [atap, ...tiang, alas];
};
