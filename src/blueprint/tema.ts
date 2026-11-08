// Tema blueprint: kertas biru cetak biru, garis putih, satu warna redline untuk sorotan.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "Barlow Condensed", url: staticFile("fonts/BarlowCondensed-500.woff2"), weight: "500" });
loadFont({ family: "Barlow Condensed", url: staticFile("fonts/BarlowCondensed-600.woff2"), weight: "600" });
loadFont({ family: "Barlow Condensed", url: staticFile("fonts/BarlowCondensed-700.woff2"), weight: "700" });
loadFont({ family: "IBM Plex Mono", url: staticFile("fonts/IBMPlexMono-400.woff2"), weight: "400" });
loadFont({ family: "IBM Plex Mono", url: staticFile("fonts/IBMPlexMono-500.woff2"), weight: "500" });

export const bp = {
  biru: "#1D4E89",
  biruTua: "#163E6E", // panel teks, bayangan bidang
  garis: "#FFFFFF",
  grid: "rgba(255,255,255,0.12)",
  gridTebal: "rgba(255,255,255,0.28)",
  pudar: "rgba(255,255,255,0.62)",
  redline: "#FF8A65", // markah koreksi: hanya untuk angka/hal yang dibahas
} as const;

export const fon = {
  judul: '"Barlow Condensed", "Arial Narrow", sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
} as const;

const f2 = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const persen = (n: number) => `${f2.format(n)}%`;
export const rupiah = (n: number) => `Rp${new Intl.NumberFormat("id-ID").format(Math.round(n))}`;
