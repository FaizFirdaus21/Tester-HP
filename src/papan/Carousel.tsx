// Carousel Instagram gaya Papan Kapur: infografis 1080×1350 (4:5), maksimal 6 slide, tanpa suara.
// Slide 1 = hook, slide 2–5 = poin (penjelasan, perumpamaan, efek, solusi), slide 6 = CTA + logo + tagline.
// Slide poin: ilustrasi kapur di atas (±58% tinggi), judul besar huruf kapital, isi maksimal 2 baris.
//
// Semua slide digambar di SATU papan panjang (lebar = jumlah slide × 1080) lalu dipotong per slide,
// jadi tekstur papan dan coretan yang melewati batas slide bersambung saat digeser.
// Tekstur: public/papan/papan-carousel.jpg (8640×1350), dibuat dengan
//   python3 scripts/buat_tekstur_papan.py public/papan/papan-carousel.jpg 8640 1350
//
// Data: produksi/<slug>/carousel.json — format lengkap di docs/carousel-papan.md.
// Render: node scripts/carousel.mjs produksi/<slug>/carousel.json produksi/<slug> --browser <chrome-headless-shell>
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SimbolKapur, LogoKapur } from "./BrandBoard";
import { Coret, FilterKapur, Panah, Tulis, garis, lingkaran } from "./Komponen";
import { Ilustrasi, centang, kotak, kotakBulat } from "./ilustrasi";
import { k } from "./tema";

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
const MAKS_SLIDE = 6;
const SUDAH = -9999; // tampil penuh (gambar diam)
export const TAGLINE = "Biar dompetmu nggak kaget.";

export type DataSlide = {
  peran: string;
  judul: string;
  isi?: string;
  visual?: string;
  angka?: string;
  gambar?: string | string[]; // 1–3 objek ilustrasi (lihat src/papan/ilustrasi), atau "angka:<teks>"
  label?: string[]; // label di bawah tiap objek
  panah?: boolean; // panah kapur di antara objek
  sumber?: string;
};
export type DataCarousel = { judul: string; slide: DataSlide[]; sumber?: string };
export type PropsCarousel = { data: DataCarousel; slide: number };

// ---------------------------------------------------------------- teks
// Pembungkus baris berdasarkan perkiraan lebar huruf (lebar rata-rata per huruf relatif ukuran font).
// Perkiraan, bukan ukur kanvas: font belum tentu siap saat diukur, dan hasilnya harus deterministik.
const LEBAR_HURUF = { tangan: 0.47, tebal: 0.52, tipis: 0.45, hias: 0.58, kapital: 0.62 } as const;
const bungkus = (teks: string, ukuran: number, lebar: number, gaya: keyof typeof LEBAR_HURUF): string[] => {
  const maks = Math.max(8, Math.floor(lebar / (ukuran * LEBAR_HURUF[gaya])));
  const baris: string[] = [];
  for (const paragraf of teks.split("\n")) {
    let s = "";
    for (const kata of paragraf.split(/\s+/).filter(Boolean)) {
      if (s && (s + " " + kata).length > maks) {
        baris.push(s);
        s = kata;
      } else s = s ? `${s} ${kata}` : kata;
    }
    if (s) baris.push(s);
  }
  return baris;
};

const Baris: React.FC<{ x: number; y: number; baris: string[]; ukuran: number; jarak: number; gaya: "tangan" | "tebal" | "tipis" | "hias"; warna?: string; rata?: "left" | "center"; tebalFilter?: boolean }> = ({
  x,
  y,
  baris,
  ukuran,
  jarak,
  gaya,
  warna = k.putih,
  rata = "left",
  tebalFilter,
}) => (
  <>
    {baris.map((b, i) => (
      <Tulis key={i} x={x} y={y + i * jarak} teks={b} ukuran={ukuran} gaya={gaya} warna={warna} mulai={SUDAH} rata={rata} tebalFilter={tebalFilter} />
    ))}
  </>
);

// ---------------------------------------------------------------- slide
const NomorSlide: React.FC<{ x0: number; i: number; n: number }> = ({ x0, i, n }) => (
  <Tulis x={x0 + 1000} y={86} teks={`${i + 1}/${n}`} ukuran={40} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="right" />
);

const SlideHook: React.FC<{ x0: number; s: DataSlide }> = ({ x0, s }) => {
  const cx = x0 + 540;
  return (
    <>
      <SimbolKapur x={x0 + 70} y={56} s={64} />
      <Tulis x={x0 + 150} y={90} teks="@intipdompet" ukuran={40} gaya="tebal" mulai={SUDAH} />
      {s.angka ? (
        <>
          <Baris x={cx} y={300} baris={bungkus(s.judul, 112, 900, "tebal")} ukuran={112} jarak={118} gaya="tebal" rata="center" />
          <Tulis x={cx} y={640} teks={s.angka} ukuran={380} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" tebalFilter />
          <Coret pts={lingkaran(cx, 640, 380, 210, 7)} mulai={SUDAH} warna={k.merah} tebal={7} kapur={false} />
          <Coret pts={garis(cx - 270, 850, cx + 270, 842, 3, 5)} mulai={SUDAH} warna={k.kuning} tebal={12} kapur={false} />
          {s.isi ? <Baris x={cx} y={985} baris={bungkus(s.isi, 110, 900, "hias")} ukuran={110} jarak={116} gaya="hias" warna={k.merah} rata="center" /> : null}
        </>
      ) : (
        <>
          <Baris x={cx} y={420} baris={bungkus(s.judul, 128, 900, "tebal")} ukuran={128} jarak={136} gaya="tebal" rata="center" />
          {s.isi ? <Baris x={cx} y={900} baris={bungkus(s.isi, 96, 900, "hias")} ukuran={96} jarak={104} gaya="hias" warna={k.merah} rata="center" /> : null}
        </>
      )}
      {/* ajakan geser: panahnya melewati batas slide, ujungnya muncul di tepi kiri slide 2 */}
      <Tulis x={x0 + 700} y={1235} teks="geser" ukuran={52} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="right" />
      <Panah x1={x0 + 730} y1={1240} x2={x0 + 1150} y2={1236} tinggi={26} mulai={SUDAH} lama={1} warna={k.biru} tebal={5} />
    </>
  );
};

const SlidePoin: React.FC<{ x0: number; s: DataSlide }> = ({ x0, s }) => {
  const cx = x0 + 540;
  const daftar = s.gambar ? (Array.isArray(s.gambar) ? s.gambar : [s.gambar]) : [];
  const objek = s.angka ? [`angka:${s.angka}`, ...daftar] : daftar;
  const judul = bungkus(s.judul.toUpperCase(), 84, 940, "kapital");
  if (judul.length > 2) console.warn(`[carousel] judul "${s.judul}" lebih dari 2 baris`);
  const yJudul = objek.length ? 880 : 300;
  const akhirJudul = yJudul + (judul.length - 1) * 94;
  const checklist = (s.isi ?? "").split("\n").filter((b) => b.trim().startsWith("✓"));
  const isi = !checklist.length && s.isi ? bungkus(s.isi, 54, 920, "tangan") : [];
  if (isi.length > 2) console.warn(`[carousel] isi slide "${s.judul}" ${isi.length} baris (maks. 2)`);
  let yIsi = akhirJudul + 115;
  return (
    <>
      {objek.length ? <Ilustrasi x={x0 + 90} y={140} w={900} h={640} objek={objek} label={s.label} panah={s.panah} /> : null}
      <Baris x={cx} y={yJudul} baris={judul} ukuran={84} jarak={94} gaya="tebal" rata="center" />
      <Coret pts={garis(cx - 150, akhirJudul + 62, cx + 150, akhirJudul + 56, 9, 3)} mulai={SUDAH} warna={k.kuning} tebal={8} kapur={false} />
      {checklist.length ? (
        checklist.map((b, i) => {
          const baris = bungkus(b.replace(/^\s*✓\s*/, ""), 50, 800, "tangan");
          const y = yIsi;
          yIsi += baris.length * 62 + 34;
          return (
            <React.Fragment key={i}>
              <Coret pts={kotak(x0 + 110, y - 30, 58, 58, 40 + i)} mulai={SUDAH} tebal={5} kapur={false} />
              <Coret pts={centang(x0 + 120, y - 4, 0.85)} mulai={SUDAH} warna={k.hijauTerang} tebal={8} kapur={false} />
              <Baris x={x0 + 200} y={y} baris={baris} ukuran={50} jarak={62} gaya="tangan" />
            </React.Fragment>
          );
        })
      ) : isi.length ? (
        <Baris x={cx} y={yIsi} baris={isi} ukuran={54} jarak={66} gaya="tangan" rata="center" />
      ) : null}
      {s.sumber ? <Tulis x={cx} y={1295} teks={`sumber: ${s.sumber}`} ukuran={30} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" /> : null}
    </>
  );
};

const SlideCta: React.FC<{ x0: number; s: DataSlide; sumber?: string }> = ({ x0, s, sumber }) => {
  const cx = x0 + 540;
  // alur vertikal: judul → ajakan → ikon komen/simpan → logo → tagline → sumber + disclaimer (dari bawah)
  const judul = bungkus(s.judul, 90, 900, "tebal");
  const yJudul = 220;
  const akhirJudul = yJudul + (judul.length - 1) * 98;
  const isi = s.isi ? bungkus(s.isi, 60, 900, "hias") : [];
  const yIsi = akhirJudul + 125;
  const akhirIsi = isi.length ? yIsi + (isi.length - 1) * 70 : akhirJudul;
  const yIkon = Math.max(640, akhirIsi + 90); // tepi atas ikon
  return (
    <>
      <Baris x={cx} y={yJudul} baris={judul} ukuran={90} jarak={98} gaya="tebal" rata="center" />
      {isi.length ? <Baris x={cx} y={yIsi} baris={isi} ukuran={60} jarak={70} gaya="hias" warna={k.kuning} rata="center" /> : null}
      {/* gelembung komen: badan dan ekor digambar terpisah supaya ekor tidak mencoret isinya */}
      <Coret pts={kotakBulat(cx - 300, yIkon, 200, 120, 30)} mulai={SUDAH} tebal={6} kapur={false} />
      <Coret
        pts={[
          [cx - 262, yIkon + 120],
          [cx - 282, yIkon + 168],
          [cx - 222, yIkon + 120],
        ]}
        mulai={SUDAH}
        tebal={6}
        kapur={false}
      />
      <Tulis x={cx - 200} y={yIkon + 60} teks="__ %" ukuran={56} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" />
      <Tulis x={cx - 200} y={yIkon + 215} teks="komen" ukuran={44} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
      <Coret
        pts={[
          [cx + 150, yIkon],
          [cx + 250, yIkon],
          [cx + 250, yIkon + 160],
          [cx + 200, yIkon + 120],
          [cx + 150, yIkon + 160],
          [cx + 150, yIkon + 2],
        ]}
        mulai={SUDAH}
        tebal={6}
        kapur={false}
      />
      <Tulis x={cx + 200} y={yIkon + 215} teks="simpan" ukuran={44} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
      <LogoKapur x={cx - 264} y={Math.max(yIkon + 280, 960)} s={100} />
      <Tulis x={cx} y={Math.max(yIkon + 280, 960) + 175} teks={TAGLINE} ukuran={72} gaya="hias" warna={k.kuning} mulai={SUDAH} rata="center" />
      {sumber ? <Baris x={cx} y={1250} baris={bungkus(`sumber: ${sumber}`, 30, 960, "tipis")} ukuran={30} jarak={36} gaya="tipis" warna={k.biru} rata="center" /> : null}
      <Tulis x={cx} y={1308} teks="Konten edukasi, bukan ajakan membeli." ukuran={30} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
    </>
  );
};

// ---------------------------------------------------------------- komposisi
export const CarouselPapan: React.FC<PropsCarousel> = ({ data, slide }) => {
  const n = Math.min(data.slide.length, MAKS_SLIDE);
  if (data.slide.length > MAKS_SLIDE) console.warn(`[carousel] ${data.slide.length} slide; hanya ${MAKS_SLIDE} pertama yang dipakai (aturan maks. 6 slide)`);
  return (
    <AbsoluteFill style={{ background: "#0f0d0b", overflow: "hidden" }}>
      <FilterKapur />
      <div style={{ position: "absolute", left: -slide * SLIDE_W, top: 0, width: n * SLIDE_W, height: SLIDE_H }}>
        <Img src={staticFile("papan/papan-carousel.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 8640, height: SLIDE_H }} />
        {/* cahaya kelas yang sama di tiap slide, sedikit gelap di atas dan bawah */}
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, background: "radial-gradient(90% 65% at 50% 45%, rgba(255,244,220,0.08), transparent 60%, rgba(0,0,0,0.38))" }} />
        ))}
        {data.slide.slice(0, n).map((s, i) => {
          const x0 = i * SLIDE_W;
          return (
            <React.Fragment key={i}>
              {i === 0 || s.peran === "hook" ? <SlideHook x0={x0} s={s} /> : i === n - 1 || s.peran === "cta" ? <SlideCta x0={x0} s={s} sumber={data.sumber} /> : <SlidePoin x0={x0} s={s} />}
              <NomorSlide x0={x0} i={i} n={n} />
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
