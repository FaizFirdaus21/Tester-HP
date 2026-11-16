// Reels "Undangan di WA? Jangan dibuka." (tayang 20 Nov 2026, 12.00, hook tipe B) — Papan Kapur v3.1 (TATA_V31, 4 blok).
// Naskah: produksi/20261120-file-apk-undangan/naskah-vo.json.
//   A hook: gelembung chat WA "Undangan Pernikahan.apk" + silang merah (mulai frame 2) · B fakta: ".apk" = APLIKASI ≠ undangan → HP + bank
//   · C TIP: tiga langkah bernomor (tahan ≥ 2,5 s) · D CTA "undangan", akhir kembali ke hook (loop).
//
// vo-waktu.json: VO_AMBANG_DB=-35 VO_JEDA_MIN=0.13 python3 scripts/sinkron_vo.py produksi/20261120-file-apk-undangan src/produksi/file-apk-undangan/vo-waktu.json
import React from "react";
import naskah from "../../../produksi/20261120-file-apk-undangan/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, Panah, Tulis, TungguFont, garis, lingkaran } from "../../papan/Komponen";
import { k } from "../../papan/tema";
import { BENDA, Bentuk } from "../../papan/ilustrasi";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, C, Langkah, Muncul, ReelsPapan, TATA_V31, buatReels, persegi } from "../../papan/reels";

const R = buatReels(vo as DataVO, naskah, TATA_V31);
const { W } = R;
const D = { ...R.cta, x0: R.cta.x - 540 };
export const DURASI_APK_UNDANGAN = R.durasi;
const B_ = BENDA;
const SUDAH = -9999;

/** Gelembung chat WA kapur berisi file: ikon dokumen + nama file. */
const ChatFile: React.FC<{ x: number; y: number; w: number; nama: string }> = ({ x, y, w, nama }) => (
  <>
    <Bentuk pts={[[x, y], [x + w, y], [x + w, y + 220], [x + 60, y + 220], [x + 20, y + 260], [x + 30, y + 220], [x, y + 220], [x, y]]} warna={k.hijauTerang} garis={k.putih} isi={0.18} tebal={6} />
    <Bentuk pts={persegi(x + 40, y + 40, 110, 140)} warna={k.putih} isi={0.2} tebal={5} />
    <Tulis x={x + 95} y={y + 125} teks="APK" ukuran={34} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" />
    <Tulis x={x + 180} y={y + 105} teks={nama} ukuran={60} gaya="tebal" mulai={SUDAH} />
    <Tulis x={x + 180} y={y + 170} teks="2,3 MB · dokumen" ukuran={38} warna={k.biru} mulai={SUDAH} />
  </>
);

const IsiPapan: React.FC = () => (
  <TungguFont>
    {/* ===== A: hook — chat WA utuh di frame 0, silang merah mulai frame 2 ===== */}
    <Tulis x={A.x} y={A.y0 + 250} teks="undangan di WA?" ukuran={110} gaya="tebal" mulai={SUDAH} rata="center" />
    <Tulis x={A.x0 + 80} y={A.y0 + 380} teks="+62 8xx · nomor asing" ukuran={44} warna={k.biru} mulai={SUDAH} />
    <ChatFile x={A.x0 + 70} y={A.y0 + 420} w={920} nama="Undangan Pernikahan.apk" />
    <Coret pts={garis(A.x0 + 100, A.y0 + 380, A.x0 + 980, A.y0 + 720, 3, 4)} mulai={2} lama={5} warna={k.merah} tebal={18} kapur={false} />
    <Coret pts={garis(A.x0 + 980, A.y0 + 380, A.x0 + 100, A.y0 + 720, 4, 4)} mulai={6} lama={5} warna={k.merah} tebal={18} kapur={false} />
    <Tulis x={A.x} y={A.y0 + 1000} teks="JANGAN DIBUKA" ukuran={118} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" tebalFilter />

    {/* ===== B: fakta ===== */}
    <Tulis x={B.x0 + 80} y={B.y0 + 330} teks="Undangan Pernikahan" ukuran={72} gaya="tebal" mulai={R.tiba(1)} perHuruf={0.6} />
    <Tulis x={B.x0 + 960} y={B.y0 + 330} teks=".apk" ukuran={96} gaya="tebal" warna={k.merah} mulai={W(1, "berakhiran apk", -0.4)} perHuruf={1.5} rata="right" />
    <Coret pts={lingkaran(B.x0 + 870, B.y0 + 300, 105, 70, 2)} mulai={W(1, "berakhiran apk", -0.2)} lama={10} warna={k.kuning} tebal={7} />
    <Muncul mulai={W(1, "itu aplikasi", -0.3)}>
      <B_.label cx={B.x} cy={B.y0 + 520} s={560} teks="APLIKASI ≠ undangan" warna={k.kuning} />
    </Muncul>
    <Tulis x={B.x} y={B.y0 + 720} teks="kalau dipasang:" ukuran={66} gaya="hias" warna={k.biru} mulai={W(1, "Kalau dipasang", -0.3)} perHuruf={0.8} rata="center" />
    <Muncul mulai={W(1, "mengambil alih HP", -0.4)}>
      <B_.hp cx={B.x0 + 260} cy={B.y0 + 960} s={300} teks="diambil alih" />
    </Muncul>
    <Panah x1={B.x0 + 420} y1={B.y0 + 960} x2={B.x0 + 600} y2={B.y0 + 960} tinggi={30} mulai={W(1, "aplikasi bankmu", -0.6)} lama={8} warna={k.merah} tebal={8} />
    <Muncul mulai={W(1, "aplikasi bankmu", -0.4)}>
      <B_.bank cx={B.x0 + 790} cy={B.y0 + 950} s={260} teks="BANK" />
    </Muncul>
    <Tulis x={B.x0 + 790} y={B.y0 + 1130} teks="ikut dikuras" ukuran={60} gaya="tebal" warna={k.merah} mulai={W(1, "aplikasi bankmu", -0.3, 14)} perHuruf={0.6} rata="center" />

    {/* ===== C: TIP — tiga langkah, tiap langkah tertahan ≥ 2,5 s ===== */}
    <Tulis x={C.x} y={C.y0 + 230} teks="Triknya:" ukuran={96} gaya="hias" warna={k.kuning} mulai={R.tiba(2)} perHuruf={1} rata="center" />
    <Langkah x0={C.x0} n={1} y={C.y0 + 420} judul="cek 3 huruf terakhir" kecil="…apk = APLIKASI → hapus" mulai={R.tiba(2)} warnaKecil={k.merah} />
    <Langkah x0={C.x0} n={2} y={C.y0 + 700} judul="pasang hanya dari Play Store" kecil="bukan dari file kiriman chat" mulai={W(2, "Pasang aplikasi", -0.3)} />
    <Langkah x0={C.x0} n={3} y={C.y0 + 980} judul="telanjur klik?" kecil="hubungi bank lewat nomor resmi" mulai={W(2, "Telanjur klik", -0.3)} warnaKecil={k.hijauTerang} />

    {/* ===== D: CTA ===== */}
    <Tulis x={D.x} y={D.y0 + 280} teks="pernah dapat undangan begini?" ukuran={66} gaya="tebal" mulai={R.tiba(3)} perHuruf={0.6} rata="center" />
    <Muncul mulai={R.tiba(3)}>
      <B_.gelembung cx={D.x + 80} cy={D.y0 + 540} s={480} teks="ya / nggak" />
    </Muncul>
    <Tulis x={D.x} y={D.y0 + 790} teks="komen ↓" ukuran={110} gaya="hias" warna={k.kuning} mulai={W(3, "Komen", -0.2)} perHuruf={1.4} rata="center" />
    <Tulis x={D.x} y={D.y0 + 980} teks="IntipDompet" ukuran={130} gaya="tebal" mulai={W(3, "IntipDompet", -0.1)} perHuruf={1.2} rata="center" />
    <Tulis x={D.x} y={D.y0 + 1080} teks="Biar dompetmu nggak kaget." ukuran={66} gaya="hias" warna={k.kuning} mulai={W(3, "Biar dompetmu", -0.1)} perHuruf={1} rata="center" />
    <Tulis x={D.x} y={D.y0 + 1170} teks="konten edukasi · imbauan resmi bank soal file APK" ukuran={34} gaya="tipis" warna={k.biru} mulai={W(3, "IntipDompet", 0.3)} perHuruf={0.4} rata="center" />
  </TungguFont>
);

const TEKS_TAMPIL = naskah.blok.map((b) => b.teks.replace(/ IntipDompet\. Biar dompetmu nggak kaget\.$/, "").replace("berakhiran apk", "berakhiran .apk").replace("Kalau apk", "Kalau .apk"));

export const ApkUndanganReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);
