import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { linearTiming } from "@remotion/transitions";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Whip pan: geser cepat dengan blur arah gerak ----------
type WhipProps = { arah: "kiri" | "kanan" | "atas" | "bawah" };
const WhipComp: React.FC<TransitionPresentationComponentProps<WhipProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const horizontal = passedProps.arah === "kiri" || passedProps.arah === "kanan";
  const tanda = passedProps.arah === "kiri" || passedProps.arah === "atas" ? -1 : 1;
  const jarak = horizontal ? 1080 : 1920;
  const geser = presentationDirection === "entering" ? (1 - p) * jarak * tanda : -p * jarak * tanda;
  const blur = Math.sin(p * Math.PI) * 14;
  const t = horizontal ? `translateX(${geser}px)` : `translateY(${geser}px)`;
  return (
    <AbsoluteFill style={{ transform: t, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>
  );
};
export const whip = (arah: WhipProps["arah"]): TransitionPresentation<WhipProps> => ({
  component: WhipComp,
  props: { arah },
});

// ---------- Zoom menembus: adegan lama membesar & hilang, adegan baru mendarat dari sedikit lebih besar ----------
type ZoomProps = { titikX: number; titikY: number };
const ZoomComp: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const origin = `${passedProps.titikX}px ${passedProps.titikY}px`;
  if (presentationDirection === "exiting") {
    const s = interpolate(p, [0, 1], [1, 3.2], clamp);
    const o = interpolate(p, [0.45, 0.8], [1, 0], clamp);
    return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: origin, opacity: o }}>{children}</AbsoluteFill>;
  }
  const s = interpolate(p, [0.35, 1], [1.35, 1], clamp);
  const o = interpolate(p, [0.35, 0.6], [0, 1], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: origin, opacity: o }}>{children}</AbsoluteFill>;
};
export const zoom = (titikX = 540, titikY = 760): TransitionPresentation<ZoomProps> => ({
  component: ZoomComp,
  props: { titikX, titikY },
});

// ---------- Tilt: kamera mendongak, dunia lama turun ke bawah, dunia baru turun dari atas ----------
type TiltProps = Record<string, never>;
const TiltComp: React.FC<TransitionPresentationComponentProps<TiltProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const y = presentationDirection === "entering" ? -(1 - p) * 1920 : p * 1920;
  const blur = Math.sin(p * Math.PI) * 10;
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};
export const tilt = (): TransitionPresentation<TiltProps> => ({ component: TiltComp, props: {} });

export const waktu = (durasi: number) =>
  linearTiming({ durationInFrames: durasi, easing: Easing.bezier(0.7, 0, 0.25, 1) });
