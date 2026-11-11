// Katalog ilustrasi kapur: semua pose orang dan semua benda, untuk memilih lapisan adegan.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FilterKapur, Tulis } from "../Komponen";
import { BENDA, Orang, Pose } from "../ilustrasi";
import { k } from "../tema";

const POSE: Pose[] = ["netral", "hp", "struk", "mikir", "kaget", "jempol", "tunjuk"];
const EKSPRESI = { netral: "senyum", hp: "senyum", struk: "cemas", mikir: "mikir", kaget: "kaget", jempol: "senyum", tunjuk: "datar" } as const;
const BAJU = [k.biru, k.merah, k.kuning, k.hijauTerang];
const TEKS: Record<string, string> = { label: "Rp1,5 jt", kalender: "NOV", kalkulator: "10%", gelembung: "__ %", hp: "Rp1,35 jt" };

export const GaleriIlustrasi: React.FC = () => (
  <AbsoluteFill style={{ background: "#0f0d0b", overflow: "hidden" }}>
    <FilterKapur />
    <Img src={staticFile("papan/papan-carousel.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 8640, height: 1350, transform: "scale(1.6)", transformOrigin: "0 0" }} />
    {POSE.map((p, i) => {
      const cx = 160 + (i % 4) * 290;
      const cy = 300 + Math.floor(i / 4) * 420;
      return (
        <React.Fragment key={p}>
          <Orang cx={cx} cy={cy} s={240} pose={p} ekspresi={EKSPRESI[p]} baju={BAJU[i % 4]} />
          <Tulis x={cx} y={cy + 170} teks={`orang: ${p}`} ukuran={30} warna={k.biru} mulai={-9999} rata="center" />
        </React.Fragment>
      );
    })}
    {Object.entries(BENDA).map(([nama, B], i) => {
      const cx = 1290 + (i % 4) * 230;
      const cy = 220 + Math.floor(i / 4) * 300;
      return (
        <React.Fragment key={nama}>
          <B cx={cx} cy={cy} s={nama === "meja" ? 200 : 150} teks={TEKS[nama]} />
          <Tulis x={cx} y={cy + 130} teks={nama} ukuran={30} warna={k.biru} mulai={-9999} rata="center" />
        </React.Fragment>
      );
    })}
  </AbsoluteFill>
);
