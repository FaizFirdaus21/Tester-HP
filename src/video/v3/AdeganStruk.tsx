import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { font } from "./gaya";
import { L, Lapis, Naskah, Sinema, eIO } from "./Umum";

// Meja kayu dilihat dari atas, struk belanja tercetak dan terus memanjang.
const Kayu: React.FC = () => (
  <svg width={1080} height={2600} style={{ position: "absolute", top: -340 }}>
    <rect width={1080} height={2600} fill="#a8703f" />
    {Array.from({ length: 9 }).map((_, i) => (
      <g key={i}>
        <rect x={i * 124} y={0} width={122} height={2600} fill={i % 2 ? "#b27a47" : "#a06a3b"} />
        {Array.from({ length: 7 }).map((__, k) => (
          <path
            key={k}
            d={`M ${i * 124 + 14 + k * 16} 0 C ${i * 124 + 30 + k * 16} 700 ${i * 124 + k * 16} 1400 ${i * 124 + 20 + k * 16} 2600`}
            stroke="#7c4d27"
            strokeWidth={1.6}
            opacity={0.35}
            fill="none"
          />
        ))}
        <rect x={i * 124 + 122} y={0} width={2} height={2600} fill="#5b3519" opacity={0.6} />
      </g>
    ))}
  </svg>
);

const ITEM = ["BERAS 5 KG", "MINYAK GORENG 2 L", "TELUR 1 KG", "CABAI MERAH 1/4 KG", "BAWANG MERAH", "GULA PASIR 1 KG", "SUSU UHT"];

export const AdeganStruk: React.FC = () => {
  const f = useCurrentFrame();
  const cetak = L(f, 4, 150, 0, 1, eIO); // proporsi struk yang sudah keluar
  const panjang = 260 + 1200 * cetak;
  const naik = Math.max(0, panjang - 980); // kamera mengikuti ke bawah
  return (
    <AbsoluteFill style={{ background: "#a8703f" }}>
      <Lapis dalam={1} kx={0} ky={naik * 0.7} zoom={L(f, 0, 190, 1.04, 1.1, eIO)}>
        <Kayu />
        {/* bayangan cangkir & kantong */}
        <div style={{ position: "absolute", left: 760, top: 260, width: 260, height: 260, borderRadius: "50%", background: "#f2ece2", boxShadow: "18px 26px 30px rgba(40,20,5,0.45)" }} />
        <div style={{ position: "absolute", left: 790, top: 290, width: 200, height: 200, borderRadius: "50%", background: "#4b2a14", boxShadow: "inset 0 10px 30px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: -120, top: 900, width: 340, height: 520, borderRadius: 40, background: "#e7e2d6", transform: "rotate(14deg)", boxShadow: "16px 24px 40px rgba(40,20,5,0.4)", opacity: 0.95 }} />
        {/* struk */}
        <div
          style={{
            position: "absolute",
            left: 270,
            top: 120,
            width: 520,
            height: panjang,
            background: "#fbfaf5",
            transform: "rotate(-3deg)",
            boxShadow: "14px 22px 36px rgba(40,20,5,0.45)",
            padding: "40px 38px",
            fontFamily: font.mono,
            color: "#2b2b2b",
            fontSize: 26,
            overflow: "hidden",
            clipPath: `polygon(0 0, 100% 0, 100% calc(100% - 14px), ${Array.from({ length: 21 }, (_, i) => `${100 - i * 5}% ${i % 2 ? "100%" : "calc(100% - 14px)"}`).join(", ")}, 0 calc(100% - 14px))`,
          }}
        >
          <div style={{ textAlign: "center", fontWeight: 800, fontSize: 34, letterSpacing: "0.08em" }}>PASAR SEGAR</div>
          <div style={{ textAlign: "center", fontSize: 20, opacity: 0.6, marginBottom: 18 }}>STRUK BELANJA · OKT 2026</div>
          <div style={{ borderTop: "3px dashed #999", margin: "8px 0 18px" }} />
          {ITEM.map((it, i) => {
            const muncul = f > 20 + i * 16;
            return (
              <div key={it} style={{ display: "flex", justifyContent: "space-between", marginBottom: 22, opacity: muncul ? 1 : 0 }}>
                <span>{it}</span>
                <span style={{ color: "#d23a2a", fontWeight: 700 }}>▲ naik</span>
              </div>
            );
          })}
          <div style={{ borderTop: "3px dashed #999", margin: "18px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 32, opacity: f > 140 ? 1 : 0 }}>
            <span>TOTAL</span>
            <span style={{ background: "#ffe34d", padding: "0 10px" }}>MAKIN MAHAL</span>
          </div>
        </div>
      </Lapis>
      <Naskah mulai={20} y={1170} teks="Pernah nggak kamu merasa harga kebutuhan sehari-hari *makin* *mahal,* padahal katanya inflasi Indonesia masih *terkendali?*" />
      <Sinema vignette={0.5} />
    </AbsoluteFill>
  );
};
