// Dunia template Papan Kapur: papan hijau bertekstur dalam bingkai kayu, rak kapur, ruang gelap di belakang,
// dan kamera 2,5D (geser, zoom, miring X/Y) yang bergerak mulus antar-bagian papan.
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { TungguFont, acak } from "./Komponen";
import { PAPAN_H, PAPAN_W, k } from "./tema";

export type KunciKamera = { f: number; x: number; y: number; s: number; rx?: number; ry?: number; rz?: number };

const halus = Easing.bezier(0.45, 0, 0.25, 1);

/** Interpolasi kamera antar-kunci: berhenti lembut di tiap kunci (cocok untuk "tahan lalu pindah"). */
export const kameraPada = (fr: number, kunci: KunciKamera[]) => {
  let i = 0;
  while (i < kunci.length - 2 && fr >= kunci[i + 1].f) i++;
  const a = kunci[i];
  const b = kunci[i + 1] ?? a;
  const t = b.f === a.f ? 1 : halus(Math.min(1, Math.max(0, (fr - a.f) / (b.f - a.f))));
  const l = (p: number, q: number) => p + (q - p) * t;
  // zoom diinterpolasi dalam skala log supaya terasa merata
  const s = Math.exp(l(Math.log(a.s), Math.log(b.s)));
  return { x: l(a.x, b.x), y: l(a.y, b.y), s, rx: l(a.rx ?? 0, b.rx ?? 0), ry: l(a.ry ?? 0, b.ry ?? 0), rz: l(a.rz ?? 0, b.rz ?? 0) };
};

const BINGKAI = 70;

/** Rak kapur di bawah papan: kayu, beberapa batang kapur, dan penghapus. Terangkat sedikit (2,5D). */
const Rak: React.FC = () => (
  <div style={{ position: "absolute", left: -BINGKAI, top: PAPAN_H + BINGKAI - 10, width: PAPAN_W + BINGKAI * 2, height: 110, transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #8a6440, ${k.bingkai} 40%, #3e2a19)`, boxShadow: "0 30px 40px rgba(0,0,0,0.6)" }} />
    {[
      { x: 300, w: 220, warna: k.putih, r: -3 },
      { x: 560, w: 130, warna: k.kuning, r: 8 },
      { x: 760, w: 160, warna: k.merah, r: -5 },
      { x: 1500, w: 190, warna: k.biru, r: 4 },
    ].map((b, i) => (
      <div key={i} style={{ position: "absolute", left: b.x, top: 18, width: b.w, height: 34, borderRadius: 16, background: `linear-gradient(180deg, #fff, ${b.warna} 50%, #a9ab9f)`, transform: `rotate(${b.r}deg)`, boxShadow: "0 8px 10px rgba(0,0,0,0.45)" }} />
    ))}
    {/* penghapus */}
    <div style={{ position: "absolute", left: 1040, top: -40, width: 340, height: 110, transform: "rotate(-4deg)" }}>
      <div style={{ position: "absolute", inset: 0, top: 50, background: "#d7d5cc", borderRadius: 8 }} />
      <div style={{ position: "absolute", inset: 0, bottom: 50, background: "linear-gradient(180deg, #a87c4f, #6d4b2c)", borderRadius: "10px 10px 2px 2px", boxShadow: "0 14px 18px rgba(0,0,0,0.5)" }} />
    </div>
  </div>
);

/** Cahaya jendela miring di permukaan papan (koordinat papan, jadi ikut bergerak bersama papan). */
const CahayaJendela: React.FC = () => (
  <>
    {[
      { x: -400, y: 300, w: 1500, h: 2600 },
      { x: 900, y: 3300, w: 1400, h: 2400 },
      { x: -300, y: 5600, w: 1700, h: 2300 },
    ].map((j, i) => (
      <div key={i} style={{ position: "absolute", left: j.x, top: j.y, width: j.w, height: j.h, transform: "skewX(-24deg)", mixBlendMode: "screen", opacity: 0.55 }}>
        {/* dua panel kaca dipisah kusen: berkas terang dengan bayangan kusen */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(255,240,205,0.10) 12%, rgba(255,240,205,0.13) 44%, transparent 47%, transparent 53%, rgba(255,240,205,0.13) 56%, rgba(255,240,205,0.10) 88%, transparent 100%)", filter: "blur(18px)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "48%", height: 60, background: "rgba(0,0,0,0.5)", mixBlendMode: "multiply", filter: "blur(16px)" }} />
      </div>
    ))}
    {/* bayangan rak di bawah papan */}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260, background: "linear-gradient(0deg, rgba(0,0,0,0.45), transparent)" }} />
  </>
);

/** Papan + bingkai + rak dalam koordinat papan. Anak-anak = isi papan (tulisan, coretan). */
export const Papan: React.FC<{ kunci: KunciKamera[]; children: React.ReactNode; layar?: React.ReactNode }> = (props) => (
  <TungguFont>
    <PapanIsi {...props} />
  </TungguFont>
);

const PapanIsi: React.FC<{ kunci: KunciKamera[]; children: React.ReactNode; layar?: React.ReactNode }> = ({ kunci, children, layar }) => {
  const fr = useCurrentFrame();
  const c = kameraPada(fr, kunci);
  // goyang kamera tangan yang sangat halus
  const gx = Math.sin(fr / 41) * 3;
  const gy = Math.sin(fr / 53 + 2) * 3;
  // papan selalu terasa benda fisik: kemiringan 3D sangat kecil yang terus bergerak
  const nx = Math.sin(fr / 95) * 1.2;
  const ny = Math.sin(fr / 120 + 1) * 1.6;
  const nz = Math.sin(fr / 140 + 2) * 0.35;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 70% at 50% 40%, #2a2620 0%, #0f0d0b 70%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 45%" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: PAPAN_W,
            height: PAPAN_H,
            transformOrigin: "0 0",
            transformStyle: "preserve-3d",
            transform: `translate(${540 + gx}px, ${960 + gy}px) rotateX(${c.rx + nx}deg) rotateY(${c.ry + ny}deg) rotateZ(${c.rz + nz}deg) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)`,
          }}
        >
          {/* bingkai kayu */}
          <div style={{ position: "absolute", left: -BINGKAI, top: -BINGKAI, width: PAPAN_W + BINGKAI * 2, height: PAPAN_H + BINGKAI * 2, background: `linear-gradient(135deg, #8b6440, ${k.bingkai} 50%, #4a321e)`, boxShadow: "0 60px 120px rgba(0,0,0,0.7)" }}>
            <Img src={staticFile("catatan/kayu-meja.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.5 }} />
            {/* bevel: tepi atas-kiri kena cahaya, bawah-kanan gelap */}
            <div style={{ position: "absolute", inset: 0, boxShadow: "inset 6px 6px 0 rgba(255,220,170,0.25), inset -8px -8px 0 rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.4)" }} />
            <div style={{ position: "absolute", left: BINGKAI - 10, top: BINGKAI - 10, right: BINGKAI - 10, bottom: BINGKAI - 10, boxShadow: "0 0 0 10px rgba(40,25,12,0.55)" }} />
            {[
              [BINGKAI / 2, BINGKAI / 2],
              [PAPAN_W + BINGKAI * 1.5, BINGKAI / 2],
              [BINGKAI / 2, PAPAN_H + BINGKAI * 1.5],
              [PAPAN_W + BINGKAI * 1.5, PAPAN_H + BINGKAI * 1.5],
            ].map(([sx, sy], i) => (
              <div key={i} style={{ position: "absolute", left: sx - 11, top: sy - 11, width: 22, height: 22, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #e8e2d2, #8d8576 55%, #3b362e)", boxShadow: "1px 2px 3px rgba(0,0,0,0.6)" }}>
                <div style={{ position: "absolute", left: 4, top: 10, width: 14, height: 2, background: "rgba(40,36,30,0.7)", transform: `rotate(${i * 37}deg)` }} />
              </div>
            ))}
          </div>
          {/* permukaan papan */}
          <div style={{ position: "absolute", left: 0, top: 0, width: PAPAN_W, height: PAPAN_H, overflow: "hidden" }}>
            <Img src={staticFile("papan/papan.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            <CahayaJendela />
            {/* papan sedikit masuk ke dalam bingkai: bayangan bibir bingkai di tepi atas & kiri */}
            <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 46px 50px -20px rgba(0,0,0,0.7), inset 40px 0 50px -24px rgba(0,0,0,0.55), inset -20px -20px 40px -20px rgba(0,0,0,0.4)" }} />
          </div>
          <Rak />
          {/* isi papan */}
          <div style={{ position: "absolute", left: 0, top: 0, width: PAPAN_W, height: PAPAN_H }}>{children}</div>
        </div>
      </AbsoluteFill>
      {/* cahaya lampu kelas: terang di tengah atas, gelap di pojok */}
      <AbsoluteFill style={{ background: "radial-gradient(85% 60% at 50% 38%, rgba(255,244,220,0.07) 0%, transparent 55%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
      {/* debu kapur melayang di udara, di depan papan (parallax kecil terhadap kamera) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const x = (acak(i) * 1180 - 50 - c.x * 0.04 * (1 + acak(i + 9))) % 1180;
          const y = (acak(i + 3) * 2000 - fr * (0.2 + acak(i + 5) * 0.5) - c.y * 0.03) % 2000;
          const s = 2 + acak(i + 7) * 4;
          return <div key={i} style={{ position: "absolute", left: (x + 1180) % 1180 - 50, top: (y + 2000) % 2000 - 40, width: s, height: s, borderRadius: "50%", background: "#f5f3e8", opacity: 0.12 + acak(i + 11) * 0.18, filter: s > 4.5 ? "blur(1.5px)" : undefined }} />;
        })}
      </AbsoluteFill>
      {layar}
    </AbsoluteFill>
  );
};
