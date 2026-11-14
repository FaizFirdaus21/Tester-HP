// Reels "Gaji naik, kok tabungan tetap segitu?" (tayang 14 Nov 2026, 19.00) — template Papan Kapur.
// Naskah: produksi/20261114-gaya-hidup-ikut-naik/naskah-vo.json. Satu blok = satu bagian papan:
//   A hook · B penjelasan (dua garis naik) · C perumpamaan (kos kecil → kos luas) · D efek (4 hal kecil)
//   E akibat (contoh Rp1 jt × 12) · F solusi (bagi dua kenaikan di hari gajian) · G CTA (lebar 2 kolom)
//
// Sinkron: padaFrasa + jangkar jeda kalimat dari audio. vo-waktu.json di folder ini dibuat dengan:
//   python3 scripts/sinkron_vo.py produksi/20261114-gaya-hidup-ikut-naik src/produksi/gaya-hidup-ikut-naik/vo-waktu.json
//
// Efek 2,5D tiga kali: kamera miring di pembuka, di perumpamaan, dan tarikan mundur ke CTA.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import naskah from "../../../produksi/20261114-gaya-hidup-ikut-naik/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, FilterKapur, Panah, Titik, Tulis, garis, lingkaran, p01 } from "../../papan/Komponen";
import { KunciKamera, Papan } from "../../papan/Papan";
import { d, font, k, sel } from "../../papan/tema";
import { SuaraVO } from "../../catatan/Komponen";
import { BENDA, Bentuk, Orang } from "../../papan/ilustrasi";
import { BarisSubtitel, DataVO, jadwalVO, padaFrasa, peringatkan, perkiraanVO, rapatkanVO, subtitelDariBlok } from "../../catatan/Jadwal";

// ---------------------------------------------------------------- jadwal
const VO = rapatkanVO(vo as DataVO, { jeda: 0.4 });
const J = jadwalVO(VO, { b0: 0, b1: 1, b2: 2, b3: 3, b4: 4, b5: 5, b6: 6, akhir: "selesai" }, perkiraanVO(naskah), { awal: 0.4, ekor: 1.4 });
const T = J.T;
const MULAI = [T.b0, T.b1, T.b2, T.b3, T.b4, T.b5, T.b6];
export const DURASI_GAYA_HIDUP = d(T.akhir);

const PINDAH = 0.3; // perpindahan kamera total 0,6 s (aturan 14 Nov)
/** Judul bagian i mulai ditulis saat kamera berangkat, supaya papan tidak kosong saat kamera tiba. */
const TIBA = (i: number) => d(MULAI[i] - PINDAH);
const batasBagian = (i: number) => (i + 1 < MULAI.length ? MULAI[i + 1] - PINDAH : T.akhir);
const W = (i: number, frasa: string, geser = 0, lama = 0) => {
  const f = d(padaFrasa(J, i, naskah.blok[i].teks, frasa, geser));
  if (f + lama > d(batasBagian(i))) peringatkan(`blok ${i} "${frasa}": selesai di frame ${f + lama}, kamera pindah di ${d(batasBagian(i))}`);
  return f;
};

// ---------------------------------------------------------------- bagian papan
const A = sel(0, 0);
const B = sel(1, 0);
const C = sel(0, 1);
const D = sel(1, 1);
const E = sel(0, 2);
const F = sel(1, 2);
const G = { x: 1080, y0: 5760 };

// ---------------------------------------------------------------- kamera
const fokus = (s: { x: number; y0: number }) => ({ x: s.x, y: s.y0 + 880 });
const KAMERA: KunciKamera[] = (() => {
  const kunci: KunciKamera[] = [
    // frame 0 tegak dan utuh (hook terbaca); dorongan pelan supaya tidak diam
    { f: 0, ...fokus(A), s: 1.0 },
  ];
  const bagian = [A, B, C, D, E, F];
  for (let i = 1; i < bagian.length; i++) {
    const asal = bagian[i - 1];
    const tuju = bagian[i];
    kunci.push({ f: d(MULAI[i] - PINDAH), ...fokus(asal), s: 1.05, ry: i % 2 ? 2 : -2 });
    if (i === 2) {
      kunci.push({ f: d(MULAI[i] + PINDAH), ...fokus(tuju), s: 1.02, rx: 10, ry: 9, rz: 1 });
      kunci.push({ f: d(MULAI[i] + 2.4), ...fokus(tuju), s: 1.0 });
    } else {
      kunci.push({ f: d(MULAI[i] + PINDAH), ...fokus(tuju), s: 1.0, ry: i % 2 ? -3 : 3 });
    }
  }
  kunci.push({ f: d(T.b6 - PINDAH), ...fokus(F), s: 1.05 });
  kunci.push({ f: d(T.b6 + 0.9), x: 1080, y: 3600, s: 0.42, rx: 20, ry: -10, rz: -1.5 });
  kunci.push({ f: d(T.b6 + 2.0), x: G.x, y: G.y0 + 880, s: 0.6, rx: 4 });
  kunci.push({ f: d(T.akhir), x: G.x, y: G.y0 + 900, s: 0.64, rx: 0, ry: 2 });
  return kunci;
})();

// ---------------------------------------------------------------- bentuk kecil
const kotak = (x: number, y: number, w: number, h: number, seed: number): Titik[] => [
  ...garis(x, y, x + w, y, seed, 2),
  ...garis(x + w, y, x + w, y + h, seed + 1, 2),
  ...garis(x + w, y + h, x, y + h, seed + 2, 2),
  ...garis(x, y + h, x, y + 4, seed + 3, 2),
];
const persegi = (x: number, y: number, w: number, h: number): Titik[] => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
const centang = (x: number, y: number, s = 1): Titik[] => [[x, y], [x + 22 * s, y + 30 * s], [x + 70 * s, y - 40 * s]];
const pesawat = (x: number, y: number, s: number): Titik[][] => [
  [[x, y + 60 * s], [x + 260 * s, y], [x + 120 * s, y + 150 * s], [x + 95 * s, y + 90 * s], [x, y + 60 * s]],
  [[x + 95 * s, y + 90 * s], [x + 260 * s, y]],
];
// Kurva naik halus (garis tren) dari (x1,y1) ke (x2,y2).
const kurva = (x1: number, y1: number, x2: number, y2: number, lengkung: number): Titik[] =>
  Array.from({ length: 13 }, (_, i) => {
    const u = i / 12;
    return [x1 + (x2 - x1) * u, y1 + (y2 - y1) * u - Math.sin(u * Math.PI) * lengkung] as Titik;
  });

const Muncul: React.FC<{ mulai: number; children: React.ReactNode }> = ({ mulai, children }) => {
  const fr = useCurrentFrame();
  const p = p01(fr, mulai, 10);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: 0, top: (1 - p) * 24, opacity: p }}>{children}</div>;
};

// Lemari kapur: bingkai, garis pintu, dan isi kotak-kotak barang (n buah) yang muncul berurutan.
const WARNA_BARANG = [k.kuning, k.merah, k.biru, k.hijauTerang];
const Lemari: React.FC<{ x: number; y: number; w: number; h: number; isi: number; mulaiIsi: number; seed: number }> = ({ x, y, w, h, isi, mulaiIsi, seed }) => {
  const kol = Math.max(2, Math.round(w / 90));
  const bar = Math.max(3, Math.round(h / 90));
  const bw = (w - 24) / kol;
  const bh = (h - 24) / bar;
  return (
    <>
      <Bentuk pts={persegi(x, y, w, h)} warna={k.putih} isi={0.08} tebal={6} />
      <Coret pts={garis(x + w / 2, y + 6, x + w / 2, y + h - 6, seed, 2)} mulai={-9999} lama={1} tebal={4} kapur={false} />
      {Array.from({ length: Math.min(isi, kol * bar) }, (_, i) => {
        const c = i % kol;
        const r = bar - 1 - Math.floor(i / kol);
        return (
          <Muncul key={i} mulai={mulaiIsi + i * 2}>
            <Bentuk pts={persegi(x + 12 + c * bw + 6, y + 12 + r * bh + 6, bw - 12, bh - 12)} warna={WARNA_BARANG[(i + seed) % 4]} garis={k.putih} isi={0.45} tebal={3} />
          </Muncul>
        );
      })}
    </>
  );
};

const B_ = BENDA;
const SUDAH = -9999;

const IsiPapan: React.FC = () => (
  <>
    {/* ===== A: hook — sudah utuh di frame 0 (aturan 14 Nov); kapur hanya menambah coretan mulai 0,5 s ===== */}
    <Tulis x={A.x - 120} y={A.y0 + 420} teks="gaji" ukuran={190} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" tebalFilter />
    <Panah x1={A.x + 150} y1={A.y0 + 470} x2={A.x + 300} y2={A.y0 + 200} tinggi={60} mulai={SUDAH} lama={1} warna={k.hijauTerang} tebal={14} />
    <B_.koin cx={A.x0 + 260} cy={A.y0 + 720} s={220} />
    <Tulis x={A.x0 + 420} y={A.y0 + 730} teks="tabungan" ukuran={100} gaya="tebal" mulai={SUDAH} />
    <Panah x1={A.x0 + 430} y1={A.y0 + 840} x2={A.x0 + 900} y2={A.y0 + 840} tinggi={40} mulai={SUDAH} lama={1} warna={k.biru} tebal={10} />
    <Tulis x={A.x} y={A.y0 + 1040} teks="kok tetap segitu?" ukuran={116} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" tebalFilter />
    <Coret pts={garis(A.x0 + 130, A.y0 + 1090, A.x0 + 950, A.y0 + 1082, 5, 4)} mulai={d(0.5)} lama={10} warna={k.merah} tebal={9} />
    <Coret pts={lingkaran(A.x0 + 660, A.y0 + 840, 70, 40, 3)} mulai={W(0, "tetap", -0.2)} lama={10} warna={k.putih} tebal={6} />

    {/* ===== B: lifestyle inflation ===== */}
    <Tulis x={B.x} y={B.y0 + 260} teks="gaya hidup ikut naik" ukuran={86} gaya="tebal" mulai={TIBA(1)} perHuruf={1.3} rata="center" />
    <Tulis x={B.x} y={B.y0 + 370} teks="(lifestyle inflation)" ukuran={62} gaya="hias" warna={k.biru} mulai={W(1, "lifestyle", -0.2)} perHuruf={1} rata="center" />
    <Coret pts={garis(B.x0 + 120, B.y0 + 1140, B.x0 + 960, B.y0 + 1140, 9, 2)} mulai={W(1, "Begitu gaji", -0.6)} lama={10} tebal={4} kapur={false} />
    <Coret pts={kurva(B.x0 + 140, B.y0 + 1040, B.x0 + 760, B.y0 + 600, 40)} mulai={W(1, "Begitu gaji", -0.2)} lama={22} warna={k.kuning} tebal={10} />
    <Tulis x={B.x0 + 790} y={B.y0 + 580} teks="gaji" ukuran={70} gaya="tebal" warna={k.kuning} mulai={W(1, "bertambah", 0)} perHuruf={2} />
    <Coret pts={kurva(B.x0 + 140, B.y0 + 1100, B.x0 + 760, B.y0 + 690, 40)} mulai={W(1, "pengeluaran", -0.2)} lama={22} warna={k.merah} tebal={10} />
    <Tulis x={B.x0 + 520} y={B.y0 + 960} teks="pengeluaran" ukuran={62} gaya="tebal" warna={k.merah} mulai={W(1, "pelan-pelan")} perHuruf={1} rata="center" />
    <Coret pts={lingkaran(B.x0 + 760, B.y0 + 645, 60, 90, 6)} mulai={W(1, "sisanya", -0.4)} lama={12} warna={k.putih} tebal={6} />
    <Tulis x={B.x0 + 860} y={B.y0 + 850} teks="sisa sama" ukuran={66} gaya="hias" mulai={W(1, "sisanya", -0.1)} perHuruf={1.2} rata="center" />
    <Panah x1={B.x0 + 840} y1={B.y0 + 800} x2={B.x0 + 790} y2={B.y0 + 740} tinggi={20} mulai={W(1, "sama saja", -0.2)} lama={8} tebal={5} />

    {/* ===== C: perumpamaan kos ===== */}
    <Tulis x={C.x} y={C.y0 + 230} teks="Mirip pindah kos" ukuran={90} gaya="hias" warna={k.biru} mulai={TIBA(2)} perHuruf={1.4} rata="center" />
    <Coret pts={kotak(C.x0 + 80, C.y0 + 560, 300, 360, 21)} mulai={W(2, "Mirip pindah", 0.2)} lama={14} tebal={6} />
    <Lemari x={C.x0 + 110} y={C.y0 + 620} w={150} h={270} isi={6} mulaiIsi={W(2, "Mirip pindah", 0.5)} seed={1} />
    <Tulis x={C.x0 + 230} y={C.y0 + 990} teks="kos kecil" ukuran={56} warna={k.biru} mulai={W(2, "Mirip pindah", 0.4)} perHuruf={1.4} rata="center" />
    <Panah x1={C.x0 + 400} y1={C.y0 + 720} x2={C.x0 + 490} y2={C.y0 + 720} tinggi={30} mulai={W(2, "lebih luas", -0.4)} lama={8} tebal={7} />
    <Coret pts={kotak(C.x0 + 510, C.y0 + 420, 500, 500, 31)} mulai={W(2, "lebih luas", -0.2)} lama={16} tebal={6} />
    <Lemari x={C.x0 + 550} y={C.y0 + 480} w={300} h={410} isi={20} mulaiIsi={W(2, "ikut penuh", -0.6)} seed={2} />
    <Tulis x={C.x0 + 760} y={C.y0 + 990} teks="lemari lebih besar" ukuran={56} warna={k.biru} mulai={W(2, "Lemarinya", -0.2)} perHuruf={1.2} rata="center" />
    <Tulis x={C.x} y={C.y0 + 1130} teks="…tetap penuh lagi" ukuran={92} gaya="tebal" warna={k.merah} mulai={W(2, "ikut penuh", 0, 18)} perHuruf={1.2} rata="center" />

    {/* ===== D: efek hal kecil ===== */}
    <Tulis x={D.x} y={D.y0 + 240} teks="habis buat hal kecil" ukuran={86} gaya="tebal" mulai={TIBA(3)} perHuruf={1.2} rata="center" />
    {[
      { f: "kopi", t: "kopi", el: (cx: number, cy: number) => <B_.gelas cx={cx} cy={cy} s={220} teks="1" /> },
      { f: "ongkir", t: "ongkir", el: (cx: number, cy: number) => <B_.tas cx={cx} cy={cy} s={220} /> },
      { f: "langganan", t: "langganan", el: (cx: number, cy: number) => <B_.hp cx={cx} cy={cy} s={240} teks="langganan" /> },
      { f: "makan di luar", t: "makan di luar", el: (cx: number, cy: number) => <B_.piring cx={cx} cy={cy} s={240} /> },
    ].map((r, i) => {
      const cx = D.x0 + 290 + (i % 2) * 500;
      const cy = D.y0 + 520 + Math.floor(i / 2) * 420;
      const m = W(3, r.f, -0.3, 30);
      return (
        <React.Fragment key={i}>
          <Muncul mulai={m}>{r.el(cx, cy)}</Muncul>
          <Panah x1={cx + 150} y1={cy + 60} x2={cx + 150} y2={cy - 90} tinggi={26} mulai={m + 6} lama={8} warna={k.merah} tebal={7} />
          <Tulis x={cx} y={cy + 180} teks={r.t} ukuran={58} warna={k.kuning} mulai={m + 4} perHuruf={1.5} rata="center" />
        </React.Fragment>
      );
    })}
    <Tulis x={D.x} y={D.y0 + 1240} teks="terasa wajar, diam-diam naik" ukuran={50} gaya="tipis" warna={k.biru} mulai={W(3, "terasa wajar")} perHuruf={0.8} rata="center" />

    {/* ===== E: akibat — contoh hitungan ===== */}
    <Tulis x={E.x0 + 110} y={E.y0 + 230} teks="Contoh:" ukuran={84} gaya="hias" warna={k.biru} mulai={TIBA(4)} perHuruf={2} />
    <Tulis x={E.x} y={E.y0 + 380} teks="naik Rp1 jt / bulan" ukuran={92} gaya="tebal" mulai={W(4, "satu juta", -0.4)} perHuruf={1.5} rata="center" />
    <Tulis x={E.x} y={E.y0 + 510} teks="× 12 bulan" ukuran={92} gaya="tebal" mulai={W(4, "setahun", -0.3)} perHuruf={2} rata="center" />
    <Coret pts={garis(E.x - 300, E.y0 + 580, E.x + 300, E.y0 + 574, 7, 3)} mulai={W(4, "setahun")} lama={10} tebal={6} kapur={false} />
    <Tulis x={E.x} y={E.y0 + 700} teks="= Rp12 jt" ukuran={150} gaya="tebal" warna={k.kuning} mulai={W(4, "setahun", 0.3)} perHuruf={2} rata="center" tebalFilter />
    <Muncul mulai={W(4, "semuanya habis", -0.3)}>
      <B_.uang cx={E.x - 200} cy={E.y0 + 940} s={260} teks="Rp" />
      <B_.uang cx={E.x - 170} cy={E.y0 + 910} s={260} teks="Rp" />
    </Muncul>
    <Coret pts={garis(E.x - 340, E.y0 + 1020, E.x - 30, E.y0 + 840, 8, 3)} mulai={W(4, "melewatkan", -0.2)} lama={8} warna={k.merah} tebal={7} />
    <Tulis x={E.x + 240} y={E.y0 + 930} teks="nabung yang lewat" ukuran={58} warna={k.merah} mulai={W(4, "kesempatan", -0.2)} perHuruf={1} rata="center" />
    <Tulis x={E.x} y={E.y0 + 1130} teks="(contoh hitungan)" ukuran={40} gaya="tipis" warna={k.biru} mulai={W(4, "Contohnya", 0.5)} perHuruf={0.8} rata="center" />

    {/* ===== F: solusi ===== */}
    <Tulis x={F.x0 + 80} y={F.y0 + 250} teks="Di hari gajian:" ukuran={84} gaya="hias" warna={k.kuning} mulai={TIBA(5)} perHuruf={1.4} />
    <Muncul mulai={W(5, "hari gajian", -0.6)}>
      <B_.kalender cx={F.x0 + 905} cy={F.y0 + 235} s={170} teks="GAJIAN" />
    </Muncul>
    <Coret pts={lingkaran(F.x0 + 905, F.y0 + 235, 118, 112, 3)} mulai={W(5, "hari gajian", -0.3)} lama={12} warna={k.merah} tebal={6} />
    <Tulis x={F.x} y={F.y0 + 430} teks="kenaikan gaji" ukuran={60} warna={k.biru} mulai={W(5, "setengah", -0.8)} perHuruf={1.2} rata="center" />
    <Coret pts={kotak(F.x0 + 140, F.y0 + 480, 800, 300, 41)} mulai={W(5, "setengah", -0.6)} lama={12} tebal={6} />
    <Coret pts={garis(F.x, F.y0 + 470, F.x, F.y0 + 795, 42, 3)} mulai={W(5, "setengah", -0.1)} lama={8} warna={k.kuning} tebal={8} />
    <Muncul mulai={W(5, "ke tabungan", -0.3)}>
      <Bentuk pts={persegi(F.x0 + 150, F.y0 + 490, 385, 280)} warna={k.hijauTerang} garis={k.hijauTerang} isi={0.22} tebal={2} />
    </Muncul>
    <Tulis x={F.x0 + 340} y={F.y0 + 630} teks="tabung dulu" ukuran={70} gaya="tebal" mulai={W(5, "ke tabungan", -0.2)} perHuruf={1.4} rata="center" />
    <Coret pts={centang(F.x0 + 300, F.y0 + 720, 0.9)} mulai={W(5, "ke tabungan", 0.3)} lama={8} warna={k.hijauTerang} tebal={9} />
    <Tulis x={F.x0 + 740} y={F.y0 + 630} teks="nikmati" ukuran={70} gaya="tebal" warna={k.kuning} mulai={W(5, "Sisanya baru", -0.2)} perHuruf={1.6} rata="center" />
    <Tulis x={F.x0 + 340} y={F.y0 + 860} teks="½" ukuran={80} gaya="tebal" warna={k.hijauTerang} mulai={W(5, "setengah")} perHuruf={2} rata="center" />
    <Tulis x={F.x0 + 740} y={F.y0 + 860} teks="½" ukuran={80} gaya="tebal" warna={k.kuning} mulai={W(5, "Sisanya baru")} perHuruf={2} rata="center" />
    <Muncul mulai={W(5, "tabunganmu ikut", -0.3)}>
      <Orang cx={F.x0 + 260} cy={F.y0 + 1130} s={230} pose="jempol" ekspresi="senyum" baju={k.hijauTerang} />
    </Muncul>
    <Tulis x={F.x0 + 660} y={F.y0 + 1090} teks="tabungan ikut naik" ukuran={66} gaya="tebal" warna={k.hijauTerang} mulai={W(5, "tabunganmu ikut", 0, 20)} perHuruf={1.1} rata="center" />

    {/* ===== G: CTA ===== */}
    <Tulis x={G.x} y={G.y0 + 300} teks="Naik gaji berapa persen?" ukuran={132} gaya="tebal" mulai={Math.max(W(6, "Kenaikan gajimu"), d(T.b6 + 1.6))} perHuruf={1.4} rata="center" />
    <Muncul mulai={W(6, "berapa persen", -0.2)}>
      <B_.gelembung cx={G.x + 120} cy={G.y0 + 545} s={500} teks="__ %" />
    </Muncul>
    <Tulis x={G.x} y={G.y0 + 800} teks="tulis di komen ↓" ukuran={110} gaya="hias" warna={k.kuning} mulai={W(6, "Tulis angkanya")} perHuruf={1.8} rata="center" />
    <Tulis x={G.x - 170} y={G.y0 + 980} teks="kirim ke teman" ukuran={110} mulai={W(6, "Kirim")} perHuruf={1.6} rata="center" />
    {pesawat(G.x + 270, G.y0 + 900, 0.9).map((pts, j) => (
      <Coret key={j} pts={pts} mulai={W(6, "Kirim", 0.2) + j * 14} lama={14} tebal={7} kapur={j === 0} />
    ))}
    <Tulis x={G.x} y={G.y0 + 1130} teks="IntipDompet" ukuran={150} gaya="tebal" mulai={W(6, "IntipDompet")} perHuruf={2} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1235} teks="Biar dompetmu nggak kaget." ukuran={96} gaya="hias" warna={k.kuning} mulai={W(6, "Biar dompetmu")} perHuruf={1.5} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1320} teks="konten edukasi · angka = contoh hitungan" ukuran={54} gaya="tipis" warna={k.biru} mulai={W(6, "IntipDompet", 0.3)} perHuruf={0.5} rata="center" />
  </>
);

// ---------------------------------------------------------------- subtitel
const TEKS_TAMPIL = [
  "Gaji naik, kok tabungan tetap segitu?",
  "Ini namanya gaya hidup yang ikut naik, istilah kerennya lifestyle inflation. Begitu gaji bertambah, pengeluaran pelan-pelan ikut bertambah, sampai sisanya sama saja.",
  "Mirip pindah ke kos yang lebih luas. Lemarinya lebih besar, tapi lama-lama ikut penuh lagi.",
  "Kenaikan gaji habis buat hal kecil yang terasa wajar: kopi lebih mahal, ongkir lebih sering, langganan bertambah, makan di luar makin sering.",
  "Contohnya, gaji naik Rp1 juta sebulan. Kalau semuanya habis, setahun kamu melewatkan kesempatan menabung Rp12 juta.",
  "Begitu gaji naik, pindahkan dulu setengah kenaikannya ke tabungan di hari gajian. Sisanya baru boleh dinikmati. Dengan begitu, tabunganmu ikut naik bareng gajimu.",
  "Kenaikan gajimu terakhir berapa persen? Tulis angkanya di komen. Kirim ke teman yang baru naik gaji.",
];
// Subtitel aktif sejak frame 0 (aturan 14 Nov): potongan pertama ditarik ke detik 0.
const SUB: BarisSubtitel[] = subtitelDariBlok(J, TEKS_TAMPIL, 38)
  .filter((s) => s.selesai - s.mulai > 0.2)
  .map((s, i) => (i === 0 ? { ...s, mulai: 0 } : s));

const BarisSub: React.FC<{ teks: string; lama: number; langsung?: boolean }> = ({ teks, lama, langsung }) => {
  const fr = useCurrentFrame();
  const o = Math.min(langsung ? 1 : p01(fr, 0, 4), 1 - p01(fr, lama - 3, 3));
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1300, height: 180, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: font.sans, fontWeight: 650, fontSize: 44, lineHeight: 1.3, color: "#fbfaf4", opacity: o, textShadow: "0 2px 3px rgba(0,0,0,0.8), 0 0 24px rgba(0,0,0,0.65)" }}>
      {teks}
    </div>
  );
};
const Subtitel: React.FC = () => (
  <>
    {SUB.map((s, i) => {
      const lama = Math.max(1, d(s.selesai) - d(s.mulai));
      return (
        <Sequence key={i} from={d(s.mulai)} durationInFrames={lama} layout="none">
          <BarisSub teks={s.teks} lama={lama} langsung={s.mulai === 0} />
        </Sequence>
      );
    })}
  </>
);

export const GayaHidupReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <AbsoluteFill style={{ background: "#0f0d0b" }}>
    <FilterKapur />
    <Papan kunci={KAMERA} layar={subtitel ? <Subtitel /> : null}>
      <IsiPapan />
    </Papan>
    {J.ada ? <SuaraVO vo={VO} awal={J.awal} /> : null}
  </AbsoluteFill>
);
