// Demo template Papan Kapur: video deposito LPS, disinkron ke VO asli.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import vo from "../../../produksi/20261109-bunga-deposito-lps/vo-waktu.json";
import { Angkat, Coret, FilterKapur, Panah, Titik, Tulis, garis, ikonBank, lingkaran } from "../Komponen";
import { KunciKamera, Papan } from "../Papan";
import { d, font, k, sel } from "../tema";

type Blok = { mulai: number; durasi: number; teks: string };
const B = vo.blok as Blok[];

/** Frame saat frasa diucapkan di blok i (perkiraan dari posisi huruf dalam teks VO). */
const w = (i: number, frasa: string, geser = 0) => {
  const b = B[i];
  const idx = b.teks.indexOf(frasa);
  if (idx < 0) throw new Error(`Frasa "${frasa}" tidak ada di blok ${i}`);
  return d(b.mulai + (b.durasi * idx) / b.teks.length + geser);
};
const akhir = (i: number) => d(B[i].mulai + B[i].durasi);

export const DURASI_PAPAN = d(vo.total + 0.6);

// ---------------------------------------------------------------- bentuk kecil
const kotak = (x: number, y: number, w2: number, h: number, seed: number): Titik[] => [
  ...garis(x, y, x + w2, y, seed, 2),
  ...garis(x + w2, y, x + w2, y + h, seed + 1, 2),
  ...garis(x + w2, y + h, x, y + h, seed + 2, 2),
  ...garis(x, y + h, x, y + 4, seed + 3, 2),
];
const centang = (x: number, y: number, s = 1): Titik[] => [
  [x, y],
  [x + 22 * s, y + 30 * s],
  [x + 70 * s, y - 40 * s],
];

// ---------------------------------------------------------------- kamera
const A = sel(0, 0);
const Bc = sel(1, 0);
const C = sel(0, 1);
const D = sel(1, 1);
const E = sel(0, 2);
const F = sel(1, 2);
const G = { x: 1080, y: 5760 };

const KUNCI: KunciKamera[] = [
  { f: 0, x: A.x, y: A.y - 40, s: 1.14, rx: 12, ry: -16, rz: -2 },
  { f: d(2.6), x: A.x, y: A.y - 60, s: 1.0 },
  { f: d(3.3), x: A.x, y: A.y - 60, s: 1.02 },
  { f: d(4.2), x: Bc.x, y: Bc.y - 80, s: 1.0, ry: -4 },
  { f: d(15.0), x: Bc.x, y: Bc.y - 100, s: 1.06, ry: 3 },
  { f: d(15.9), x: C.x, y: C.y - 80, s: 1.0, ry: 5 },
  { f: d(26.0), x: C.x, y: C.y - 100, s: 1.05, ry: -3 },
  { f: d(26.9), x: D.x, y: D.y - 80, s: 1.0 },
  { f: d(37.9), x: D.x, y: D.y - 100, s: 1.06 },
  { f: d(38.9), x: E.x, y: E.y - 60, s: 0.98, rx: 18 },
  { f: d(42.6), x: E.x, y: E.y - 60, s: 1.0, rx: 10, ry: 6 },
  { f: d(44.0), x: E.x, y: E.y - 80, s: 1.02 },
  { f: d(46.4), x: E.x, y: E.y - 90, s: 1.04 },
  { f: d(47.3), x: F.x, y: F.y - 80, s: 1.0, ry: -4 },
  { f: d(58.2), x: F.x, y: F.y - 100, s: 1.05, ry: 2 },
  // mundur memperlihatkan seluruh papan dalam posisi miring, lalu turun ke baris penutup
  { f: d(59.6), x: 1080, y: 3700, s: 0.42, rx: 20, ry: -10, rz: -1.5 },
  { f: d(60.6), x: 1080, y: 4100, s: 0.44, rx: 16, ry: -7 },
  { f: d(62.0), x: G.x, y: G.y + 880, s: 0.6, rx: 4 },
  { f: d(71.6), x: G.x, y: G.y + 900, s: 0.64, rx: 0, ry: 2 },
];

// ---------------------------------------------------------------- subtitel
const SUB: { i: number; teks: string }[] = [
  { i: 1, teks: "Belum tentu. LPS cuma menjamin simpanan rupiah di bank umum yang bunganya maksimal 3,75% setahun, sampai akhir Januari 2027." },
  { i: 2, teks: "Banyak yang kira cuma kelebihan bunganya yang hangus. Padahal menurut aturan LPS, seluruh simpanannya nggak dijamin, termasuk pokoknya." },
  { i: 3, teks: "Misalnya kamu taruh Rp10 juta dengan bunga 6% di bank umum. Kalau banknya tutup, Rp10 juta itu bisa nggak diganti. Cashback juga dihitung bunga, lho." },
  { i: 4, teks: "Dan bank memang bisa tutup. Hingga Oktober tahun ini, 14 BPR dan BPRS sudah dilikuidasi." },
  { i: 5, teks: "Jadi, cek dulu: bunga plus cashback-nya masih di bawah batas atau nggak. Ingat juga, jaminannya maksimal Rp2 miliar per nasabah per bank." },
];

const potong = (teks: string, maks = 40) => {
  const kata = teks.split(" ");
  const baris: string[] = [];
  let s = "";
  for (const kt of kata) {
    if ((s + " " + kt).trim().length > maks && s) {
      baris.push(s);
      s = kt;
    } else s = (s + " " + kt).trim();
  }
  if (s) baris.push(s);
  return baris;
};

const Subtitel: React.FC = () => {
  const fr = useCurrentFrame();
  for (const s of SUB) {
    const b = B[s.i];
    const awal = d(b.mulai);
    const ujung = d(b.mulai + b.durasi);
    if (fr < awal || fr >= ujung) continue;
    const potongan = potong(s.teks);
    const total = s.teks.length;
    let pos = 0;
    for (const p of potongan) {
      const a = awal + ((ujung - awal) * pos) / total;
      pos += p.length + 1;
      const z = awal + ((ujung - awal) * pos) / total;
      if (fr >= a && fr < z) {
        const o = interpolate(fr, [a, a + 4, z - 3, z], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div style={{ position: "absolute", left: 90, right: 90, top: 1330, textAlign: "center", fontFamily: font.sans, fontWeight: 650, fontSize: 44, lineHeight: 1.3, color: "#fbfaf4", opacity: o, textShadow: "0 2px 3px rgba(0,0,0,0.8), 0 0 24px rgba(0,0,0,0.65)" }}>
            {p}
          </div>
        );
      }
    }
  }
  return null;
};

// ---------------------------------------------------------------- isi papan
const IsiPapan: React.FC = () => {
  // tanda di garis bilangan 0–6%
  const gx = (v: number) => Bc.x0 + 160 + (v / 6) * 760;
  const gy = 1010;
  return (
    <>
      {/* ===== A: hook ===== */}
      <Tulis x={A.x} y={470} teks="Deposito" ukuran={150} gaya="tebal" mulai={d(0.3)} perHuruf={2} rata="center" />
      <Tulis x={A.x} y={840} teks="6%" ukuran={430} gaya="tebal" warna={k.kuning} mulai={-6} perHuruf={5} rata="center" tebalFilter />
      <Coret pts={garis(320, 1070, 780, 1060, 3, 4)} mulai={d(0.85)} lama={10} warna={k.kuning} tebal={11} />
      <Tulis x={A.x} y={1200} teks="aman nggak?" ukuran={130} gaya="hias" warna={k.merah} mulai={w(0, "aman")} perHuruf={2} rata="center" />

      {/* ===== B: batas LPS ===== */}
      <Tulis x={Bc.x} y={330} teks="Belum tentu." ukuran={120} gaya="hias" warna={k.kuning} mulai={w(1, "Belum")} perHuruf={2} rata="center" />
      <Tulis x={Bc.x} y={480} teks="LPS cuma menjamin bunga sampai" ukuran={62} mulai={w(1, "El pe es")} perHuruf={1.3} rata="center" />
      <Tulis x={Bc.x} y={700} teks="3,75%" ukuran={300} gaya="tebal" warna={k.kuning} mulai={w(1, "tiga koma", -0.2)} perHuruf={5} rata="center" tebalFilter />
      <Tulis x={Bc.x} y={880} teks="per tahun · rupiah · bank umum" ukuran={50} gaya="tipis" warna={k.biru} mulai={w(1, "setahun", -0.3)} perHuruf={1.2} rata="center" />
      <Coret pts={garis(gx(0) - 20, gy, gx(6) + 60, gy, 5, 2)} mulai={w(1, "simpanan rupiah")} lama={18} />
      {[0, 3.75, 6].map((v, i) => (
        <React.Fragment key={v}>
          <Coret pts={garis(gx(v), gy - 26, gx(v), gy + 26, 10 + i, 1)} mulai={w(1, "simpanan rupiah") + 18 + i * 5} lama={5} kapur={false} />
          <Tulis x={gx(v)} y={gy + 70} teks={v === 3.75 ? "3,75%" : `${v}%`} ukuran={46} mulai={w(1, "simpanan rupiah") + 20 + i * 5} perHuruf={1} rata="center" kapur={false} />
        </React.Fragment>
      ))}
      <Coret pts={garis(gx(0), gy - 4, gx(3.75), gy - 4, 21, 1)} mulai={w(1, "maksimal")} lama={14} tebal={16} warna={k.hijauTerang} />
      <Tulis x={(gx(0) + gx(3.75)) / 2} y={gy - 60} teks="dijamin" ukuran={48} warna={k.hijauTerang} mulai={w(1, "maksimal") + 10} perHuruf={1.5} rata="center" kapur={false} />
      <Coret pts={garis(gx(3.75), gy - 4, gx(6), gy - 4, 22, 1)} mulai={w(1, "sampai akhir")} lama={10} tebal={16} warna={k.merah} />
      <Tulis x={(gx(3.75) + gx(6)) / 2} y={gy - 60} teks="tidak dijamin" ukuran={44} warna={k.merah} mulai={w(1, "sampai akhir") + 8} perHuruf={1.3} rata="center" kapur={false} />
      <Coret pts={lingkaran(gx(6), gy + 70, 70, 50, 4)} mulai={w(1, "Januari", -0.4)} lama={14} warna={k.merah} tebal={6} />
      <Tulis x={Bc.x} y={1175} teks="berlaku s.d. 31 Jan 2027" ukuran={52} gaya="tipis" warna={k.biru} mulai={w(1, "Januari")} perHuruf={1.2} rata="center" />

      {/* ===== C: salah kaprah ===== */}
      <Tulis x={290} y={C.y0 + 320} teks="Dikira" ukuran={92} gaya="hias" warna={k.biru} mulai={w(2, "Banyak")} perHuruf={2} rata="center" />
      <Coret pts={garis(540, C.y0 + 250, 540, C.y0 + 1180, 7, 3)} mulai={w(2, "Banyak") + 8} lama={16} tebal={5} kapur={false} />
      {["cuma kelebihan", "bunganya", "yang hangus"].map((t, i) => (
        <Tulis key={t} x={290} y={C.y0 + 520 + i * 90} teks={t} ukuran={62} mulai={w(2, "cuma") + i * 14} perHuruf={1.2} rata="center" />
      ))}
      <Coret pts={garis(90, C.y0 + 620, 490, C.y0 + 600, 9, 6)} mulai={w(2, "Padahal")} lama={10} warna={k.merah} tebal={10} />
      <Tulis x={790} y={C.y0 + 320} teks="Faktanya" ukuran={92} gaya="hias" warna={k.kuning} mulai={w(2, "Padahal")} perHuruf={2} rata="center" />
      <Angkat mulai={w(2, "seluruh", 0.3)} selesai={akhir(2) - 6} x={575} y={C.y0 + 420} w={440} h={560} miringY={-12}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Tulis x={220} y={90} teks="SELURUH" ukuran={96} gaya="tebal" warna={k.merah} mulai={w(2, "seluruh")} perHuruf={2} rata="center" />
          <Tulis x={220} y={200} teks="simpanan" ukuran={72} mulai={w(2, "simpanannya")} perHuruf={1.5} rata="center" />
          <Tulis x={220} y={300} teks="nggak dijamin" ukuran={64} mulai={w(2, "nggak dijamin")} perHuruf={1.5} rata="center" />
          <Tulis x={220} y={440} teks="termasuk pokok!" ukuran={64} gaya="tebal" warna={k.kuning} mulai={w(2, "termasuk")} perHuruf={1.5} rata="center" />
          <Coret pts={garis(40, 490, 400, 486, 15, 3)} mulai={w(2, "pokoknya")} lama={8} warna={k.kuning} tebal={7} />
        </div>
      </Angkat>
      <Coret pts={lingkaran(795, C.y0 + 700, 250, 330, 6)} mulai={w(2, "termasuk", -0.2)} lama={16} warna={k.merah} tebal={6} />

      {/* ===== D: contoh Rp10 juta ===== */}
      <Tulis x={D.x0 + 110} y={D.y0 + 210} teks="Misal:" ukuran={84} gaya="hias" warna={k.biru} mulai={w(3, "Misalnya")} perHuruf={2} />
      <Angkat mulai={w(3, "Kalau banknya")} selesai={w(3, "Cashback")} x={D.x0 + 250} y={D.y0 + 300} w={580} h={380} miringX={18} miringY={-14}>
        <div style={{ position: "absolute", inset: 0 }}>
          {[2, 1, 0].map((n) => (
            <Coret key={n} pts={kotak(30 + n * 18, 40 + n * 22, 500, 270, 30 + n)} mulai={w(3, "sepuluh juta") - 20 + (2 - n) * 6} lama={16} tebal={6} kapur={n === 0} />
          ))}
          <Coret pts={lingkaran(280, 175, 70, 70, 8)} mulai={w(3, "sepuluh juta") + 6} lama={10} tebal={5} kapur={false} />
          <Tulis x={280} y={180} teks="Rp10 juta" ukuran={82} gaya="tebal" warna={k.kuning} mulai={w(3, "sepuluh juta")} perHuruf={2} rata="center" />
        </div>
      </Angkat>
      <Tulis x={D.x} y={D.y0 + 790} teks="bunga 6%  >  3,75%" ukuran={78} mulai={w(3, "bunga enam")} perHuruf={1.6} rata="center" />
      <Coret pts={lingkaran(D.x - 70, D.y0 + 790, 72, 52, 11)} mulai={w(3, "di bank umum")} lama={12} warna={k.merah} tebal={5} />
      <Tulis x={D.x} y={D.y0 + 920} teks="→ bisa nggak diganti" ukuran={72} gaya="tebal" warna={k.merah} mulai={w(3, "bisa nggak")} perHuruf={1.4} rata="center" />
      <Tulis x={D.x} y={D.y0 + 1060} teks="cashback = bunga" ukuran={70} warna={k.kuning} mulai={w(3, "Cashback")} perHuruf={1.6} rata="center" />
      <Coret pts={kotak(D.x - 300, D.y0 + 1000, 600, 120, 40)} mulai={w(3, "dihitung")} lama={16} warna={k.kuning} tebal={5} />

      {/* ===== E: 14 bank ===== */}
      <Tulis x={E.x} y={E.y0 + 300} teks="Bank bisa tutup." ukuran={110} gaya="hias" mulai={w(4, "bank memang")} perHuruf={2} rata="center" />
      {Array.from({ length: 14 }).map((_, i) => {
        const bar = Math.floor(i / 5);
        const kol = i % 5;
        const n = bar < 2 ? 5 : 4;
        const cx = E.x - ((n - 1) * 180) / 2 + kol * 180;
        const cy = E.y0 + 500 + bar * 150;
        const mulai = w(4, "Hingga") + i * 4;
        const silang = w(4, "empat belas") + i * 3;
        return (
          <React.Fragment key={i}>
            {ikonBank(cx, cy, 110, i * 7).map((pts, j) => (
              <Coret key={j} pts={pts} mulai={mulai + j} lama={8} tebal={4} kapur={false} />
            ))}
            <Coret pts={garis(cx - 55, cy - 55, cx + 55, cy + 55, i + 70, 2)} mulai={silang} lama={5} warna={k.merah} tebal={6} kapur={false} />
            <Coret pts={garis(cx + 55, cy - 55, cx - 55, cy + 55, i + 90, 2)} mulai={silang + 2} lama={5} warna={k.merah} tebal={6} kapur={false} />
          </React.Fragment>
        );
      })}
      <Tulis x={E.x} y={E.y0 + 950} teks="14" ukuran={250} gaya="tebal" warna={k.kuning} mulai={w(4, "empat belas")} perHuruf={6} rata="center" tebalFilter />
      <Tulis x={E.x} y={E.y0 + 1085} teks="BPR & BPRS dilikuidasi" ukuran={62} mulai={w(4, "dilikuidasi", -0.6)} perHuruf={1.2} rata="center" />
      <Tulis x={E.x} y={E.y0 + 1150} teks="s.d. Okt 2026 · sumber: KSSK, 3 Nov 2026" ukuran={34} gaya="tipis" warna={k.biru} mulai={w(4, "dilikuidasi")} perHuruf={0.6} rata="center" kapur={false} />

      {/* ===== F: cek dulu ===== */}
      <Tulis x={F.x0 + 110} y={F.y0 + 300} teks="Cek dulu:" ukuran={120} gaya="hias" warna={k.kuning} mulai={w(5, "cek dulu")} perHuruf={2} />
      <Coret pts={kotak(F.x0 + 110, F.y0 + 470, 80, 80, 50)} mulai={w(5, "bunga plus", -0.4)} lama={12} tebal={5} />
      <Tulis x={F.x0 + 230} y={F.y0 + 490} teks="bunga + cashback" ukuran={66} mulai={w(5, "bunga plus")} perHuruf={1.4} />
      <Tulis x={F.x0 + 230} y={F.y0 + 580} teks="≤ 3,75% ?" ukuran={70} gaya="tebal" warna={k.kuning} mulai={w(5, "di bawah batas")} perHuruf={2} />
      <Coret pts={centang(F.x0 + 125, F.y0 + 505, 1.1)} mulai={w(5, "atau nggak")} lama={8} warna={k.hijauTerang} tebal={9} />
      <Coret pts={kotak(F.x0 + 110, F.y0 + 740, 80, 80, 60)} mulai={w(5, "Ingat")} lama={12} tebal={5} />
      <Tulis x={F.x0 + 230} y={F.y0 + 760} teks="jaminan maks." ukuran={66} mulai={w(5, "jaminannya")} perHuruf={1.4} />
      <Tulis x={F.x0 + 230} y={F.y0 + 870} teks="Rp2 miliar" ukuran={110} gaya="tebal" warna={k.kuning} mulai={w(5, "dua miliar")} perHuruf={2.5} tebalFilter />
      <Tulis x={F.x0 + 230} y={F.y0 + 975} teks="per nasabah, per bank" ukuran={54} gaya="tipis" warna={k.biru} mulai={w(5, "per nasabah")} perHuruf={1.2} />
      <Coret pts={centang(F.x0 + 125, F.y0 + 775, 1.1)} mulai={w(5, "per bank")} lama={8} warna={k.hijauTerang} tebal={9} />
      <Panah x1={F.x0 + 900} y1={F.y0 + 1080} x2={F.x0 + 760} y2={F.y0 + 920} tinggi={-40} mulai={w(5, "per nasabah", 0.2)} lama={14} warna={k.biru} tebal={5} />

      {/* ===== G: penutup (lebar 2 kolom, huruf lebih besar karena kamera mundur) ===== */}
      <Tulis x={G.x} y={G.y + 420} teks="Bunga tinggi boleh," ukuran={190} gaya="tebal" mulai={w(6, "Bunga")} perHuruf={2.4} rata="center" />
      <Tulis x={G.x} y={G.y + 680} teks="asal tahu risikonya." ukuran={170} gaya="hias" warna={k.kuning} mulai={w(6, "asal")} perHuruf={2.2} rata="center" />
      <Coret pts={garis(G.x - 760, G.y + 810, G.x + 760, G.y + 800, 80, 6)} mulai={w(6, "risikonya")} lama={14} warna={k.kuning} tebal={12} />
      <Tulis x={G.x} y={G.y + 960} teks="Konten edukasi, bukan ajakan membeli." ukuran={80} gaya="tipis" warna={k.biru} mulai={w(6, "Konten")} perHuruf={1.2} rata="center" />
      <Tulis x={G.x} y={G.y + 1200} teks="IntipDompet" ukuran={180} gaya="tebal" mulai={w(7, "IntipDompet")} perHuruf={2.2} rata="center" />
      <Tulis x={G.x} y={G.y + 1400} teks="Urusan uang, kita intip." ukuran={120} gaya="hias" warna={k.kuning} mulai={w(7, "Urusan")} perHuruf={1.8} rata="center" />
    </>
  );
};

export const DepositoPapan: React.FC = () => (
  <AbsoluteFill style={{ background: "#0f0d0b" }}>
    <FilterKapur />
    <Papan kunci={KUNCI} layar={<Subtitel />}>
      <IsiPapan />
    </Papan>
    <Audio src={staticFile(vo.audio)} />
  </AbsoluteFill>
);
