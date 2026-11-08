// Render banyak gambar diam sekaligus (bundle sekali). Untuk storyboard dan pengecekan.
// Pakai: node scripts/stills.mjs <compositionId> <outDir> <frame,frame,...> [--browser <path>]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [id, outDir, frames, ...rest] = process.argv.slice(2);
if (!id || !outDir || !frames) {
  console.error("Pakai: node scripts/stills.mjs <compositionId> <outDir> <frame,frame,...> [--browser <path>]");
  process.exit(1);
}
const bi = rest.indexOf("--browser");
const browserExecutable = bi >= 0 ? rest[bi + 1] : null;
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of frames.split(",").map(Number)) {
  const output = path.join(outDir, `${id}-${String(f).padStart(5, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: f, output, browserExecutable });
  console.log(output);
}
