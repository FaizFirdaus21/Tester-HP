// Carousel Instagram gaya Papan Kapur (1080×1350, 4:5, 5–8 slide, tanpa suara).
//
// Semua slide digambar di SATU papan panjang (lebar = jumlah slide × 1080) lalu dipotong per slide,
// jadi tekstur papan dan coretan yang melewati batas slide bersambung saat digeser.
// Tekstur: public/papan/papan-carousel.jpg (8640×1350, cukup untuk 8 slide), dibuat dengan
//   python3 scripts/buat_tekstur_papan.py public/papan/papan-carousel.jpg 8640 1350
//
// Data: produksi/<slug>/carousel.json
//   { "judul": "...", "sumber": "...", "slide": [ { "peran": "hook" | "poin" | "cta", "judul": "...", "isi": "...", "visual": "...",
//       // opsional, diisi Director dari kolom visual:
//       "angka": "3,75%",          // angka besar kuning
//       "gambar": "bank" | "hp" | "amplop" | "koin" | "grafik" | "kalender" | "perisai" | "centang",
//       "sumber": "LPS, 28 Sep 2026" } ] }
//   isi dengan baris diawali "✓" (dipisah "\n") digambar sebagai checklist.
// Render: node scripts/carousel.mjs produksi/<slug>/carousel.json produksi/<slug> --browser <chrome-headless-shell>
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SimbolKapur, LogoKapur } from "./BrandBoard";
import { Coret, FilterKapur, Panah, Titik, Tulis, garis, ikonBank, lingkaran } from "./Komponen";
import { k } from "./tema";

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
const MAKS_SLIDE = 8;
const SUDAH = -9999; // tampil penuh (gambar diam)
export const TAGLINE = "Biar dompetmu nggak kaget.";

export type Gambar = "bank" | "hp" | "amplop" | "koin" | "grafik" | "kalender" | "perisai" | "centang";
export type DataSlide = { peran: string; judul: string; isi?: string; visual?: string; angka?: string; gambar?: Gambar | string; sumber?: string };
export type DataCarousel = { judul: string; slide: DataSlide[]; sumber?: string };
export type PropsCarousel = { data: DataCarousel; slide: number };

// ---------------------------------------------------------------- teks
// Pembungkus baris berdasarkan perkiraan lebar huruf (lebar rata-rata per huruf relatif ukuran font).
// Perkiraan, bukan ukur kanvas: font belum tentu siap saat diukur, dan hasilnya harus deterministik.
const LEBAR_HURUF = { tangan: 0.47, tebal: 0.52, tipis: 0.45, hias: 0.58 } as const;
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

// ---------------------------------------------------------------- gambar kapur
const kotak = (x: number, y: number, w: number, h: number, seed: number): Titik[] => [
  ...garis(x, y, x + w, y, seed, 2),
  ...garis(x + w, y, x + w, y + h, seed + 1, 2),
  ...garis(x + w, y + h, x, y + h, seed + 2, 2),
  ...garis(x, y + h, x, y + 4, seed + 3, 2),
];
const kotakBulat = (x: number, y: number, w: number, h: number, r: number): Titik[] => {
  const pts: Titik[] = [];
  const sudut = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 6; i++) {
      const a = a0 + (i / 6) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  sudut(x + w - r, y + r, -Math.PI / 2);
  sudut(x + w - r, y + h - r, 0);
  sudut(x + r, y + h - r, Math.PI / 2);
  sudut(x + r, y + r, Math.PI);
  pts.push([x + w - r, y + 2]);
  return pts;
};
const centang = (x: number, y: number, s = 1): Titik[] => [
  [x, y],
  [x + 22 * s, y + 30 * s],
  [x + 70 * s, y - 40 * s],
];

/** Gambar kapur sederhana di sekitar (cx, cy) dengan ukuran s. Kembalikan daftar coretan + warnanya. */
const gambarKapur = (jenis: string, cx: number, cy: number, s: number): { pts: Titik[]; warna?: string; tebal?: number }[] => {
  const h = s / 2;
  switch (jenis) {
    case "bank":
      return ikonBank(cx, cy, s, 5).map((pts) => ({ pts }));
    case "hp":
      return [
        { pts: kotakBulat(cx - h * 0.55, cy - h, s * 0.55, s, s * 0.09) },
        { pts: kotakBulat(cx - h * 0.42, cy - h * 0.86, s * 0.17, s * 0.22, s * 0.04) },
        { pts: kotak(cx - s * 0.08, cy + h * 0.55, s * 0.18, s * 0.09, 7), warna: k.kuning },
      ];
    case "amplop":
      return [
        { pts: kotak(cx - h, cy - h * 0.62, s, s * 0.62, 11) },
        {
          pts: [
            [cx - h, cy - h * 0.62],
            [cx, cy + h * 0.05],
            [cx + h, cy - h * 0.62],
          ],
        },
      ];
    case "koin":
      return [0, 1, 2].map((i) => ({ pts: lingkaran(cx, cy + h * 0.5 - i * s * 0.22, h * 0.8, h * 0.28, 20 + i), warna: k.kuning }));
    case "grafik":
      return [
        { pts: [[cx - h, cy - h], [cx - h, cy + h], [cx + h, cy + h]] as Titik[] },
        { pts: [[cx - h * 0.8, cy + h * 0.6], [cx - h * 0.2, cy + h * 0.1], [cx + h * 0.2, cy + h * 0.3], [cx + h * 0.85, cy - h * 0.7]] as Titik[], warna: k.kuning, tebal: 9 },
      ];
    case "kalender":
      return [
        { pts: kotak(cx - h, cy - h * 0.8, s, s * 0.9, 31) },
        { pts: garis(cx - h, cy - h * 0.45, cx + h, cy - h * 0.45, 32, 1) },
        ...[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => ({ pts: lingkaran(cx - h * 0.65 + c * h * 0.43, cy - h * 0.12 + r * h * 0.3, 7, 7, r * 4 + c) }))),
      ];
    case "perisai":
      return [
        {
          pts: [
            [cx, cy - h],
            [cx + h * 0.8, cy - h * 0.7],
            [cx + h * 0.7, cy + h * 0.2],
            [cx, cy + h],
            [cx - h * 0.7, cy + h * 0.2],
            [cx - h * 0.8, cy - h * 0.7],
            [cx, cy - h],
          ] as Titik[],
        },
        { pts: centang(cx - h * 0.35, cy + h * 0.05, s / 200), warna: k.hijauTerang, tebal: 10 },
      ];
    case "centang":
      return [{ pts: centang(cx - h * 0.5, cy + h * 0.1, s / 120), warna: k.hijauTerang, tebal: 14 }];
    default:
      return [];
  }
};

const GambarKapur: React.FC<{ jenis: string; cx: number; cy: number; s: number }> = ({ jenis, cx, cy, s }) => (
  <>
    {gambarKapur(jenis, cx, cy, s).map((g, i) => (
      <Coret key={i} pts={g.pts} mulai={SUDAH} warna={g.warna ?? k.putih} tebal={g.tebal ?? 6} kapur={false} />
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
  const kiri = x0 + 90;
  const judul = bungkus(s.judul, 84, 900, "tebal");
  const yJudul = 230;
  const akhirJudul = yJudul + (judul.length - 1) * 96;
  const adaVisual = Boolean(s.angka || s.gambar);
  const checklist = (s.isi ?? "").split("\n").filter((b) => b.trim().startsWith("✓"));
  const yVisual = akhirJudul + 270;
  let yIsi = adaVisual ? yVisual + 290 : akhirJudul + 170;
  return (
    <>
      <Baris x={kiri} y={yJudul} baris={judul} ukuran={84} jarak={96} gaya="tebal" />
      <Coret pts={garis(kiri, akhirJudul + 70, kiri + 300, akhirJudul + 64, 9, 3)} mulai={SUDAH} warna={k.kuning} tebal={8} kapur={false} />
      {s.angka && s.gambar ? (
        <>
          <Tulis x={x0 + 380} y={yVisual} teks={s.angka} ukuran={210} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" tebalFilter />
          <GambarKapur jenis={s.gambar} cx={x0 + 820} cy={yVisual} s={230} />
        </>
      ) : s.angka ? (
        <Tulis x={x0 + 540} y={yVisual} teks={s.angka} ukuran={250} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" tebalFilter />
      ) : s.gambar ? (
        <GambarKapur jenis={s.gambar} cx={x0 + 540} cy={yVisual + 20} s={340} />
      ) : null}
      {checklist.length ? (
        checklist.map((b, i) => {
          const baris = bungkus(b.replace(/^\s*✓\s*/, ""), 60, 800, "tangan");
          const y = yIsi;
          yIsi += baris.length * 74 + 50;
          return (
            <React.Fragment key={i}>
              <Coret pts={kotak(kiri, y - 36, 70, 70, 40 + i)} mulai={SUDAH} tebal={5} kapur={false} />
              <Coret pts={centang(kiri + 12, y - 4, 1)} mulai={SUDAH} warna={k.hijauTerang} tebal={9} kapur={false} />
              <Baris x={kiri + 110} y={y} baris={baris} ukuran={60} jarak={74} gaya="tangan" />
            </React.Fragment>
          );
        })
      ) : s.isi ? (
        <Baris x={kiri} y={yIsi} baris={bungkus(s.isi, adaVisual ? 62 : 68, 900, "tangan")} ukuran={adaVisual ? 62 : 68} jarak={adaVisual ? 78 : 86} gaya="tangan" />
      ) : null}
      {s.sumber ? <Tulis x={kiri} y={1270} teks={`sumber: ${s.sumber}`} ukuran={32} gaya="tipis" warna={k.biru} mulai={SUDAH} /> : null}
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
  if (data.slide.length > MAKS_SLIDE) console.warn(`[carousel] ${data.slide.length} slide; hanya ${MAKS_SLIDE} pertama yang dipakai (tekstur 8640 px)`);
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
