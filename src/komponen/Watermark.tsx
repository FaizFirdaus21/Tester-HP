import React from "react";
import { font, jarak, warna } from "../brand";

export const Watermark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 150,
      left: jarak.j4,
      fontFamily: font.display,
      fontWeight: 800,
      fontSize: 36,
      letterSpacing: "-0.02em",
      color: warna.tinta,
      opacity: 0.7,
    }}
  >
    <span style={{ color: warna.biru }}>intip</span>dompet
  </div>
);
