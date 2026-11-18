// Reels "Sembilan koma empat persen. Hilang saat dijual." (tayang 19 Nov 2026, 19.00, hook tipe A) — Papan Kapur v3.1 (TATA_V31, 4 blok).
// Naskah: produksi/20261119-emas-hilang-per-gram/naskah-vo.json (harga Logam Mulia 17 Nov 2026).
//   A hook: "9,4%" raksasa (tidak dibulatkan), emas kapur retak dalam 0,3 s · B fakta: jual / buyback / tanggal data → selisih
//   · C TIP: cek harga di logammulia.com + papan dua kolom (hilang saat dijual 9,4% → balik modal 10,4%) · D CTA, loop ke hook.
// Harga dan angka ada di konstanta HARGA; harga lengkap hanya tampil di layar (tidak diucapkan).
//
// vo-waktu.json: VO_AMBANG_DB=-35 VO_JEDA_MIN=0.13 python3 scripts/sinkron_vo.py produksi/20261119-emas-hilang-per-gram src/produksi/emas-hilang-per-gram/vo-waktu.json
import React from "react";
import { useCurrentFrame } from "remotion";
import naskah from "../../../produksi/20261119-emas-hilang-per-gram/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, Panah, Tulis, TungguFont, garis, ukurLebar } from "../../papan/Komponen";
import { k } from "../../papan/tema";
import { BENDA, Bentuk } from "../../papan/ilustrasi";
import { BatangEmas } from "../../papan/ilustrasi/benda";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, C, Langkah, Muncul, ReelsPapan, TATA_V31, buatReels, persegi } from "../../papan/reels";

// ---- data (fakta.json, Logam Mulia 17 Nov 2026) ----
const HARGA = {
  tanggal: "17 Nov 2026",
  jual: "Rp2.515.000",
  buyback: "Rp2.278.000",
  selisih: "Rp237.000",
  hook: "9,4%",
  kiri: { judul: "HILANG SAAT DIJUAL", rumus: "Rp237 rb ÷ Rp2,515 jt", hasil: "9,4%" },
  kanan: { judul: "BALIK MODAL", rumus: "Rp237 rb ÷ Rp2,278 jt", hasil: "10,4%" },
};

const R = buatReels(vo as DataVO, naskah, TATA_V31);
const { W } = R;
const D = { ...R.cta, x0: R.cta.x - 540 };
export const DURASI_EMAS_PER_GRAM = R.durasi;
const B_ = BENDA;
const SUDAH = -9999;

/** Batang emas yang retak: garis retak merah tergambar frame 2–9, batang bergetar sesaat. */
const EmasRetak: React.FC<{ cx: number; cy: number; s: number }> = ({ cx, cy, s }) => {
  const fr = useCurrentFrame();
  const g = fr < 12 ? Math.sin(fr * 2.2) * 8 * (1 - fr / 12) : 0;
  return (
    <>
      <BatangEmas cx={cx + g} cy={cy} s={s} />
      <Coret pts={[[cx - s * 0.05 + g, cy - s * 0.24], [cx + s * 0.04 + g, cy - s * 0.08], [cx - s * 0.06 + g, cy + s * 0.04], [cx + s * 0.05 + g, cy + s * 0.2]]} mulai={2} lama={7} warna={k.merah} tebal={9} kapur={false} />
    </>
  );
};

/** Satu kolom rumus pada papan tips. */
const Kolom: React.FC<{ x: number; y: number; judul: string; rumus: string; hasil: string; warna: string; mulai: number }> = ({ x, y, judul, rumus, hasil, warna, mulai }) => (
  <>
    <Muncul mulai={mulai}>
      <Bentuk pts={persegi(x - 215, y - 70, 430, 470)} warna={warna} garis={warna} isi={0.1} tebal={5} />
    </Muncul>
    <Tulis x={x} y={y} teks={judul} ukuran={Math.min(46, (390 * 46) / ukurLebar(judul, 46, "tebal"))} gaya="tebal" warna={warna} mulai={mulai} perHuruf={0.6} rata="center" />
    <Tulis x={x} y={y + 110} teks={rumus} ukuran={Math.min(44, (390 * 44) / ukurLebar(rumus, 44, "tangan"))} mulai={mulai + 6} perHuruf={0.5} rata="center" />
    <Tulis x={x} y={y + 290} teks={`= ${hasil}`} ukuran={Math.min(110, (380 * 110) / ukurLebar(`= ${hasil}`, 110, "tebal"))} gaya="tebal" warna={warna} mulai={mulai + 12} perHuruf={1.4} rata="center" tebalFilter />
  </>
);

const IsiPapan: React.FC = () => {
  const u = Math.min(480, (480 * 880) / ukurLebar(HARGA.hook, 480, "tebal"));
  return (
    <TungguFont>
      {/* ===== A: hook — "9,4%" raksasa utuh di frame 0 ===== */}
      <Tulis x={A.x} y={A.y0 + 260} teks="emas 1 gram" ukuran={96} gaya="tebal" mulai={SUDAH} rata="center" />
      <Tulis x={A.x} y={A.y0 + 700} teks={HARGA.hook} ukuran={u} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" tebalFilter />
      <Tulis x={A.x} y={A.y0 + 950} teks="hilang saat dijual" ukuran={104} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" tebalFilter />
      <EmasRetak cx={A.x} cy={A.y0 + 1130} s={280} />

      {/* ===== B: fakta — tanggal data wajib terbaca ===== */}
      <Tulis x={B.x} y={B.y0 + 250} teks="emas Antam 1 gram" ukuran={84} gaya="tebal" mulai={R.tiba(1)} perHuruf={0.8} rata="center" />
      <Muncul mulai={R.tiba(1)}>
        <Tulis x={B.x} y={B.y0 + 350} teks={`Logam Mulia · ${HARGA.tanggal}`} ukuran={64} gaya="tebal" warna={k.biru} mulai={SUDAH} rata="center" />
      </Muncul>
      <Tulis x={B.x0 + 90} y={B.y0 + 560} teks="jual" ukuran={64} warna={k.kuning} mulai={W(1, "selisih harga jual", -0.3)} perHuruf={1} />
      <Tulis x={B.x0 + 990} y={B.y0 + 560} teks={HARGA.jual} ukuran={92} gaya="tebal" warna={k.kuning} mulai={W(1, "selisih harga jual", 0)} perHuruf={0.8} rata="right" />
      <Tulis x={B.x0 + 90} y={B.y0 + 720} teks="buyback" ukuran={64} warna={k.hijauTerang} mulai={W(1, "buyback", -0.3)} perHuruf={1} />
      <Tulis x={B.x0 + 990} y={B.y0 + 720} teks={HARGA.buyback} ukuran={92} gaya="tebal" warna={k.hijauTerang} mulai={W(1, "buyback", 0)} perHuruf={0.8} rata="right" />
      <Coret pts={garis(B.x0 + 120, B.y0 + 790, B.x0 + 960, B.y0 + 784, 6, 3)} mulai={W(1, "dua ratus tiga puluh", -0.8)} lama={8} tebal={6} kapur={false} />
      <Panah x1={B.x0 + 160} y1={B.y0 + 800} x2={B.x0 + 260} y2={B.y0 + 920} tinggi={24} mulai={W(1, "dua ratus tiga puluh", -0.6)} lama={6} warna={k.merah} tebal={6} />
      <Tulis x={B.x} y={B.y0 + 960} teks={`selisih ${HARGA.selisih}`} ukuran={104} gaya="tebal" warna={k.merah} mulai={W(1, "dua ratus tiga puluh", -0.5)} perHuruf={0.9} rata="center" tebalFilter />
      <Tulis x={B.x} y={B.y0 + 1070} teks="per gram" ukuran={60} warna={k.biru} mulai={W(1, "per gram", -0.3)} perHuruf={1} rata="center" />

      {/* ===== C: TIP — cek harga + papan dua kolom ===== */}
      <Tulis x={C.x} y={C.y0 + 220} teks="Triknya:" ukuran={92} gaya="hias" warna={k.kuning} mulai={R.tiba(2)} perHuruf={1} rata="center" />
      <Langkah x0={C.x0} n={1} y={C.y0 + 380} judul="cek harga jual & buyback" kecil="di logammulia.com" mulai={R.tiba(2)} />
      <Kolom x={C.x0 + 290} y={C.y0 + 640} {...HARGA.kiri} warna={k.merah} mulai={W(2, "Sembilan koma empat", -0.3)} />
      <Panah x1={C.x0 + 508} y1={C.y0 + 860} x2={C.x0 + 572} y2={C.y0 + 860} tinggi={20} mulai={W(2, "Supaya balik modal", -0.3)} lama={6} tebal={6} />
      <Kolom x={C.x0 + 790} y={C.y0 + 640} {...HARGA.kanan} warna={k.hijauTerang} mulai={W(2, "Supaya balik modal", -0.1)} />

      {/* ===== D: CTA ===== */}
      <Tulis x={D.x} y={D.y0 + 280} teks="cek buyback sebelum beli?" ukuran={74} gaya="tebal" mulai={R.tiba(3)} perHuruf={0.6} rata="center" />
      <Muncul mulai={R.tiba(3)}>
        <B_.gelembung cx={D.x + 80} cy={D.y0 + 540} s={480} teks="ya / nggak" />
      </Muncul>
      <Tulis x={D.x} y={D.y0 + 790} teks="komen ↓" ukuran={110} gaya="hias" warna={k.kuning} mulai={W(3, "Komen", -0.2)} perHuruf={1.4} rata="center" />
      <Tulis x={D.x} y={D.y0 + 980} teks="IntipDompet" ukuran={130} gaya="tebal" mulai={W(3, "IntipDompet", -0.1)} perHuruf={1.2} rata="center" />
      <Tulis x={D.x} y={D.y0 + 1080} teks="Biar dompetmu nggak kaget." ukuran={66} gaya="hias" warna={k.kuning} mulai={W(3, "Biar dompetmu", -0.1)} perHuruf={1} rata="center" />
      <Tulis x={D.x} y={D.y0 + 1170} teks={`konten edukasi · harga Logam Mulia ${HARGA.tanggal}`} ukuran={36} gaya="tipis" warna={k.biru} mulai={W(3, "IntipDompet", 0.3)} perHuruf={0.4} rata="center" />
    </TungguFont>
  );
};

const TEKS_TAMPIL = [
  "9,4%. Hilang saat dijual.",
  "Per 17 November, selisih harga jual dan buyback emas Antam Rp237 ribu per gram.",
  "Triknya: cek dua harga di situs Logam Mulia. 9,4% itu yang hilang saat dijual. Supaya balik modal, buyback harus naik 10,4% dulu.",
  "Kamu cek buyback sebelum beli? Komen ya atau nggak.",
];

export const EmasPerGramReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);
