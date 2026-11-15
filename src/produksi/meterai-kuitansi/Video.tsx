// Reels "Sepuluh ribu. Sering kebuang percuma." (tayang 19 Nov 2026, 12.00) — Papan Kapur v3.1 (TATA_V31, 4 blok).
// Naskah: produksi/20261119-meterai-kuitansi/naskah-vo.json.
//   A hook: "Rp" kecil + "10.000" raksasa, dicoret mulai frame 2, meterai jatuh ke tempat sampah · B fakta: garis bilangan Rp5 jt (UU 10/2020)
//   · C TIP: tiga langkah bernomor, tiap langkah tertahan ≥ 2,5 s · D CTA, akhir kembali ke hook (loop).
//
// vo-waktu.json: VO_AMBANG_DB=-35 VO_JEDA_MIN=0.13 python3 scripts/sinkron_vo.py produksi/20261119-meterai-kuitansi src/produksi/meterai-kuitansi/vo-waktu.json
import React from "react";
import { useCurrentFrame } from "remotion";
import naskah from "../../../produksi/20261119-meterai-kuitansi/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, Panah, Tulis, TungguFont, garis, lingkaran, p01, ukurLebar } from "../../papan/Komponen";
import { d, k } from "../../papan/tema";
import { BENDA, Bentuk } from "../../papan/ilustrasi";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, C, Muncul, ReelsPapan, TATA_V31, buatReels, centang, persegi } from "../../papan/reels";

const R = buatReels(vo as DataVO, naskah, TATA_V31);
const { W } = R;
const D = { ...R.cta, x0: R.cta.x - 540 };
export const DURASI_METERAI = R.durasi;
const B_ = BENDA;
const SUDAH = -9999;

/** Prangko meterai kapur (persegi merah bergerigi tipis) dengan nilai di tengah. */
const Meterai: React.FC<{ x: number; y: number; w?: number; nilai: string }> = ({ x, y, w = 220, nilai }) => {
  const h = w * 0.7;
  return (
    <>
      <Bentuk pts={persegi(x - w / 2, y - h / 2, w, h)} warna={k.merah} garis={k.putih} isi={0.32} tebal={5} />
      <Tulis x={x} y={y - h * 0.12} teks="METERAI" ukuran={w * 0.16} gaya="tebal" mulai={SUDAH} rata="center" />
      <Tulis x={x} y={y + h * 0.3} teks={nilai} ukuran={Math.min(w * 0.28, (w * 0.85) / (nilai.length * 0.55))} gaya="tebal" mulai={SUDAH} rata="center" />
    </>
  );
};

/** Meterai yang jatuh ke tempat sampah antara frame `mulai` dan `mulai + lama`. */
const MeteraiJatuh: React.FC<{ x: number; y0: number; y1: number; mulai: number; lama: number }> = ({ x, y0, y1, mulai, lama }) => {
  const fr = useCurrentFrame();
  const p = p01(fr, mulai, lama);
  const y = y0 + (y1 - y0) * p * p;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${p * 25}deg)`, transformOrigin: `${x}px ${y}px`, opacity: 1 - p * 0.35 }}>
      <Meterai x={x} y={y} w={190} nilai="10.000" />
    </div>
  );
};

const AngkaRaksasa: React.FC<{ x: number; y: number; teks: string; warna: string; maks?: number }> = ({ x, y, teks, warna, maks = 920 }) => {
  const u = Math.min(560, (560 * maks) / ukurLebar(teks, 560, "tebal"));
  return <Tulis x={x} y={y} teks={teks} ukuran={u} gaya="tebal" warna={warna} mulai={SUDAH} rata="center" tebalFilter />;
};

/** Satu langkah tips: nomor bulat + baris judul + baris kecil; muncul pada frame `mulai`. */
const Langkah: React.FC<{ n: number; y: number; judul: string; kecil: string; mulai: number; warnaKecil?: string }> = ({ n, y, judul, kecil, mulai, warnaKecil = k.biru }) => (
  <>
    <Coret pts={lingkaran(C.x0 + 120, y - 20, 50, 50, n)} mulai={mulai} lama={8} warna={k.kuning} tebal={6} />
    <Tulis x={C.x0 + 120} y={y + 5} teks={String(n)} ukuran={70} gaya="tebal" warna={k.kuning} mulai={mulai} perHuruf={2} rata="center" />
    <Tulis x={C.x0 + 200} y={y - 10} teks={judul} ukuran={64} gaya="tebal" mulai={mulai + 4} perHuruf={0.7} />
    <Tulis x={C.x0 + 200} y={y + 75} teks={kecil} ukuran={Math.min(54, (820 * 54) / ukurLebar(kecil, 54, "tangan"))} warna={warnaKecil} mulai={mulai + 12} perHuruf={0.5} />
  </>
);

const IsiPapan: React.FC = () => (
  <TungguFont>
    {/* ===== A: hook — "Rp" kecil + "10.000" raksasa, coretan mulai frame 2, meterai jatuh ke tempat sampah ===== */}
    <Tulis x={A.x0 + 110} y={A.y0 + 420} teks="Rp" ukuran={150} gaya="tebal" warna={k.kuning} mulai={SUDAH} />
    <AngkaRaksasa x={A.x} y={A.y0 + 760} teks="10.000" warna={k.kuning} maks={860} />
    <Coret pts={garis(A.x0 + 70, A.y0 + 720, A.x0 + 1010, A.y0 + 650, 3, 4)} mulai={2} lama={6} warna={k.merah} tebal={18} kapur={false} />
    <Tulis x={A.x} y={A.y0 + 950} teks="sering kebuang" ukuran={120} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" tebalFilter />
    <MeteraiJatuh x={A.x0 + 330} y0={A.y0 + 1100} y1={A.y0 + 1210} mulai={3} lama={12} />
    <B_.ember cx={A.x0 + 720} cy={A.y0 + 1180} s={200} />
    <Panah x1={A.x0 + 450} y1={A.y0 + 1160} x2={A.x0 + 600} y2={A.y0 + 1180} tinggi={24} mulai={SUDAH} lama={1} warna={k.merah} tebal={6} />

    {/* ===== B: fakta (tahan ≥ 2,5 s) ===== */}
    <Tulis x={B.x} y={B.y0 + 250} teks="meterai wajib kalau…" ukuran={84} gaya="tebal" mulai={R.tiba(1)} perHuruf={0.8} rata="center" />
    <Coret pts={garis(B.x0 + 80, B.y0 + 640, B.x0 + 960, B.y0 + 640, 5, 2)} mulai={R.tiba(1)} lama={8} tebal={7} />
    <Panah x1={B.x0 + 880} y1={B.y0 + 640} x2={B.x0 + 990} y2={B.y0 + 640} tinggi={30} mulai={R.tiba(1) + 6} lama={4} tebal={7} />
    <Coret pts={garis(B.x, B.y0 + 580, B.x, B.y0 + 700, 6, 1)} mulai={W(1, "di atas lima juta", -0.4)} lama={6} warna={k.kuning} tebal={9} />
    <Tulis x={B.x} y={B.y0 + 780} teks="Rp5 jt" ukuran={84} gaya="tebal" warna={k.kuning} mulai={W(1, "di atas lima juta", -0.3)} perHuruf={1.4} rata="center" />
    <Tulis x={B.x0 + 790} y={B.y0 + 520} teks="> Rp5 jt" ukuran={72} gaya="tebal" mulai={W(1, "di atas lima juta", 0)} perHuruf={1} rata="center" />
    <Meterai x={B.x0 + 790} y={B.y0 + 390} w={170} nilai="10.000" />
    <Tulis x={B.x0 + 290} y={B.y0 + 520} teks="≤ Rp5 jt" ukuran={72} gaya="tebal" warna={k.hijauTerang} mulai={W(1, "Pas lima juta", -0.3)} perHuruf={1} rata="center" />
    <Tulis x={B.x0 + 290} y={B.y0 + 420} teks="belum wajib" ukuran={60} warna={k.hijauTerang} mulai={W(1, "belum wajib", -0.3)} perHuruf={1} rata="center" />
    <Tulis x={B.x} y={B.y0 + 1000} teks="pas Rp5.000.000 pun" ukuran={78} gaya="tebal" mulai={W(1, "Pas lima juta", -0.1)} perHuruf={0.8} rata="center" />
    <Tulis x={B.x} y={B.y0 + 1110} teks="belum wajib" ukuran={96} gaya="tebal" warna={k.hijauTerang} mulai={W(1, "belum wajib", -0.2)} perHuruf={1} rata="center" tebalFilter />
    <Tulis x={B.x} y={B.y0 + 1200} teks="UU 10/2020" ukuran={44} gaya="tipis" warna={k.biru} mulai={R.tiba(1)} perHuruf={0.8} rata="center" />

    {/* ===== C: TIP — tiga langkah, tiap langkah tertahan ≥ 2,5 s ===== */}
    <Tulis x={C.x} y={C.y0 + 230} teks="Biar nggak ketipu:" ukuran={88} gaya="hias" warna={k.kuning} mulai={R.tiba(2)} perHuruf={0.8} rata="center" />
    <Langkah n={1} y={C.y0 + 420} judul="beli di e-meterai.co.id" kecil="resmi Peruri · jangan < Rp10.000" mulai={R.tiba(2)} />
    <Langkah n={2} y={C.y0 + 700} judul="cek keaslian:" kecil="verification.peruri.co.id → unggah PDF" mulai={W(2, "Cek keasliannya", -0.3)} />
    <Langkah n={3} y={C.y0 + 980} judul="meterai Rp3.000 / Rp6.000" kecil="nggak berlaku sejak 2022" mulai={W(2, "Satu lagi", -0.2)} warnaKecil={k.merah} />
    <Muncul mulai={W(2, "Satu lagi", 0.2)}>
      <Meterai x={C.x0 + 860} y={C.y0 + 1150} w={150} nilai="6000" />
    </Muncul>
    <Coret pts={garis(C.x0 + 780, C.y0 + 1200, C.x0 + 940, C.y0 + 1100, 7, 3)} mulai={W(2, "sudah nggak berlaku", -0.2)} lama={8} warna={k.merah} tebal={9} />

    {/* ===== D: CTA ===== */}
    <Tulis x={D.x} y={D.y0 + 280} teks="masih simpan meterai lama?" ukuran={70} gaya="tebal" mulai={R.tiba(3)} perHuruf={0.6} rata="center" />
    <Muncul mulai={R.tiba(3)}>
      <B_.gelembung cx={D.x + 80} cy={D.y0 + 540} s={480} teks="ya / nggak" />
    </Muncul>
    <Tulis x={D.x} y={D.y0 + 790} teks="komen ↓" ukuran={110} gaya="hias" warna={k.kuning} mulai={W(3, "Komen", -0.2)} perHuruf={1.4} rata="center" />
    <Tulis x={D.x} y={D.y0 + 980} teks="IntipDompet" ukuran={130} gaya="tebal" mulai={W(3, "IntipDompet", -0.1)} perHuruf={1.2} rata="center" />
    <Tulis x={D.x} y={D.y0 + 1080} teks="Biar dompetmu nggak kaget." ukuran={66} gaya="hias" warna={k.kuning} mulai={W(3, "Biar dompetmu", -0.1)} perHuruf={1} rata="center" />
    <Tulis x={D.x} y={D.y0 + 1170} teks="konten edukasi · UU 10/2020, PMK 133/2021, Peruri" ukuran={34} gaya="tipis" warna={k.biru} mulai={W(3, "IntipDompet", 0.3)} perHuruf={0.4} rata="center" />
  </TungguFont>
);

const TEKS_TAMPIL = [
  "Rp10.000. Sering kebuang percuma.",
  "Meterai cuma wajib di kuitansi di atas Rp5 juta. Pas Rp5 juta pun belum wajib.",
  "Beli e-meterai hanya di situs resmi Peruri, jangan yang di bawah Rp10.000. Cek keasliannya dengan mengunggah PDF ke situs verifikasi Peruri. Satu lagi, meterai lama Rp3.000 dan Rp6.000 sudah nggak berlaku.",
  "Masih simpan meterai lama? Komen ya atau nggak.",
];

export const MeteraiReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);
