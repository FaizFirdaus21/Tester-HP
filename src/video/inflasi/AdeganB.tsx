import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Kamera, Kota, Langit, Sumber, Teks, lerp } from "../../komponen/Panggung";
import { Tipo, kedipOtomatis } from "../../komponen/Tipo";
import { huruf, m, persen } from "../../tema/malam";

const Mendarat: React.FC<{ mulai: number; children: React.ReactNode; dari?: number; style?: React.CSSProperties }> = ({
  mulai,
  children,
  dari = 1.5,
  style,
}) => {
  const f = useCurrentFrame();
  const p = lerp(f, mulai, mulai + 11, 0, 1);
  return (
    <div style={{ ...style, opacity: Math.min(1, p * 2.5), transform: `scale(${dari + (1 - dari) * p})` }}>{children}</div>
  );
};

const Pil: React.FC<{ x: number; y: number; teks: string; warna?: string; latar?: string; ukuran?: number; skala?: number; o?: number }> = ({
  x,
  y,
  teks,
  warna = m.langit,
  latar = m.bulan,
  ukuran = 38,
  skala = 1,
  o = 1,
}) => {
  const w = teks.length * ukuran * 0.56 + ukuran * 1.5;
  const h = ukuran * 1.8;
  return (
    <g transform={`translate(${x} ${y}) scale(${skala})`} opacity={o}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={latar} />
      <text x={0} y={ukuran * 0.36} textAnchor="middle" fontFamily={huruf.display} fontWeight={600} fontSize={ukuran} fill={warna}>
        {teks}
      </text>
    </g>
  );
};

// Cabai geometris: badan pil oranye + tangkai putih.
const Cabai: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = -30 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-26} y={-20} width={170} height={52} rx={26} fill={m.oranye} />
    <rect x={-46} y={-14} width={34} height={22} rx={8} fill={m.putih} />
    <rect x={-62} y={-30} width={14} height={34} rx={7} fill={m.putih} />
  </g>
);

// ---------------------------------------------------------------- 7. Cabai (satu bidikan panjang, kamera bergerak)
const DASAR = 1080;
const PX_RIBU = 11; // px per Rp1.000
const BAR_W = 220;
const xBar = [330, 800, 1270];

const Batang: React.FC<{ x: number; tumbuhDasar: number; tumbuhAtas: number; nilaiDasar: number; nilaiAtas: number }> = ({
  x,
  tumbuhDasar,
  tumbuhAtas,
  nilaiDasar,
  nilaiAtas,
}) => {
  const hDasar = nilaiDasar * PX_RIBU * tumbuhDasar;
  const hAtas = nilaiAtas * PX_RIBU * tumbuhAtas;
  const total = hDasar + hAtas;
  const atas = DASAR - total;
  const rx = Math.min(28, total / 2);
  return (
    <g>
      <rect x={x - BAR_W / 2} y={atas} width={BAR_W} height={total} rx={rx} fill={m.kota3} />
      {hAtas > 1 ? (
        <>
          <rect x={x - BAR_W / 2} y={atas} width={BAR_W} height={hAtas} rx={Math.min(28, hAtas / 2)} fill={m.oranye} />
          {hAtas > 28 ? <rect x={x - BAR_W / 2} y={atas + 28} width={BAR_W} height={hAtas - 28} fill={m.oranye} /> : null}
        </>
      ) : null}
    </g>
  );
};

const NilaiBatang: React.FC<{ x: number; tinggi: number; teks: string; o: number; warna?: string }> = ({ x, tinggi, teks, o, warna = m.putih }) => (
  <text x={x} y={DASAR - tinggi - 34} textAnchor="middle" fontFamily={huruf.display} fontWeight={600} fontSize={66} fill={warna} opacity={o}>
    {teks}
  </text>
);

export const CABAI_FASE = [170, 180, 140] as const;

export const AdeganCabai: React.FC = () => {
  const f = useCurrentFrame();
  const [g, h] = [CABAI_FASE[0], CABAI_FASE[0] + CABAI_FASE[1]];
  const b1 = lerp(f, 12, 36, 0, 1);
  const b2d = lerp(f, 58, 76, 0, 1);
  const b2a = lerp(f, 80, 102, 0, 1);
  const b3d = lerp(f, g + 26, g + 44, 0, 1);
  const b3a = lerp(f, g + 46, g + 64, 0, 1);
  const datar = lerp(f, g + 70, g + 90, 0, 1);
  const pilNol = lerp(f, g + 86, g + 98, 0, 1);
  const hantu = lerp(f, h + 14, h + 34, 0, 1);
  const tolak = f > h + 62;
  const geleng = tolak && f < h + 92 ? Math.sin((f - h - 62) / 2.4) * 14 * (1 - (f - h - 62) / 30) : 0;
  const tipoMasuk = lerp(f, h + 40, h + 58, 0, 1);
  const t50 = 50 * PX_RIBU;
  const t40 = 40 * PX_RIBU;
  const persenNaik = lerp(f, 100, 118, 0, 1);

  return (
    <AbsoluteFill>
      <Kamera
        kunci={[
          { f: 0, x: 600, y: 900, s: 1.02 },
          { f: g - 10, x: 570, y: 900, s: 1 },
          { f: g + 20, x: 1040, y: 900, s: 1 },
          { f: h, x: 1060, y: 900, s: 1.02 },
          { f: h + 30, x: 940, y: 930, s: 0.68 },
          { f: h + CABAI_FASE[2], x: 940, y: 930, s: 0.7 },
        ]}
      >
        <Langit seed={7}>
          <Kota turun={300} jendela={false} />
          <g transform="translate(1080 0)">
            <Kota turun={300} jendela={false} />
          </g>
          {/* dasar grafik */}
          <rect x={150} y={DASAR} width={1300} height={6} rx={3} fill={m.pudar} />
          {/* batang 1: tahun lalu */}
          <Batang x={xBar[0]} tumbuhDasar={b1} tumbuhAtas={0} nilaiDasar={40} nilaiAtas={0} />
          <NilaiBatang x={xBar[0]} tinggi={t40 * b1} teks="Rp40.000" o={b1} />
          {/* batang 2: tahun ini, kenaikan berwarna oranye */}
          <Batang x={xBar[1]} tumbuhDasar={b2d} tumbuhAtas={b2a} nilaiDasar={40} nilaiAtas={10} />
          <NilaiBatang x={xBar[1]} tinggi={t40 * b2d + 110 * b2a} teks="Rp50.000" o={b2d} />
          <g opacity={persenNaik}>
            <Pil x={(xBar[0] + xBar[1]) / 2} y={DASAR - 250} teks="▲ +25%" warna={m.langit} latar={m.oranye} ukuran={40} skala={1.4 - 0.4 * persenNaik} />
          </g>
          {/* batang 3: bulan depan */}
          <Batang x={xBar[2]} tumbuhDasar={b3d} tumbuhAtas={b3a} nilaiDasar={40} nilaiAtas={10} />
          <NilaiBatang x={xBar[2]} tinggi={t40 * b3d + 110 * b3a} teks="Rp50.000" o={b3d} />
          {/* garis datar: inflasi 0% */}
          <rect x={xBar[1] + BAR_W / 2} y={DASAR - t50 - 4} width={(xBar[2] - xBar[1] - BAR_W) * datar} height={8} rx={4} fill={m.bulan} />
          <Pil x={(xBar[1] + xBar[2]) / 2} y={DASAR - t50 - 150} teks="inflasi 0%" ukuran={40} skala={1.4 - 0.4 * pilNol} o={pilNol} />
          {/* kembali ke Rp40.000? */}
          <g opacity={hantu}>
            {Array.from({ length: 7 }).map((_, i) => (
              <rect key={i} x={xBar[2] - 150 + i * 46} y={DASAR - t40 - 3} width={26} height={6} rx={3} fill={m.bulan} />
            ))}
            <g transform={`translate(${geleng} 0)`}>
              <Pil
                x={xBar[2] + 290}
                y={DASAR - t40 - 60 * (1 - hantu)}
                teks={tolak ? "belum tentu" : "Rp40.000?"}
                warna={tolak ? m.langit : m.langit}
                latar={tolak ? m.oranye : m.bulan}
                ukuran={38}
              />
            </g>
          </g>
          <g transform={`translate(${1620 + 200 * (1 - tipoMasuk)} ${DASAR}) rotate(-8) scale(0.55)`} opacity={tipoMasuk}>
            <Tipo mata={tolak ? "kedip" : "tanya"} lihatX={-1} lenganKiri={tolak ? 60 : 10} />
          </g>
          {/* label sumbu */}
          {["tahun lalu", "tahun ini", "bulan depan"].map((t, i) => (
            <text key={t} x={xBar[i]} y={DASAR + 66} textAnchor="middle" fontFamily={huruf.teks} fontWeight={700} fontSize={40} fill={m.bulan}>
              {t}
            </text>
          ))}
        </Langit>
      </Kamera>
      {/* judul kecil tetap di layar */}
      <div style={{ position: "absolute", top: 250, left: 96, display: "flex", alignItems: "center", gap: 18 }}>
        <svg width={120} height={90} viewBox="-70 -60 220 140">
          <Cabai x={0} y={20} s={0.95} r={-20} />
        </svg>
        <div>
          <div style={{ fontFamily: huruf.display, fontWeight: 600, fontSize: 52, color: m.putih }}>harga cabai per kg</div>
          <div style={{ fontFamily: huruf.mono, fontSize: 24, color: m.pudar }}>contoh ilustrasi</div>
        </div>
      </div>
      <Sequence durationInFrames={CABAI_FASE[0]}>
        <Teks mulai={8} teks="Bayangkan tahun lalu harga cabai Rp40 ribu sekilo. Tahun ini naik menjadi *Rp50* *ribu.*" />
      </Sequence>
      <Sequence from={g} durationInFrames={CABAI_FASE[1]}>
        <Teks mulai={6} teks="Kalau bulan depan harganya tetap Rp50 ribu, inflasinya bisa saja *nol* untuk cabai tersebut." />
      </Sequence>
      <Sequence from={h}>
        <Teks mulai={6} teks="Tapi apakah harganya kembali menjadi Rp40 ribu? Ya, *belum* *tentu.*" />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 8. Disalahpahami
export const Disalahpahami: React.FC = () => {
  const f = useCurrentFrame();
  const angkat = lerp(f, 14, 24, 0, 70);
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, s: 1 }, { f: 65, s: 1.08 }]}>
        <Langit seed={8}>
          <Kota turun={320} jendela={false} />
          <g transform="translate(540 1290) scale(0.72)">
            <Tipo mata="tanya" lenganKiri={angkat} lenganKanan={angkat} />
          </g>
        </Langit>
      </Kamera>
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, textAlign: "center", fontFamily: huruf.display, fontWeight: 600 }}>
        <Mendarat mulai={0} style={{ fontSize: 84, color: m.bulan }}>
          Inilah yang sering
        </Mendarat>
        <Mendarat mulai={8} style={{ fontSize: 132, color: m.oranye, lineHeight: 1.05 }}>
          disalahpahami.
        </Mendarat>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 9. Metafora: harga = ketinggian, inflasi = kecepatan naik
const ketinggian = (f: number) => lerp(f, 14, 130, 0, 1); // cepat di awal, melambat panjang

export const Metafora: React.FC = () => {
  const f = useCurrentFrame();
  const alt = ketinggian(f);
  const laju = Math.max(0, (ketinggian(f + 1) - ketinggian(f - 1)) / 2);
  const lajuMaks = 0.032;
  const lajuN = Math.min(1, laju / lajuMaks);
  const y = 1150 - 640 * alt + Math.sin(f / 15) * 8 * alt;
  const jarumSudut = -90 + 180 * lajuN;
  const lab1 = lerp(f, 6, 18, 0, 1);
  const lab2 = lerp(f, 16, 28, 0, 1);
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, y: 900, s: 1.05 }, { f: 155, y: 860, s: 1 }]}>
        <Langit seed={9}>
          <circle cx={900} cy={300} r={70} fill={m.bulan} />
          <Kota turun={520} jendela={false} />
          {/* penggaris ketinggian */}
          <rect x={150} y={460} width={18} height={720} rx={9} fill={m.kota2} />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={132} y={480 + i * 96} width={54} height={8} rx={4} fill={m.kota3} />
          ))}
          <g transform={`translate(196 ${y - 200})`}>
            <path d="M 0 0 L 36 -24 L 36 24 Z" fill={m.oranye} />
          </g>
          {/* garis kecepatan di bawah Tipo */}
          {[-50, 0, 50].map((dx, i) => (
            <rect key={i} x={540 + dx - 8} y={y + 20} width={16} height={260 * lajuN} rx={8} fill={m.bulan} opacity={0.7} />
          ))}
          <g transform={`translate(540 ${y}) scale(0.62)`}>
            <Tipo mata={lajuN > 0.4 ? "senang" : kedipOtomatis(f, 50, 10)} lenganKiri={20 + 40 * lajuN} lenganKanan={20 + 40 * lajuN} />
          </g>
          {/* speedometer */}
          <g transform="translate(870 870)">
            <path d="M -120 0 A 120 120 0 0 1 120 0" stroke={m.kota2} strokeWidth={34} fill="none" strokeLinecap="round" />
            <g transform={`rotate(${jarumSudut})`}>
              <rect x={-7} y={-104} width={14} height={104} rx={7} fill={m.putih} />
            </g>
            <circle r={20} fill={m.putih} />
          </g>
        </Langit>
      </Kamera>
      <div style={{ position: "absolute", left: 96, top: 250, opacity: lab1 }}>
        <div style={{ fontFamily: huruf.display, fontWeight: 600, fontSize: 60, color: m.putih }}>harga</div>
        <div style={{ fontFamily: huruf.teks, fontWeight: 700, fontSize: 36, color: m.pudar }}>= ketinggian</div>
      </div>
      <div style={{ position: "absolute", right: 96, top: 600, textAlign: "right", opacity: lab2 }}>
        <div style={{ fontFamily: huruf.display, fontWeight: 600, fontSize: 60, color: m.oranye }}>inflasi</div>
        <div style={{ fontFamily: huruf.teks, fontWeight: 700, fontSize: 36, color: m.pudar }}>= kecepatan naik</div>
      </div>
      <Teks mulai={12} teks="Inflasi mengukur seberapa cepat harga *naik,* bukan seberapa *murah* harga barang." />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 10. Pangan bergejolak
export const Pangan: React.FC = () => {
  const f = useCurrentFrame();
  const skala = 700 / 7; // px per 1%
  const a = lerp(f, 14, 44, 0, 3.23);
  const b = lerp(f, 30, 66, 0, 5.81);
  const tunjuk = lerp(f, 60, 72, 0, 1);
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, x: 760, y: 820, s: 1.35 }, { f: 70, x: 540, y: 960, s: 1 }, { f: 210, x: 540, y: 960, s: 1.02 }]}>
        <Langit seed={10}>
          <Kota turun={280} jendela={false} />
          <rect x={96} y={560} width={a * skala} height={100} rx={26} fill={m.kota3} />
          <rect x={96} y={830} width={b * skala} height={100} rx={26} fill={m.oranye} />
          <Cabai x={585} y={790} s={0.6} r={-14} />
          <g transform={`translate(${960} ${1090 + 30 * (1 - tunjuk)}) rotate(-6) scale(0.42)`} opacity={tunjuk}>
            <Tipo mata="normal" lihatX={-1} lihatY={-0.8} lenganKiri={110} />
          </g>
        </Langit>
      </Kamera>
      <div style={{ position: "absolute", left: 96, top: 400, fontFamily: huruf.mono, fontSize: 30, color: m.pudar }}>inflasi tahunan · Oktober 2026</div>
      <div style={{ position: "absolute", left: 96, top: 490, fontFamily: huruf.teks, fontWeight: 700, fontSize: 44, color: m.bulan }}>inflasi umum</div>
      <div style={{ position: "absolute", left: 96, top: 760, fontFamily: huruf.teks, fontWeight: 700, fontSize: 44, color: m.bulan }}>pangan bergejolak</div>
      <div
        style={{ position: "absolute", left: 96 + a * (700 / 7) + 24, top: 560, fontFamily: huruf.display, fontWeight: 600, fontSize: 80, color: m.putih, fontVariantNumeric: "tabular-nums" }}
      >
        {persen(a)}
      </div>
      <div
        style={{ position: "absolute", left: Math.min(96 + b * (700 / 7) + 24, 820), top: 830, fontFamily: huruf.display, fontWeight: 600, fontSize: 80, color: m.oranye, fontVariantNumeric: "tabular-nums" }}
      >
        {persen(b)}
      </div>
      <Sumber teks="Sumber: BPS & Bank Indonesia, Oktober 2026" y={965} mulai={40} />
      <Teks
        mulai={12}
        teks="Bahkan, menurut Bank Indonesia, kelompok pangan bergejolak masih mengalami inflasi tahunan sebesar *5,81* *persen* pada Oktober 2026."
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 11. Mengintip dompet
export const Dompet: React.FC = () => {
  const f = useCurrentFrame();
  const buka = lerp(f, 14, 34, 0, 1);
  const tengok = lerp(f, 30, 46, 0, 1);
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, x: 540, y: 900, s: 1 }, { f: 150, x: 520, y: 850, s: 1.16 }]}>
        <Langit seed={11}>
          <Kota turun={300} jendela={false} />
          {/* isi dompet yang terlihat */}
          <rect x={330} y={700 + 60 * (1 - buka)} width={300} height={120} rx={18} fill={m.bulan} />
          <circle cx={640} cy={760 + 60 * (1 - buka)} r={36} fill={m.putih} />
          {/* badan dompet */}
          <rect x={260} y={760} width={560} height={340} rx={52} fill={m.kota3} />
          <rect x={300} y={790} width={480} height={22} rx={11} fill={m.kota2} />
          {/* tutup dompet terangkat */}
          <g transform={`translate(260 760) rotate(${-14 * buka}) translate(0 ${-150 * buka})`}>
            <rect x={0} y={0} width={560} height={170} rx={52} fill={m.kota2} />
            <rect x={470} y={60} width={80} height={56} rx={22} fill={m.bulan} />
          </g>
          <g transform={`translate(${880 - 40 * tengok} 900) rotate(${-16 * tengok}) scale(0.7)`}>
            <Tipo mata={f > 70 ? "lirik" : kedipOtomatis(f, 60, 20)} lihatX={-0.9} lihatY={0.9 * tengok} lenganKiri={30 * tengok} />
          </g>
        </Langit>
      </Kamera>
      <Teks mulai={12} teks="Jadi, meskipun inflasi melambat, bukan berarti daya beli masyarakat *otomatis* *membaik.*" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 12. Kesimpulan
export const KESIMPULAN_FASE = [125, 165] as const;

export const Kesimpulan: React.FC = () => {
  const f = useCurrentFrame();
  const y = 640 + Math.sin(f / 18) * 14;
  const tiang = lerp(f, 8, 30, 0, 1);
  const lab1 = lerp(f, 24, 36, 0, 1);
  const fase2 = KESIMPULAN_FASE[0];
  const lab2 = lerp(f, fase2 + 10, fase2 + 22, 0, 1);
  const tanah = 1190;
  const tinggiTiang = (tanah - y - 30) * tiang;
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, x: 540, y: 980, s: 0.92 }, { f: 290, x: 540, y: 880, s: 1 }]}>
        <Langit seed={12}>
          <circle cx={190} cy={330} r={100} fill={m.bulan} />
          <Kota turun={260} />
          <rect x={526} y={tanah - tinggiTiang} width={28} height={tinggiTiang} rx={14} fill={m.oranye} />
          <g transform={`translate(540 ${y}) scale(0.6)`}>
            <Tipo mata={kedipOtomatis(f, 70, 0)} lihatX={-0.4} lihatY={0.6} lenganKiri={25} lenganKanan={25} />
          </g>
          <g opacity={lab1}>
            <Pil x={255} y={y + 60} teks="harga tetap tinggi" ukuran={42} />
          </g>
          <g opacity={lab2}>
            <Pil x={790} y={y - 400} teks="kenaikan melambat" ukuran={46} latar={m.kota3} warna={m.bulan} />
          </g>
        </Langit>
      </Kamera>
      <Sequence durationInFrames={fase2}>
        <Teks mulai={12} teks="Kesimpulannya: harga bisa *tetap* *mahal* meskipun inflasi sudah terkendali." />
      </Sequence>
      <Sequence from={fase2}>
        <Teks mulai={6} teks="Karena yang melambat adalah *kenaikan* *harganya,* bukan harga barangnya yang kembali turun." />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 13. Sekarang kamu jadi tahu, kan?
export const TahuKan: React.FC = () => {
  const f = useCurrentFrame();
  const mata = f < 22 ? "normal" : f < 44 ? "kedipSatu" : "senang";
  const angguk = f > 22 && f < 40 ? Math.sin(((f - 22) / 18) * Math.PI) * 5 : 0;
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, s: 1 }, { f: 75, s: 1.07 }]}>
        <Langit seed={13}>
          <Kota turun={420} jendela={false} />
          <g transform={`translate(540 ${1560}) rotate(${angguk}) scale(2.2)`}>
            <Tipo mata={mata} antena={0.6 + 0.4 * Math.abs(Math.sin(f / 5))} />
          </g>
        </Langit>
      </Kamera>
      <Teks mulai={6} posisi="atas" teks="Sekarang kamu jadi *tahu,* kan?" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 14. Penutup
export const Penutup: React.FC = () => {
  const f = useCurrentFrame();
  const naik = lerp(f, 0, 14, 340, 0);
  const tulisan = lerp(f, 8, 20, 0, 1);
  const tag = lerp(f, 14, 26, 0, 1);
  const TANAH = 1180;
  return (
    <AbsoluteFill>
      <Langit seed={14}>
        <circle cx={790} cy={330} r={90} fill={m.bulan} />
        <rect x={0} y={980} width={170} height={940} fill={m.kota2} />
        <rect x={900} y={940} width={180} height={980} fill={m.kota2} />
        <g transform={`translate(540 ${TANAH + 250 + naik})`}>
          <Tipo mata={f > 30 ? "senang" : "normal"} lihatY={-0.5} />
        </g>
        <rect x={-200} y={TANAH} width={1480} height={800} fill={m.kota3} />
      </Langit>
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center" }}>
        <div
          style={{
            fontFamily: huruf.display,
            fontWeight: 600,
            fontSize: 150,
            letterSpacing: "-0.02em",
            color: m.putih,
            opacity: tulisan,
            transform: `translateY(${40 * (1 - tulisan)}px)`,
          }}
        >
          intip<span style={{ color: m.bulan }}>dompet</span>
        </div>
        <div
          style={{
            fontFamily: huruf.teks,
            fontWeight: 700,
            fontSize: 50,
            color: m.pudar,
            marginTop: 10,
            opacity: tag,
            transform: `translateY(${30 * (1 - tag)}px)`,
          }}
        >
          Urusan uang, kita intip.
        </div>
      </div>
    </AbsoluteFill>
  );
};
