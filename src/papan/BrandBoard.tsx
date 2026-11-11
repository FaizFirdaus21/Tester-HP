// Brand board @intipdompet versi "Papan Kapur", plus foto profil dan logo kapur.
// Dirender sebagai gambar diam (renderStill). Semua tulisan dan coretan tampil penuh (mulai negatif).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Angkat, Coret, FilterKapur, Panah, Titik, Tulis, garis, lingkaran } from "./Komponen";
import { font, k } from "./tema";

const SUDAH = -9999; // tampil penuh

// ---------------------------------------------------------------- bentuk
/** Persegi bersudut bulat sebagai titik-titik (untuk digambar dengan kapur). */
const persegiBulat = (x: number, y: number, w: number, h: number, r: number, seed = 1): Titik[] => {
  const pts: Titik[] = [];
  const sudut = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 8; i++) {
      const a = a0 + (i / 8) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  sudut(x + w - r, y + r, -Math.PI / 2);
  sudut(x + w - r, y + h - r, 0);
  sudut(x + r, y + h - r, Math.PI / 2);
  sudut(x + r, y + r, Math.PI);
  pts.push([pts[0][0] + 2, pts[0][1]]);
  // goyang tangan kecil
  return pts.map((p, i) => [p[0] + Math.sin(i * 1.7 + seed) * 1.6, p[1] + Math.cos(i * 2.3 + seed) * 1.6]);
};

/** Simbol intipdompet versi kapur: kotak + tiga batang kemajuan (isi kuning makin panjang). */
export const SimbolKapur: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  const w = s;
  const pad = s * 0.17;
  const tinggiBatang = s * 0.13;
  const isi = [0.35, 0.6, 0.88];
  return (
    <>
      <Coret pts={persegiBulat(x, y, w, w, s * 0.2, 3)} mulai={SUDAH} warna={k.biru} tebal={Math.max(5, s * 0.035)} kapur={false} />
      {isi.map((p, i) => {
        const by = y + pad + s * 0.08 + i * s * 0.24;
        const bx0 = x + pad;
        const bx1 = x + w - pad;
        return (
          <React.Fragment key={i}>
            <Coret pts={persegiBulat(bx0, by - tinggiBatang / 2, bx1 - bx0, tinggiBatang, tinggiBatang / 2, 10 + i)} mulai={SUDAH} warna={k.putih} tebal={Math.max(3, s * 0.016)} kapur={false} />
            <Coret pts={garis(bx0 + tinggiBatang * 0.45, by, bx0 + (bx1 - bx0) * p, by, 20 + i, 1)} mulai={SUDAH} warna={k.kuning} tebal={tinggiBatang * 0.72} kapur={false} />
          </React.Fragment>
        );
      })}
    </>
  );
};

/** Logo mendatar: simbol + "intip" (kuning) "dompet" (putih) dalam huruf kapur tebal. */
export const LogoKapur: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <>
    <SimbolKapur x={x} y={y} s={s} />
    <Tulis x={x + s * 1.22} y={y + s * 0.5} teks="intip" ukuran={s * 0.78} gaya="tebal" warna={k.kuning} mulai={SUDAH} tebalFilter />
    <Tulis x={x + s * 1.22 + s * 1.68} y={y + s * 0.5} teks="dompet" ukuran={s * 0.78} gaya="tebal" mulai={SUDAH} tebalFilter />
  </>
);

// ---------------------------------------------------------------- latar papan
const LatarPapan: React.FC<{ w: number; h: number; bingkai?: number; children: React.ReactNode }> = ({ w, h, bingkai = 56, children }) => (
  <AbsoluteFill style={{ background: "linear-gradient(135deg, #8b6440, #6B4A2E 50%, #4a321e)" }}>
    <Img src={staticFile("catatan/kayu-meja.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.5 }} />
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 6px 6px 0 rgba(255,220,170,0.25), inset -8px -8px 0 rgba(0,0,0,0.35)" }} />
    <div style={{ position: "absolute", left: bingkai, top: bingkai, width: w - bingkai * 2, height: h - bingkai * 2, overflow: "hidden" }}>
      <Img src={staticFile("papan/papan.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 2160, height: 7680, transform: `translate(${-(2160 - (w - bingkai * 2)) / 2}px, -1900px)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(85% 60% at 45% 30%, rgba(255,244,220,0.08), transparent 60%, rgba(0,0,0,0.35))" }} />
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 40px 46px -20px rgba(0,0,0,0.7), inset 36px 0 46px -24px rgba(0,0,0,0.55), inset -20px -20px 40px -20px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: -bingkai, top: -bingkai, width: w, height: h }}>{children}</div>
    </div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- brand board
const BW = 2400;
const BH = 3000;
const KIRI = 150;
const KANAN = 1270;

const JudulBagian: React.FC<{ x: number; y: number; no: string; teks: string }> = ({ x, y, no, teks }) => (
  <>
    <Tulis x={x} y={y} teks={no} ukuran={44} gaya="tebal" warna={k.merah} mulai={SUDAH} />
    <Tulis x={x + 80} y={y} teks={teks} ukuran={66} gaya="hias" warna={k.biru} mulai={SUDAH} />
    <Coret pts={garis(x, y + 50, x + 980, y + 48, no.charCodeAt(1), 2)} mulai={SUDAH} warna={k.putih} tebal={3} kapur={false} />
  </>
);

const Swatch: React.FC<{ x: number; y: number; warna: string; nama: string; hex: string; peran: string; seed: number }> = ({ x, y, warna, nama, hex, peran, seed }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 150,
        height: 150,
        background: warna,
        borderRadius: `${40 + (seed % 3) * 8}% ${55 - (seed % 4) * 6}% ${45 + (seed % 5) * 4}% ${60 - (seed % 2) * 10}%`,
        filter: "url(#kapurTebal)",
        transform: `rotate(${(seed % 5) * 7 - 14}deg)`,
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15)",
      }}
    />
    <Tulis x={x + 185} y={y + 40} teks={nama} ukuran={46} gaya="tebal" warna={warna === k.papan ? k.putih : warna} mulai={SUDAH} />
    <Tulis x={x + 185} y={y + 90} teks={hex} ukuran={34} gaya="tipis" mulai={SUDAH} />
    <Tulis x={x + 185} y={y + 132} teks={peran} ukuran={30} gaya="tipis" warna={k.biru} mulai={SUDAH} />
  </>
);

const Telepon: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  // skala layar 1080×1920 → s
  const W = 1080 * s;
  const H = 1920 * s;
  const zona = (a: number, b: number, warna: string, label: string, i: number) => (
    <React.Fragment key={label}>
      <div style={{ position: "absolute", left: x + 6, top: y + a * s, width: W - 12, height: (b - a) * s, background: warna, filter: "url(#kapur)" }} />
      <Coret pts={garis(x + W + 14, y + ((a + b) / 2) * s, x + W + 70, y + ((a + b) / 2) * s, 40 + i, 1)} mulai={SUDAH} tebal={3} kapur={false} />
      <Tulis x={x + W + 84} y={y + ((a + b) / 2) * s} teks={label} ukuran={34} mulai={SUDAH} />
    </React.Fragment>
  );
  return (
    <>
      {zona(220, 1200, "rgba(244,212,106,0.22)", "isi utama  y 220–1200", 0)}
      {zona(1300, 1480, "rgba(156,203,234,0.3)", "subtitel tipis  y 1300–1480", 1)}
      {zona(1500, 1920, "rgba(242,139,130,0.22)", "tertutup tombol IG (kosongkan)", 2)}
      <Coret pts={persegiBulat(x, y, W, H, 40, 9)} mulai={SUDAH} tebal={6} kapur={false} />
      <Tulis x={x + W / 2} y={y + 700 * s} teks="6%?" ukuran={170 * s * 2.2} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" />
      <Tulis x={x + W / 2} y={y + 1390 * s} teks="subtitel di sini" ukuran={46 * s * 2.2} mulai={SUDAH} rata="center" />
    </>
  );
};

export const BrandBoardPapan: React.FC = () => (
  <AbsoluteFill>
    <FilterKapur />
    <LatarPapan w={BW} h={BH}>
      {/* ===== kepala: logo utama ===== */}
      <Tulis x={KIRI} y={150} teks="BRAND BOARD · gaya Papan Kapur" ukuran={40} gaya="tipis" warna={k.biru} mulai={SUDAH} />
      <Tulis x={BW - KIRI} y={150} teks="v1 · Nov 2026" ukuran={40} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="right" />
      <LogoKapur x={500} y={240} s={300} />
      <Tulis x={BW / 2} y={650} teks="Urusan uang, kita intip." ukuran={96} gaya="hias" warna={k.kuning} mulai={SUDAH} rata="center" />
      <Coret pts={garis(760, 712, 1640, 704, 5, 4)} mulai={SUDAH} warna={k.kuning} tebal={8} kapur={false} />
      <Tulis x={BW / 2} y={790} teks="Media edukasi keuangan untuk usia 20–35: data harian, dijelaskan di papan tulis." ukuran={44} mulai={SUDAH} rata="center" />

      {/* ===== 01 logo & varian ===== */}
      <JudulBagian x={KIRI} y={950} no="01" teks="Logo & varian" />
      <SimbolKapur x={KIRI + 10} y={1060} s={250} />
      <Tulis x={KIRI + 135} y={1360} teks="simbol kapur" ukuran={34} gaya="tipis" mulai={SUDAH} rata="center" />
      {/* foto profil: lingkaran */}
      <div style={{ position: "absolute", left: KIRI + 330, top: 1050, width: 270, height: 270, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 6px rgba(238,240,230,0.85), 0 18px 30px rgba(0,0,0,0.5)" }}>
        <Img src={staticFile("papan/foto-profil-papan.png")} style={{ width: "100%", height: "100%" }} />
      </div>
      <Tulis x={KIRI + 465} y={1360} teks="foto profil" ukuran={34} gaya="tipis" mulai={SUDAH} rata="center" />
      {/* logo digital asli di atas kartu yang terangkat (2,5D) */}
      <Angkat mulai={SUDAH} x={KIRI + 660} y={1080} w={330} h={220} miringX={10} miringY={-14}>
        <div style={{ position: "absolute", inset: 0, background: "#f3f1ea", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 30px rgba(0,0,0,0.08)" }}>
          <Img src={staticFile("logo.png")} style={{ width: 290 }} />
        </div>
      </Angkat>
      <Tulis x={KIRI + 825} y={1360} teks="logo digital (non-video)" ukuran={34} gaya="tipis" mulai={SUDAH} rata="center" />
      <Tulis x={KIRI} y={1450} teks="Simbol = logo digital, digambar ulang dengan kapur." ukuran={34} warna={k.biru} gaya="tipis" mulai={SUDAH} />

      {/* ===== 02 warna kapur ===== */}
      <JudulBagian x={KANAN} y={950} no="02" teks="Warna kapur" />
      <Swatch x={KANAN} y={1040} warna={k.putih} nama="Kapur putih" hex="#EEF0E6" peran="isi & teks utama" seed={1} />
      <Swatch x={KANAN + 520} y={1040} warna={k.kuning} nama="Kuning koin" hex="#F4D46A" peran="angka penting, merek" seed={2} />
      <Swatch x={KANAN} y={1230} warna={k.merah} nama="Merah muda" hex="#F28B82" peran="risiko, coret, peringatan" seed={3} />
      <Swatch x={KANAN + 520} y={1230} warna={k.biru} nama="Biru langit" hex="#9CCBEA" peran="catatan, sumber, label" seed={4} />
      <Swatch x={KANAN} y={1420} warna={k.hijauTerang} nama="Hijau aman" hex="#A8E0B0" peran="centang, dijamin" seed={5} />
      <Swatch x={KANAN + 520} y={1420} warna={k.papan} nama="Papan" hex="#28463A" peran="latar papan" seed={6} />

      {/* ===== 03 huruf ===== */}
      <JudulBagian x={KIRI} y={1680} no="03" teks="Huruf" />
      <Tulis x={KIRI} y={1800} teks="3,75%  Rp2 miliar" ukuran={96} gaya="tebal" warna={k.kuning} mulai={SUDAH} tebalFilter />
      <Tulis x={KIRI} y={1880} teks="Kalam Bold — angka & judul (angka lurus, mudah dibaca)" ukuran={32} gaya="tipis" warna={k.biru} mulai={SUDAH} />
      <Tulis x={KIRI} y={1965} teks="bunga plus cashback-nya" ukuran={62} mulai={SUDAH} />
      <Tulis x={KIRI} y={2030} teks="Kalam Regular — isi tulisan kapur" ukuran={32} gaya="tipis" warna={k.biru} mulai={SUDAH} />
      <Tulis x={KIRI} y={2120} teks="Cek dulu:" ukuran={80} gaya="hias" warna={k.putih} mulai={SUDAH} />
      <Tulis x={KIRI} y={2190} teks="Fredericka the Great — judul hias, maksimal 3 kata" ukuran={32} gaya="tipis" warna={k.biru} mulai={SUDAH} />
      <div style={{ position: "absolute", left: KIRI, top: 2240, fontFamily: font.sans, fontWeight: 650, fontSize: 44, color: "#fbfaf4", textShadow: "0 2px 3px rgba(0,0,0,0.8)" }}>Subtitel tipis tanpa kotak.</div>
      <Tulis x={KIRI} y={2335} teks="Plus Jakarta Sans 650 — subtitel" ukuran={32} gaya="tipis" warna={k.biru} mulai={SUDAH} />

      {/* ===== 04 elemen kapur ===== */}
      <JudulBagian x={KANAN} y={1680} no="04" teks="Elemen kapur" />
      <Tulis x={KANAN + 120} y={1800} teks="penting" ukuran={56} mulai={SUDAH} rata="center" />
      <Coret pts={garis(KANAN + 20, 1840, KANAN + 220, 1836, 3, 3)} mulai={SUDAH} warna={k.kuning} tebal={8} kapur={false} />
      <Tulis x={KANAN + 120} y={1890} teks="garis bawah" ukuran={30} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
      <Tulis x={KANAN + 440} y={1800} teks="6%" ukuran={70} gaya="tebal" mulai={SUDAH} rata="center" />
      <Coret pts={lingkaran(KANAN + 440, 1802, 90, 60, 4)} mulai={SUDAH} warna={k.merah} tebal={6} kapur={false} />
      <Tulis x={KANAN + 440} y={1890} teks="lingkari" ukuran={30} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
      <Tulis x={KANAN + 760} y={1800} teks="hangus" ukuran={58} mulai={SUDAH} rata="center" />
      <Coret pts={garis(KANAN + 660, 1806, KANAN + 860, 1794, 6, 5)} mulai={SUDAH} warna={k.merah} tebal={8} kapur={false} />
      <Tulis x={KANAN + 760} y={1890} teks="coret" ukuran={30} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
      <Coret pts={[[KANAN + 70, 2010], [KANAN + 100, 2050], [KANAN + 170, 1960]]} mulai={SUDAH} warna={k.hijauTerang} tebal={10} kapur={false} />
      <Tulis x={KANAN + 120} y={2110} teks="centang" ukuran={30} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
      <Panah x1={KANAN + 350} y1={2050} x2={KANAN + 540} y2={2010} tinggi={70} mulai={SUDAH} />
      <Tulis x={KANAN + 440} y={2110} teks="panah" ukuran={30} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
      <div style={{ position: "absolute", left: KANAN + 670, top: 1965, padding: "6px 22px", border: `5px solid ${k.merah}`, color: k.merah, fontFamily: font.tangan, fontWeight: 700, fontSize: 56, transform: "rotate(-8deg)", filter: "url(#kapurTebal)" }}>TUTUP</div>
      <Tulis x={KANAN + 760} y={2110} teks="cap" ukuran={30} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" />
      <Angkat mulai={SUDAH} x={KANAN + 120} y={2170} w={420} h={170} miringX={14} miringY={-12}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Coret pts={persegiBulat(0, 0, 420, 170, 18, 2)} mulai={SUDAH} tebal={5} kapur={false} />
          <Tulis x={210} y={86} teks="Rp10 juta" ukuran={72} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" />
        </div>
      </Angkat>
      <Tulis x={KANAN + 600} y={2240} teks="kartu terangkat 2,5D" ukuran={34} mulai={SUDAH} />
      <Tulis x={KANAN + 600} y={2290} teks="maks. 2–3 kali per video" ukuran={30} gaya="tipis" warna={k.biru} mulai={SUDAH} />

      {/* ===== 05 tata letak reels ===== */}
      <JudulBagian x={KIRI} y={2450} no="05" teks="Tata letak Reels" />
      <Telepon x={KIRI + 10} y={2530} s={0.205} />

      {/* ===== 06 suara merek ===== */}
      <JudulBagian x={KANAN} y={2450} no="06" teks="Suara merek" />
      {[
        { t: "Sapa \"kamu\", santai, satu ide per kalimat.", w: k.putih },
        { t: "Hook → jelaskan → umpama → efek → akibat", w: k.putih },
        { t: "   → solusi → CTA yang memancing komen.", w: k.putih },
        { t: "Angka selalu ada sumbernya. Contoh diberi label \"contoh\".", w: k.putih },
        { t: "✗  cuan, auto kaya, pasti untung, suruh beli produk", w: k.merah },
        { t: "CTA: \"Bunga berapa? Tulis angkanya di komen.\"", w: k.kuning },
      ].map((b, i) => (
        <Tulis key={i} x={KANAN} y={2550 + i * 56} teks={b.t} ukuran={36} warna={b.w} mulai={SUDAH} />
      ))}
      <Tulis x={KANAN} y={2905} teks="@intipdompet" ukuran={52} gaya="tebal" warna={k.kuning} mulai={SUDAH} />
    </LatarPapan>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- foto profil
export const FotoProfilPapan: React.FC = () => (
  <AbsoluteFill>
    <FilterKapur />
    <LatarPapan w={1080} h={1080} bingkai={0}>
      <SimbolKapur x={290} y={290} s={500} />
    </LatarPapan>
  </AbsoluteFill>
);
