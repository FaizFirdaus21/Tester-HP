// Tema template "Papan Kapur": papan tulis hijau, tulisan kapur, sesekali efek 2,5D.
import { loadFont } from "@remotion/fonts";

// Semua font papan. `fontSiap` selesai saat semuanya termuat: komponen yang mengukur lebar teks (Tulis, Carousel,
// Sampul) baru dirender sesudahnya (lihat TungguFont), supaya tata letak tidak dihitung dengan font cadangan.
const muatFont: Promise<void>[] = [];
import { staticFile } from "remotion";

muatFont.push(loadFont({ family: "Kalam", url: staticFile("fonts/Kalam-Light.woff2"), weight: "300" }));
muatFont.push(loadFont({ family: "Kalam", url: staticFile("fonts/Kalam-Regular.woff2"), weight: "400" }));
muatFont.push(loadFont({ family: "Kalam", url: staticFile("fonts/Kalam-Bold.woff2"), weight: "700" }));
// Angka 0–9 memakai Shantell Sans: angka 5 di Kalam mirip huruf S ("Rp5" terbaca "RpS").
// Hanya digit yang diganti (unicode-range), huruf tetap Kalam.
muatFont.push(loadFont({ family: "Angka Kapur", url: staticFile("fonts/ShantellSans-Variable.woff2"), weight: "300 800", unicodeRange: "U+0030-0039" }));
muatFont.push(loadFont({ family: "Fredericka the Great", url: staticFile("fonts/FrederickaTheGreat-Regular.woff2"), weight: "400" }));
muatFont.push(loadFont({ family: "Plus Jakarta Sans", url: staticFile("fonts/PlusJakartaSans-Variable.woff2"), weight: "200 800" }));

export const fontSiap = Promise.all(muatFont);

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
  tangan: '"Angka Kapur", "Kalam", cursive', // tulisan kapur utama, mudah dibaca
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
