// Carousel Instagram gaya Papan Kapur: infografis 1080×1350 (4:5), maksimal 6 slide, tanpa suara.
// Setiap slide: ADEGAN ilustrasi kapur di atas (±55% tinggi) + JUDUL kapital besar (kata kunci berwarna)
// + isi maksimal 2 baris. Slide 1 = hook, slide 2–5 = penjelasan/perumpamaan/efek/solusi,
// slide 6 = CTA komen/simpan + logo + tagline.
//
// Semua slide digambar di SATU papan panjang (lebar = jumlah slide × 1080) lalu dipotong per slide,
// jadi tekstur papan dan coretan yang melewati batas slide bersambung saat digeser.
// Tekstur: public/papan/papan-carousel.jpg (8640×1350): python3 scripts/buat_tekstur_papan.py public/papan/papan-carousel.jpg 8640 1350
//
// Data: produksi/<slug>/carousel.json — format di docs/carousel-papan.md. Penanda warna di judul/isi:
//   [kata] = kuning, {kata} = merah muda, <kata> = biru.
// Render: node scripts/carousel.mjs produksi/<slug>/carousel.json produksi/<slug> --browser <chrome-headless-shell>
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { LogoKapur, SimbolKapur } from "./BrandBoard";
import { FilterKapur, Gaya, Panah, Tulis, ukurLebar } from "./Komponen";
import { Adegan, DataAdegan, Ilustrasi } from "./ilustrasi";
import { k } from "./tema";

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
const MAKS_SLIDE = 6;
const SUDAH = -9999; // tampil penuh (gambar diam)
export const TAGLINE = "Biar dompetmu nggak kaget.";
const LEBAR_TEKS = 940;

export type DataSlide = {
  peran: string;
  judul: string;
  isi?: string;
  visual?: string;
  ilustrasi?: DataAdegan; // adegan lengkap (koordinat dalam kotak 900×690)
  gambar?: string | string[]; // cara cepat: 1–3 objek ikon berlabel (tanpa orang)
  label?: string[];
  panah?: boolean;
  angka?: string;
  sumber?: string;
};
export type DataCarousel = { judul: string; slide: DataSlide[]; sumber?: string };
export type PropsCarousel = { data: DataCarousel; slide: number };

// ---------------------------------------------------------------- teks berwarna
const WARNA_TANDA: Record<string, string> = { "[": k.kuning, "{": k.merah, "<": k.biru };
const PASANGAN: Record<string, string> = { "[": "]", "{": "}", "<": ">" };
type Potong = { t: string; warna: string };

/** "beli [emas] {rugi}?" -> potongan kata dengan warna masing-masing. */
const urai = (teks: string, dasar: string): Potong[] => {
  const hasil: Potong[] = [];
  let i = 0;
  while (i < teks.length) {
    const c = teks[i];
    if (WARNA_TANDA[c]) {
      const j = teks.indexOf(PASANGAN[c], i + 1);
      if (j > i) {
        for (const kata of teks.slice(i + 1, j).split(/(\s+)/)) if (kata) hasil.push({ t: kata, warna: WARNA_TANDA[c] });
        i = j + 1;
        continue;
      }
    }
    const j = teks.slice(i + 1).search(/[[{<]/);
    const akhir = j < 0 ? teks.length : i + 1 + j;
    for (const kata of teks.slice(i, akhir).split(/(\s+)/)) if (kata) hasil.push({ t: kata, warna: dasar });
    i = akhir;
  }
  return hasil;
};

/** Bungkus potongan jadi baris dengan lebar terukur (font sama seperti Tulis). */
const bungkusWarna = (teks: string, ukuran: number, gaya: Gaya, lebar: number, dasar: string, kapital: boolean): Potong[][] => {
  const potong = urai(kapital ? teks.toUpperCase() : teks, dasar);
  const baris: Potong[][] = [[]];
  let w = 0;
  for (const p of potong) {
    const spasi = /^\s+$/.test(p.t);
    const lp = ukurLebar(p.t, ukuran, gaya);
    if (!spasi && w + lp > lebar && baris[baris.length - 1].length) {
      const b = baris[baris.length - 1];
      while (b.length && /^\s+$/.test(b[b.length - 1].t)) b.pop();
      baris.push([]);
      w = 0;
    }
    if (spasi && w === 0) continue;
    baris[baris.length - 1].push(p);
    w += lp;
  }
  return baris.filter((b) => b.length);
};

const TeksWarna: React.FC<{ cx: number; y: number; teks: string; ukuran: number; jarak: number; gaya: Gaya; warna?: string; kapital?: boolean; maksBaris: number; label: string; tebalFilter?: boolean }> = ({
  cx,
  y,
  teks,
  ukuran,
  jarak,
  gaya,
  warna = k.putih,
  kapital = false,
  maksBaris,
  label,
  tebalFilter,
}) => {
  const baris = bungkusWarna(teks, ukuran, gaya, LEBAR_TEKS, warna, kapital);
  if (baris.length > maksBaris) console.warn(`[carousel] ${label} "${teks}" jadi ${baris.length} baris (maks. ${maksBaris})`);
  for (const b of baris) {
    const lebar = b.reduce((n, p) => n + ukurLebar(p.t, ukuran, gaya), 0);
    if (lebar > 1020) console.warn(`[carousel] ${label}: baris "${b.map((p) => p.t).join("")}" lebih lebar dari slide (${Math.round(lebar)} px)`);
  }
  return (
    <>
      {baris.map((b, i) => {
        const lebar = b.reduce((n, p) => n + ukurLebar(p.t, ukuran, gaya), 0);
        let x = cx - lebar / 2;
        return b.map((p, j) => {
          const xi = x;
          x += ukurLebar(p.t, ukuran, gaya);
          return /^\s+$/.test(p.t) ? null : (
            <Tulis key={`${i}-${j}`} x={xi} y={y + i * jarak} teks={p.t} ukuran={ukuran} gaya={gaya} warna={p.warna} mulai={SUDAH} tebalFilter={tebalFilter} />
          );
        });
      })}
    </>
  );
};
const jumlahBaris = (teks: string, ukuran: number, gaya: Gaya, kapital: boolean) => bungkusWarna(teks, ukuran, gaya, LEBAR_TEKS, k.putih, kapital).length;

// ---------------------------------------------------------------- bagian slide
const KOTAK = { x: 90, y: 100, w: 900, h: 690 };

const IlustrasiSlide: React.FC<{ x0: number; s: DataSlide; h?: number }> = ({ x0, s, h = KOTAK.h }) => {
  if (s.ilustrasi) return <Adegan x={x0 + KOTAK.x} y={KOTAK.y} w={KOTAK.w} h={h} adegan={s.ilustrasi} />;
  const daftar = s.gambar ? (Array.isArray(s.gambar) ? s.gambar : [s.gambar]) : [];
  const objek = s.angka ? [`angka:${s.angka}`, ...daftar] : daftar;
  if (!objek.length) {
    console.warn(`[carousel] slide "${s.judul}" tanpa ilustrasi; setiap slide carousel harus bergambar`);
    return null;
  }
  return <Ilustrasi x={x0 + KOTAK.x} y={KOTAK.y + 40} w={KOTAK.w} h={h - 80} objek={objek} label={s.label} panah={s.panah} />;
};

// `batas` = y terbawah yang boleh dipakai isi sebelum menabrak elemen bawah (sumber, "geser", logo).
const JudulDanIsi: React.FC<{ x0: number; s: DataSlide; y: number; ukuran: number; batas: number }> = ({ x0, s, y, ukuran, batas }) => {
  const cx = x0 + 540;
  const jarak = Math.round(ukuran * 1.1);
  const n = jumlahBaris(s.judul, ukuran, "tebal", true);
  const yIsi = y + (n - 1) * jarak + Math.round(ukuran * 0.95);
  const nIsi = s.isi ? jumlahBaris(s.isi, 42, "tangan", false) : 0;
  const bawah = nIsi ? yIsi + (nIsi - 1) * 54 + 26 : y + (n - 1) * jarak + ukuran * 0.6;
  if (bawah > batas) console.warn(`[carousel] teks slide "${s.judul}" turun sampai y ${Math.round(bawah)}, menabrak elemen bawah (batas ${batas})`);
  return (
    <>
      <TeksWarna cx={cx} y={y} teks={s.judul} ukuran={ukuran} jarak={jarak} gaya="tebal" kapital maksBaris={3} label="judul" tebalFilter />
      {s.isi ? <TeksWarna cx={cx} y={yIsi} teks={s.isi} ukuran={42} jarak={54} gaya="tangan" maksBaris={2} label="isi" /> : null}
    </>
  );
};

const Sumber: React.FC<{ x0: number; teks: string }> = ({ x0, teks }) => (
  <Tulis x={x0 + 540} y={1308} teks={teks} ukuran={28} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
);

const SlideHook: React.FC<{ x0: number; s: DataSlide }> = ({ x0, s }) => (
  <>
    <SimbolKapur x={x0 + 66} y={38} s={56} />
    <Tulis x={x0 + 136} y={68} teks="@intipdompet" ukuran={36} gaya="tebal" mulai={SUDAH} />
    <IlustrasiSlide x0={x0} s={s} />
    <JudulDanIsi x0={x0} s={s} y={880} ukuran={88} batas={1262} />
    {/* ajakan geser: panahnya melewati batas slide, ujungnya muncul di tepi kiri slide 2 */}
    <Tulis x={x0 + 760} y={1296} teks="geser" ukuran={46} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="right" />
    <Panah x1={x0 + 785} y1={1300} x2={x0 + 1150} y2={1296} tinggi={22} mulai={SUDAH} lama={1} warna={k.biru} tebal={5} />
  </>
);

const SlidePoin: React.FC<{ x0: number; s: DataSlide }> = ({ x0, s }) => (
  <>
    <IlustrasiSlide x0={x0} s={s} />
    <JudulDanIsi x0={x0} s={s} y={880} ukuran={80} batas={s.sumber ? 1280 : 1320} />
    {s.sumber ? <Sumber x0={x0} teks={`sumber: ${s.sumber}`} /> : null}
  </>
);

const SlideCta: React.FC<{ x0: number; s: DataSlide; sumber?: string }> = ({ x0, s, sumber }) => {
  const cx = x0 + 540;
  return (
    <>
      <IlustrasiSlide x0={x0} s={s} h={570} />
      <JudulDanIsi x0={x0} s={s} y={745} ukuran={76} batas={1070} />
      <LogoKapur x={cx - 205} y={1085} s={78} />
      <Tulis x={cx} y={1222} teks={TAGLINE} ukuran={60} gaya="hias" warna={k.kuning} mulai={SUDAH} rata="center" />
      {sumber ? <Tulis x={cx} y={1282} teks={`sumber: ${sumber}`} ukuran={26} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" /> : null}
      <Tulis x={cx} y={1318} teks="Konten edukasi, bukan ajakan membeli." ukuran={26} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
    </>
  );
};

// ---------------------------------------------------------------- komposisi
export const CarouselPapan: React.FC<PropsCarousel> = ({ data, slide }) => {
  const n = Math.min(data.slide.length, MAKS_SLIDE);
  if (data.slide.length > MAKS_SLIDE) console.warn(`[carousel] ${data.slide.length} slide; hanya ${MAKS_SLIDE} pertama yang dipakai`);
  // hanya slide ini dan tetangganya yang digambar (coretan di perbatasan tetap tersambung)
  const tampil = (i: number) => Math.abs(i - slide) <= 1;
  return (
    <AbsoluteFill style={{ background: "#0f0d0b", overflow: "hidden" }}>
      <FilterKapur />
      <div style={{ position: "absolute", left: -slide * SLIDE_W, top: 0, width: n * SLIDE_W, height: SLIDE_H }}>
        <Img src={staticFile("papan/papan-carousel.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 8640, height: SLIDE_H }} />
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, background: "radial-gradient(90% 65% at 50% 42%, rgba(255,244,220,0.08), transparent 60%, rgba(0,0,0,0.38))" }} />
        ))}
        {data.slide.slice(0, n).map((s, i) => {
          if (!tampil(i)) return null;
          const x0 = i * SLIDE_W;
          return (
            <React.Fragment key={i}>
              {i === 0 ? <SlideHook x0={x0} s={s} /> : i === n - 1 ? <SlideCta x0={x0} s={s} sumber={data.sumber} /> : <SlidePoin x0={x0} s={s} />}
              <Tulis x={x0 + 1010} y={66} teks={`${i + 1}/${n}`} ukuran={36} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="right" />
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
