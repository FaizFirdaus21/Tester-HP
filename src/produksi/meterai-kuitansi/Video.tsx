// Reels "Kuitansi tiga juta nggak perlu meterai" (tayang 19 Nov 2026, 12.00, hook tipe C) — Papan Kapur v3 (TATA_V3).
// Naskah: produksi/20261119-meterai-kuitansi/naskah-vo.json (3 blok).
//   A hook: kuitansi raksasa "Rp3.000.000" + meterai Rp10.000 dicoret (gerak mulai frame 2) · B garis bilangan Rp5 jt (UU 10/2020)
//   + koin Rp10 rb ke tempat sampah · C cek nominal + CTA, akhir kembali ke hook (loop).
//
// vo-waktu.json: VO_AMBANG_DB=-35 VO_JEDA_MIN=0.13 python3 scripts/sinkron_vo.py produksi/20261119-meterai-kuitansi src/produksi/meterai-kuitansi/vo-waktu.json
import React from "react";
import naskah from "../../../produksi/20261119-meterai-kuitansi/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, Panah, Tulis, garis, lingkaran } from "../../papan/Komponen";
import { d, k } from "../../papan/tema";
import { BENDA, Bentuk } from "../../papan/ilustrasi";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, Muncul, ReelsPapan, TATA_V3, buatReels, centang, persegi } from "../../papan/reels";

const R = buatReels(vo as DataVO, naskah, TATA_V3);
const { W } = R;
const C = { ...R.cta, x0: R.cta.x - 540 };
export const DURASI_METERAI = R.durasi;
const B_ = BENDA;
const SUDAH = -9999;

const IsiPapan: React.FC = () => (
  <>
    {/* ===== A: hook — kuitansi raksasa utuh di frame 0; meterai dicoret mulai frame 2 ===== */}
    <Tulis x={A.x} y={A.y0 + 250} teks="kuitansi" ukuran={96} gaya="tebal" mulai={SUDAH} rata="center" />
    <Bentuk pts={persegi(A.x0 + 60, A.y0 + 320, 960, 560)} warna={k.putih} isi={0.08} tebal={7} />
    <Tulis x={A.x0 + 110} y={A.y0 + 430} teks="Terima dari: …" ukuran={50} warna={k.biru} mulai={SUDAH} />
    <Tulis x={A.x0 + 110} y={A.y0 + 530} teks="Rp" ukuran={110} gaya="tebal" warna={k.kuning} mulai={SUDAH} />
    <Tulis x={A.x} y={A.y0 + 740} teks="3.000.000" ukuran={170} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" tebalFilter />
    <Bentuk pts={persegi(A.x0 + 760, A.y0 + 380, 210, 150)} warna={k.merah} garis={k.putih} isi={0.3} tebal={5} />
    <Tulis x={A.x0 + 865} y={A.y0 + 430} teks="METERAI" ukuran={34} gaya="tebal" mulai={SUDAH} rata="center" />
    <Tulis x={A.x0 + 865} y={A.y0 + 500} teks="10.000" ukuran={54} gaya="tebal" mulai={SUDAH} rata="center" />
    <Coret pts={garis(A.x0 + 740, A.y0 + 360, A.x0 + 990, A.y0 + 550, 2, 3)} mulai={2} lama={4} warna={k.merah} tebal={14} kapur={false} />
    <Coret pts={garis(A.x0 + 990, A.y0 + 360, A.x0 + 740, A.y0 + 550, 3, 3)} mulai={6} lama={4} warna={k.merah} tebal={14} kapur={false} />
    <Tulis x={A.x} y={A.y0 + 1030} teks="nggak perlu meterai" ukuran={104} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" tebalFilter />
    <Tulis x={A.x0 + 960} y={A.y0 + 860} teks="contoh" ukuran={36} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="right" />

    {/* ===== B: aturan + efek ===== */}
    <Tulis x={B.x} y={B.y0 + 250} teks="UU 10/2020" ukuran={96} gaya="tebal" mulai={R.tiba(1)} perHuruf={1} rata="center" />
    <Muncul mulai={R.tiba(1)}>
      <Bentuk pts={persegi(B.x0 + 700, B.y0 + 330, 230, 160)} warna={k.merah} garis={k.putih} isi={0.3} tebal={5} />
      <Tulis x={B.x0 + 815} y={B.y0 + 385} teks="METERAI" ukuran={36} gaya="tebal" mulai={SUDAH} rata="center" />
      <Tulis x={B.x0 + 815} y={B.y0 + 460} teks="10.000" ukuran={60} gaya="tebal" mulai={SUDAH} rata="center" />
    </Muncul>
    <Tulis x={B.x0 + 330} y={B.y0 + 440} teks="wajib kalau…" ukuran={72} gaya="hias" warna={k.biru} mulai={W(1, "mewajibkan", -0.3)} perHuruf={1} rata="center" />
    <Coret pts={garis(B.x0 + 80, B.y0 + 700, B.x0 + 960, B.y0 + 700, 5, 2)} mulai={W(1, "hanya untuk", -0.5)} lama={8} tebal={7} />
    <Panah x1={B.x0 + 880} y1={B.y0 + 700} x2={B.x0 + 990} y2={B.y0 + 700} tinggi={30} mulai={W(1, "hanya untuk", -0.3)} lama={4} tebal={7} />
    <Coret pts={garis(B.x, B.y0 + 640, B.x, B.y0 + 760, 6, 1)} mulai={W(1, "lima juta", -0.6)} lama={6} warna={k.kuning} tebal={9} />
    <Tulis x={B.x} y={B.y0 + 840} teks="Rp5 jt" ukuran={84} gaya="tebal" warna={k.kuning} mulai={W(1, "lima juta", -0.5)} perHuruf={1.4} rata="center" />
    <Tulis x={B.x0 + 780} y={B.y0 + 620} teks="> Rp5 jt: wajib" ukuran={60} gaya="tebal" mulai={W(1, "di atas", -0.3)} perHuruf={1} rata="center" />
    <Tulis x={B.x0 + 280} y={B.y0 + 620} teks="≤ Rp5 jt: nggak" ukuran={60} gaya="tebal" warna={k.hijauTerang} mulai={W(1, "Di bawah itu", -0.4)} perHuruf={1} rata="center" />
    <Muncul mulai={W(1, "sepuluh ribumu", -0.4)}>
      <B_.koin cx={B.x0 + 300} cy={B.y0 + 1000} s={170} teks="10rb" />
    </Muncul>
    <Panah x1={B.x0 + 410} y1={B.y0 + 1000} x2={B.x0 + 600} y2={B.y0 + 1030} tinggi={30} mulai={W(1, "terbuang", -0.4)} lama={6} warna={k.merah} tebal={7} />
    <Muncul mulai={W(1, "terbuang", -0.3)}>
      <B_.ember cx={B.x0 + 730} cy={B.y0 + 1010} s={220} />
    </Muncul>
    <Tulis x={B.x} y={B.y0 + 1200} teks="Rp10.000 terbuang" ukuran={78} gaya="tebal" warna={k.merah} mulai={W(1, "terbuang", 0)} perHuruf={1} rata="center" tebalFilter />

    {/* ===== C: aksi + CTA ===== */}
    <Tulis x={C.x} y={C.y0 + 260} teks="cek nominal dulu" ukuran={96} gaya="tebal" warna={k.kuning} mulai={R.tiba(2)} perHuruf={0.8} rata="center" />
    <Muncul mulai={R.tiba(2)}>
      <Bentuk pts={persegi(C.x0 + 140, C.y0 + 340, 520, 260)} warna={k.putih} isi={0.08} tebal={5} />
    </Muncul>
    <Tulis x={C.x0 + 400} y={C.y0 + 500} teks="> Rp5 jt?" ukuran={86} gaya="tebal" mulai={W(2, "nominal", 0)} perHuruf={1.2} rata="center" />
    <Coret pts={centang(C.x0 + 740, C.y0 + 480, 1.5)} mulai={W(2, "sebelum tempel", -0.2)} lama={8} warna={k.hijauTerang} tebal={12} />
    <Muncul mulai={W(2, "Pernah begitu", -0.3)}>
      <B_.gelembung cx={C.x + 100} cy={C.y0 + 780} s={460} teks="ya / nggak" />
    </Muncul>
    <Tulis x={C.x} y={C.y0 + 990} teks="komen ↓" ukuran={100} gaya="hias" warna={k.kuning} mulai={W(2, "Komen", -0.2)} perHuruf={1.4} rata="center" />
    <Tulis x={C.x} y={C.y0 + 1110} teks="IntipDompet" ukuran={110} gaya="tebal" mulai={W(2, "IntipDompet", -0.1)} perHuruf={1.2} rata="center" />
    <Tulis x={C.x} y={C.y0 + 1190} teks="Biar dompetmu nggak kaget." ukuran={70} gaya="hias" warna={k.kuning} mulai={W(2, "Biar dompetmu", -0.1)} perHuruf={1} rata="center" />
    <Coret pts={lingkaran(C.x0 + 400, C.y0 + 470, 300, 150, 4)} mulai={W(2, "Cek nominal", 0)} lama={10} warna={k.kuning} tebal={5} />
  </>
);

const TEKS_TAMPIL = naskah.blok.map((b) => b.teks.replace(/ IntipDompet\. Biar dompetmu nggak kaget\.$/, ""))
  .map((t) => t.replace("tiga juta", "Rp3 juta").replace("sepuluh ribu", "Rp10.000").replace("lima juta rupiah", "Rp5 juta").replace("sepuluh ribumu", "Rp10.000-mu"));

export const MeteraiReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);
