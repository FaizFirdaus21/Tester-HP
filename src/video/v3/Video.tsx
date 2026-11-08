import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { tilt, waktu, whip, zoom } from "../../komponen/Transisi";
import "./gaya";
import { AdeganCabai, CABAI_FASE3 } from "./AdeganCabai";
import { AdeganDompet } from "./AdeganDompet";
import { AdeganJalan } from "./AdeganJalan";
import { AdeganKalender } from "./AdeganKalender";
import { AdeganKunci, AdeganOutro, LUBANG_KUNCI } from "./AdeganKunci";
import { AdeganPanci } from "./AdeganPanci";
import { AdeganPasar } from "./AdeganPasar";
import { AdeganRak } from "./AdeganRak";
import { AdeganStruk } from "./AdeganStruk";
import { AdeganTermometer } from "./AdeganTermometer";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Iris lubang kunci: adegan baru terlihat lewat lubang kunci yang membesar.
const KunciComp: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  const s = interpolate(p, [0, 1], [0.6, 40], clamp);
  const m = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 120'><path d='${LUBANG_KUNCI}' fill='#fff'/></svg>`)}")`;
  return (
    <AbsoluteFill
      style={{
        WebkitMaskImage: m,
        maskImage: m,
        WebkitMaskSize: `${100 * s}px ${120 * s}px`,
        maskSize: `${100 * s}px ${120 * s}px`,
        WebkitMaskPosition: "center 42%",
        maskPosition: "center 42%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
const kunci = (): TransitionPresentation<Record<string, never>> => ({ component: KunciComp, props: {} });

// Kilat cahaya (matahari terbit).
const KilatComp: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const putih = presentationDirection === "exiting" ? interpolate(p, [0, 0.5], [0, 1], clamp) : interpolate(p, [0.5, 1], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: presentationDirection === "exiting" ? (p < 0.5 ? 1 : 0) : p >= 0.5 ? 1 : 0 }}>
      {children}
      <AbsoluteFill style={{ background: "#fff6e0", opacity: putih }} />
    </AbsoluteFill>
  );
};
const kilat = (): TransitionPresentation<Record<string, never>> => ({ component: KilatComp, props: {} });

// Larut lewat uap: adegan baru muncul dari kabur.
const UapComp: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ filter: `blur(${p * 30}px) brightness(${1 + p * 0.6})` }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill style={{ opacity: interpolate(p, [0.2, 0.7], [0, 1], clamp), filter: `blur(${(1 - p) * 30}px)` }}>{children}</AbsoluteFill>;
};
const uap = (): TransitionPresentation<Record<string, never>> => ({ component: UapComp, props: {} });

type T = { p: TransitionPresentation<never>; d: number } | null;
export const ADEGAN: { id: string; durasi: number; C: React.FC; t: T }[] = [
  { id: "pasar", durasi: 100, C: () => <AdeganPasar mode="judul" />, t: { p: whip("bawah") as never, d: 12 } },
  { id: "struk", durasi: 190, C: AdeganStruk, t: { p: uap() as never, d: 14 } },
  { id: "kunci", durasi: 78, C: AdeganKunci, t: { p: kunci() as never, d: 18 } },
  { id: "termometer", durasi: 185, C: AdeganTermometer, t: { p: whip("kiri") as never, d: 10 } },
  { id: "kalender", durasi: 104, C: AdeganKalender, t: { p: zoom(540, 700) as never, d: 12 } },
  { id: "rak", durasi: 160, C: AdeganRak, t: { p: whip("atas") as never, d: 10 } },
  { id: "cabai", durasi: CABAI_FASE3[0] + CABAI_FASE3[1] + CABAI_FASE3[2], C: AdeganCabai, t: null },
  { id: "jalan", durasi: 226, C: () => <AdeganJalan mode="siang" />, t: { p: whip("kiri") as never, d: 10 } },
  { id: "panci", durasi: 210, C: AdeganPanci, t: { p: uap() as never, d: 16 } },
  { id: "dompet", durasi: 150, C: AdeganDompet, t: { p: tilt() as never, d: 14 } },
  { id: "puncak", durasi: 290, C: () => <AdeganJalan mode="malam" />, t: { p: kilat() as never, d: 14 } },
  { id: "fajar", durasi: 76, C: () => <AdeganPasar mode="pagi" />, t: null },
  { id: "outro", durasi: 56, C: AdeganOutro, t: null },
];

export const DURASI_V3 = ADEGAN.reduce((n, a) => n + a.durasi - (a.t ? a.t.d : 0), 0);

export const MULAI_V3 = (() => {
  let s = 0;
  const r: Record<string, number> = {};
  for (const a of ADEGAN) {
    r[a.id] = s;
    s += a.durasi - (a.t ? a.t.d : 0);
  }
  return r;
})();

export const InflasiSinematik: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      {ADEGAN.flatMap((a) => {
        const el = [
          <TransitionSeries.Sequence key={a.id} durationInFrames={a.durasi}>
            <a.C />
          </TransitionSeries.Sequence>,
        ];
        if (a.t) el.push(<TransitionSeries.Transition key={`${a.id}-t`} presentation={a.t.p} timing={waktu(a.t.d)} />);
        return el;
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
