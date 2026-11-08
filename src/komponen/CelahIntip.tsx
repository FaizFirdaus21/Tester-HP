import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { warna } from "../brand";

// Ciri khas merek: celah berbentuk pil melebar seperti dompet dibuka,
// lalu isi video terlihat di baliknya.
export const CelahIntip: React.FC<{ durasi?: number; children: React.ReactNode }> = ({
  durasi = 16,
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ease = Easing.bezier(0.7, 0, 0.2, 1);

  const lebarCelah = interpolate(frame, [0, durasi * 0.45], [140, width * 0.86], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const p = interpolate(frame, [durasi * 0.4, durasi], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const w = lebarCelah + (width - lebarCelah) * p;
  const h = 48 + (height - 48) * p;
  const r = interpolate(p, [0, 1], [24, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: warna.biru }}>
      <div
        style={{
          position: "absolute",
          left: (width - w) / 2,
          top: (height - h) / 2,
          width: w,
          height: h,
          borderRadius: r,
          overflow: "hidden",
          backgroundColor: warna.kertas,
        }}
      >
        <div style={{ position: "absolute", left: -(width - w) / 2, top: -(height - h) / 2, width, height }}>
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
