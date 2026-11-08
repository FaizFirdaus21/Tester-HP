// Tema "malam" intipdompet (brand board v3): ilustrasi vektor datar,
// tanpa gradasi, tanpa garis tepi, satu aksen oranye per frame.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "Fredoka", url: staticFile("fonts/Fredoka-Variable.woff2"), weight: "300 700" });
loadFont({ family: "Figtree", url: staticFile("fonts/Figtree-Variable.woff2"), weight: "300 900" });
loadFont({ family: "JetBrains Mono", url: staticFile("fonts/JetBrainsMono-Variable.woff2"), weight: "100 800" });

export const m = {
  langit: "#1B2A4A",
  kota1: "#24365E",
  kota2: "#2E4372",
  kota3: "#3A5286",
  bulan: "#F2EEE8",
  putih: "#FFFFFF",
  oranye: "#F28C38",
  pudar: "#A9B6D3",
} as const;

export const huruf = {
  display: '"Fredoka", "Figtree", sans-serif',
  teks: '"Figtree", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

export const aman = { atas: 220, bawah: 420, sisi: 96 } as const;

const fmt = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const persen = (n: number) => `${fmt.format(n)}%`;
