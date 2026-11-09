// Demo template Buku Catatan dengan naskah "Inflasi terkendali, kok belanja makin mahal?".
// Waktu ditulis dalam detik (d()) supaya mudah disesuaikan dengan voice-over.
import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import vo from "./vo-waktu.json";
import { CatatanSobek, Coret, GarisUkur, Indeks, Kanvas, Panah, SapuanTinta, Sketsa, Stempel, Subtitel, Sumbu, Tulis, gelombang, garisTangan, lingkaranTangan, p01 } from "../Komponen";
import { DataVO, jadwalVO, setelah } from "../Jadwal";
import { Meja, Properti, kameraOtomatis, nomorBagian, tataHalaman } from "../Meja";
import { c, d } from "../tema";

// Halaman 2 kolom × 3 baris bagian. Jumlah bagian bebas: tataHalaman(n) menyusun asal tiap bagian.
const TATA = tataHalaman(6);
const [B1, B2, B3, B4, B5, B6] = TATA.asal;

// Jadwal (detik). Tanpa VO: CADANGAN. Dengan VO (vo-waktu.json terisi): tiap isyarat mulai tepat saat bloknya diucapkan.
// Blok VO: 0 hook, 1 data BPS, 2 jangan salah paham, 3 cabai, 4 disalahpahami, 5 pangan & daya beli, 6 kesimpulan, 7 penutup.
const J = jadwalVO(
  vo as DataVO,
  { b1: 0, b2: 1, b3: 2, b4: 3, b5: 4, b6: 5, mundur: 6, sobek: 7, akhir: "selesai" },
  { b1: 0, b2: 7.2, b3: 15.6, b4: 21.4, b5: 34.2, b6: 41.4, mundur: 47.2, sobek: 49.4, akhir: 54 },
);
const T = J.T;
const R = J.r;
export const DURASI_CATATAN = d(T.akhir);

const MULAI_BAGIAN = [0, T.b2, T.b3, T.b4, T.b5, T.b6];
const KAMERA = kameraOtomatis(TATA, MULAI_BAGIAN, T.mundur, T.akhir);

const PROPERTI: Properti[] = [
  { jenis: "pensil", x: 760, y: 120, putar: 64, dalam: 1.3, kabur: 10 },
  { jenis: "penggaris", x: 700, y: 3700, putar: -3, dalam: 1.25, kabur: 12 },
  { jenis: "cangkir", x: -60, y: 5200, dalam: 1.3, kabur: 14 },
  { jenis: "pensil", x: 2100, y: 4100, putar: -120, dalam: 1.3, kabur: 10 },
];

// Tanda tanya besar merah (digambar seperti coretan spidol).
const tanyaD = (x: number, y: number, s = 1) =>
  `M ${x - 70 * s} ${y - 60 * s} C ${x - 70 * s} ${y - 170 * s} ${x + 110 * s} ${y - 180 * s} ${x + 110 * s} ${y - 60 * s} C ${x + 110 * s} ${y + 20 * s} ${x + 10 * s} ${y + 10 * s} ${x + 10 * s} ${y + 110 * s}`;

// Cabai sketsa (siluet).
const cabaiD = (x: number, y: number, s = 1) =>
  `M ${x} ${y} C ${x + 40 * s} ${y - 40 * s} ${x + 150 * s} ${y - 30 * s} ${x + 280 * s} ${y + 30 * s} C ${x + 360 * s} ${y + 70 * s} ${x + 420 * s} ${y + 140 * s} ${x + 440 * s} ${y + 210 * s} C ${x + 380 * s} ${y + 150 * s} ${x + 300 * s} ${y + 110 * s} ${x + 200 * s} ${y + 90 * s} C ${x + 100 * s} ${y + 70 * s} ${x + 20 * s} ${y + 60 * s} ${x} ${y} Z`;

const Halaman: React.FC = () => {
  const fr = useCurrentFrame();
  const t = (detik: number) => d(detik);
  return (
    <>
      <Kanvas lebar={TATA.lebar} tinggi={TATA.tinggi}>
        {/* ---------- B1: judul */}
        <GarisUkur x={B1[0] + 70} y={B1[1] + 300} w={140} mulai={t(1.4)} />
        <Coret d={garisTangan(B1[0] + 60, B1[1] + 840, B1[0] + 1010, B1[1] + 840, 3, 3)} mulai={t(2.2)} durasi={t(1.1)} tebal={4} />
        <Coret d={tanyaD(B1[0] + 880, B1[1] + 1060, 1.25)} mulai={t(5.2)} durasi={t(0.6)} warna={c.merah} tebal={22} />
        <circle cx={B1[0] + 893} cy={B1[1] + 1250} r={17} fill={c.merah} opacity={p01(fr, t(5.8), 3)} />
        <Coret d={gelombang(B1[0] + 60, B1[1] + 1640, 460, 16, 2)} mulai={t(2.4)} durasi={t(1)} tebal={2.5} warna={c.tintaPudar} />

        {/* ---------- B2: data BPS */}
        <GarisUkur x={B2[0] + 70} y={B2[1] + 300} w={140} mulai={t(setelah(R("b2"), 0.2))} ruas={2} />
        <Coret d={garisTangan(B2[0] + 160, B2[1] + 770, B2[0] + 920, B2[1] + 770, 5, 3)} mulai={t(setelah(R("b2"), 1.4))} durasi={t(0.6)} />
        <Sumbu x1={B2[0] + 120} x2={B2[0] + 960} y={B2[1] + 1010} tanda={[0, 1, 2, 3, 4, 5, 6].map((v) => B2[0] + 140 + v * 130)} mulai={t(setelah(R("b2"), 3))} durasi={t(0.6)} />
        <Coret d={`M ${B2[0] + 140 + 1.5 * 130} ${B2[1] + 950} L ${B2[0] + 140 + 3.5 * 130} ${B2[1] + 950}`} mulai={t(setelah(R("b2"), 3.8))} durasi={t(0.5)} warna={c.merah} tebal={14} opacity={0.75} />
        <Coret d={`M ${B2[0] + 140 + 3.23 * 130} ${B2[1] + 920} L ${B2[0] + 140 + 3.23 * 130} ${B2[1] + 1040}`} mulai={t(setelah(R("b2"), 4.4))} durasi={t(0.25)} warna={c.tinta} tebal={6} />
        <Coret d={lingkaranTangan(B2[0] + 800, B2[1] + 1210, 170, 66, 4)} mulai={t(setelah(R("b2"), 6.4))} durasi={t(0.6)} warna={c.merah} tebal={6} />

        {/* ---------- B3: inflasi rendah != harga murah */}
        <GarisUkur x={B3[0] + 70} y={B3[1] + 300} w={140} mulai={t(setelah(R("b3"), 0.3))} />
        <Coret d={lingkaranTangan(B3[0] + 760, B3[1] + 820, 250, 92, 2)} mulai={t(setelah(R("b3"), 3.4))} durasi={t(0.6)} warna={c.merah} tebal={6} />
        <Sketsa id="label" mulai={t(setelah(R("b3"), 1.2))} d={`M ${B3[0] + 300} ${B3[1] + 1000} L ${B3[0] + 640} ${B3[1] + 1000} L ${B3[0] + 760} ${B3[1] + 1090} L ${B3[0] + 640} ${B3[1] + 1180} L ${B3[0] + 300} ${B3[1] + 1180} Z`} bayangan={{ cx: B3[0] + 520, cy: B3[1] + 1225, rx: 230, ry: 16 }} />
        <circle cx={B3[0] + 650} cy={B3[1] + 1090} r={16} fill="none" stroke={c.tinta} strokeWidth={4} opacity={p01(fr, t(setelah(R("b3"), 1.8)), 4)} />

        {/* ---------- B4: cabai */}
        <GarisUkur x={B4[0] + 70} y={B4[1] + 300} w={140} mulai={t(setelah(R("b4"), 0.2))} ruas={3} />
        <Sketsa id="cabai" mulai={t(setelah(R("b4"), 0.6))} d={cabaiD(B4[0] + 280, B4[1] + 340, 1.15)} bayangan={{ cx: B4[0] + 540, cy: B4[1] + 640, rx: 230, ry: 16 }} />
        <Coret d={`M ${B4[0] + 280} ${B4[1] + 340} C ${B4[0] + 250} ${B4[1] + 320} ${B4[0] + 230} ${B4[1] + 290} ${B4[0] + 230} ${B4[1] + 255}`} mulai={t(setelah(R("b4"), 1.2))} durasi={8} tebal={5} />
        <Sumbu x1={B4[0] + 80} x2={B4[0] + 1000} y={B4[1] + 980} tanda={[200, 540, 880].map((x) => B4[0] + x)} mulai={t(setelah(R("b4"), 1.6))} durasi={t(0.6)} />
        <Panah x1={B4[0] + 210} y1={B4[1] + 940} x2={B4[0] + 530} y2={B4[1] + 940} tinggi={130} mulai={t(setelah(R("b4"), 4.2))} durasi={t(0.6)} warna={c.merah} tebal={7} />
        <Panah x1={B4[0] + 550} y1={B4[1] + 940} x2={B4[0] + 870} y2={B4[1] + 940} tinggi={60} mulai={t(setelah(R("b4"), 7.6))} durasi={t(0.6)} warna={c.tintaPudar} tebal={3} />
        <Coret d={lingkaranTangan(B4[0] + 880, B4[1] + 1090, 130, 60, 6)} mulai={t(setelah(R("b4"), 9.4))} durasi={t(0.5)} warna={c.merah} tebal={6} />
        

        {/* ---------- B5: harga = tinggi, inflasi = kemiringan */}
        <GarisUkur x={B5[0] + 70} y={B5[1] + 300} w={140} mulai={t(setelah(R("b5"), 0.3))} />
        <Coret d={`M ${B5[0] + 140} ${B5[1] + 420} L ${B5[0] + 140} ${B5[1] + 1100} L ${B5[0] + 980} ${B5[1] + 1100}`} mulai={t(setelah(R("b5"), 0.6))} durasi={t(0.6)} tebal={3.5} />
        <Coret
          d={`M ${B5[0] + 160} ${B5[1] + 1060} C ${B5[0] + 300} ${B5[1] + 680} ${B5[0] + 520} ${B5[1] + 520} ${B5[0] + 960} ${B5[1] + 490}`}
          mulai={t(setelah(R("b5"), 1.4))}
          durasi={t(1.4)}
          tebal={6}
        />
        <Coret d={`M ${B5[0] + 130} ${B5[1] + 800} L ${B5[0] + 440} ${B5[1] + 530}`} mulai={t(setelah(R("b5"), 3.2))} durasi={t(0.4)} warna={c.merah} tebal={7} />
        <Coret d={`M ${B5[0] + 640} ${B5[1] + 540} L ${B5[0] + 1000} ${B5[1] + 480}`} mulai={t(setelah(R("b5"), 4.6))} durasi={t(0.4)} warna={c.merah} tebal={7} />
        <Coret d={`M ${B5[0] + 960} ${B5[1] + 500} L ${B5[0] + 960} ${B5[1] + 1090}`} mulai={t(setelah(R("b5"), 5.4))} durasi={t(0.5)} tebal={3} warna={c.tintaPudar} putus="10 10" />

        {/* ---------- B6: pangan bergejolak */}
        <GarisUkur x={B6[0] + 70} y={B6[1] + 300} w={140} mulai={t(setelah(R("b6"), 0.2))} ruas={2} />
        <Sketsa id="umum" mulai={t(setelah(R("b6"), 0.6))} d={`M ${B6[0] + 200} ${B6[1] + 1200} L ${B6[0] + 200} ${B6[1] + 1200 - 323 * 1.2} L ${B6[0] + 440} ${B6[1] + 1200 - 323 * 1.2} L ${B6[0] + 440} ${B6[1] + 1200} Z`} />
        <Coret d={`M ${B6[0] + 620} ${B6[1] + 1200} L ${B6[0] + 620} ${B6[1] + 1200 - 581 * 1.2} L ${B6[0] + 860} ${B6[1] + 1200 - 581 * 1.2} L ${B6[0] + 860} ${B6[1] + 1200}`} mulai={t(setelah(R("b6"), 1.4))} durasi={t(0.8)} warna={c.merah} tebal={7} />
        <Coret d={garisTangan(B6[0] + 120, B6[1] + 1200, B6[0] + 960, B6[1] + 1200, 4, 2)} mulai={t(setelah(R("b6"), 0.4))} durasi={t(0.4)} tebal={3.5} />
        <Coret d={gelombang(B6[0] + 560, B6[1] + 520, 360, 12, 3)} mulai={t(setelah(R("b6"), 2.4))} durasi={t(0.6)} warna={c.merah} tebal={4} />
      </Kanvas>

      {/* ---------- teks B1 */}
      <Tulis x={B1[0] + 540} y={B1[1] + 690} rata="center" gaya="tinta" ukuran={150} mulai={t(1.8)} perHuruf={3} teks="Inflasi 3,23%" />
      <Tulis x={B1[0] + 120} y={B1[1] + 1000} gaya="spidol" warna={c.merah} ukuran={96} mulai={t(3.4)} perHuruf={2} teks="kok belanja" />
      <Tulis x={B1[0] + 120} y={B1[1] + 1120} gaya="spidol" warna={c.merah} ukuran={96} mulai={t(4.2)} perHuruf={2} teks="makin mahal" />
      <Tulis x={B1[0] + 70} y={B1[1] + 1720} gaya="tangan" ukuran={34} mulai={t(2.6)} perHuruf={1} teks="— catatan no. 1" />

      {/* ---------- teks B2 */}
      <Stempel x={B2[0] + 760} y={B2[1] + 420} teks="BPS · Okt 2026" mulai={t(setelah(R("b2"), 0.6))} />
      <Tulis x={B2[0] + 540} y={B2[1] + 620} rata="center" gaya="tinta" ukuran={250} mulai={t(setelah(R("b2"), 0.8))} perHuruf={3} teks="3,23%" />
      <Tulis x={B2[0] + 540} y={B2[1] + 840} rata="center" gaya="tangan" ukuran={52} mulai={t(setelah(R("b2"), 1.8))} perHuruf={1} teks="naik dalam setahun" />
      {[0, 3, 6].map((v) => (
        <Tulis key={v} x={B2[0] + 140 + v * 130} y={B2[1] + 1085} rata="center" gaya="serif" ukuran={44} mulai={t(setelah(R("b2"), 3.4))} teks={`${v}`} />
      ))}
      <Tulis x={B2[0] + 140 + 2.5 * 130} y={B2[1] + 895} rata="center" gaya="spidol" warna={c.merah} ukuran={38} mulai={t(setelah(R("b2"), 4))} perHuruf={1} teks="sasaran BI 2,5 ± 1" />
      <Tulis x={B2[0] + 800} y={B2[1] + 1210} rata="center" gaya="tinta" ukuran={84} mulai={t(setelah(R("b2"), 5.6))} perHuruf={2} teks="0,22%" />
      <Tulis x={B2[0] + 470} y={B2[1] + 1215} rata="center" gaya="tangan" ukuran={44} mulai={t(setelah(R("b2"), 6.2))} perHuruf={1} teks="sebulan cuma" />

      {/* ---------- teks B3 */}
      <Tulis x={B3[0] + 540} y={B3[1] + 600} rata="center" gaya="serif" ukuran={120} mulai={t(setelah(R("b3"), 0.6))} perHuruf={2} teks="Inflasi rendah" />
      <Tulis
        x={B3[0] + 540}
        y={B3[1] + 820}
        rata="center"
        gaya="serif"
        ukuran={120}
        mulai={t(setelah(R("b3"), 1.6))}
        perHuruf={2}
        teks={[{ t: "≠ ", warna: c.merah }, { t: "harga murah" }]}
      />
      <Tulis x={B3[0] + 470} y={B3[1] + 1090} rata="center" gaya="tinta" ukuran={64} mulai={t(setelah(R("b3"), 2.2))} perHuruf={2} teks="Rp" />

      {/* ---------- teks B4 */}
      <Tulis x={B4[0] + 760} y={B4[1] + 360} gaya="tangan" ukuran={40} mulai={t(setelah(R("b4"), 1.4))} perHuruf={1} teks="cabai · per kg" />
      <Tulis x={B4[0] + 760} y={B4[1] + 410} gaya="tangan" ukuran={30} mulai={t(setelah(R("b4"), 1.6))} perHuruf={1} warna={c.tintaPudar} teks="(contoh)" />
      <Tulis x={B4[0] + 200} y={B4[1] + 1090} rata="center" gaya="tinta" ukuran={62} mulai={t(setelah(R("b4"), 2.4))} perHuruf={2} teks="40rb" />
      <Tulis x={B4[0] + 200} y={B4[1] + 1160} rata="center" gaya="tangan" ukuran={32} mulai={t(setelah(R("b4"), 2.6))} perHuruf={1} teks="tahun lalu" />
      <Tulis x={B4[0] + 540} y={B4[1] + 1090} rata="center" gaya="tinta" ukuran={62} mulai={t(setelah(R("b4"), 4.8))} perHuruf={2} teks="50rb" />
      <Tulis x={B4[0] + 540} y={B4[1] + 1160} rata="center" gaya="tangan" ukuran={32} mulai={t(setelah(R("b4"), 5))} perHuruf={1} teks="tahun ini" />
      <Tulis x={B4[0] + 370} y={B4[1] + 780} rata="center" gaya="spidol" warna={c.merah} ukuran={56} mulai={t(setelah(R("b4"), 4.8))} perHuruf={2} teks="+25%" />
      <Tulis x={B4[0] + 880} y={B4[1] + 1090} rata="center" gaya="tinta" ukuran={62} mulai={t(setelah(R("b4"), 8.2))} perHuruf={2} teks="50rb" />
      <Tulis x={B4[0] + 880} y={B4[1] + 1160} rata="center" gaya="tangan" ukuran={32} mulai={t(setelah(R("b4"), 8.4))} perHuruf={1} teks="bulan depan" />
      <Tulis x={B4[0] + 710} y={B4[1] + 850} rata="center" gaya="tangan" ukuran={40} mulai={t(setelah(R("b4"), 8.2))} perHuruf={1} teks="inflasi 0%" />
      <Tulis x={B4[0] + 300} y={B4[1] + 1225} rata="center" gaya="tinta" ukuran={56} mulai={t(setelah(R("b4"), 10.6))} perHuruf={2} warna={c.tintaPudar} teks="balik 40rb?" />
      <Stempel x={B4[0] + 760} y={B4[1] + 1230} teks="belum tentu" mulai={t(setelah(R("b4"), 11.4))} miring={-6} />

      {/* ---------- teks B5 */}
      <Tulis x={B5[0] + 170} y={B5[1] + 360} gaya="tangan" ukuran={40} mulai={t(setelah(R("b5"), 0.8))} perHuruf={1} teks="harga" />
      <Tulis x={B5[0] + 860} y={B5[1] + 1150} gaya="tangan" ukuran={40} mulai={t(setelah(R("b5"), 1))} perHuruf={1} teks="waktu" />
      <Tulis x={B5[0] + 330} y={B5[1] + 760} gaya="spidol" warna={c.merah} ukuran={48} mulai={t(setelah(R("b5"), 3.4))} perHuruf={1} teks="naik cepat" miring={-38} />
      <Tulis x={B5[0] + 800} y={B5[1] + 440} gaya="spidol" warna={c.merah} ukuran={48} mulai={t(setelah(R("b5"), 4.8))} perHuruf={1} teks="melambat" miring={-8} />
      <Tulis x={B5[0] + 540} y={B5[1] + 1250} rata="center" gaya="serif" ukuran={76} mulai={t(setelah(R("b5"), 5.6))} perHuruf={2} teks={[{ t: "Inflasi = " }, { t: "kecepatan naik", warna: c.merah }]} />

      {/* ---------- teks B6 */}
      <Stempel x={B6[0] + 320} y={B6[1] + 420} teks="BI · Okt 2026" mulai={t(setelah(R("b6"), 0.5))} miring={-6} />
      <Tulis x={B6[0] + 320} y={B6[1] + 760} rata="center" gaya="tinta" ukuran={72} mulai={t(setelah(R("b6"), 1))} perHuruf={2} teks="3,23%" />
      <Tulis x={B6[0] + 740} y={B6[1] + 430} rata="center" gaya="tinta" ukuran={86} mulai={t(setelah(R("b6"), 2.2))} perHuruf={2} warna={c.merah} teks="5,81%" />
      <Tulis x={B6[0] + 320} y={B6[1] + 1255} rata="center" gaya="tangan" ukuran={38} mulai={t(setelah(R("b6"), 1.2))} perHuruf={1} teks="umum" />
      <Tulis x={B6[0] + 740} y={B6[1] + 1255} rata="center" gaya="spidol" warna={c.merah} ukuran={38} mulai={t(setelah(R("b6"), 2.4))} perHuruf={1} teks="pangan bergejolak" />
    </>
  );
};

// Subtitel tipis tanpa kotak (aktif bawaan). Tiap baris tampil sampai baris berikutnya; baris terakhir sampai kamera mundur.
const SUBTITEL_MULAI: { mulai: number; teks: string }[] = [
  { mulai: 1.0, teks: "Katanya inflasi terkendali, tapi kok belanja makin mahal?" },
  { mulai: setelah(R("b2"), 0.4), teks: "Data BPS: inflasi Oktober 2026 3,23% setahun, cuma 0,22% sebulan." },
  { mulai: setelah(R("b3"), 0.4), teks: "Tapi inflasi rendah bukan berarti harga kembali murah." },
  { mulai: setelah(R("b4"), 0.4), teks: "Cabai tahun lalu Rp40 ribu, tahun ini Rp50 ribu." },
  { mulai: setelah(R("b4"), 7.4), teks: "Bulan depan tetap Rp50 ribu? Inflasinya nol." },
  { mulai: setelah(R("b4"), 10.2), teks: "Apa balik ke Rp40 ribu? Belum tentu." },
  { mulai: setelah(R("b5"), 0.4), teks: "Inflasi mengukur seberapa cepat harga naik, bukan seberapa murah." },
  { mulai: setelah(R("b6"), 0.4), teks: "Pangan bergejolak bahkan masih naik 5,81% setahun (BI)." },
];

const SUBTITEL = SUBTITEL_MULAI.map((s, i) => ({ ...s, selesai: i + 1 < SUBTITEL_MULAI.length ? SUBTITEL_MULAI[i + 1].mulai : T.mundur }));

export const InflasiCatatan: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => {
  const fr = useCurrentFrame();
  const nomor = nomorBagian(fr, MULAI_BAGIAN);
  return (
    <Meja
      ukuran={TATA}
      kamera={KAMERA}
      properti={PROPERTI}
      halaman={<Halaman />}
      layar={
        <>
          {fr < d(T.mundur) ? <Indeks nomor={nomor} /> : null}
          {subtitel ? <Subtitel baris={SUBTITEL} /> : null}
          {J.ada && vo.audio ? (
            <Sequence from={d(J.awal)}>
              <Audio src={staticFile(vo.audio)} />
            </Sequence>
          ) : null}
          <SapuanTinta mulai={0} durasi={16} />
          <CatatanSobek
            mulai={d(T.sobek)}
            judul={[{ t: "Bukan harganya yang turun, tapi naiknya yang " }, { t: "melambat", warna: c.merah }]}
            ajakan="Follow @intipdompet buat intip data uang lainnya"
          />
        </>
      }
    />
  );
};
