// UJI template Reels v3 (TATA_V3) — TIDAK UNTUK TAYANG.
// Memakai VO BI-FAST (produksi/20261117-biaya-transfer-bifast) blok 0, 1, dan 3 sebagai 3 blok v3:
//   A hook angka raksasa · B fakta + efek · C aksi + CTA. Tujuan: menguji frame 0, ritme 1,5–2 s, kamera 0,4 s, SFX, loop.
import React from "react";
import naskahPenuh from "../../../produksi/20261117-biaya-transfer-bifast/naskah-vo.json";
import voPenuh from "../biaya-transfer-bifast/vo-waktu.json";
import { Coret, Tulis, TungguFont, garis, lingkaran, ukurLebar } from "../../papan/Komponen";
import { d, k } from "../../papan/tema";
import { BENDA } from "../../papan/ilustrasi";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, Muncul, ReelsPapan, TATA_V3, buatReels, centang } from "../../papan/reels";

const PAKAI = [0, 1, 3];
const naskah = { ...naskahPenuh, blok: PAKAI.map((i) => naskahPenuh.blok[i]) };
const vo = { ...(voPenuh as DataVO), blok: PAKAI.map((i) => (voPenuh as DataVO).blok[i]) };
const R = buatReels(vo, naskah, TATA_V3);
const { W } = R;
const C = { ...R.cta, x0: R.cta.x - 540 };
export const DURASI_UJI_V3 = R.durasi;
const B_ = BENDA;
const SUDAH = -9999;

/** Angka raksasa: setinggi ±1/3 layar, dikecilkan otomatis bila lebih lebar dari `maks`. */
const AngkaRaksasa: React.FC<{ x: number; y: number; teks: string; warna: string; maks?: number }> = ({ x, y, teks, warna, maks = 1000 }) => {
  const u = Math.min(520, (520 * maks) / ukurLebar(teks, 520, "tebal"));
  return <Tulis x={x} y={y} teks={teks} ukuran={u} gaya="tebal" warna={warna} mulai={SUDAH} rata="center" tebalFilter />;
};

const IsiPapan: React.FC = () => (
  <TungguFont>
    {/* ===== A: hook — angka raksasa utuh di frame 0, coretan merah mulai frame 2 (gerak < 0,3 s) ===== */}
    <Tulis x={A.x} y={A.y0 + 300} teks="tiap transfer beda bank" ukuran={72} gaya="tebal" mulai={SUDAH} rata="center" />
    <Tulis x={A.x0 + 120} y={A.y0 + 470} teks="Rp" ukuran={150} gaya="tebal" warna={k.kuning} mulai={SUDAH} />
    <AngkaRaksasa x={A.x} y={A.y0 + 800} teks="6.500" warna={k.kuning} maks={920} />
    <Coret pts={garis(A.x0 + 90, A.y0 + 820, A.x0 + 990, A.y0 + 760, 3, 4)} mulai={2} lama={6} warna={k.merah} tebal={18} kapur={false} />
    <Tulis x={A.x} y={A.y0 + 1010} teks="KEPOTONG" ukuran={150} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" tebalFilter />
    <Muncul mulai={d(0.5)}>
      <B_.koin cx={A.x0 + 200} cy={A.y0 + 1150} s={190} />
    </Muncul>
    <Muncul mulai={d(0.8)}>
      <B_.koin cx={A.x0 + 880} cy={A.y0 + 1150} s={190} />
    </Muncul>

    {/* ===== B: fakta + efek — elemen pertama ikut judul, lalu 1 elemen tiap ±1,5–2 s ===== */}
    <Tulis x={B.x} y={B.y0 + 260} teks="transfer online biasa" ukuran={80} gaya="tebal" mulai={R.tiba(1)} perHuruf={0.8} rata="center" />
    <Muncul mulai={R.tiba(1)}>
      <B_.label cx={B.x} cy={B.y0 + 460} s={420} teks="Rp6.500" warna={k.merah} miring={-5} />
    </Muncul>
    <Tulis x={B.x} y={B.y0 + 650} teks="padahal lewat BI-FAST" ukuran={72} warna={k.biru} mulai={W(1, "Padahal", -0.2)} perHuruf={0.8} rata="center" />
    <Muncul mulai={W(1, "Bank Indonesia", -0.4)}>
      <B_.bank cx={B.x0 + 230} cy={B.y0 + 880} s={220} teks="BI" />
    </Muncul>
    <Tulis x={B.x0 + 640} y={B.y0 + 900} teks="dibatasi BI" ukuran={72} gaya="tebal" mulai={W(1, "membatasi", -0.3)} perHuruf={1} rata="center" />
    <Tulis x={B.x} y={B.y0 + 1110} teks="maks. Rp2.500" ukuran={118} gaya="tebal" warna={k.kuning} mulai={W(1, "maksimal", -0.4)} perHuruf={1.2} rata="center" tebalFilter />
    <Coret pts={lingkaran(B.x, B.y0 + 1070, 430, 110, 5)} mulai={W(1, "dua ribu lima ratus", 0)} lama={10} warna={k.kuning} tebal={7} />

    {/* ===== C: aksi + CTA ===== */}
    <Tulis x={C.x} y={C.y0 + 260} teks="sebelum transfer:" ukuran={84} gaya="tebal" warna={k.kuning} mulai={R.tiba(2)} perHuruf={0.8} rata="center" />
    <Muncul mulai={R.tiba(2)}>
      <B_.hp cx={C.x0 + 250} cy={C.y0 + 600} s={380} teks="m-banking" />
    </Muncul>
    <Muncul mulai={W(2, "be i fast", -0.4)}>
      <B_.label cx={C.x0 + 720} cy={C.y0 + 560} s={360} teks="pilih BI-FAST" warna={k.kuning} />
    </Muncul>
    <Coret pts={centang(C.x0 + 680, C.y0 + 700, 1.3)} mulai={W(2, "kalau tersedia", -0.2)} lama={8} warna={k.hijauTerang} tebal={11} />
    <Tulis x={C.x} y={C.y0 + 960} teks="cek daftar biaya bankmu" ukuran={72} gaya="tebal" mulai={W(2, "Cek juga", -0.2)} perHuruf={0.8} rata="center" />
    <Tulis x={C.x} y={C.y0 + 1120} teks="biaya bankmu? komen ↓" ukuran={80} gaya="hias" warna={k.kuning} mulai={W(2, "aplikasi bankmu", 0)} perHuruf={0.8} rata="center" />
  </TungguFont>
);

const TEKS_TAMPIL = [
  "Transfer kepotong Rp6.500.",
  "Itu tarif transfer online biasa di sejumlah bank. Padahal lewat BI-FAST, Bank Indonesia membatasi biayanya maksimal Rp2.500.",
  "Sebelum transfer, pilih menu BI-FAST kalau tersedia. Cek juga daftar biaya di aplikasi bankmu.",
];

export const UjiV3Reels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);
