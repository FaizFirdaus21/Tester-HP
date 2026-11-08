import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { aman, huruf, m } from "../tema/malam";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeKamera = Easing.bezier(0.45, 0, 0.2, 1);
export const easeMasuk = Easing.bezier(0.16, 1, 0.3, 1); // cepat lalu melambat, tanpa memantul
export const easeKeluar = Easing.bezier(0.7, 0, 0.84, 0);

// ---------- Kamera ----------
export type KunciKamera = { f: number; x?: number; y?: number; s?: number; r?: number };

const nilaiKamera = (frame: number, kunci: KunciKamera[], k: "x" | "y" | "s" | "r", awal: number) => {
  const titik = kunci.map((c) => ({ f: c.f, v: c[k] }));
  let last = awal;
  const isi = titik.map((t) => {
    if (t.v !== undefined) last = t.v;
    return { f: t.f, v: last };
  });
  if (isi.length === 1) return isi[0].v;
  for (let i = 0; i < isi.length - 1; i++) {
    const a = isi[i];
    const b = isi[i + 1];
    if (frame <= b.f || i === isi.length - 2) {
      return interpolate(frame, [a.f, b.f], [a.v, b.v], { ...clamp, easing: easeKamera });
    }
  }
  return last;
};

// Menggerakkan "dunia" di dalamnya: x,y = pusat bidikan dalam koordinat dunia, s = zoom, r = miring (derajat).
export const Kamera: React.FC<{ kunci: KunciKamera[]; children: React.ReactNode }> = ({ kunci, children }) => {
  const f = useCurrentFrame();
  const x = nilaiKamera(f, kunci, "x", 540);
  const y = nilaiKamera(f, kunci, "y", 960);
  const s = nilaiKamera(f, kunci, "s", 1);
  const r = nilaiKamera(f, kunci, "r", 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          transform: `translate(540px, 960px) rotate(${r}deg) scale(${s}) translate(${-x}px, ${-y}px)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Dunia malam ----------
export const Bintang: React.FC<{ jumlah?: number; tinggi?: number; seed?: number }> = ({
  jumlah = 18,
  tinggi = 1300,
  seed = 1,
}) => {
  const f = useCurrentFrame();
  const acak = (i: number) => {
    const x = Math.sin((i + 1) * 12.9898 * seed) * 43758.5453;
    return x - Math.floor(x);
  };
  return (
    <>
      {Array.from({ length: jumlah }).map((_, i) => {
        const x = acak(i) * 1080;
        const y = 120 + acak(i + 50) * tinggi;
        const r = 3 + Math.round(acak(i + 99) * 3);
        const kedip = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(f / 18 + i * 1.9));
        return <circle key={i} cx={x} cy={y} r={r} fill={m.bulan} opacity={kedip} />;
      })}
    </>
  );
};

type Gedung = [number, number, number]; // x, puncak y, lebar
const lapis: Gedung[][] = [
  [[0, 1080, 150], [130, 1160, 120], [240, 1020, 140], [370, 1130, 110], [470, 1060, 160], [620, 1150, 120], [730, 1000, 150], [870, 1120, 120], [980, 1060, 100]],
  [[-20, 1260, 170], [140, 1320, 130], [260, 1230, 150], [700, 1250, 160], [850, 1310, 120], [960, 1240, 140]],
  [[0, 1420, 220], [200, 1460, 120], [760, 1450, 140], [890, 1410, 210]],
];
const warnaLapis = [m.kota1, m.kota2, m.kota3];

// Siluet kota tiga lapis. `turun` menggeser seluruh kota ke bawah (untuk bidikan yang lebih tinggi).
export const Kota: React.FC<{ turun?: number; jendela?: boolean; tanah?: number }> = ({
  turun = 0,
  jendela = true,
  tanah = 1640,
}) => (
  <g transform={`translate(0 ${turun})`}>
    {lapis.map((l, li) =>
      l.map(([x, y, w], i) => (
        <g key={`${li}-${i}`}>
          <rect x={x} y={y} width={w} height={2400 - y} fill={warnaLapis[li]} />
          {jendela && li === 1
            ? [0, 1, 2].map((r) =>
                [0, 1].map((c) => (
                  <rect
                    key={`${r}${c}`}
                    x={x + 28 + c * (w / 2 - 10)}
                    y={y + 40 + r * 70}
                    width={w / 2 - 46}
                    height={30}
                    rx={6}
                    fill={m.kota1}
                  />
                )),
              )
            : null}
        </g>
      )),
    )}
    <rect x={-200} y={tanah} width={1480} height={800} fill={m.kota3} />
  </g>
);

export const Langit: React.FC<{ children?: React.ReactNode; bintang?: boolean; seed?: number }> = ({
  children,
  bintang = true,
  seed = 1,
}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", overflow: "visible" }}>
    <rect x={-2000} y={-3000} width={5080} height={7920} fill={m.langit} />
    {bintang ? <Bintang seed={seed} /> : null}
    {children}
  </svg>
);

// ---------- Teks ----------
// Kalimat dengan *kata sorotan* (oranye). Muncul kata demi kata seirama ucapan.
export const Kalimat: React.FC<{
  teks: string;
  mulai?: number;
  kataPerDetik?: number;
  ukuran?: number;
  warna?: string;
  rata?: "left" | "center";
  lebar?: number;
  tebal?: number;
  hurufKeluarga?: string;
  tinggiBaris?: number;
}> = ({
  teks,
  mulai = 0,
  kataPerDetik = 3,
  ukuran = 56,
  warna = m.bulan,
  rata = "left",
  lebar = 888,
  tebal = 700,
  hurufKeluarga = huruf.teks,
  tinggiBaris = 1.22,
}) => {
  const f = useCurrentFrame();
  const kata = teks.split(" ");
  const jarak = 30 / kataPerDetik;
  return (
    <div
      style={{
        width: lebar,
        fontFamily: hurufKeluarga,
        fontWeight: tebal,
        fontSize: ukuran,
        lineHeight: tinggiBaris,
        color: warna,
        textAlign: rata,
        textWrap: "balance",
      }}
    >
      {kata.map((k, i) => {
        const sorot = k.includes("*");
        const bersih = k.replace(/\*/g, "");
        const t = f - mulai - i * jarak;
        const p = interpolate(t, [0, 7], [0, 1], { ...clamp, easing: easeMasuk });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.26em",
              opacity: p,
              transform: `translateY(${(1 - p) * 18}px)`,
              color: sorot ? m.oranye : undefined,
            }}
          >
            {bersih}
          </span>
        );
      })}
    </div>
  );
};

// Durasi (frame) yang dibutuhkan untuk menampilkan kalimat utuh.
export const durasiKalimat = (teks: string, kataPerDetik = 3) => Math.ceil((teks.split(" ").length * 30) / kataPerDetik);

// Teks naskah di area bawah, di atas zona aman bawah.
export const Teks: React.FC<{ teks: string; mulai?: number; kataPerDetik?: number; posisi?: "bawah" | "atas" }> = ({
  posisi = "bawah",
  ...p
}) => (
  <div
    style={{
      position: "absolute",
      left: aman.sisi,
      right: aman.sisi,
      ...(posisi === "bawah" ? { bottom: aman.bawah + 30 } : { top: aman.atas + 40 }),
    }}
  >
    <Kalimat {...p} />
  </div>
);

export const Sumber: React.FC<{ teks: string; y?: number; mulai?: number }> = ({ teks, y = 1385, mulai = 0 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [mulai, mulai + 10], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: aman.sisi,
        top: y,
        fontFamily: huruf.mono,
        fontSize: 24,
        color: m.pudar,
        opacity: o,
      }}
    >
      {teks}
    </div>
  );
};

export const lerp = (f: number, a: number, b: number, dari: number, ke: number, easing = easeMasuk) =>
  interpolate(f, [a, b], [dari, ke], { ...clamp, easing });
