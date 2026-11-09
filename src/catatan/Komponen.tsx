// Komponen gambar & tulisan tangan untuk template Buku Catatan.
// Semua posisi dalam koordinat HALAMAN kecuali yang disebut "layar".
import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import type { BarisSubtitel } from "./Jadwal";
import { c, d, f } from "./tema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const eTulis = Easing.bezier(0.33, 0, 0.25, 1);
export const p01 = (fr: number, mulai: number, durasi: number, e = eTulis) =>
  interpolate(fr, [mulai, mulai + Math.max(1, durasi)], [0, 1], { ...clamp, easing: e });

// Bilangan acak deterministik.
export const acak = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ---------------------------------------------------------------- path tangan
const goyang = (seed: number, i: number, amp: number) => (acak(seed * 13 + i) - 0.5) * 2 * amp;

export const garisTangan = (x1: number, y1: number, x2: number, y2: number, seed = 1, amp = 3) => {
  const n = 6;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const melengkung = Math.sin(t * Math.PI) * amp * 1.4;
    return [x1 + (x2 - x1) * t + goyang(seed, i, amp * 0.4), y1 + (y2 - y1) * t + goyang(seed, i + 50, amp) - melengkung];
  });
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    const [px, py] = pts[i - 1];
    d += ` Q ${px} ${py} ${(px + x) / 2} ${(py + y) / 2}`;
  }
  return d + ` L ${pts[n][0]} ${pts[n][1]}`;
};

// Lingkaran coretan: tidak bulat sempurna, ujungnya melewati titik awal.
export const lingkaranTangan = (cx: number, cy: number, rx: number, ry: number, seed = 1) => {
  const n = 40;
  const lebih = 0.16;
  const mulaiA = -2.6 + acak(seed) * 0.4;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = mulaiA + t * Math.PI * 2 * (1 + lebih);
    const r = 1 + 0.05 * Math.sin(a * 2 + seed) + 0.03 * Math.sin(a * 5 + seed * 3) - 0.04 * t;
    const x = cx + Math.cos(a) * rx * r;
    const y = cy + Math.sin(a) * ry * r + t * ry * 0.08;
    d += `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
};

export const gelombang = (x: number, y: number, w: number, amp = 14, n = 2.5) => {
  let d = "";
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    d += `${i ? "L" : "M"} ${x + w * t} ${y + Math.sin(t * Math.PI * 2 * n) * amp * (0.6 + 0.4 * Math.sin(t * Math.PI))} `;
  }
  return d;
};

// Busur dari (x1,y1) ke (x2,y2), melengkung ke atas setinggi `tinggi`.
export const busur = (x1: number, y1: number, x2: number, y2: number, tinggi: number) => {
  const my = Math.min(y1, y2) - tinggi;
  const k1x = x1 + (x2 - x1) * 0.1;
  const k2x = x2 - (x2 - x1) * 0.1;
  return { d: `M ${x1} ${y1} C ${k1x} ${my} ${k2x} ${my} ${x2} ${y2}`, k2: [k2x, my] as const };
};

// ---------------------------------------------------------------- SVG di halaman
export const Kanvas: React.FC<{ children: React.ReactNode; lebar: number; tinggi: number }> = ({ children, lebar, tinggi }) => (
  <svg width={lebar} height={tinggi} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    {children}
  </svg>
);

// Coretan yang tergambar: garis bawah, lingkaran, gelombang, sumbu.
export const Coret: React.FC<{ d: string; mulai: number; durasi?: number; warna?: string; tebal?: number; opacity?: number; putus?: string }> = ({
  d,
  mulai,
  durasi = 12,
  warna = c.tinta,
  tebal = 4,
  opacity = 1,
  putus,
}) => {
  const fr = useCurrentFrame();
  const p = p01(fr, mulai, durasi);
  if (p <= 0) return null;
  return (
    <path
      d={d}
      pathLength={1}
      strokeDasharray={putus ? undefined : "1 1"}
      strokeDashoffset={putus ? undefined : 1 - p}
      stroke={warna}
      strokeWidth={tebal}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity * (putus ? p : 1)}
      style={{ filter: "url(#tintaBasah)" }}
    />
  );
};

// Panah melengkung: busur tergambar, lalu kepala panah muncul.
export const Panah: React.FC<{ x1: number; y1: number; x2: number; y2: number; tinggi?: number; mulai: number; durasi?: number; warna?: string; tebal?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  tinggi = 80,
  mulai,
  durasi = 16,
  warna = c.tintaPudar,
  tebal = 3,
}) => {
  const fr = useCurrentFrame();
  const { d, k2 } = busur(x1, y1, x2, y2, tinggi);
  const k = p01(fr, mulai + durasi - 3, 5);
  const ang = Math.atan2(y2 - k2[1], x2 - k2[0]);
  const s = 14 + tebal * 2.5;
  return (
    <g>
      <Coret d={d} mulai={mulai} durasi={durasi} warna={warna} tebal={tebal} />
      {k > 0 ? (
        <path
          d={`M ${x2 - Math.cos(ang - 0.5) * s} ${y2 - Math.sin(ang - 0.5) * s} L ${x2} ${y2} L ${x2 - Math.cos(ang + 0.5) * s} ${y2 - Math.sin(ang + 0.5) * s}`}
          stroke={warna}
          strokeWidth={tebal}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={k}
        />
      ) : null}
    </g>
  );
};

// Sumbu dengan ujung panah lurus (garis bilangan).
export const Sumbu: React.FC<{ x1: number; x2: number; y: number; tanda: number[]; mulai: number; durasi?: number }> = ({ x1, x2, y, tanda, mulai, durasi = 14 }) => {
  const fr = useCurrentFrame();
  const k = p01(fr, mulai + durasi - 2, 4);
  return (
    <g>
      <Coret d={garisTangan(x1, y, x2, y, 7, 1)} mulai={mulai} durasi={durasi} tebal={3.5} />
      {k > 0 ? <path d={`M ${x2 - 22} ${y - 14} L ${x2} ${y} L ${x2 - 22} ${y + 14}`} stroke={c.tinta} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={k} /> : null}
      {tanda.map((tx, i) => (
        <Coret key={i} d={`M ${tx} ${y - 18} L ${tx} ${y + 18}`} mulai={mulai + 4 + i * 3} durasi={4} tebal={3.5} />
      ))}
    </g>
  );
};

// Garis ukur kecil dengan ujung bergaris (ornamen pojok).
export const GarisUkur: React.FC<{ x: number; y: number; w: number; mulai: number; ruas?: number }> = ({ x, y, w, mulai, ruas = 1 }) => (
  <g>
    <Coret d={`M ${x} ${y} L ${x + w} ${y}`} mulai={mulai} durasi={10} tebal={2} warna={c.tintaPudar} />
    {Array.from({ length: ruas + 1 }, (_, i) => (
      <Coret key={i} d={`M ${x + (w * i) / ruas} ${y - 12} L ${x + (w * i) / ruas} ${y + 12}`} mulai={mulai + 2 + i * 3} durasi={3} tebal={2} warna={c.tintaPudar} />
    ))}
  </g>
);

// Sketsa berarsir: garis tepi tergambar, lalu arsiran dan bayangan arsir muncul.
export const Sketsa: React.FC<{ d: string; mulai: number; id: string; bayangan?: { cx: number; cy: number; rx: number; ry: number }; tebal?: number }> = ({
  d,
  mulai,
  id,
  bayangan,
  tebal = 4,
}) => {
  const fr = useCurrentFrame();
  const arsir = p01(fr, mulai + 12, 14);
  return (
    <g>
      <defs>
        <clipPath id={`k${id}`}>
          <path d={d} />
        </clipPath>
        <pattern id={`a${id}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <path d="M 0 0 L 0 14" stroke={c.tinta} strokeWidth={1.6} opacity={0.55} />
        </pattern>
      </defs>
      {bayangan ? (
        <ellipse cx={bayangan.cx} cy={bayangan.cy} rx={bayangan.rx * arsir} ry={bayangan.ry} fill={`url(#a${id})`} opacity={0.7 * arsir} />
      ) : null}
      <g clipPath={`url(#k${id})`}>
        <rect x={-5000} y={-5000} width={10000} height={10000} fill={`url(#a${id})`} opacity={arsir} />
      </g>
      <Coret d={d} mulai={mulai} durasi={14} tebal={tebal} />
    </g>
  );
};

// ---------------------------------------------------------------- tulisan
type Gaya = "serif" | "tinta" | "tangan" | "spidol" | "miring";
const gayaHuruf: Record<Gaya, React.CSSProperties> = {
  serif: { fontFamily: f.serif, fontWeight: 500 },
  tinta: { fontFamily: f.tinta, fontWeight: 400, letterSpacing: "0.04em", WebkitTextStroke: "0.035em currentColor" },
  tangan: { fontFamily: f.tangan, fontWeight: 300 },
  spidol: { fontFamily: f.tangan, fontWeight: 700 },
  miring: { fontFamily: f.serif, fontStyle: "italic", fontWeight: 400 },
};

export type Potongan = { t: string; warna?: string; gaya?: Gaya };

// Tulisan yang muncul huruf demi huruf seperti sedang ditulis (tiap huruf "disapu" dari kiri).
export const Tulis: React.FC<{
  x: number;
  y: number;
  teks: string | Potongan[];
  ukuran?: number;
  gaya?: Gaya;
  warna?: string;
  mulai: number;
  perHuruf?: number; // frame per huruf
  rata?: "left" | "center" | "right";
  miring?: number; // derajat
  lebar?: number;
  aliran?: boolean; // true = ikut alur dokumen (bukan posisi absolut)
}> = ({ x, y, teks, ukuran = 80, gaya = "serif", warna = c.tinta, mulai, perHuruf = 2, rata = "left", miring = 0, lebar, aliran }) => {
  const fr = useCurrentFrame();
  const bagianTeks: Potongan[] = typeof teks === "string" ? [{ t: teks }] : teks;
  let n = 0;
  const geser = rata === "center" ? "-50%" : rata === "right" ? "-100%" : "0";
  return (
    <div
      style={{
        position: aliran ? "relative" : "absolute",
        left: aliran ? 0 : x,
        top: aliran ? 0 : y,
        transform: aliran ? undefined : `translate(${geser}, -50%) rotate(${miring}deg)`,
        fontSize: ukuran,
        lineHeight: 1.1,
        whiteSpace: lebar ? "normal" : "nowrap",
        width: lebar,
        textAlign: rata,
        color: warna,
        ...gayaHuruf[gaya],
      }}
    >
      {bagianTeks.map((b, bi) => (
        <span key={bi} style={{ color: b.warna, ...(b.gaya ? gayaHuruf[b.gaya] : {}) }}>
          {b.t.split(/(\s+)/).map((kata, ki) => {
            if (/^\s+$/.test(kata)) {
              n += kata.length;
              return <span key={ki}>{kata}</span>;
            }
            return (
              <span key={ki} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                {Array.from(kata).map((ch, i) => {
                  const idx = n++;
                  const p = p01(fr, mulai + idx * perHuruf, Math.max(2, perHuruf + 2), Easing.linear);
                  // Huruf yang belum ditulis disembunyikan penuh. Klip saja masih menyisakan pita -5% di kiri
                  // yang memperlihatkan serpihan huruf bertinta tebal sebelum gilirannya.
                  return (
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        visibility: p <= 0 ? "hidden" : undefined,
                        clipPath: p >= 1 ? undefined : `inset(-20% ${(1 - p) * 100}% -20% 0)`,
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

export const lamaTulis = (teks: string | Potongan[], perHuruf = 2) =>
  (typeof teks === "string" ? Array.from(teks).length : teks.reduce((n, b) => n + Array.from(b.t).length, 0)) * perHuruf;

// Stempel merah miring yang "dicap".
export const Stempel: React.FC<{ x: number; y: number; teks: string; mulai: number; miring?: number; ukuran?: number }> = ({ x, y, teks, mulai, miring = -8, ukuran = 46 }) => {
  const fr = useCurrentFrame();
  const p = p01(fr, mulai, 6, Easing.bezier(0.2, 0, 0.2, 1));
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${miring}deg) scale(${1.5 - 0.5 * p})`,
        opacity: Math.min(1, p * 1.6) * 0.92,
        border: `4px solid ${c.merah}`,
        borderRadius: 8,
        padding: "6px 22px 10px",
        color: c.merah,
        fontFamily: f.serif,
        fontStyle: "italic",
        fontSize: ukuran,
        whiteSpace: "nowrap",
        boxShadow: `inset 0 0 0 3px rgba(230,218,195,0.6)`,
        mixBlendMode: "multiply",
      }}
    >
      {teks}
    </div>
  );
};

// Tumpukan lembar yang bertambah (mis. halaman, struk, tagihan).
export const Tumpukan: React.FC<{ x: number; y: number; lebar?: number; maks?: number; mulai: number; durasi: number }> = ({ x, y, lebar = 500, maks = 18, mulai, durasi }) => {
  const fr = useCurrentFrame();
  const n = Math.round(maks * p01(fr, mulai, durasi, Easing.bezier(0.3, 0, 0.6, 1)));
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {Array.from({ length: n }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -lebar / 2 + (acak(i + 3) - 0.5) * 18,
            top: -i * 13,
            width: lebar,
            height: 22,
            background: "#ECE1C8",
            border: `2.5px solid ${c.tinta}`,
            borderRadius: 3,
            transform: `rotate(${(acak(i) - 0.5) * 1.6}deg)`,
          }}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------- lapisan layar
// Sapuan tinta merah pembuka: bentuk lonjong menyapu diagonal dari kiri bawah ke kanan atas.
export const SapuanTinta: React.FC<{ mulai?: number; durasi?: number }> = ({ mulai = 0, durasi = 16 }) => {
  const fr = useCurrentFrame();
  const p = p01(fr, mulai, durasi, Easing.bezier(0.45, 0, 0.55, 1));
  if (p <= 0 || p >= 1) return null;
  const x = -500 + 1900 * p;
  const y = 2200 - 2700 * p;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`translate(${x} ${y}) rotate(-38)`}>
          <path d="M -560 0 C -420 -150 260 -190 560 -40 C 620 -10 610 40 540 60 C 240 150 -400 160 -560 0 Z" fill={c.merah} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// Penanda bagian di pojok kiri atas: titik merah + nomor.
export const Indeks: React.FC<{ nomor: number }> = ({ nomor }) => (
  <div style={{ position: "absolute", left: 76, top: 186, display: "flex", alignItems: "center", gap: 12, fontFamily: f.serif, fontSize: 30, color: c.tinta, zIndex: 5 }}>
    <span style={{ width: 13, height: 13, borderRadius: "50%", background: c.merah, display: "inline-block" }} />
    {String(nomor).padStart(2, "0")}
  </div>
);

// Sobekan kertas berselotip yang naik dari bawah (penutup / kesimpulan).
export const CatatanSobek: React.FC<{ mulai: number; judul: Potongan[]; ajakan?: string; y?: number }> = ({ mulai, judul, ajakan, y = 1180 }) => {
  const fr = useCurrentFrame();
  const p = p01(fr, mulai, 14, Easing.bezier(0.16, 1, 0.3, 1));
  if (p <= 0) return null;
  const tepi = (atas: boolean) =>
    Array.from({ length: 31 }, (_, i) => {
      const x = (i / 30) * 100;
      const yy = atas ? 2 + acak(i + 9) * 3.5 : 98 - acak(i + 40) * 3.5;
      return `${x}% ${yy}%`;
    });
  const bentuk = `polygon(${[...tepi(true), ...tepi(false).reverse()].join(", ")})`;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y + (1 - p) * 900,
        transform: `rotate(${-1.5 + (1 - p) * 4}deg)`,
        filter: "drop-shadow(0 18px 24px rgba(40,25,10,0.35))",
        zIndex: 6,
      }}
    >
      <div style={{ background: c.sobek, clipPath: bentuk, padding: "70px 70px 80px", backgroundImage: "linear-gradient(rgba(255,255,255,0.18), rgba(0,0,0,0.04))" }}>
        <Tulis x={0} y={0} aliran teks={judul} ukuran={92} mulai={mulai + 10} perHuruf={2} lebar={830} />
        <div style={{ height: 34 }} />
        {ajakan ? (
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginLeft: 20 }}>
            <svg width={70} height={70} style={{ flex: "none", marginTop: 10 }}>
              <Coret d="M 8 8 C 0 40 20 56 60 56 M 46 44 L 60 56 L 46 66" mulai={mulai + 50} durasi={10} tebal={3} warna={c.tintaPudar} />
            </svg>
            <div style={{ fontFamily: f.tangan, fontWeight: 300, fontSize: 40, color: c.tinta, lineHeight: 1.2, opacity: p01(fr, mulai + 48, 10) }}>{ajakan}</div>
          </div>
        ) : null}
      </div>
      {/* selotip */}
      {[
        [-30, -26, -8],
        [780, -22, 10],
      ].map(([l, t, r], i) => (
        <div key={i} style={{ position: "absolute", left: l, top: t, width: 190, height: 62, background: "rgba(245,240,228,0.55)", transform: `rotate(${r}deg)`, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }} />
      ))}
    </div>
  );
};

// Subtitel tipis tanpa kotak di pita layar y 1300–1480 (di bawah isi utama, di atas tombol Instagram).
// Aktif bawaan karena banyak penonton Reels menonton tanpa suara. Waktu dalam detik.
export const SUBTITEL_ATAS = 1300;
export const SUBTITEL_BAWAH = 1480;
const BarisSub: React.FC<{ teks: string; lama: number }> = ({ teks, lama }) => {
  const fr = useCurrentFrame();
  const o = Math.min(p01(fr, 0, 4), 1 - p01(fr, lama - 3, 3));
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: SUBTITEL_ATAS,
        height: SUBTITEL_BAWAH - SUBTITEL_ATAS,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: f.serif,
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: 44,
        lineHeight: 1.22,
        color: c.tinta,
        opacity: o,
        textShadow: "0 0 18px rgba(230,218,195,0.95), 0 0 6px rgba(230,218,195,0.95)",
      }}
    >
      {teks}
    </div>
  );
};

export const Subtitel: React.FC<{ baris: BarisSubtitel[] }> = ({ baris }) => (
  <>
    {baris.map((b, i) => {
      const mulai = d(b.mulai);
      const lama = Math.max(1, d(b.selesai) - mulai);
      return (
        <Sequence key={i} from={mulai} durationInFrames={lama} layout="none">
          <BarisSub teks={b.teks} lama={lama} />
        </Sequence>
      );
    })}
  </>
);
