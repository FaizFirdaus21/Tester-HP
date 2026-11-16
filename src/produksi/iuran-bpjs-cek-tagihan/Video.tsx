// Reels "Tiga puluh lima ribu. Iuran BPJS." (tayang 20 Nov 2026, 19.00, hook tipe D) — Papan Kapur v3.1 (TATA_V31, 4 blok).
// Naskah: produksi/20261120-iuran-bpjs-cek-tagihan/naskah-vo.json.
//   A hook: "35" raksasa + "rb" kecil, kartu BPJS "kelas 3" muncul dalam 0,3 s · B fakta: 3 label harga (tahan ≥ 2,5 s)
//   · C TIP: HP Mobile JKN + 2 menu bernomor + rumah sakit "!" · D CTA, akhir kembali ke hook (loop).
//
// vo-waktu.json: VO_AMBANG_DB=-35 VO_JEDA_MIN=0.13 python3 scripts/sinkron_vo.py produksi/20261120-iuran-bpjs-cek-tagihan src/produksi/iuran-bpjs-cek-tagihan/vo-waktu.json
import React from "react";
import naskah from "../../../produksi/20261120-iuran-bpjs-cek-tagihan/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, Tulis, TungguFont, lingkaran, ukurLebar } from "../../papan/Komponen";
import { k } from "../../papan/tema";
import { BENDA, Bentuk } from "../../papan/ilustrasi";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, C, Langkah, Muncul, ReelsPapan, TATA_V31, buatReels, persegi } from "../../papan/reels";

const R = buatReels(vo as DataVO, naskah, TATA_V31);
const { W } = R;
const D = { ...R.cta, x0: R.cta.x - 540 };
export const DURASI_BPJS_TAGIHAN = R.durasi;
const B_ = BENDA;
const SUDAH = -9999;

/** Kartu peserta kapur (hijau) dengan tulisan BPJS dan label kelas. */
const KartuBpjs: React.FC<{ x: number; y: number; kelas: string }> = ({ x, y, kelas }) => (
  <>
    <Bentuk pts={persegi(x - 230, y - 130, 460, 260)} warna={k.hijauTerang} garis={k.putih} isi={0.25} tebal={6} />
    <Tulis x={x - 200} y={y - 50} teks="BPJS Kesehatan" ukuran={48} gaya="tebal" mulai={SUDAH} />
    <Tulis x={x - 200} y={y + 20} teks="•••• •••• 1234" ukuran={40} warna={k.biru} mulai={SUDAH} />
    <Tulis x={x + 200} y={y + 95} teks={kelas} ukuran={56} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="right" />
  </>
);

/** Rumah sakit kapur sederhana: gedung + palang. */
const RumahSakit: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <>
    <Bentuk pts={persegi(x - 110, y - 90, 220, 180)} warna={k.putih} isi={0.08} tebal={5} />
    <Bentuk pts={persegi(x - 18, y - 70, 36, 90)} warna={k.merah} garis={k.merah} isi={0.7} tebal={3} />
    <Bentuk pts={persegi(x - 45, y - 43, 90, 36)} warna={k.merah} garis={k.merah} isi={0.7} tebal={3} />
  </>
);

const IsiPapan: React.FC = () => {
  const u = Math.min(560, (560 * 560) / ukurLebar("35", 560, "tebal"));
  return (
    <TungguFont>
      {/* ===== A: hook — "35" raksasa + "rb", kartu BPJS kelas 3 muncul dalam 0,3 s ===== */}
      <Tulis x={A.x} y={A.y0 + 250} teks="iuran BPJS / orang / bulan" ukuran={66} gaya="tebal" mulai={SUDAH} rata="center" />
      <Tulis x={A.x0 + 120} y={A.y0 + 700} teks="Rp" ukuran={140} gaya="tebal" warna={k.kuning} mulai={SUDAH} />
      <Tulis x={A.x} y={A.y0 + 760} teks="35" ukuran={u} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" tebalFilter />
      <Tulis x={A.x0 + 830} y={A.y0 + 760} teks="rb" ukuran={150} gaya="tebal" warna={k.kuning} mulai={SUDAH} />
      <Muncul mulai={2}>
        <KartuBpjs x={A.x} y={A.y0 + 1020} kelas="kelas 3" />
      </Muncul>

      {/* ===== B: fakta — tiga label harga ===== */}
      <Tulis x={B.x} y={B.y0 + 250} teks="peserta mandiri" ukuran={88} gaya="tebal" mulai={R.tiba(1)} perHuruf={0.8} rata="center" />
      <Tulis x={B.x} y={B.y0 + 340} teks="per orang per bulan" ukuran={56} warna={k.biru} mulai={R.tiba(1)} perHuruf={0.8} rata="center" />
      <Muncul mulai={R.tiba(1)}>
        <B_.label cx={B.x} cy={B.y0 + 520} s={520} teks="K1 Rp150 rb" warna={k.kuning} />
      </Muncul>
      <Muncul mulai={W(1, "kelas dua", -0.3)}>
        <B_.label cx={B.x} cy={B.y0 + 760} s={520} teks="K2 Rp100 rb" warna={k.biru} />
      </Muncul>
      <Muncul mulai={W(1, "kelas tiga", -0.3)}>
        <B_.label cx={B.x} cy={B.y0 + 1000} s={520} teks="K3 Rp35 rb" warna={k.hijauTerang} />
      </Muncul>
      <Coret pts={lingkaran(B.x + 30, B.y0 + 1000, 300, 110, 4)} mulai={W(1, "tiga puluh lima", -0.2)} lama={10} warna={k.kuning} tebal={6} />

      {/* ===== C: TIP — Mobile JKN, dua menu bernomor ===== */}
      <Tulis x={C.x} y={C.y0 + 230} teks="Triknya: buka Mobile JKN" ukuran={78} gaya="hias" warna={k.kuning} mulai={R.tiba(2)} perHuruf={0.7} rata="center" />
      <Langkah x0={C.x0} n={1} y={C.y0 + 430} judul="menu Info Iuran" kecil="→ cek tagihan" mulai={R.tiba(2)} />
      <Langkah x0={C.x0} n={2} y={C.y0 + 710} judul="menu Info Peserta" kecil="→ cek status aktif" mulai={W(2, "Info Peserta", -0.3)} warnaKecil={k.hijauTerang} />
      <Muncul mulai={W(2, "Cek sekarang", -0.3)}>
        <RumahSakit x={C.x0 + 300} y={C.y0 + 1030} />
      </Muncul>
      <Tulis x={C.x0 + 430} y={C.y0 + 1050} teks="!" ukuran={140} gaya="tebal" warna={k.merah} mulai={W(2, "Cek sekarang", -0.1)} perHuruf={2} />
      <Tulis x={C.x0 + 720} y={C.y0 + 1010} teks="cek sekarang," ukuran={58} gaya="tebal" mulai={W(2, "Cek sekarang", 0)} perHuruf={0.8} rata="center" />
      <Tulis x={C.x0 + 720} y={C.y0 + 1080} teks="bukan di RS" ukuran={58} gaya="tebal" warna={k.merah} mulai={W(2, "jangan tunggu", -0.2, 12)} perHuruf={0.6} rata="center" />

      {/* ===== D: CTA ===== */}
      <Tulis x={D.x} y={D.y0 + 280} teks="keluargamu kelas berapa?" ukuran={72} gaya="tebal" mulai={R.tiba(3)} perHuruf={0.6} rata="center" />
      <Muncul mulai={R.tiba(3)}>
        <B_.gelembung cx={D.x + 80} cy={D.y0 + 540} s={480} teks="kelas __" />
      </Muncul>
      <Tulis x={D.x} y={D.y0 + 790} teks="komen angkanya ↓" ukuran={96} gaya="hias" warna={k.kuning} mulai={W(3, "Komen", -0.2)} perHuruf={1.2} rata="center" />
      <Tulis x={D.x} y={D.y0 + 980} teks="IntipDompet" ukuran={130} gaya="tebal" mulai={W(3, "IntipDompet", -0.1)} perHuruf={1.2} rata="center" />
      <Tulis x={D.x} y={D.y0 + 1080} teks="Biar dompetmu nggak kaget." ukuran={66} gaya="hias" warna={k.kuning} mulai={W(3, "Biar dompetmu", -0.1)} perHuruf={1} rata="center" />
      <Tulis x={D.x} y={D.y0 + 1170} teks="konten edukasi · iuran: Perpres 64/2020 · BPJS Kesehatan" ukuran={34} gaya="tipis" warna={k.biru} mulai={W(3, "IntipDompet", 0.3)} perHuruf={0.4} rata="center" />
    </TungguFont>
  );
};

const TEKS_TAMPIL = [
  "Rp35 ribu. Iuran BPJS.",
  "Peserta mandiri bayar per orang: kelas 1 Rp150 ribu, kelas 2 Rp100 ribu, kelas 3 Rp35 ribu.",
  "Triknya, buka Mobile JKN. Menu Info Iuran untuk tagihan, Info Peserta untuk cek status aktif. Cek sekarang, jangan tunggu di rumah sakit.",
  "Keluargamu pakai BPJS kelas berapa? Komen angkanya.",
];

export const BpjsTagihanReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);
