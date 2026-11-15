// Reels "Bayar minimum, utang nggak turun-turun" (tayang 18 Nov 2026, 19.00) — template Papan Kapur, naskah v2 (5 blok, ±37 s).
// Naskah: produksi/20261118-kartu-kredit-bayar-minimum/naskah-vo.json.
//   A hook (utuh di frame 0) · B inti (min. bayar 5%, bunga maks. 1,75%/bulan) · C perahu bocor + contoh hitungan
//   D solusi (checklist) · CTA (baris 2) · akhir kembali ke hook (loop).
// Tiap bagian: judul DAN elemen pertama muncul saat kamera berangkat (catatan Orchestrator 14 Nov: tidak ada jeda judul saja).
//
// vo-waktu.json dibuat dengan:
//   VO_AMBANG_DB=-35 VO_JEDA_MIN=0.13 python3 scripts/sinkron_vo.py produksi/20261118-kartu-kredit-bayar-minimum src/produksi/kartu-kredit-bayar-minimum/vo-waktu.json
import React from "react";
import naskah from "../../../produksi/20261118-kartu-kredit-bayar-minimum/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, Panah, Titik, Tulis, garis, lingkaran } from "../../papan/Komponen";
import { d, k } from "../../papan/tema";
import { BENDA, Orang } from "../../papan/ilustrasi";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, C, Checklist, D, Muncul, ReelsPapan, TATA_V2, buatReels } from "../../papan/reels";

const R = buatReels(vo as DataVO, naskah, TATA_V2);
const { W } = R;
const G = R.cta;
export const DURASI_KARTU_KREDIT = R.durasi;
const B_ = BENDA;
const SUDAH = -9999;

// Grafik utang datar: sumbu + garis hampir mendatar.
const sumbuX = (x: number, y: number, w: number): Titik[] => garis(x, y, x + w, y, 3, 2);
const sumbuY = (x: number, y: number, h: number): Titik[] => garis(x, y, x, y - h, 4, 2);
const datar = (x: number, y: number, w: number): Titik[] => Array.from({ length: 9 }, (_, i) => [x + (w * i) / 8, y + (i % 2 ? 6 : -6) + i * 2] as Titik);

const IsiPapan: React.FC = () => (
  <>
    {/* ===== A: hook — utuh di frame 0; kapur menambah garis bawah mulai 0,5 s ===== */}
    <Tulis x={A.x} y={A.y0 + 260} teks="bayar minimum," ukuran={110} gaya="tebal" mulai={SUDAH} rata="center" />
    <B_.kartu cx={A.x0 + 260} cy={A.y0 + 560} s={330} />
    <Coret pts={sumbuY(A.x0 + 520, A.y0 + 720, 300)} mulai={SUDAH} lama={1} tebal={5} kapur={false} />
    <Coret pts={sumbuX(A.x0 + 520, A.y0 + 720, 430)} mulai={SUDAH} lama={1} tebal={5} kapur={false} />
    <Coret pts={datar(A.x0 + 540, A.y0 + 500, 400)} mulai={SUDAH} lama={1} warna={k.merah} tebal={10} kapur={false} />
    <Tulis x={A.x0 + 740} y={A.y0 + 450} teks="utang" ukuran={60} warna={k.merah} mulai={SUDAH} rata="center" />
    <Tulis x={A.x} y={A.y0 + 1010} teks="utang NGGAK TURUN" ukuran={96} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" tebalFilter />
    <Coret pts={garis(A.x0 + 90, A.y0 + 1060, A.x0 + 990, A.y0 + 1052, 5, 4)} mulai={d(0.5)} lama={10} warna={k.merah} tebal={9} />

    {/* ===== B: aturan BI ===== */}
    <Tulis x={B.x} y={B.y0 + 250} teks="aturan Bank Indonesia" ukuran={80} gaya="tebal" mulai={R.tiba(1)} perHuruf={1} rata="center" />
    <Muncul mulai={R.tiba(1)}>
      <B_.bank cx={B.x} cy={B.y0 + 440} s={220} teks="BI" />
    </Muncul>
    <Tulis x={B.x} y={B.y0 + 680} teks="min. bayar 5%" ukuran={130} gaya="tebal" warna={k.kuning} mulai={W(1, "lima persen", -0.6)} perHuruf={1.4} rata="center" tebalFilter />
    <Tulis x={B.x} y={B.y0 + 820} teks="tapi sisanya kena bunga" ukuran={62} warna={k.biru} mulai={W(1, "Tapi sisanya", -0.2)} perHuruf={1} rata="center" />
    <Tulis x={B.x} y={B.y0 + 990} teks="maks. 1,75% / bulan" ukuran={92} gaya="tebal" warna={k.merah} mulai={W(1, "maksimal", -0.4)} perHuruf={1.2} rata="center" tebalFilter />
    <Coret pts={lingkaran(B.x, B.y0 + 955, 420, 95, 6)} mulai={W(1, "sebulan", -0.3)} lama={12} warna={k.merah} tebal={6} />

    {/* ===== C: perahu bocor + contoh ===== */}
    <Tulis x={C.x} y={C.y0 + 230} teks="Mirip menguras perahu bocor" ukuran={66} gaya="hias" warna={k.biru} mulai={R.tiba(2)} perHuruf={0.8} rata="center" />
    <Muncul mulai={R.tiba(2)}>
      <B_.perahu cx={C.x0 + 360} cy={C.y0 + 470} s={420} />
    </Muncul>
    <Muncul mulai={W(2, "menguras", -0.2)}>
      <B_.ember cx={C.x0 + 760} cy={C.y0 + 430} s={180} />
    </Muncul>
    <Panah x1={C.x0 + 680} y1={C.y0 + 470} x2={C.x0 + 560} y2={C.y0 + 470} tinggi={20} mulai={W(2, "menguras", 0.1)} lama={8} warna={k.biru} tebal={5} />
    <Tulis x={C.x0 + 110} y={C.y0 + 680} teks="Contoh:" ukuran={70} gaya="hias" warna={k.biru} mulai={W(2, "Tagihan lima juta", -0.3)} perHuruf={2} />
    <Tulis x={C.x} y={C.y0 + 790} teks="Rp5 jt − Rp250 rb" ukuran={86} gaya="tebal" mulai={W(2, "Tagihan lima juta", 0)} perHuruf={1.2} rata="center" />
    <Tulis x={C.x} y={C.y0 + 910} teks="= Rp4,75 jt × 1,75%" ukuran={86} gaya="tebal" mulai={W(2, "sisanya", -0.3)} perHuruf={1.2} rata="center" />
    <Tulis x={C.x} y={C.y0 + 1050} teks="≈ Rp83 rb bunga / bulan" ukuran={80} gaya="tebal" warna={k.merah} mulai={W(2, "delapan puluh", -0.5)} perHuruf={1.1} rata="center" tebalFilter />
    <Tulis x={C.x} y={C.y0 + 1140} teks="(contoh hitungan, bunga maksimum)" ukuran={40} gaya="tipis" warna={k.biru} mulai={W(2, "Tagihan lima juta", 0.4)} perHuruf={0.6} rata="center" />

    {/* ===== D: solusi ===== */}
    <Tulis x={D.x0 + 100} y={D.y0 + 250} teks="Biar cepat lunas:" ukuran={92} gaya="hias" warna={k.kuning} mulai={R.tiba(3)} perHuruf={1.2} />
    <Checklist
      x={D.x0 + 100}
      y={D.y0 + 460}
      jarak={190}
      baris={[
        { kotak: R.tiba(3), centang: W(3, "Bayar lunas", 0.3), teks: <Tulis x={D.x0 + 220} y={D.y0 + 460} teks="bayar lunas" ukuran={66} mulai={R.tiba(3)} perHuruf={1.2} /> },
        { kotak: W(3, "Kalau belum", -0.3), centang: W(3, "di atas minimum", 0), teks: <Tulis x={D.x0 + 220} y={D.y0 + 650} teks="bayar jauh > minimum" ukuran={66} mulai={W(3, "jauh di atas", -0.3)} perHuruf={1} /> },
        { kotak: W(3, "stop pakai", -0.3), centang: W(3, "kartunya dulu", 0, 8), teks: <Tulis x={D.x0 + 220} y={D.y0 + 840} teks="stop pakai kartu dulu" ukuran={66} mulai={W(3, "stop pakai")} perHuruf={1} /> },
      ]}
    />
    <Muncul mulai={W(3, "stop pakai", -0.2)}>
      <B_.kartu cx={D.x0 + 780} cy={D.y0 + 1080} s={240} />
    </Muncul>
    <Coret pts={garis(D.x0 + 650, D.y0 + 1150, D.x0 + 910, D.y0 + 1010, 9, 3)} mulai={W(3, "kartunya dulu", -0.2)} lama={8} warna={k.merah} tebal={8} />
    <Muncul mulai={W(3, "Bayar lunas", 0)}>
      <Orang cx={D.x0 + 280} cy={D.y0 + 1110} s={220} pose="jempol" ekspresi="senyum" baju={k.hijauTerang} />
    </Muncul>

    {/* ===== CTA ===== */}
    <Tulis x={G.x} y={G.y0 + 300} teks="Lunas atau minimum?" ukuran={138} gaya="tebal" mulai={Math.max(W(4, "Kamu biasa"), d(R.MULAI[4] + 1.6))} perHuruf={1.2} rata="center" />
    <Muncul mulai={W(4, "lunas atau", -0.2)}>
      <B_.gelembung cx={G.x + 120} cy={G.y0 + 545} s={500} teks="lunas / minimum" />
    </Muncul>
    <Tulis x={G.x} y={G.y0 + 800} teks="komen 1 kata ↓" ukuran={110} gaya="hias" warna={k.kuning} mulai={W(4, "Komen")} perHuruf={1.6} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1000} teks="IntipDompet" ukuran={150} gaya="tebal" mulai={W(4, "IntipDompet")} perHuruf={2} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1105} teks="Biar dompetmu nggak kaget." ukuran={96} gaya="hias" warna={k.kuning} mulai={W(4, "Biar dompetmu")} perHuruf={1.5} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1195} teks="konten edukasi · aturan kartu kredit: Bank Indonesia" ukuran={46} gaya="tipis" warna={k.biru} mulai={W(4, "IntipDompet", 0.3)} perHuruf={0.5} rata="center" />
  </>
);

const TEKS_TAMPIL = [
  "Bayar minimum, utang nggak turun-turun.",
  "Bank Indonesia membolehkan bayar minimum 5%. Tapi sisanya kena bunga, maksimal 1,75% sebulan.",
  "Mirip menguras perahu bocor. Tagihan Rp5 juta, bayar Rp250 ribu, sisanya bisa kena bunga Rp80 ribuan sebulan.",
  "Bayar lunas kalau bisa. Kalau belum, bayar jauh di atas minimum dan stop pakai kartunya dulu.",
  "Kamu biasa bayar lunas atau minimum? Komen satu kata.",
];

export const KartuKreditReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);
