// Render slide carousel Papan Kapur: satu PNG per slide (slide-01.png ... slide-NN.png).
// Pakai: node scripts/carousel.mjs produksi/<slug>/carousel.json produksi/<slug> [--browser <chrome-headless-shell>]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [masukan, keluar, ...sisa] = process.argv.slice(2);
if (!masukan || !keluar) {
  console.error("Pakai: node scripts/carousel.mjs <carousel.json> <folder-keluar> [--browser <path>]");
  process.exit(1);
}
const bi = sisa.indexOf("--browser");
const browserExecutable = bi >= 0 ? sisa[bi + 1] : null;
const data = JSON.parse(fs.readFileSync(masukan, "utf8"));
const n = Math.min(data.slide.length, 8);
if (data.slide.length < 5 || data.slide.length > 8) console.warn(`Peringatan: ${data.slide.length} slide (aturan 5–8).`);
fs.mkdirSync(keluar, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "CarouselPapan", inputProps: { data, slide: 0 }, browserExecutable });
for (let i = 0; i < n; i++) {
  const output = path.join(keluar, `slide-${String(i + 1).padStart(2, "0")}.png`);
  const props = { data, slide: i };
  // renderStill memakai props milik objek komposisi, jadi props slide dipasang di sana juga
  await renderStill({
    serveUrl,
    composition: { ...composition, props },
    inputProps: props,
    output,
    imageFormat: "png",
    browserExecutable,
    onBrowserLog: (log) => {
      if (log.text.includes("[carousel]")) console.warn(log.text);
    },
  });
  console.log(output);
}
