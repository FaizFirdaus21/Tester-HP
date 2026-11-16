// Reels "Dua ratus ribu. Hilang per gram." (tayang 19 Nov 2026, 19.00, hook tipe A) — Papan Kapur v3 (TATA_V3).
// Naskah: produksi/20261119-emas-hilang-per-gram/naskah-vo.json (3 blok).
//   A hook: angka raksasa selisih, dicoret mulai frame 2, batang emas bergetar · B harga jual vs buyback + TANGGAL DATA (wajib terlihat)
//   · C aksi + CTA, akhir kembali ke hook (loop).
// HARGA DITAHAN (Orchestrator 15 Nov): Research memperbarui harga 18 Nov pagi. Ganti konstanta HARGA di bawah, sinkron ulang VO, baru render final.
//
// vo-waktu.json: VO_AMBANG_DB=-35 VO_JEDA_MIN=0.13 python3 scripts/sinkron_vo.py produksi/20261119-emas-hilang-per-gram src/produksi/emas-hilang-per-gram/vo-waktu.json
import React from "react";
import naskah from "../../../produksi/20261119-emas-hilang-per-gram/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, Tulis, TungguFont, garis, ukurLebar } from "../../papan/Komponen";
import { d, k } from "../../papan/tema";
import { BENDA } from "../../papan/ilustrasi";
import { BatangEmas } from "../../papan/ilustrasi/benda";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, Muncul, ReelsPapan, TATA_V31, buatReels } from "../../papan/reels";
import { useCurrentFrame } from "remotion";

// ---- data harga (fakta.json); ubah di sini saat harga diperbarui ----
const HARGA = { tanggal: "12 Nov 2026", jual: "Rp2,518 jt", buyback: "Rp2,316 jt", selisih: "Rp202 rb", hook: "200rb" };
// frasa VO tempat tiap elemen muncul (sesuaikan bila naskah berubah)
const FRASA = { tanggal: "Per dua belas November", jual: "dijual", buyback: "buyback", rugi: "kamu rugi" };

const R = buatReels(vo as DataVO, naskah, TATA_V31);
const { W } = R;
const C = { ...R.cta, x0: R.cta.x - 540 };
export const DURASI_EMAS_PER_GRAM = R.durasi;
const B_ = BENDA;
const SUDAH = -9999;

/** Batang emas yang bergetar singkat (frame 0–12) lalu diam. */
const EmasGetar: React.FC<{ cx: number; cy: number; s: number }> = ({ cx, cy, s }) => {
  const fr = useCurrentFrame();
  const g = fr < 12 ? Math.sin(fr * 2.2) * 10 * (1 - fr / 12) : 0;
  return <BatangEmas cx={cx + g} cy={cy} s={s} />;
};

const AngkaRaksasa: React.FC<{ x: number; y: number; teks: string; warna: string; maks?: number }> = ({ x, y, teks, warna, maks = 940 }) => {
  const u = Math.min(560, (560 * maks) / ukurLebar(teks, 560, "tebal"));
  return <Tulis x={x} y={y} teks={teks} ukuran={u} gaya="tebal" warna={warna} mulai={SUDAH} rata="center" tebalFilter />;
};

const IsiPapan: React.FC = () => (
  <TungguFont>
    {/* ===== A: hook ===== */}
    <Tulis x={A.x0 + 110} y={A.y0 + 420} teks="Rp" ukuran={150} gaya="tebal" warna={k.kuning} mulai={SUDAH} />
    <AngkaRaksasa x={A.x} y={A.y0 + 760} teks={HARGA.hook} warna={k.kuning} />
    <Coret pts={garis(A.x0 + 80, A.y0 + 760, A.x0 + 1000, A.y0 + 690, 3, 4)} mulai={2} lama={6} warna={k.merah} tebal={18} kapur={false} />
    <Tulis x={A.x} y={A.y0 + 960} teks="HILANG per gram" ukuran={120} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" tebalFilter />
    <EmasGetar cx={A.x} cy={A.y0 + 1130} s={300} />

    {/* ===== B: harga + tanggal data (tanggal wajib terbaca) ===== */}
    <Tulis x={B.x} y={B.y0 + 250} teks="emas Antam 1 gram" ukuran={84} gaya="tebal" mulai={R.tiba(1)} perHuruf={0.8} rata="center" />
    <Muncul mulai={R.tiba(1)}>
      <Tulis x={B.x} y={B.y0 + 350} teks={`Logam Mulia · ${HARGA.tanggal}`} ukuran={64} gaya="tebal" warna={k.biru} mulai={SUDAH} rata="center" />
    </Muncul>
    <Tulis x={B.x0 + 90} y={B.y0 + 560} teks="jual" ukuran={64} warna={k.kuning} mulai={W(1, FRASA.jual, -0.3)} perHuruf={1} />
    <Tulis x={B.x0 + 990} y={B.y0 + 560} teks={HARGA.jual} ukuran={96} gaya="tebal" warna={k.kuning} mulai={W(1, FRASA.jual, 0)} perHuruf={1} rata="right" />
    <Tulis x={B.x0 + 90} y={B.y0 + 720} teks="buyback" ukuran={64} warna={k.hijauTerang} mulai={W(1, FRASA.buyback, -0.3)} perHuruf={1} />
    <Tulis x={B.x0 + 990} y={B.y0 + 720} teks={HARGA.buyback} ukuran={96} gaya="tebal" warna={k.hijauTerang} mulai={W(1, FRASA.buyback, 0)} perHuruf={1} rata="right" />
    <Coret pts={garis(B.x0 + 120, B.y0 + 790, B.x0 + 960, B.y0 + 784, 6, 3)} mulai={W(1, FRASA.rugi, -0.8)} lama={8} tebal={6} kapur={false} />
    <Tulis x={B.x} y={B.y0 + 960} teks={`selisih ${HARGA.selisih}`} ukuran={124} gaya="tebal" warna={k.merah} mulai={W(1, FRASA.rugi, -0.5)} perHuruf={1} rata="center" tebalFilter />
    <Tulis x={B.x} y={B.y0 + 1080} teks="kalau beli lalu langsung jual" ukuran={60} warna={k.biru} mulai={W(1, "Beli lalu", -0.2)} perHuruf={0.8} rata="center" />

    {/* ===== C: aksi + CTA ===== */}
    <Tulis x={C.x} y={C.y0 + 260} teks="cek selisihnya dulu" ukuran={90} gaya="tebal" warna={k.kuning} mulai={R.tiba(2)} perHuruf={0.8} rata="center" />
    <Muncul mulai={R.tiba(2)}>
      <B_.emasTumpuk cx={C.x0 + 300} cy={C.y0 + 520} s={300} />
    </Muncul>
    <Tulis x={C.x0 + 720} y={C.y0 + 520} teks="jual − buyback" ukuran={66} gaya="tebal" mulai={W(2, "selisih jual", -0.2)} perHuruf={1} rata="center" />
    <Muncul mulai={W(2, "di tempatmu", -0.4)}>
      <B_.gelembung cx={C.x + 100} cy={C.y0 + 780} s={460} teks="Rp____" />
    </Muncul>
    <Tulis x={C.x} y={C.y0 + 990} teks="komen angkanya ↓" ukuran={90} gaya="hias" warna={k.kuning} mulai={W(2, "Komen", -0.2)} perHuruf={1.2} rata="center" />
    <Tulis x={C.x} y={C.y0 + 1110} teks="IntipDompet" ukuran={110} gaya="tebal" mulai={W(2, "IntipDompet", -0.1)} perHuruf={1.2} rata="center" />
    <Tulis x={C.x} y={C.y0 + 1190} teks="Biar dompetmu nggak kaget." ukuran={70} gaya="hias" warna={k.kuning} mulai={W(2, "Biar dompetmu", -0.1)} perHuruf={1} rata="center" />
  </TungguFont>
);

const TEKS_TAMPIL = naskah.blok.map((b) => b.teks.replace(/ IntipDompet\. Biar dompetmu nggak kaget\.$/, ""));

export const EmasPerGramReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);
