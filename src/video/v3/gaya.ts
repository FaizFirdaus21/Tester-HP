// Gaya video v3 "sinematik": setiap adegan punya dunia sendiri.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "Plus Jakarta Sans", url: staticFile("fonts/PlusJakartaSans-Variable.woff2"), weight: "200 800" });
loadFont({ family: "JetBrains Mono", url: staticFile("fonts/JetBrainsMono-Variable.woff2"), weight: "100 800" });

export const font = {
  utama: '"Plus Jakarta Sans", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

export const sorot = "#FFD23F"; // kuning sorotan teks
export const GL = "swangle";

const f2 = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const persen = (n: number) => `${f2.format(n)}%`;
export const rupiah = (n: number) => `Rp${new Intl.NumberFormat("id-ID").format(Math.round(n))}`;
