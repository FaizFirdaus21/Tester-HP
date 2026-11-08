import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { font, jarak, teks, warna } from "../brand";

// Frame penutup: latar tinta, ajakan kirim ke teman (sinyal "sends" paling kuat di Instagram).
export const Penutup: React.FC<{ ajakan: string }> = ({ ajakan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const masuk = spring({ frame, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: warna.tinta,
        padding: `${jarak.amanAtas}px ${jarak.j4}px ${jarak.amanBawah}px`,
        justifyContent: "center",
        gap: jarak.j3,
      }}
    >
      <Img src={staticFile("logo-simbol.png")} style={{ width: 160, height: 160, opacity: masuk }} />
      <div
        style={{
          ...teks.judul,
          color: warna.diAtasBiru,
          transform: `translateY(${interpolate(masuk, [0, 1], [40, 0])}px)`,
          opacity: masuk,
        }}
      >
        {ajakan}
      </div>
      <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 56, color: warna.diAtasBiru, opacity: masuk }}>
        <span style={{ color: warna.biruTerang }}>intip</span>dompet
      </div>
    </AbsoluteFill>
  );
};
