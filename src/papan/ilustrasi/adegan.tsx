// Penyusun adegan infografis: lapisan (orang, benda, atau gambar raster), label kapur kecil, dan panah.
// Koordinat lapisan relatif terhadap kotak adegan (x, y, w, h).
//
// Lapisan raster ({ "jenis": "gambar", "src": "papan/ilustrasi/x.png", ... }) dipakai untuk mengganti
// ilustrasi kode dengan gambar kapur AI kelak, tanpa mengubah tata letak slide.
import React from "react";
import { Img, staticFile } from "remotion";
import { Panah, Tulis, ukurLebar } from "../Komponen";
import { k } from "../tema";
import { BENDA } from "./benda";
import { SUDAH } from "./dasar";
import { Ekspresi, Orang, Pose } from "./orang";

const WARNA: Record<string, string> = { putih: k.putih, kuning: k.kuning, merah: k.merah, biru: k.biru, hijau: k.hijauTerang };
const warnaDari = (w?: string) => (w ? WARNA[w] ?? w : undefined);

export type Lapis = {
  jenis: string; // "orang", nama benda (lihat BENDA), atau "gambar" (raster)
  x: number;
  y: number;
  s: number;
  pose?: Pose;
  ekspresi?: Ekspresi;
  baju?: string;
  cermin?: boolean;
  teks?: string;
  miring?: number;
  warna?: string;
  src?: string; // untuk jenis "gambar": path di public/
  w?: number;
  h?: number;
};
export type LabelAdegan = { teks: string; x: number; y: number; warna?: string; ukuran?: number; rata?: "left" | "center" | "right"; miring?: number };
export type PanahAdegan = { x1: number; y1: number; x2: number; y2: number; tinggi?: number; warna?: string };
export type DataAdegan = { lapis: Lapis[]; label?: LabelAdegan[]; panah?: PanahAdegan[] };

export const JENIS_BENDA = Object.keys(BENDA);

// Batas aman di dalam slide 1080 px, relatif ke kotak adegan yang mulai di x = 90 (margin 30 px dari tepi slide).
const KIRI_AMAN = -60;
const KANAN_AMAN = 960;

const periksa = (adegan: DataAdegan, h: number) => {
  for (const t of adegan.label ?? []) {
    const lebar = ukurLebar(t.teks, t.ukuran ?? 40, "tangan");
    const rata = t.rata ?? "center";
    const kiri = rata === "center" ? t.x - lebar / 2 : rata === "right" ? t.x - lebar : t.x;
    if (kiri < KIRI_AMAN || kiri + lebar > KANAN_AMAN) console.warn(`[ilustrasi] label "${t.teks}" keluar dari slide (x ${Math.round(kiri)}..${Math.round(kiri + lebar)})`);
    if (t.y < -40 || t.y > h + 40) console.warn(`[ilustrasi] label "${t.teks}" di luar kotak adegan (y ${t.y})`);
  }
  for (const l of adegan.lapis) {
    const setengah = l.jenis === "orang" ? l.s * 0.5 : l.s * 0.55;
    if (l.x - setengah < KIRI_AMAN || l.x + setengah > KANAN_AMAN) console.warn(`[ilustrasi] ${l.jenis} di x ${l.x} (s ${l.s}) terpotong tepi slide`);
  }
};

export const Adegan: React.FC<{ x: number; y: number; w: number; h: number; adegan: DataAdegan }> = ({ x, y, h, adegan }) => (
  <>
    {periksa(adegan, h) ?? null}
    {adegan.lapis.map((l, i) => {
      const cx = x + l.x;
      const cy = y + l.y;
      if (l.jenis === "gambar" && l.src) {
        const w = l.w ?? l.s;
        const h = l.h ?? l.s;
        return <Img key={i} src={staticFile(l.src)} style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, objectFit: "contain" }} />;
      }
      if (l.jenis === "orang") {
        return <Orang key={i} cx={cx} cy={cy} s={l.s} pose={l.pose} ekspresi={l.ekspresi} baju={warnaDari(l.baju)} teks={l.teks} cermin={l.cermin} />;
      }
      const B = BENDA[l.jenis];
      if (!B) {
        console.warn(`[ilustrasi] jenis "${l.jenis}" tidak dikenal; pilihan: orang, gambar, ${JENIS_BENDA.join(", ")}`);
        return null;
      }
      return <B key={i} cx={cx} cy={cy} s={l.s} teks={l.teks} miring={l.miring} warna={warnaDari(l.warna)} />;
    })}
    {(adegan.panah ?? []).map((p, i) => (
      <Panah key={`p${i}`} x1={x + p.x1} y1={y + p.y1} x2={x + p.x2} y2={y + p.y2} tinggi={p.tinggi ?? 40} mulai={SUDAH} lama={1} warna={warnaDari(p.warna) ?? k.putih} tebal={5} />
    ))}
    {(adegan.label ?? []).map((t, i) => (
      <Tulis key={`l${i}`} x={x + t.x} y={y + t.y} teks={t.teks} ukuran={t.ukuran ?? 40} warna={warnaDari(t.warna) ?? k.biru} mulai={SUDAH} rata={t.rata ?? "center"} miring={t.miring ?? 0} />
    ))}
  </>
);
