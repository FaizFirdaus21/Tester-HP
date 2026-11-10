// "Bunga deposito tinggi, tapi nggak dijamin LPS?" (produksi/20261109-bunga-deposito-lps)
// Gaya: template Buku Catatan. Satu bagian halaman per blok VO 0–5, lalu mundur ke seluruh halaman dan sobekan penutup.
//
// Sinkron: tiap tulisan/coretan ditempatkan pada frasa yang diucapkan (padaFrasa), memakai jangkar jeda kalimat
// dari audio. vo-waktu.json di folder ini dibuat dengan:
//   python3 scripts/sinkron_vo.py produksi/20261109-bunga-deposito-lps src/produksi/bunga-deposito-lps/vo-waktu.json
// Jalankan ulang setiap kali VO dibuat ulang. Tanpa audio, waktunya diperkirakan dari jumlah kata naskah (perkiraanVO).
import React from "react";
import { useCurrentFrame } from "remotion";
import naskah from "../../../produksi/20261109-bunga-deposito-lps/naskah-vo.json";
import vo from "./vo-waktu.json";
import { CatatanSobek, Coret, GarisUkur, Indeks, Kanvas, Panah, SapuanTinta, Stempel, Subtitel, SuaraVO, Sumbu, Tulis, garisTangan, lingkaranTangan, p01 } from "../../catatan/Komponen";
import { DataVO, jadwalVO, padaFrasa, perkiraanVO, rapatkanVO, subtitelDariBlok } from "../../catatan/Jadwal";
import { Meja, Properti, kameraOtomatis, nomorBagian, tataHalaman } from "../../catatan/Meja";
import { c, d, f } from "../../catatan/tema";

// ---------------------------------------------------------------- pilihan yang menunggu keputusan user
// Blok VO yang dipakai. Membuang blok (mis. 3 = contoh Rp10 juta, 4 = 14 BPR) cukup dengan menghapus indeksnya:
// audio blok itu tidak diputar, bagiannya hilang dari halaman, dan kamera menyesuaikan. Tidak perlu VO ulang.
const BLOK_DIPAKAI = [0, 1, 2, 3, 4, 5, 6, 7];
// true = angka lurus (lining) untuk semua tulisan di halaman; false = angka gaya lama seperti referensi.
const ANGKA_LURUS = false;
// Jeda antar-blok (detik) setelah hening di ujung tiap blok TTS dibuang.
const JEDA_BLOK = 0.4;

// ---------------------------------------------------------------- jadwal
const VO = rapatkanVO(vo as DataVO, { pakai: BLOK_DIPAKAI, jeda: JEDA_BLOK });
const dipakai = (i: number) => BLOK_DIPAKAI.includes(i);

// Bagian halaman = blok 0–5 yang dipakai, berurutan.
const BAGIAN = [0, 1, 2, 3, 4, 5].filter(dipakai);
const TATA = tataHalaman(BAGIAN.length);
const LUAR: [number, number] = [-50000, -50000]; // bagian yang dibuang digambar jauh di luar halaman
const asal = (i: number) => (dipakai(i) ? TATA.asal[BAGIAN.indexOf(i)] : LUAR);
const [B1, B2, B3, B4, B5, B6] = [0, 1, 2, 3, 4, 5].map(asal);

// Hook harus terbaca secepatnya: suara mulai 0,5 s (setelah sapuan tinta), bukan 1,2 s seperti referensi.
const J = jadwalVO(
  VO,
  { b1: 0, b2: 1, b3: 2, b4: 3, b5: 4, b6: 5, penutup: 6, tagline: 7, akhir: "selesai" },
  perkiraanVO(naskah),
  { awal: 0.5, ekor: 2 },
);
const T = J.T;
export const DURASI_DEPOSITO = d(T.akhir);

// Frame saat `frasa` diucapkan di blok i (geser dalam detik).
const F = (i: number, frasa: string, geser = 0) => d(padaFrasa(J, i, naskah.blok[i].teks, frasa, geser));

const MULAI_BAGIAN = BAGIAN.map((i, k) => (k === 0 ? 0 : [T.b1, T.b2, T.b3, T.b4, T.b5, T.b6][i]));
const MUNDUR = T.penutup - 0.3;
const KAMERA = kameraOtomatis(TATA, MULAI_BAGIAN, MUNDUR, T.akhir);

const PROPERTI: Properti[] = [
  { jenis: "pensil", x: 760, y: 120, putar: 64, dalam: 1.3, kabur: 10 },
  { jenis: "penggaris", x: 700, y: 3700, putar: -3, dalam: 1.25, kabur: 12 },
  { jenis: "cangkir", x: -60, y: 5200, dalam: 1.3, kabur: 14 },
  { jenis: "pensil", x: 2100, y: 4100, putar: -120, dalam: 1.3, kabur: 10 },
];

// Tanda tanya merah seperti coretan spidol.
const tanyaD = (x: number, y: number, s = 1) =>
  `M ${x - 70 * s} ${y - 60 * s} C ${x - 70 * s} ${y - 170 * s} ${x + 110 * s} ${y - 180 * s} ${x + 110 * s} ${y - 60 * s} C ${x + 110 * s} ${y + 20 * s} ${x + 10 * s} ${y + 10 * s} ${x + 10 * s} ${y + 110 * s}`;

// Gedung bank kecil (atap segitiga, tiga tiang, alas).
const bankD = (cx: number, cy: number) =>
  [
    `M ${cx - 50} ${cy - 28} L ${cx} ${cy - 64} L ${cx + 50} ${cy - 28} Z`,
    `M ${cx - 32} ${cy - 20} L ${cx - 32} ${cy + 38}`,
    `M ${cx} ${cy - 20} L ${cx} ${cy + 38}`,
    `M ${cx + 32} ${cy - 20} L ${cx + 32} ${cy + 38}`,
    `M ${cx - 56} ${cy + 46} L ${cx + 56} ${cy + 46}`,
  ].join(" ");

// Kotak centang tulisan tangan.
const kotakD = (x: number, y: number, s = 56) => `M ${x} ${y} L ${x + s} ${y + 2} L ${x + s - 2} ${y + s} L ${x + 1} ${y + s - 1} Z`;
const centangD = (x: number, y: number) => `M ${x + 8} ${y + 26} L ${x + 26} ${y + 50} L ${x + 72} ${y - 18}`;

// Posisi 14 gedung bank (7 × 2) di bagian 5.
const BANK = Array.from({ length: 14 }, (_, i) => ({ x: 165 + (i % 7) * 125, y: i < 7 ? 560 : 740 }));
const bankMulai = (i: number) => F(4, "empat belas") + Math.round(i * 3.6);

// Garis bilangan bunga di bagian 2: 0%..7%.
const xPersen = (v: number) => 140 + v * 115;

const Halaman: React.FC = () => {
  const fr = useCurrentFrame();
  const jumlahBank = BANK.filter((_, i) => fr >= bankMulai(i)).length;
  return (
    <>
      <Kanvas lebar={TATA.lebar} tinggi={TATA.tinggi}>
        {/* ---------- B1: hook */}
        <GarisUkur x={B1[0] + 70} y={B1[1] + 270} w={140} mulai={6} />
        <Coret d={garisTangan(B1[0] + 290, B1[1] + 930, B1[0] + 790, B1[1] + 930, 3, 3)} mulai={34} durasi={8} tebal={4} />
        <Coret d={tanyaD(B1[0] + 830, B1[1] + 1050, 0.85)} mulai={F(0, "aman")} durasi={10} warna={c.merah} tebal={20} />
        <circle cx={B1[0] + 841} cy={B1[1] + 1212} r={15} fill={c.merah} opacity={p01(fr, F(0, "aman") + 10, 3)} />

        {/* ---------- B2: batas LPS 3,75% */}
        <GarisUkur x={B2[0] + 70} y={B2[1] + 270} w={140} mulai={d(T.b2 + 0.2)} ruas={2} />
        <Coret d={garisTangan(B2[0] + 120, B2[1] + 500, B2[0] + 300, B2[1] + 440, 2, 2)} mulai={F(1, "Belum", 0.5)} durasi={8} warna={c.merah} tebal={9} />
        <Coret d={garisTangan(B2[0] + 330, B2[1] + 770, B2[0] + 750, B2[1] + 770, 5, 3)} mulai={F(1, "tiga koma", 1.2)} durasi={10} />
        <Sumbu x1={B2[0] + 100} x2={B2[0] + 990} y={B2[1] + 1060} tanda={[0, 1, 2, 3, 4, 5, 6, 7].map((v) => B2[0] + xPersen(v))} mulai={F(1, "bunganya")} durasi={14} />
        <Coret d={`M ${B2[0] + xPersen(0)} ${B2[1] + 1060} L ${B2[0] + xPersen(3.75)} ${B2[1] + 1060}`} mulai={F(1, "tiga koma")} durasi={12} tebal={14} opacity={0.8} />
        <Coret d={`M ${B2[0] + xPersen(3.75)} ${B2[1] + 1060} L ${B2[0] + xPersen(6)} ${B2[1] + 1060}`} mulai={F(1, "tiga koma", 1.4)} durasi={12} warna={c.merah} tebal={14} opacity={0.75} />
        <Coret d={lingkaranTangan(B2[0] + xPersen(6), B2[1] + 1060, 46, 40, 3)} mulai={F(1, "tiga koma", 2)} durasi={10} warna={c.merah} tebal={5} />

        {/* ---------- B3: dikira vs faktanya */}
        <GarisUkur x={B3[0] + 70} y={B3[1] + 270} w={140} mulai={d(T.b3 + 0.2)} />
        <Coret d={garisTangan(B3[0] + 540, B3[1] + 300, B3[0] + 540, B3[1] + 1150, 4, 2)} mulai={F(2, "Banyak")} durasi={14} tebal={2.5} warna={c.tintaPudar} />
        <Coret d={garisTangan(B3[0] + 100, B3[1] + 520, B3[0] + 480, B3[1] + 730, 6, 3)} mulai={F(2, "Padahal")} durasi={8} warna={c.merah} tebal={7} />
        <Coret d={lingkaranTangan(B3[0] + 785, B3[1] + 690, 215, 200, 5)} mulai={F(2, "termasuk pokoknya")} durasi={14} warna={c.merah} tebal={6} />

        {/* ---------- B4: contoh Rp10 juta */}
        <GarisUkur x={B4[0] + 70} y={B4[1] + 270} w={140} mulai={d(T.b4 + 0.2)} ruas={3} />
        <Coret d={`M ${B4[0] + 140} ${B4[1] + 340} L ${B4[0] + 600} ${B4[1] + 336} L ${B4[0] + 604} ${B4[1] + 640} L ${B4[0] + 138} ${B4[1] + 644} Z`} mulai={F(3, "Misalnya")} durasi={14} tebal={4.5} />
        <Coret d={`M ${B4[0] + 140} ${B4[1] + 340} L ${B4[0] + 372} ${B4[1] + 480} L ${B4[0] + 600} ${B4[1] + 336}`} mulai={F(3, "Misalnya", 0.4)} durasi={10} tebal={3.5} />
        <Panah x1={B4[0] + 630} y1={B4[1] + 500} x2={B4[0] + 770} y2={B4[1] + 500} tinggi={70} mulai={F(3, "Kalau banknya")} durasi={12} warna={c.merah} tebal={6} />
        <Coret d={tanyaD(B4[0] + 860, B4[1] + 470, 0.7)} mulai={F(3, "Kalau banknya", 0.5)} durasi={10} warna={c.merah} tebal={16} />
        <circle cx={B4[0] + 867} cy={B4[1] + 604} r={13} fill={c.merah} opacity={p01(fr, F(3, "Kalau banknya", 0.5) + 10, 3)} />

        {/* ---------- B5: 14 BPR/BPRS dilikuidasi */}
        <GarisUkur x={B5[0] + 70} y={B5[1] + 270} w={140} mulai={d(T.b5 + 0.2)} />
        {BANK.map((b, i) => (
          <Coret key={i} d={bankD(B5[0] + b.x, B5[1] + b.y)} mulai={bankMulai(i)} durasi={6} tebal={3.5} />
        ))}
        {BANK.map((b, i) => (
          <Coret
            key={`x${i}`}
            d={garisTangan(B5[0] + b.x - 52, B5[1] + b.y + 40, B5[0] + b.x + 52, B5[1] + b.y - 56, i + 20, 2)}
            mulai={F(4, "sudah dilikuidasi") + Math.round(i * 0.8)}
            durasi={5}
            warna={c.merah}
            tebal={5}
          />
        ))}

        {/* ---------- B6: checklist */}
        <GarisUkur x={B6[0] + 70} y={B6[1] + 270} w={140} mulai={d(T.b6 + 0.2)} ruas={2} />
        <Coret d={kotakD(B6[0] + 100, B6[1] + 492)} mulai={F(5, "bunga plus")} durasi={8} tebal={4} />
        <Coret d={centangD(B6[0] + 100, B6[1] + 492)} mulai={F(5, "atau nggak")} durasi={8} warna={c.merah} tebal={9} />
        <Coret d={kotakD(B6[0] + 100, B6[1] + 742)} mulai={F(5, "Ingat")} durasi={8} tebal={4} />
        <Coret d={centangD(B6[0] + 100, B6[1] + 742)} mulai={F(5, "per bank")} durasi={8} warna={c.merah} tebal={9} />
        <Coret d={garisTangan(B6[0] + 300, B6[1] + 1100, B6[0] + 780, B6[1] + 1100, 9, 2)} mulai={F(5, "Ingat", 1.4)} durasi={10} tebal={2.5} warna={c.tintaPudar} />
      </Kanvas>

      {/* ---------- teks B1 */}
      <Tulis x={B1[0] + 540} y={B1[1] + 470} rata="center" gaya="tinta" ukuran={140} mulai={8} perHuruf={2} teks="Deposito" />
      <Tulis x={B1[0] + 540} y={B1[1] + 780} rata="center" gaya="tinta" ukuran={340} mulai={22} perHuruf={4} teks="6%" />
      <Tulis x={B1[0] + 830} y={B1[1] + 600} gaya="tangan" ukuran={36} warna={c.tintaPudar} mulai={30} perHuruf={1} miring={-6} teks="(contoh)" />
      <Tulis x={B1[0] + 130} y={B1[1] + 1080} gaya="spidol" warna={c.merah} ukuran={120} mulai={F(0, "aman") - 4} perHuruf={2} teks="aman?" />

      {/* ---------- teks B2 */}
      <Tulis x={B2[0] + 540} y={B2[1] + 340} rata="center" gaya="spidol" warna={c.merah} ukuran={84} mulai={F(1, "Belum")} perHuruf={2} teks="Belum tentu." />
      <Tulis x={B2[0] + 210} y={B2[1] + 470} rata="center" gaya="tinta" ukuran={96} mulai={F(1, "Belum")} perHuruf={2} warna={c.tintaPudar} teks="6%" />
      <Stempel x={B2[0] + 760} y={B2[1] + 470} teks="LPS · bank umum" mulai={F(1, "El pe es")} />
      <Tulis x={B2[0] + 540} y={B2[1] + 650} rata="center" gaya="tinta" ukuran={230} mulai={F(1, "tiga koma")} perHuruf={3} teks="3,75%" />
      <Tulis x={B2[0] + 540} y={B2[1] + 830} rata="center" gaya="tangan" ukuran={46} mulai={F(1, "setahun")} perHuruf={1} teks="batas bunga yang dijamin LPS" />
      <Tulis x={B2[0] + 540} y={B2[1] + 895} rata="center" gaya="tangan" ukuran={34} mulai={F(1, "sampai akhir")} perHuruf={1} warna={c.tintaPudar} teks="berlaku 1 Okt 2026 – 31 Jan 2027" />
      <Tulis x={B2[0] + xPersen(1.9)} y={B2[1] + 1010} rata="center" gaya="tangan" ukuran={34} mulai={F(1, "tiga koma", 0.6)} perHuruf={1} teks="dijamin" />
      <Tulis x={B2[0] + xPersen(4.9)} y={B2[1] + 1010} rata="center" gaya="spidol" warna={c.merah} ukuran={32} mulai={F(1, "tiga koma", 1.8)} perHuruf={1} teks="tidak dijamin" />
      {[
        [0, "0%"],
        [3.75, "3,75%"],
        [6, "6%"],
      ].map(([v, t]) => (
        <Tulis key={t as string} x={B2[0] + xPersen(v as number)} y={B2[1] + 1130} rata="center" gaya="serif" ukuran={40} mulai={F(1, "bunganya", 0.4)} perHuruf={1} teks={t as string} />
      ))}

      {/* ---------- teks B3 */}
      <Tulis x={B3[0] + 290} y={B3[1] + 350} rata="center" gaya="tangan" ukuran={58} warna={c.tintaPudar} mulai={F(2, "Banyak")} perHuruf={2} teks="Dikira" />
      <Tulis x={B3[0] + 290} y={B3[1] + 625} rata="center" gaya="serif" ukuran={56} lebar={380} mulai={F(2, "cuma kelebihan")} perHuruf={1} teks="cuma kelebihan bunga yang hangus" />
      <Tulis x={B3[0] + 790} y={B3[1] + 350} rata="center" gaya="spidol" warna={c.merah} ukuran={62} mulai={F(2, "Padahal")} perHuruf={2} teks="Faktanya" />
      <Tulis x={B3[0] + 790} y={B3[1] + 570} rata="center" gaya="tinta" ukuran={90} mulai={F(2, "seluruh simpanannya")} perHuruf={2} teks="pokok" />
      <Tulis x={B3[0] + 790} y={B3[1] + 670} rata="center" gaya="tinta" ukuran={90} mulai={F(2, "seluruh simpanannya", 0.4)} perHuruf={2} teks="+ bunga" />
      <Tulis x={B3[0] + 780} y={B3[1] + 800} rata="center" gaya="spidol" warna={c.merah} ukuran={48} mulai={F(2, "nggak dijamin")} perHuruf={2} teks="TIDAK dijamin" />
      <Tulis x={B3[0] + 790} y={B3[1] + 1120} rata="center" gaya="tangan" ukuran={30} warna={c.tintaPudar} mulai={F(2, "aturan")} perHuruf={1} teks="sumber: FAQ LPS" />

      {/* ---------- teks B4 */}
      <Tulis x={B4[0] + 372} y={B4[1] + 570} rata="center" gaya="tinta" ukuran={84} mulai={F(3, "sepuluh juta")} perHuruf={2} teks="Rp10 juta" />
      <Tulis x={B4[0] + 540} y={B4[1] + 770} rata="center" gaya="tinta" ukuran={80} mulai={F(3, "bunga enam")} perHuruf={2} teks={[{ t: "bunga " }, { t: "6%", warna: c.merah }, { t: " > 3,75%" }]} />
      <Tulis x={B4[0] + 540} y={B4[1] + 885} rata="center" gaya="tangan" ukuran={50} mulai={F(3, "bisa nggak")} perHuruf={1} teks="bisa nggak diganti" />
      <Stempel x={B4[0] + 540} y={B4[1] + 1010} teks="cashback = bunga" mulai={F(3, "Cashback")} miring={-6} ukuran={52} />
      <Tulis x={B4[0] + 540} y={B4[1] + 1140} rata="center" gaya="tangan" ukuran={30} warna={c.tintaPudar} mulai={F(3, "Misalnya", 1)} perHuruf={1} teks="contoh hitungan, bukan data bank tertentu" />

      {/* ---------- teks B5 */}
      <Tulis x={B5[0] + 540} y={B5[1] + 360} rata="center" gaya="serif" ukuran={86} mulai={F(4, "Dan bank")} perHuruf={2} teks="Bank bisa tutup" />
      {jumlahBank > 0 ? (
        <div style={{ position: "absolute", left: B5[0] + 540, top: B5[1] + 950, transform: "translate(-50%, -50%)", fontFamily: f.tinta, fontSize: 170, letterSpacing: "0.04em", WebkitTextStroke: "0.035em currentColor", color: c.tinta }}>
          {jumlahBank}
        </div>
      ) : null}
      <Tulis x={B5[0] + 540} y={B5[1] + 1075} rata="center" gaya="tangan" ukuran={44} mulai={F(4, "empat belas", 0.8)} perHuruf={1} teks="BPR & BPRS dilikuidasi · hingga Okt 2026" />
      <Tulis x={B5[0] + 540} y={B5[1] + 1140} rata="center" gaya="tangan" ukuran={30} warna={c.tintaPudar} mulai={F(4, "Hingga")} perHuruf={1} teks="sumber: KSSK, 3 Nov 2026" />

      {/* ---------- teks B6 */}
      <Tulis x={B6[0] + 100} y={B6[1] + 350} gaya="spidol" warna={c.merah} ukuran={92} mulai={F(5, "cek dulu")} perHuruf={2} teks="Cek dulu:" />
      <Tulis x={B6[0] + 190} y={B6[1] + 520} gaya="serif" ukuran={62} mulai={F(5, "bunga plus")} perHuruf={1} teks="bunga + cashback ≤ 3,75%" />
      <Tulis x={B6[0] + 190} y={B6[1] + 600} gaya="tangan" ukuran={38} warna={c.tintaPudar} mulai={F(5, "di bawah batas")} perHuruf={1} teks="masih di bawah batas LPS?" />
      <Tulis x={B6[0] + 190} y={B6[1] + 770} gaya="serif" ukuran={62} mulai={F(5, "Ingat")} perHuruf={1} teks="jaminan maks. Rp2 miliar" />
      <Tulis x={B6[0] + 190} y={B6[1] + 850} gaya="tangan" ukuran={38} warna={c.tintaPudar} mulai={F(5, "per nasabah")} perHuruf={1} teks="per nasabah, per bank" />
      <Tulis x={B6[0] + 540} y={B6[1] + 1060} rata="center" gaya="tangan" ukuran={38} mulai={F(5, "Ingat", 0.6)} perHuruf={1} teks="cek di kalkulator 3T LPS" />
    </>
  );
};

// Subtitel tipis: bentuk tulisan (bukan ejaan VO). Blok 0 tanpa subtitel karena hook sudah tertulis besar.
// Blok 6–7 tanpa subtitel karena isinya tertulis di sobekan penutup.
const TEKS_TAMPIL = [
  "",
  "Belum tentu. LPS cuma menjamin simpanan rupiah di bank umum yang bunganya maksimal 3,75% setahun, sampai akhir Januari 2027.",
  "Banyak yang kira cuma kelebihan bunganya yang hangus. Padahal menurut aturan LPS, seluruh simpanannya nggak dijamin, termasuk pokoknya.",
  "Misalnya kamu taruh Rp10 juta dengan bunga 6% di bank umum. Kalau banknya tutup, Rp10 juta itu bisa nggak diganti. Cashback juga dihitung bunga, lho.",
  "Dan bank memang bisa tutup. Hingga Oktober tahun ini, 14 BPR dan BPRS sudah dilikuidasi.",
  "Jadi, cek dulu: bunga plus cashback-nya masih di bawah batas atau nggak. Ingat juga, jaminannya maksimal Rp2 miliar per nasabah per bank.",
];
const SUBTITEL = subtitelDariBlok(J, TEKS_TAMPIL.map((t, i) => (dipakai(i) ? t : "")))
  .map((s) => ({ ...s, selesai: Math.min(s.selesai, MUNDUR) }))
  .filter((s) => s.selesai - s.mulai > 0.2);

export const BungaDepositoLPS: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => {
  const fr = useCurrentFrame();
  return (
    <Meja
      ukuran={TATA}
      kamera={KAMERA}
      properti={PROPERTI}
      halaman={
        <div style={{ fontVariantNumeric: ANGKA_LURUS ? "lining-nums" : undefined }}>
          <Halaman />
        </div>
      }
      layar={
        <>
          {fr < d(MUNDUR) ? <Indeks nomor={nomorBagian(fr, MULAI_BAGIAN)} /> : null}
          {subtitel ? <Subtitel baris={SUBTITEL} /> : null}
          {J.ada ? <SuaraVO vo={VO} awal={J.awal} /> : null}
          <SapuanTinta mulai={0} durasi={16} />
          <CatatanSobek
            mulai={F(6, "Bunga tinggi", 1.0)}
            y={880}
            judul={[{ t: "Bunga tinggi boleh, asal " }, { t: "tahu risikonya.", warna: c.merah }]}
            kecil="Konten edukasi, bukan ajakan membeli."
            mulaiKecil={F(6, "Konten edukasi")}
            logo
            mulaiAjakan={F(7, "IntipDompet")}
            ajakan="Urusan uang, kita intip. Follow @intipdompet"
          />
        </>
      }
    />
  );
};
