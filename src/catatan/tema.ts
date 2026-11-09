// Template "Buku Catatan": gaya diambil dari analisis video referensi (catatan tangan di atas meja).
// Lihat docs/gaya-buku-catatan.md untuk analisis lengkap dan cara pakai.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "EB Garamond", url: staticFile("fonts/EBGaramond-Variable.woff2"), weight: "400 800" });
loadFont({ family: "EB Garamond", url: staticFile("fonts/EBGaramond-Italic-Variable.woff2"), weight: "400 800", style: "italic" });
loadFont({ family: "IM Fell English", url: staticFile("fonts/IMFellEnglish-Regular.woff2"), weight: "400" });
loadFont({ family: "Kalam", url: staticFile("fonts/Kalam-Light.woff2"), weight: "300" });
loadFont({ family: "Kalam", url: staticFile("fonts/Kalam-Regular.woff2"), weight: "400" });
loadFont({ family: "Kalam", url: staticFile("fonts/Kalam-Bold.woff2"), weight: "700" });

// Warna diukur dari frame referensi.
export const c = {
  kertas: "#E6DAC3", // kertas di bawah cahaya
  kertasTepi: "#D9CBB1",
  garisBuku: "rgba(120, 96, 70, 0.16)",
  tinta: "#312317", // tinta coklat-hitam
  tintaPudar: "rgba(49, 35, 23, 0.62)",
  merah: "#A64A33", // spidol merah bata
  merahTua: "#8E3B27",
  vignette: "#5E4C3C",
  kayu: "#6E4E34",
  kopi: "#462C19",
  pensil: "#C9A26A",
  sobek: "#DDCDAB",
} as const;

export const f = {
  serif: '"EB Garamond", Georgia, serif', // teks utama, angka gaya lama
  tinta: '"IM Fell English", "EB Garamond", serif', // persamaan / angka besar bertinta kasar
  tangan: '"Kalam", "Comic Sans MS", cursive', // tulisan tangan (300 tipis, 700 spidol)
} as const;

export const FPS = 30;
export const d = (detik: number) => Math.round(detik * FPS); // detik -> frame (untuk sinkron voice-over)

// Halaman: 2 kolom x 3 baris "bagian", masing-masing seukuran layar.
export const PW = 2160;
export const PH = 5760;
export const JARAK_GARIS = 105; // jarak garis buku (diukur dari referensi)

// Titik tengah bagian (kolom, baris) di koordinat halaman.
export const bagian = (kol: number, baris: number) => ({ x: kol * 1080 + 540, y: baris * 1920 + 960 });
