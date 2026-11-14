// Reels "Transfer kepotong Rp6.500" (tayang 17 Nov 2026, 19.00) — template Papan Kapur, naskah v2 (5 blok, ±40 s).
// Naskah: produksi/20261117-biaya-transfer-bifast/naskah-vo.json.
//   A hook (sudah utuh di frame 0) · B inti (Rp6.500 vs BI-FAST maks. Rp2.500) · C perumpamaan parkir dobel + contoh hitungan
//   D solusi (pilih BI-FAST, cek daftar biaya) · CTA (baris 2) · akhir kamera kembali ke hook supaya loop menyambung.
//
// vo-waktu.json dibuat dengan:
//   VO_AMBANG_DB=-35 VO_JEDA_MIN=0.13 python3 scripts/sinkron_vo.py produksi/20261117-biaya-transfer-bifast src/produksi/biaya-transfer-bifast/vo-waktu.json
import React from "react";
import naskah from "../../../produksi/20261117-biaya-transfer-bifast/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, Panah, Tulis, garis, lingkaran } from "../../papan/Komponen";
import { d, k } from "../../papan/tema";
import { BENDA } from "../../papan/ilustrasi";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, C, Checklist, D, Muncul, ReelsPapan, TATA_V2, buatReels, centang } from "../../papan/reels";

const R = buatReels(vo as DataVO, naskah, TATA_V2);
const { W } = R;
const G = R.cta;
export const DURASI_BIFAST = R.durasi;
const B_ = BENDA;
const SUDAH = -9999;

const IsiPapan: React.FC = () => (
  <>
    {/* ===== A: hook — utuh di frame 0; kapur menambah lingkaran dan garis mulai 0,5 s ===== */}
    <Tulis x={A.x} y={A.y0 + 270} teks="transfer beda bank" ukuran={84} gaya="tebal" mulai={SUDAH} rata="center" />
    <Tulis x={A.x} y={A.y0 + 560} teks="Rp6.500" ukuran={250} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" tebalFilter />
    <Tulis x={A.x} y={A.y0 + 760} teks="KEPOTONG" ukuran={150} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" tebalFilter />
    <B_.bank cx={A.x0 + 230} cy={A.y0 + 1010} s={230} teks="BANK A" />
    <Panah x1={A.x0 + 390} y1={A.y0 + 1010} x2={A.x0 + 690} y2={A.y0 + 1010} tinggi={40} mulai={SUDAH} lama={1} warna={k.putih} tebal={8} />
    <B_.bank cx={A.x0 + 850} cy={A.y0 + 1010} s={230} teks="BANK B" />
    <Coret pts={garis(A.x0 + 150, A.y0 + 800, A.x0 + 930, A.y0 + 792, 4, 4)} mulai={d(0.5)} lama={10} warna={k.merah} tebal={10} />
    <Coret pts={lingkaran(A.x, A.y0 + 490, 420, 140, 7)} mulai={W(0, "enam ribu", -0.2)} lama={14} warna={k.putih} tebal={6} />

    {/* ===== B: inti ===== */}
    <Tulis x={B.x} y={B.y0 + 250} teks="transfer online biasa" ukuran={78} gaya="tebal" mulai={R.tiba(1)} perHuruf={1} rata="center" />
    <Muncul mulai={W(1, "tarif transfer", -0.3)}>
      <B_.label cx={B.x0 + 290} cy={B.y0 + 440} s={330} teks="Rp6.500" warna={k.merah} miring={-6} />
    </Muncul>
    <Tulis x={B.x0 + 290} y={B.y0 + 590} teks="di sejumlah bank" ukuran={50} warna={k.biru} mulai={W(1, "sejumlah bank", -0.3)} perHuruf={1} rata="center" />
    <Muncul mulai={W(1, "be i fast", -0.4)}>
      <B_.label cx={B.x0 + 770} cy={B.y0 + 440} s={340} teks="BI-FAST" warna={k.kuning} miring={5} />
    </Muncul>
    <Tulis x={B.x0 + 770} y={B.y0 + 590} teks="padahal…" ukuran={56} gaya="hias" warna={k.biru} mulai={W(1, "Padahal", -0.2)} perHuruf={1.2} rata="center" />
    <Muncul mulai={W(1, "Bank Indonesia", -0.4)}>
      <B_.bank cx={B.x0 + 290} cy={B.y0 + 820} s={250} teks="BI" />
    </Muncul>
    <Tulis x={B.x0 + 720} y={B.y0 + 800} teks="batas dari" ukuran={56} warna={k.biru} mulai={W(1, "membatasi", -0.4)} perHuruf={1.2} rata="center" />
    <Tulis x={B.x0 + 720} y={B.y0 + 870} teks="Bank Indonesia" ukuran={56} warna={k.biru} mulai={W(1, "membatasi", -0.1)} perHuruf={1.2} rata="center" />
    <Tulis x={B.x} y={B.y0 + 1080} teks="maks. Rp2.500" ukuran={140} gaya="tebal" warna={k.kuning} mulai={W(1, "maksimal", -0.4)} perHuruf={1.4} rata="center" tebalFilter />
    <Coret pts={lingkaran(B.x, B.y0 + 1035, 450, 110, 5)} mulai={W(1, "dua ribu lima ratus", 0)} lama={14} warna={k.kuning} tebal={7} />

    {/* ===== C: parkir dobel + contoh hitungan ===== */}
    <Tulis x={C.x} y={C.y0 + 230} teks="Mirip bayar parkir 2×" ukuran={86} gaya="hias" warna={k.biru} mulai={R.tiba(2)} perHuruf={1} rata="center" />
    <Muncul mulai={W(2, "parkir", -0.3)}>
      <B_.label cx={C.x0 + 290} cy={C.y0 + 430} s={300} teks="PARKIR" warna={k.putih} miring={-6} />
    </Muncul>
    <Muncul mulai={W(2, "dua kali", -0.3)}>
      <B_.label cx={C.x0 + 590} cy={C.y0 + 450} s={300} teks="PARKIR" warna={k.putih} miring={5} />
    </Muncul>
    <Tulis x={C.x0 + 860} y={C.y0 + 480} teks="×2" ukuran={120} gaya="tebal" warna={k.merah} mulai={W(2, "dua kali", 0)} perHuruf={2} rata="center" />
    <Tulis x={C.x0 + 110} y={C.y0 + 660} teks="Contoh:" ukuran={70} gaya="hias" warna={k.biru} mulai={W(2, "Contohnya", -0.2)} perHuruf={2} />
    <Tulis x={C.x} y={C.y0 + 780} teks="20 × (Rp6.500 − Rp2.500)" ukuran={70} gaya="tebal" mulai={W(2, "dua puluh kali", -0.4)} perHuruf={0.9} rata="center" />
    <Tulis x={C.x} y={C.y0 + 920} teks="= Rp80 rb / bulan" ukuran={104} gaya="tebal" warna={k.kuning} mulai={W(2, "delapan puluh ribu", -0.5)} perHuruf={1.2} rata="center" tebalFilter />
    <Tulis x={C.x} y={C.y0 + 1060} teks="≈ Rp960 rb / tahun" ukuran={104} gaya="tebal" warna={k.merah} mulai={W(2, "hampir sejuta", -0.5)} perHuruf={1.2} rata="center" tebalFilter />
    <Tulis x={C.x} y={C.y0 + 1150} teks="(contoh hitungan)" ukuran={40} gaya="tipis" warna={k.biru} mulai={W(2, "Contohnya", 0.4)} perHuruf={0.8} rata="center" />

    {/* ===== D: solusi ===== */}
    <Tulis x={D.x0 + 100} y={D.y0 + 250} teks="Sebelum transfer:" ukuran={92} gaya="hias" warna={k.kuning} mulai={R.tiba(3)} perHuruf={1.2} />
    <Muncul mulai={W(3, "pilih menu", -0.6)}>
      <B_.hp cx={D.x0 + 250} cy={D.y0 + 640} s={380} teks="m-banking" />
    </Muncul>
    <Muncul mulai={W(3, "pilih menu", -0.3)}>
      <B_.label cx={D.x0 + 720} cy={D.y0 + 520} s={400} teks="Transfer online" warna={k.putih} />
    </Muncul>
    <Coret pts={garis(D.x0 + 520, D.y0 + 560, D.x0 + 920, D.y0 + 480, 6, 3)} mulai={W(3, "be i fast", 0)} lama={8} warna={k.merah} tebal={9} />
    <Muncul mulai={W(3, "be i fast", -0.3)}>
      <B_.label cx={D.x0 + 720} cy={D.y0 + 740} s={330} teks="BI-FAST" warna={k.kuning} />
    </Muncul>
    <Coret pts={centang(D.x0 + 900, D.y0 + 740, 1.1)} mulai={W(3, "kalau tersedia", -0.2)} lama={8} warna={k.hijauTerang} tebal={10} />
    <Checklist
      x={D.x0 + 100}
      y={D.y0 + 1020}
      jarak={0}
      baris={[{ kotak: W(3, "Cek juga", -0.3), centang: W(3, "aplikasi bankmu", 0, 8), teks: <Tulis x={D.x0 + 220} y={D.y0 + 1020} teks="cek daftar biaya bank" ukuran={60} mulai={W(3, "Cek juga")} perHuruf={1} /> }]}
    />

    {/* ===== CTA ===== */}
    <Tulis x={G.x} y={G.y0 + 300} teks="Biaya transfermu berapa?" ukuran={128} gaya="tebal" mulai={Math.max(W(4, "Biaya transfer"), d(R.MULAI[4] + 1.6))} perHuruf={1.2} rata="center" />
    <Muncul mulai={W(4, "berapa", -0.2)}>
      <B_.gelembung cx={G.x + 120} cy={G.y0 + 545} s={500} teks="Rp____" />
    </Muncul>
    <Tulis x={G.x} y={G.y0 + 800} teks="tulis di komen ↓" ukuran={110} gaya="hias" warna={k.kuning} mulai={W(4, "Tulis angkanya")} perHuruf={1.6} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1000} teks="IntipDompet" ukuran={150} gaya="tebal" mulai={W(4, "IntipDompet")} perHuruf={2} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1105} teks="Biar dompetmu nggak kaget." ukuran={96} gaya="hias" warna={k.kuning} mulai={W(4, "Biar dompetmu")} perHuruf={1.5} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1195} teks="konten edukasi · batas BI-FAST: Bank Indonesia" ukuran={50} gaya="tipis" warna={k.biru} mulai={W(4, "IntipDompet", 0.3)} perHuruf={0.5} rata="center" />
  </>
);

const TEKS_TAMPIL = [
  "Transfer kepotong Rp6.500.",
  "Itu tarif transfer online biasa di sejumlah bank. Padahal lewat BI-FAST, Bank Indonesia membatasi biayanya maksimal Rp2.500.",
  "Mirip bayar parkir dua kali di tempat yang sama. Contohnya, transfer 20 kali sebulan, selisihnya Rp80 ribu, hampir sejuta setahun.",
  "Sebelum transfer, pilih menu BI-FAST kalau tersedia. Cek juga daftar biaya di aplikasi bankmu.",
  "Biaya transfer di bankmu berapa? Tulis angkanya di komen.",
];

export const BifastReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);
