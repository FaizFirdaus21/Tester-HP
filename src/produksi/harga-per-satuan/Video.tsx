// Reels "Kemasan besar, pasti lebih hemat?" (tayang 16 Nov 2026, 19.00) — template Papan Kapur.
// Naskah: produksi/20261116-harga-per-satuan/naskah-vo.json.
//   A hook (botol kecil vs jumbo "HEMAT?") · B rumus harga ÷ isi · C perumpamaan gorengan (contoh)
//   D efek (label hemat, nggak dihitung) · E akibat (contoh sabun 500 ml vs 1 L) · F solusi (kalkulator + checklist) · G CTA
//
// vo-waktu.json dibuat dengan:
//   python3 scripts/sinkron_vo.py produksi/20261116-harga-per-satuan src/produksi/harga-per-satuan/vo-waktu.json
// Selama VO belum ada (audio null), waktu diperkirakan dari naskah.
import React from "react";
import naskah from "../../../produksi/20261116-harga-per-satuan/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, Panah, Tulis, garis, lingkaran } from "../../papan/Komponen";
import { d, k } from "../../papan/tema";
import { BENDA, Orang } from "../../papan/ilustrasi";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, C, Checklist, D, E, F, G, Muncul, ReelsPapan, buatReels, pesawat } from "../../papan/reels";

const R = buatReels(vo as DataVO, naskah);
const { W } = R;
export const DURASI_HARGA_PER_SATUAN = R.durasi;
const B_ = BENDA;

const IsiPapan: React.FC = () => (
  <>
    {/* ===== A: hook ===== */}
    <Tulis x={A.x} y={A.y0 + 250} teks="kemasan besar," ukuran={100} gaya="tebal" mulai={4} perHuruf={1.2} rata="center" />
    <Muncul mulai={d(0.2)}>
      <B_.botol cx={A.x0 + 300} cy={A.y0 + 640} s={280} teks="kecil" />
    </Muncul>
    <Muncul mulai={W(0, "besar", 0)}>
      <B_.botol cx={A.x0 + 690} cy={A.y0 + 600} s={480} teks="JUMBO" warna={k.hijauTerang} />
    </Muncul>
    <Muncul mulai={W(0, "hemat", -0.4)}>
      <B_.label cx={A.x0 + 830} cy={A.y0 + 360} s={300} teks="HEMAT!" warna={k.kuning} miring={-10} />
    </Muncul>
    <Tulis x={A.x0 + 960} y={A.y0 + 470} teks="?" ukuran={170} gaya="tebal" warna={k.merah} mulai={W(0, "hemat", 0)} perHuruf={2} rata="center" />
    <Tulis x={A.x} y={A.y0 + 1050} teks="pasti lebih hemat?" ukuran={108} gaya="hias" warna={k.merah} mulai={W(0, "pasti", -0.2, 18)} perHuruf={1} rata="center" />

    {/* ===== B: rumus ===== */}
    <Tulis x={B.x} y={B.y0 + 260} teks="cara paling jujur:" ukuran={80} gaya="hias" warna={k.biru} mulai={W(1, "paling jujur", -0.5)} perHuruf={1.2} rata="center" />
    <Tulis x={B.x} y={B.y0 + 500} teks="harga ÷ isi" ukuran={150} gaya="tebal" mulai={W(1, "harga per satuan", -0.8)} perHuruf={2} rata="center" />
    <Coret pts={garis(B.x - 330, B.y0 + 560, B.x + 330, B.y0 + 552, 4, 3)} mulai={W(1, "harga per satuan", -0.2)} lama={10} tebal={6} kapur={false} />
    <Tulis x={B.x} y={B.y0 + 700} teks="= harga per satuan" ukuran={100} gaya="tebal" warna={k.kuning} mulai={W(1, "harga per satuan", 0)} perHuruf={1.4} rata="center" tebalFilter />
    {[
      { t: "per gram", f: "per gram", x: -310 },
      { t: "per ml", f: "per mililiter", x: 0 },
      { t: "per lembar", f: "per lembar", x: 310 },
    ].map((r, i) => (
      <Muncul key={i} mulai={W(1, r.f, -0.3)}>
        <B_.label cx={B.x + r.x} cy={B.y0 + 900} s={280} teks={r.t} warna={[k.biru, k.hijauTerang, k.merah][i]} miring={[-5, 3, -3][i]} />
      </Muncul>
    ))}

    {/* ===== C: gorengan ===== */}
    <Tulis x={C.x} y={C.y0 + 230} teks="Mirip beli gorengan" ukuran={88} gaya="hias" warna={k.biru} mulai={W(2, "Mirip beli", -0.2)} perHuruf={1.3} rata="center" />
    <Muncul mulai={W(2, "Tiga ribu", -0.3)}>
      <B_.gorengan cx={C.x0 + 260} cy={C.y0 + 520} s={220} />
    </Muncul>
    <Tulis x={C.x0 + 260} y={C.y0 + 690} teks="1 = Rp3.000" ukuran={70} gaya="tebal" mulai={W(2, "Tiga ribu", 0)} perHuruf={1.4} rata="center" />
    {[0, 1, 2].map((i) => (
      <Muncul key={i} mulai={W(2, "sepuluh ribu", -0.3) + i * 4}>
        <B_.gorengan cx={C.x0 + 640 + i * 120} cy={C.y0 + 470 + (i % 2) * 70} s={180} />
      </Muncul>
    ))}
    <Tulis x={C.x0 + 760} y={C.y0 + 690} teks="3 = Rp10.000" ukuran={70} gaya="tebal" mulai={W(2, "sepuluh ribu", 0)} perHuruf={1.3} rata="center" />
    <Tulis x={C.x0 + 700} y={C.y0 + 870} teks="÷3 = Rp3.333" ukuran={76} gaya="tebal" warna={k.merah} mulai={W(2, "Yang kedua", -0.2)} perHuruf={1.3} rata="center" />
    <Coret pts={lingkaran(C.x0 + 700, C.y0 + 848, 230, 66, 9)} mulai={W(2, "lebih mahal", -0.3)} lama={12} warna={k.merah} tebal={6} />
    <Tulis x={C.x} y={C.y0 + 1040} teks="per biji malah lebih mahal" ukuran={74} gaya="tebal" warna={k.kuning} mulai={W(2, "lebih mahal", 0, 16)} perHuruf={1} rata="center" />
    <Tulis x={C.x} y={C.y0 + 1130} teks="(contoh)" ukuran={40} gaya="tipis" warna={k.biru} mulai={W(2, "Tiga ribu", 0.3)} perHuruf={0.8} rata="center" />

    {/* ===== D: label hemat ===== */}
    <Tulis x={D.x} y={D.y0 + 240} teks="langsung ambil…" ukuran={88} gaya="hias" warna={k.biru} mulai={W(3, "Label hemat", -0.2)} perHuruf={1.2} rata="center" />
    <Coret pts={garis(D.x0 + 470, D.y0 + 860, D.x0 + 1000, D.y0 + 860, 3, 2)} mulai={W(3, "Label hemat", 0)} lama={10} tebal={8} />
    <Muncul mulai={W(3, "Label hemat", 0.2)}>
      <B_.botol cx={D.x0 + 590} cy={D.y0 + 760} s={200} teks="kecil" />
      <B_.botol cx={D.x0 + 840} cy={D.y0 + 700} s={330} teks="JUMBO" warna={k.hijauTerang} />
    </Muncul>
    <Muncul mulai={W(3, "kemasan jumbo", -0.2)}>
      <B_.label cx={D.x0 + 840} cy={D.y0 + 440} s={260} teks="HEMAT!" warna={k.kuning} miring={8} />
    </Muncul>
    <Muncul mulai={W(3, "langsung ambil", -0.4)}>
      <Orang cx={D.x0 + 260} cy={D.y0 + 760} s={420} pose="tunjuk" ekspresi="senyum" baju={k.merah} />
    </Muncul>
    <Muncul mulai={W(3, "tanpa menghitung", -0.4)}>
      <B_.gelembung cx={D.x0 + 720} cy={D.y0 + 1080} s={420} teks="nggak dihitung" />
    </Muncul>

    {/* ===== E: contoh sabun ===== */}
    <Tulis x={E.x0 + 110} y={E.y0 + 230} teks="Contoh:" ukuran={84} gaya="hias" warna={k.biru} mulai={W(4, "Contohnya")} perHuruf={2} />
    <Muncul mulai={W(4, "sabun", -0.3)}>
      <B_.botol cx={E.x0 + 260} cy={E.y0 + 470} s={250} teks="500 ml" />
    </Muncul>
    <Tulis x={E.x0 + 260} y={E.y0 + 690} teks="Rp20.000" ukuran={70} gaya="tebal" mulai={W(4, "dua puluh ribu", -0.3)} perHuruf={1.5} rata="center" />
    <Tulis x={E.x0 + 260} y={E.y0 + 800} teks="= Rp40/ml" ukuran={84} gaya="tebal" warna={k.hijauTerang} mulai={W(4, "empat puluh rupiah", -0.4)} perHuruf={1.5} rata="center" tebalFilter />
    <Muncul mulai={W(4, "satu liter", -0.3)}>
      <B_.botol cx={E.x0 + 760} cy={E.y0 + 440} s={330} teks="1 L" warna={k.hijauTerang} />
    </Muncul>
    <Tulis x={E.x0 + 760} y={E.y0 + 690} teks="Rp45.000" ukuran={70} gaya="tebal" mulai={W(4, "empat puluh lima ribu", -0.3)} perHuruf={1.5} rata="center" />
    <Tulis x={E.x0 + 760} y={E.y0 + 800} teks="= Rp45/ml" ukuran={84} gaya="tebal" warna={k.merah} mulai={W(4, "empat puluh lima rupiah", -0.6)} perHuruf={1.5} rata="center" tebalFilter />
    <Coret pts={lingkaran(E.x0 + 760, E.y0 + 775, 200, 70, 4)} mulai={W(4, "empat puluh lima rupiah", 0)} lama={12} warna={k.merah} tebal={6} />
    <Tulis x={E.x} y={E.y0 + 990} teks="yang besar lebih mahal per ml" ukuran={66} gaya="tebal" warna={k.kuning} mulai={W(4, "empat puluh lima rupiah", 0.2, 18)} perHuruf={0.8} rata="center" />
    <Tulis x={E.x} y={E.y0 + 1110} teks="(contoh hitungan)" ukuran={40} gaya="tipis" warna={k.biru} mulai={W(4, "Contohnya", 0.5)} perHuruf={0.8} rata="center" />

    {/* ===== F: solusi ===== */}
    <Tulis x={F.x0 + 100} y={F.y0 + 250} teks="Sebelum ambil:" ukuran={92} gaya="hias" warna={k.kuning} mulai={W(5, "Cek label", -0.4)} perHuruf={1.4} />
    <Checklist
      x={F.x0 + 100}
      y={F.y0 + 440}
      jarak={190}
      baris={[
        { kotak: W(5, "Cek label", -0.3), centang: W(5, "Kalau nggak ada", -0.2), teks: <Tulis x={F.x0 + 220} y={F.y0 + 440} teks="cek label harga per satuan" ukuran={56} mulai={W(5, "Cek label")} perHuruf={1} /> },
        { kotak: W(5, "Kalau nggak ada", -0.3), centang: W(5, "kalkulator", 0, 8), teks: <Tulis x={F.x0 + 220} y={F.y0 + 630} teks="bagi harga ÷ isi" ukuran={56} mulai={W(5, "bagi harganya", -0.3)} perHuruf={1.1} /> },
      ]}
    />
    <Muncul mulai={W(5, "kalkulator", -0.6)}>
      <B_.hp cx={F.x0 + 330} cy={F.y0 + 930} s={330} teks="kalkulator" />
    </Muncul>
    <Tulis x={F.x0 + 720} y={F.y0 + 880} teks="45.000 ÷ 1.000" ukuran={60} gaya="tebal" mulai={W(5, "kalkulator", -0.3)} perHuruf={1} rata="center" />
    <Tulis x={F.x0 + 720} y={F.y0 + 990} teks="= 45/ml" ukuran={84} gaya="tebal" warna={k.kuning} mulai={W(5, "kalkulator", 0.2, 14)} perHuruf={1.5} rata="center" tebalFilter />
    <Panah x1={F.x0 + 520} y1={F.y0 + 930} x2={F.x0 + 600} y2={F.y0 + 900} tinggi={20} mulai={W(5, "kalkulator", -0.2)} lama={6} tebal={5} />

    {/* ===== G: CTA ===== */}
    <Tulis x={G.x} y={G.y0 + 300} teks="Pilih besar atau kecil?" ukuran={132} gaya="tebal" mulai={Math.max(W(6, "Kamu biasanya"), d(R.T.b6 + 1.6))} perHuruf={1.4} rata="center" />
    <Muncul mulai={W(6, "besar atau kecil", -0.2)}>
      <B_.gelembung cx={G.x + 120} cy={G.y0 + 545} s={500} teks="besar / kecil" />
    </Muncul>
    <Tulis x={G.x} y={G.y0 + 800} teks="jawab 1 kata di komen ↓" ukuran={100} gaya="hias" warna={k.kuning} mulai={W(6, "Jawab satu kata")} perHuruf={1.4} rata="center" />
    <Tulis x={G.x - 170} y={G.y0 + 980} teks="kirim ke teman" ukuran={110} mulai={W(6, "Kirim")} perHuruf={1.6} rata="center" />
    {pesawat(G.x + 270, G.y0 + 900, 0.9).map((pts, j) => (
      <Coret key={j} pts={pts} mulai={W(6, "Kirim", 0.2) + j * 14} lama={14} tebal={7} kapur={j === 0} />
    ))}
    <Tulis x={G.x} y={G.y0 + 1130} teks="IntipDompet" ukuran={150} gaya="tebal" mulai={W(6, "IntipDompet")} perHuruf={2} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1235} teks="Biar dompetmu nggak kaget." ukuran={96} gaya="hias" warna={k.kuning} mulai={W(6, "Biar dompetmu")} perHuruf={1.5} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1320} teks="konten edukasi · angka = contoh hitungan" ukuran={54} gaya="tipis" warna={k.biru} mulai={W(6, "IntipDompet", 0.3)} perHuruf={0.5} rata="center" />
  </>
);

const TEKS_TAMPIL = [
  "",
  "Cara paling jujur membandingkan adalah harga per satuan: per gram, per mililiter, atau per lembar.",
  "Mirip beli gorengan. Rp3 ribu dapat satu, atau Rp10 ribu dapat tiga? Yang kedua malah lebih mahal per biji.",
  "Label hemat atau kemasan jumbo sering bikin kita langsung ambil, tanpa menghitung dulu.",
  "Contohnya, sabun 500 ml Rp20 ribu, berarti Rp40 per ml. Yang 1 liter Rp45 ribu, jadi Rp45 per ml.",
  "Cek label harga per satuan di rak kalau ada. Kalau nggak ada, bagi harganya dengan isi pakai kalkulator HP.",
  "Kamu biasanya pilih kemasan besar atau kecil? Jawab satu kata di komen. Kirim ke teman yang suka stok belanja bulanan.",
];

export const HargaPerSatuanReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);
