// Tema template "Papan Kapur": papan tulis hijau, tulisan kapur, sesekali efek 2,5D.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "Kalam", url: staticFile("fonts/Kalam-Light.woff2"), weight: "300" });
loadFont({ family: "Kalam", url: staticFile("fonts/Kalam-Regular.woff2"), weight: "400" });
loadFont({ family: "Kalam", url: staticFile("fonts/Kalam-Bold.woff2"), weight: "700" });
loadFont({ family: "Fredericka the Great", url: staticFile("fonts/FrederickaTheGreat-Regular.woff2"), weight: "400" });
loadFont({ family: "Plus Jakarta Sans", url: staticFile("fonts/PlusJakartaSans-Variable.woff2"), weight: "200 800" });

// Warna kapur. Putih untuk isi, kuning untuk angka penting, merah muda untuk risiko, biru untuk catatan.
export const k = {
  putih: "#EEF0E6",
  kuning: "#F4D46A",
  merah: "#F28B82",
  biru: "#9CCBEA",
  hijauTerang: "#A8E0B0",
  papan: "#28463A",
  bingkai: "#6B4A2E",
};

export const font = {
  tangan: '"Kalam", cursive', // tulisan kapur utama, mudah dibaca
  hias: '"Fredericka the Great", serif', // judul kapur berhias
  sans: '"Plus Jakarta Sans", sans-serif', // subtitel
};

export const FPS = 30;
export const d = (detik: number) => Math.round(detik * FPS);

// Papan = grid sel seukuran layar. 2 kolom × 4 baris.
export const SEL_W = 1080;
export const SEL_H = 1920;
export const KOLOM = 2;
export const BARIS = 4;
export const PAPAN_W = SEL_W * KOLOM;
export const PAPAN_H = SEL_H * BARIS;

/** Titik tengah sel (kolom, baris) dalam koordinat papan. */
export const sel = (kol: number, bar: number) => ({ x: kol * SEL_W + SEL_W / 2, y: bar * SEL_H + SEL_H / 2, x0: kol * SEL_W, y0: bar * SEL_H });
