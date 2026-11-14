// Reels "Tiap akhir tahun, kok dompet selalu kaget?" (tayang 15 Nov 2026, 19.00) — template Papan Kapur.
// Naskah: produksi/20261115-pengeluaran-tahunan/naskah-vo.json.
//   A hook (kalender Desember) · B penjelasan (4 tagihan tahunan, ≠ dana darurat) · C perumpamaan (arisan sama diri sendiri)
//   D efek (gaji tergerus → utang?) · E akibat (contoh Rp1,2 jt ÷ 12) · F solusi (checklist 3) · G CTA
//
// vo-waktu.json dibuat dengan:
//   python3 scripts/sinkron_vo.py produksi/20261115-pengeluaran-tahunan src/produksi/pengeluaran-tahunan/vo-waktu.json
// Selama VO belum ada (audio null), waktu diperkirakan dari naskah.
import React from "react";
import naskah from "../../../produksi/20261115-pengeluaran-tahunan/naskah-vo.json";
import vo from "./vo-waktu.json";
import { Coret, Panah, Tulis, garis, lingkaran } from "../../papan/Komponen";
import { d, k } from "../../papan/tema";
import { BENDA, Bentuk, Orang } from "../../papan/ilustrasi";
import { DataVO } from "../../catatan/Jadwal";
import { A, B, C, Checklist, D, E, F, G, Muncul, ReelsPapan, bookmark, buatReels, busur } from "../../papan/reels";

const R = buatReels(vo as DataVO, naskah);
const { W } = R;
export const DURASI_PENGELUARAN_TAHUNAN = R.durasi;
const B_ = BENDA;
const SUDAH = -9999;

// Kalender kapur halaman Desember: 5×5 tanggal, sebagian dilingkari merah.
const KalenderDes: React.FC<{ cx: number; cy: number; mulaiLingkar: number }> = ({ cx, cy, mulaiLingkar }) => {
  const w = 520;
  const h = 470;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const merah = [3, 9, 17, 21];
  return (
    <>
      <Bentuk pts={[[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]} warna={k.putih} isi={0.08} tebal={7} />
      <Bentuk pts={[[x, y], [x + w, y], [x + w, y + 100], [x, y + 100], [x, y]]} warna={k.merah} garis={k.putih} isi={0.55} tebal={7} />
      <Tulis x={cx} y={y + 72} teks="DESEMBER" ukuran={64} gaya="tebal" mulai={-9999} rata="center" />
      {Array.from({ length: 20 }, (_, i) => {
        const c = i % 5;
        const r = Math.floor(i / 5);
        const tx = x + 62 + c * 99;
        const ty = y + 165 + r * 82;
        return (
          <React.Fragment key={i}>
            <Bentuk pts={lingkaran(tx, ty, 9, 9, i)} warna={k.putih} isi={0.6} tebal={3} />
            {merah.includes(i) ? <Coret pts={lingkaran(tx, ty, 36, 32, i + 3)} mulai={mulaiLingkar + merah.indexOf(i) * 6} lama={8} warna={k.merah} tebal={6} /> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

const IsiPapan: React.FC = () => (
  <>
    {/* ===== A: hook — sudah utuh di frame 0 (aturan 14 Nov); kapur melingkari tanggal mulai 0,5 s ===== */}
    <Tulis x={A.x} y={A.y0 + 230} teks="tiap akhir tahun…" ukuran={90} gaya="tebal" mulai={SUDAH} rata="center" />
    <KalenderDes cx={A.x - 120} cy={A.y0 + 620} mulaiLingkar={d(0.5)} />
    <B_.dompet cx={A.x0 + 860} cy={A.y0 + 760} s={230} />
    <Tulis x={A.x0 + 940} y={A.y0 + 640} teks="!" ukuran={150} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" />
    <Tulis x={A.x} y={A.y0 + 1050} teks="kok dompet kaget?" ukuran={116} gaya="tebal" warna={k.merah} mulai={SUDAH} rata="center" tebalFilter />

    {/* ===== B: tagihan setahun sekali ===== */}
    <Tulis x={B.x} y={B.y0 + 240} teks="datang setahun sekali" ukuran={84} gaya="tebal" mulai={R.tiba(1)} perHuruf={1.2} rata="center" />
    {[
      { t: "pajak kendaraan", f: "pajak kendaraan", w: "kuning", x: 300, y: 420, m: -6 },
      { t: "servis", f: "servis", w: "biru", x: 760, y: 440, m: 5 },
      { t: "hadiah", f: "hadiah", w: "merah", x: 300, y: 620, m: 4 },
      { t: "tiket pulang", f: "tiket", w: "hijau", x: 740, y: 640, m: -5 },
    ].map((l, i) => (
      <Muncul key={i} mulai={W(1, l.f, -0.3)}>
        <B_.label cx={B.x0 + l.x} cy={B.y0 + l.y} s={l.t.length > 8 ? 400 : 300} teks={l.t} warna={(k as Record<string, string>)[l.w === "hijau" ? "hijauTerang" : l.w]} miring={l.m} />
      </Muncul>
    ))}
    <Tulis x={B.x} y={B.y0 + 820} teks="jarang → lupa disiapkan" ukuran={60} warna={k.biru} mulai={W(1, "Karena jarang", -0.2)} perHuruf={1} rata="center" />
    <Tulis x={B.x} y={B.y0 + 980} teks="≠ dana darurat" ukuran={96} gaya="tebal" warna={k.kuning} mulai={W(1, "dana darurat", -0.6)} perHuruf={1.4} rata="center" tebalFilter />
    <Tulis x={B.x} y={B.y0 + 1100} teks="waktunya bisa ditebak" ukuran={64} gaya="hias" mulai={W(1, "bisa ditebak", -0.6, 16)} perHuruf={1} rata="center" />

    {/* ===== C: arisan sama diri sendiri ===== */}
    <Tulis x={C.x} y={C.y0 + 230} teks="Mirip arisan" ukuran={96} gaya="hias" warna={k.biru} mulai={R.tiba(2)} perHuruf={1.5} rata="center" />
    <Coret pts={busur(C.x, C.y0 + 660, 300, -Math.PI * 0.45, Math.PI * 1.35, 36)} mulai={W(2, "Mirip arisan", 0.3)} lama={24} tebal={6} />
    <Panah x1={C.x + Math.cos(Math.PI * 1.3) * 300} y1={C.y0 + 660 + Math.sin(Math.PI * 1.3) * 300} x2={C.x + Math.cos(Math.PI * 1.5) * 300} y2={C.y0 + 660 + Math.sin(Math.PI * 1.5) * 300} tinggi={30} mulai={W(2, "Mirip arisan", 1.0)} lama={8} tebal={6} />
    {Array.from({ length: 6 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
      const cx = C.x + Math.cos(a) * 300;
      const cy = C.y0 + 660 + Math.sin(a) * 300;
      return (
        <Muncul key={i} mulai={W(2, "dirimu sendiri", -0.6) + i * 3}>
          <Bentuk pts={lingkaran(cx, cy, 62, 62, i + 1)} warna={k.hijauTerang} garis={k.putih} isi={0.35} tebal={5} />
          <Tulis x={cx} y={cy + 16} teks="kamu" ukuran={40} gaya="tebal" mulai={-9999} rata="center" />
        </Muncul>
      );
    })}
    <Muncul mulai={W(2, "tanggal dapatnya", -0.3)}>
      <B_.kalender cx={C.x} cy={C.y0 + 640} s={190} teks="GILIRAN" />
    </Muncul>
    <Tulis x={C.x} y={C.y0 + 1080} teks="uangnya pasti ada" ukuran={84} gaya="tebal" warna={k.kuning} mulai={W(2, "pasti ada", -0.4, 16)} perHuruf={1.2} rata="center" />

    {/* ===== D: gaji tergerus ===== */}
    <Tulis x={D.x} y={D.y0 + 240} teks="tanpa disiapkan…" ukuran={84} gaya="hias" warna={k.biru} mulai={R.tiba(3)} perHuruf={1.2} rata="center" />
    <Muncul mulai={W(3, "Tanpa disiapkan", 0.2)}>
      <B_.uang cx={D.x0 + 330} cy={D.y0 + 560} s={420} teks="GAJI" />
    </Muncul>
    <Muncul mulai={W(3, "tagihan tahunan", -0.3)}>
      <B_.label cx={D.x0 + 700} cy={D.y0 + 420} s={420} teks="tagihan tahunan" warna={k.merah} miring={-6} />
    </Muncul>
    <Coret pts={garis(D.x0 + 120, D.y0 + 700, D.x0 + 560, D.y0 + 430, 11, 4)} mulai={W(3, "menggerus", -0.2)} lama={10} warna={k.merah} tebal={12} />
    <Tulis x={D.x0 + 330} y={D.y0 + 790} teks="gaji bulan itu tergerus" ukuran={50} warna={k.merah} mulai={W(3, "menggerus", 0.1)} perHuruf={1} rata="center" />
    <Panah x1={D.x0 + 560} y1={D.y0 + 760} x2={D.x0 + 700} y2={D.y0 + 900} tinggi={30} mulai={W(3, "berujung", -0.5)} lama={8} warna={k.merah} tebal={7} />
    <Muncul mulai={W(3, "berujung", -0.4)}>
      <B_.kartu cx={D.x0 + 800} cy={D.y0 + 990} s={240} />
    </Muncul>
    <Tulis x={D.x0 + 800} y={D.y0 + 1170} teks="utang?" ukuran={84} gaya="tebal" warna={k.merah} mulai={W(3, "berujung", -0.3, 14)} perHuruf={1.6} rata="center" />

    {/* ===== E: contoh hitungan ===== */}
    <Tulis x={E.x0 + 110} y={E.y0 + 230} teks="Contoh:" ukuran={84} gaya="hias" warna={k.biru} mulai={R.tiba(4)} perHuruf={2} />
    <Tulis x={E.x} y={E.y0 + 370} teks="pajak motor + servis" ukuran={74} mulai={W(4, "pajak motor", -0.2)} perHuruf={1.2} rata="center" />
    <Tulis x={E.x} y={E.y0 + 500} teks="= Rp1,2 jt / tahun" ukuran={92} gaya="tebal" mulai={W(4, "satu koma dua", -0.3)} perHuruf={1.5} rata="center" />
    <Tulis x={E.x} y={E.y0 + 620} teks="÷ 12 bulan" ukuran={92} gaya="tebal" mulai={W(4, "dicicil", -0.4)} perHuruf={2} rata="center" />
    <Coret pts={garis(E.x - 320, E.y0 + 680, E.x + 320, E.y0 + 674, 7, 3)} mulai={W(4, "dicicil")} lama={10} tebal={6} kapur={false} />
    <Tulis x={E.x} y={E.y0 + 820} teks="= Rp100 rb / bulan" ukuran={104} gaya="tebal" warna={k.kuning} mulai={W(4, "seratus ribu", -0.6)} perHuruf={1.4} rata="center" tebalFilter />
    {Array.from({ length: 12 }, (_, i) => (
      <Muncul key={i} mulai={W(4, "dicicil", 0.2) + i * 2}>
        <Bentuk pts={lingkaran(E.x0 + 155 + i * 70, E.y0 + 960, 26, 26, i)} warna={k.kuning} garis={k.kuning} isi={0.5} tebal={4} />
      </Muncul>
    ))}
    <Tulis x={E.x} y={E.y0 + 1100} teks="(contoh hitungan)" ukuran={40} gaya="tipis" warna={k.biru} mulai={W(4, "Contohnya", 0.5)} perHuruf={0.8} rata="center" />

    {/* ===== F: solusi ===== */}
    <Tulis x={F.x0 + 100} y={F.y0 + 260} teks="Biar nggak kaget:" ukuran={92} gaya="hias" warna={k.kuning} mulai={R.tiba(5)} perHuruf={1.4} />
    <Checklist
      x={F.x0 + 100}
      y={F.y0 + 470}
      jarak={200}
      baris={[
        { kotak: W(5, "Tulis semua", -0.3), centang: W(5, "Jumlahkan", -0.2), teks: <Tulis x={F.x0 + 220} y={F.y0 + 470} teks="daftar tagihan tahunan" ukuran={60} mulai={W(5, "Tulis semua")} perHuruf={1.1} /> },
        { kotak: W(5, "Jumlahkan", -0.3), centang: W(5, "Sisihkan", -0.2), teks: <Tulis x={F.x0 + 220} y={F.y0 + 670} teks="jumlahkan ÷ 12" ukuran={60} mulai={W(5, "Jumlahkan")} perHuruf={1.2} /> },
        { kotak: W(5, "Sisihkan", -0.3), centang: W(5, "rekening terpisah", 0, 8), teks: <Tulis x={F.x0 + 220} y={F.y0 + 870} teks="sisihkan tiap gajian" ukuran={60} mulai={W(5, "Sisihkan")} perHuruf={1.1} /> },
      ]}
    />
    <Tulis x={F.x0 + 600} y={F.y0 + 1070} teks="di rekening terpisah" ukuran={56} gaya="tebal" warna={k.hijauTerang} mulai={W(5, "rekening terpisah", -0.3, 16)} perHuruf={1} rata="center" />
    <Muncul mulai={W(5, "rekening terpisah", -0.3)}>
      <Orang cx={F.x0 + 200} cy={F.y0 + 1130} s={220} pose="jempol" ekspresi="senyum" baju={k.biru} />
    </Muncul>

    {/* ===== G: CTA ===== */}
    <Tulis x={G.x} y={G.y0 + 300} teks="Paling bikin kaget?" ukuran={138} gaya="tebal" mulai={Math.max(W(6, "Pengeluaran tahunan apa"), d(R.T.b6 + 1.6))} perHuruf={1.4} rata="center" />
    <Muncul mulai={W(6, "paling sering", -0.2)}>
      <B_.gelembung cx={G.x + 120} cy={G.y0 + 545} s={500} teks="____?" />
    </Muncul>
    <Tulis x={G.x} y={G.y0 + 800} teks="jawab 1 kata di komen ↓" ukuran={100} gaya="hias" warna={k.kuning} mulai={W(6, "Jawab satu kata")} perHuruf={1.4} rata="center" />
    <Tulis x={G.x - 120} y={G.y0 + 980} teks="simpan video ini" ukuran={104} mulai={W(6, "Simpan")} perHuruf={1.4} rata="center" />
    <Coret pts={bookmark(G.x + 330, G.y0 + 890, 0.75)} mulai={W(6, "Simpan", 0.3)} lama={14} warna={k.kuning} tebal={7} />
    <Tulis x={G.x} y={G.y0 + 1130} teks="IntipDompet" ukuran={150} gaya="tebal" mulai={W(6, "IntipDompet")} perHuruf={2} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1235} teks="Biar dompetmu nggak kaget." ukuran={96} gaya="hias" warna={k.kuning} mulai={W(6, "Biar dompetmu")} perHuruf={1.5} rata="center" />
    <Tulis x={G.x} y={G.y0 + 1320} teks="konten edukasi · angka = contoh hitungan" ukuran={54} gaya="tipis" warna={k.biru} mulai={W(6, "IntipDompet", 0.3)} perHuruf={0.5} rata="center" />
  </>
);

const TEKS_TAMPIL = [
  "Tiap akhir tahun, kok dompet selalu kaget?",
  "Banyak pengeluaran datang setahun sekali: pajak kendaraan, servis, hadiah akhir tahun, atau tiket pulang kampung. Karena jarang, kita lupa menyiapkannya. Ini beda dengan dana darurat, karena waktunya bisa ditebak.",
  "Mirip arisan yang kamu tahu tanggal dapatnya. Bedanya, ini arisan sama dirimu sendiri, jadi uangnya pasti ada saat giliranmu tiba.",
  "Tanpa disiapkan, tagihan tahunan menggerus gaji bulan itu, atau malah berujung utang.",
  "Contohnya, pajak motor dan servis totalnya Rp1,2 juta setahun. Kalau dicicil, cuma Rp100 ribu sebulan.",
  "Tulis semua pengeluaran tahunanmu. Jumlahkan, lalu bagi 12. Sisihkan angkanya tiap gajian di rekening terpisah.",
  "Pengeluaran tahunan apa yang paling sering bikin kaget? Jawab satu kata di komen. Simpan video ini buat bikin daftarnya.",
];

export const PengeluaranTahunanReels: React.FC<{ subtitel?: boolean }> = ({ subtitel = true }) => (
  <ReelsPapan r={R} teksTampil={TEKS_TAMPIL} subtitel={subtitel}>
    <IsiPapan />
  </ReelsPapan>
);

