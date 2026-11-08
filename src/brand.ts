// Token merek intipdompet. Sumber kebenaran: design system "intipdompet".
// Kalau warna atau ukuran berubah di sana, ubah juga di sini.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Font disimpan di public/fonts (lisensi SIL Open Font License, dari Google Fonts)
// supaya render tidak butuh internet dan hasilnya selalu sama.
const FONT_DISPLAY = "Archivo";
const FONT_SANS = "Plus Jakarta Sans";
const FONT_MONO = "IBM Plex Mono";

loadFont({ family: FONT_DISPLAY, url: staticFile("fonts/Archivo-800.woff2"), weight: "800" });
loadFont({ family: FONT_SANS, url: staticFile("fonts/PlusJakartaSans-Variable.woff2"), weight: "200 800" });
loadFont({ family: FONT_MONO, url: staticFile("fonts/IBMPlexMono-400.woff2"), weight: "400" });
loadFont({ family: FONT_MONO, url: staticFile("fonts/IBMPlexMono-500.woff2"), weight: "500" });

export const warna = {
  kertas: "#eef0ea",
  kertas2: "#e2e6de",
  garis: "#c3cbc2",
  tinta: "#15201c",
  tintaPudar: "#4e5b55",
  biru: "#1f4fb8",
  diAtasBiru: "#f7f8f4",
  merah: "#c42a3f", // buruk untuk dompet
  hijau: "#17663f", // baik untuk dompet
  kuningKoin: "#e8b021",
  biruTerang: "#8fb0ff", // "intip" di atas latar tinta (versi gelap logo)
} as const;

export const font = {
  display: `"${FONT_DISPLAY}", "Arial Narrow", sans-serif`,
  sans: `"${FONT_SANS}", system-ui, sans-serif`,
  mono: `"${FONT_MONO}", ui-monospace, monospace`,
} as const;

export const teks = {
  angkaHero: { fontFamily: font.display, fontWeight: 800, fontSize: 220, lineHeight: 0.9, letterSpacing: "-0.03em" },
  judul: { fontFamily: font.display, fontWeight: 800, fontSize: 96, lineHeight: 1.0, letterSpacing: "-0.02em" },
  subjudul: { fontFamily: font.sans, fontWeight: 700, fontSize: 52, lineHeight: 1.15 },
  isi: { fontFamily: font.sans, fontWeight: 500, fontSize: 40, lineHeight: 1.3 },
  label: { fontFamily: font.sans, fontWeight: 700, fontSize: 28, lineHeight: 1.2, letterSpacing: "0.06em", textTransform: "uppercase" },
  angkaData: { fontFamily: font.mono, fontWeight: 500, fontSize: 32, lineHeight: 1.2, fontVariantNumeric: "tabular-nums" },
  sumber: { fontFamily: font.mono, fontWeight: 400, fontSize: 24, lineHeight: 1.3 },
} as const;

export const jarak = { j1: 16, j2: 32, j3: 64, j4: 96, amanAtas: 220, amanBawah: 420 } as const;
export const sudut = { kecil: 12, panel: 28, celah: 999 } as const;

export const REELS = { width: 1080, height: 1920, fps: 30 } as const;

const angka = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });
export const formatAngka = (n: number) => angka.format(n);
export const formatPersen = (n: number) =>
  `${n >= 0 ? "+" : "−"}${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(Math.abs(n))}%`;
