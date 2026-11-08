import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Kalimat } from "../../komponen/Panggung";
import { KertasGrid } from "../../blueprint/Gambar";
import { bp, fon } from "../../blueprint/tema";
import {
  CatatanUmum,
  DetailBeda,
  DetailCabai,
  DetailDompet,
  DetailGauge,
  DetailJangka,
  DetailJudul,
  DetailKeranjang,
  DetailPangan,
  DetailPenutup,
  DetailRamp,
  DetailSalah,
} from "./Detail";
import { KAMERA, KunciKam, LEMBAR_H, LEMBAR_W, SEGMEN, SEL_H, SEL_W, seg } from "./linimasa";

const ease = Easing.bezier(0.65, 0, 0.35, 1);

export const kameraPada = (f: number): Required<KunciKam> => {
  const k = KAMERA;
  if (f <= k[0].f) return { rx: 0, rz: 0, ...k[0] } as Required<KunciKam>;
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i];
    const b = k[i + 1];
    if (f <= b.f) {
      const p = interpolate(f, [a.f, b.f], [0, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const mix = (u: number, v: number) => u + (v - u) * p;
      // zoom diinterpolasi secara logaritmik agar terbang terasa alami
      const s = Math.exp(mix(Math.log(a.s), Math.log(b.s)));
      return { f, x: mix(a.x, b.x), y: mix(a.y, b.y), s, rx: mix(a.rx ?? 0, b.rx ?? 0), rz: mix(a.rz ?? 0, b.rz ?? 0) };
    }
  }
  const z = k[k.length - 1];
  return { rx: 0, rz: 0, ...z } as Required<KunciKam>;
};

const Sel: React.FC<{ c: number; r: number; children: React.ReactNode }> = ({ c, r, children }) => (
  <g transform={`translate(${c * SEL_W} ${r * SEL_H})`}>{children}</g>
);

const Lembar: React.FC<{ f: number }> = ({ f }) => (
  <svg width={LEMBAR_W} height={LEMBAR_H} viewBox={`0 0 ${LEMBAR_W} ${LEMBAR_H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <KertasGrid x={-2000} y={-2000} w={LEMBAR_W + 4000} h={LEMBAR_H + 4000} />
    {/* bingkai lembar */}
    <rect x={20} y={20} width={LEMBAR_W - 40} height={LEMBAR_H - 40} fill="none" stroke={bp.garis} strokeWidth={6} />
    <rect x={44} y={44} width={LEMBAR_W - 88} height={LEMBAR_H - 88} fill="none" stroke={bp.garis} strokeWidth={2} />
    <Sel c={0} r={0}>
      <DetailJudul f={f} />
    </Sel>
    <Sel c={1} r={0}>
      <DetailKeranjang f={f} />
    </Sel>
    <Sel c={2} r={0}>
      <DetailGauge f={f} />
    </Sel>
    <Sel c={2} r={1}>
      <DetailJangka f={f} />
    </Sel>
    <Sel c={1} r={1}>
      <DetailBeda f={f} />
    </Sel>
    <Sel c={0} r={1}>
      <DetailCabai f={f} />
    </Sel>
    <Sel c={1} r={2}>
      <DetailSalah f={f} />
    </Sel>
    <Sel c={2} r={2}>
      <DetailRamp f={f} />
    </Sel>
    <Sel c={2} r={3}>
      <DetailPangan f={f} />
    </Sel>
    <Sel c={1} r={3}>
      <DetailDompet f={f} />
    </Sel>
    <Sel c={0} r={2}>
      <CatatanUmum />
    </Sel>
    <Sel c={2} r={4}>
      <DetailPenutup f={f} />
    </Sel>
  </svg>
);

const NaskahLayar: React.FC = () => (
  <>
    {SEGMEN.flatMap((s) =>
      s.naskah.map((n, i) => {
        const mulai = s.mulai + n.mulai;
        const berikut = s.naskah[i + 1] ? s.mulai + s.naskah[i + 1].mulai : s.mulai + s.durasi;
        return (
          <Sequence key={`${s.id}-${i}`} from={mulai} durationInFrames={berikut - mulai}>
            <div style={{ position: "absolute", left: 96, right: 96, bottom: 450, textShadow: `0 0 10px ${bp.biru}, 0 0 4px ${bp.biru}, 0 0 2px ${bp.biru}` }}>
              <Kalimat teks={n.teks} ukuran={64} hurufKeluarga={fon.judul} tebal={600} warna={bp.garis} warnaSorot={bp.redline} tinggiBaris={1.12} />
            </div>
          </Sequence>
        );
      }),
    )}
  </>
);

export const InflasiBlueprint: React.FC = () => {
  const f = useCurrentFrame();
  const k = kameraPada(f);
  const k1 = kameraPada(f - 1);
  // kecepatan kamera di layar -> motion blur
  const v = Math.hypot((k.x - k1.x) * k.s, (k.y - k1.y) * k.s) + Math.abs(Math.log(k.s / k1.s)) * 900;
  const blur = Math.min(10, Math.max(0, (v - 18) / 14));
  const tahu = seg("tahu");
  const tt = f - tahu.mulai;
  const oTahu = tt >= 0 && tt < tahu.durasi ? Math.min(interpolate(tt, [6, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), interpolate(tt, [tahu.durasi - 8, tahu.durasi], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: bp.biru, overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 2000, perspectiveOrigin: "50% 45%" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: LEMBAR_W,
            height: LEMBAR_H,
            transformOrigin: "0 0",
            transform: `translate(540px, 960px) rotateX(${k.rx}deg) rotateZ(${k.rz}deg) scale(${k.s}) translate(${-k.x}px, ${-k.y}px)`,
            filter: blur > 0.6 ? `blur(${blur.toFixed(1)}px)` : undefined,
          }}
        >
          <Lembar f={f} />
        </div>
      </AbsoluteFill>
      <NaskahLayar />
      {oTahu > 0 ? (
        <div style={{ position: "absolute", left: 96, right: 96, top: 760, opacity: oTahu }}>
          <div style={{ background: bp.biru, border: `4px solid ${bp.garis}`, padding: "40px 44px" }}>
            <div style={{ fontFamily: fon.mono, fontSize: 24, color: bp.pudar, marginBottom: 10 }}>RINGKASAN · LEMBAR 01/01</div>
            <div style={{ fontFamily: fon.judul, fontWeight: 700, fontSize: 110, lineHeight: 0.98, color: bp.garis }}>
              SEKARANG KAMU JADI TAHU, <span style={{ color: bp.redline }}>KAN?</span>
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
