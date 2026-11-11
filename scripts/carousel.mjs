// Render slide carousel Papan Kapur: satu PNG per slide (slide-01.png ... slide-NN.png).
// Pakai: node scripts/carousel.mjs produksi/<slug>/carousel.json produksi/<slug> [--browser <chrome-headless-shell>] [--izinkan-peringatan]
// QC otomatis (carousel tayang tanpa dicek manusia): semua peringatan [carousel]/[ilustrasi] dari template
// (teks kepanjangan, teks menabrak elemen bawah, label/objek keluar slide, slide tanpa gambar) dikumpulkan.
// Bila ada, skrip keluar dengan kode 2 dan carousel TIDAK boleh diterbitkan sebelum diperbaiki.
// Selesai render, pratinjau.png (6 slide berdampingan) dibuat di folder keluaran.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const [masukan, keluar, ...sisa] = process.argv.slice(2);
if (!masukan || !keluar) {
  console.error("Pakai: node scripts/carousel.mjs <carousel.json> <folder-keluar> [--browser <path>]");
  process.exit(1);
}
const bi = sisa.indexOf("--browser");
const browserExecutable = bi >= 0 ? sisa[bi + 1] : null;
const izinkan = sisa.includes("--izinkan-peringatan");
const peringatan = new Set();
const data = JSON.parse(fs.readFileSync(masukan, "utf8"));
const n = Math.min(data.slide.length, 6);
if (data.slide.length > 6) peringatan.add(`[carousel] ${data.slide.length} slide; aturan maksimal 6, hanya 6 pertama yang dirender`);
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
      const m = log.text.match(/\[(carousel|ilustrasi)\].*/);
      if (m) peringatan.add(m[0]); // slide tetangga ikut digambar, jadi pesan yang sama disatukan
    },
  });
  console.log(output);
}

execFileSync("python3", ["scripts/pratinjau_carousel.py", keluar, `${data.judul} (${n} slide)`], { stdio: "inherit" });
if (peringatan.size) {
  console.error(`\nQC GAGAL: ${peringatan.size} peringatan. Perbaiki carousel.json lalu render ulang:`);
  for (const p of peringatan) console.error(`  - ${p}`);
  if (!izinkan) process.exit(2);
} else {
  console.log("QC lolos: tidak ada peringatan [carousel]/[ilustrasi].");
}
