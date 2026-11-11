// Render sampul Reels Papan Kapur (1080×1920, JPEG).
// Pakai: node scripts/sampul.mjs produksi/<slug>/sampul.jpg --atas "Deposito" --angka "6%" --bawah "aman nggak?" [--label "..."] [--browser <path>]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [keluar, ...sisa] = process.argv.slice(2);
const ambil = (nama) => {
  const i = sisa.indexOf(`--${nama}`);
  return i >= 0 ? sisa[i + 1] : undefined;
};
const props = { atas: ambil("atas"), angka: ambil("angka"), bawah: ambil("bawah"), label: ambil("label") };
if (!keluar || !props.atas || !props.angka || !props.bawah) {
  console.error('Pakai: node scripts/sampul.mjs <keluar.jpg> --atas "..." --angka "..." --bawah "..." [--label "..."] [--browser <path>]');
  process.exit(1);
}
const browserExecutable = ambil("browser") ?? null;
fs.mkdirSync(path.dirname(keluar), { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "SampulPapan", inputProps: props, browserExecutable });
await renderStill({ serveUrl, composition, inputProps: props, output: keluar, imageFormat: "jpeg", jpegQuality: 90, browserExecutable });
console.log(keluar);
