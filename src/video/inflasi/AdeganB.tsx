import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Kamera, Kota, Langit, Sumber, Teks, lerp } from "../../komponen/Panggung";
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
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, s: 1 }, { f: 65, s: 1.08 }]}>
        <Langit seed={8}>
          <Kota turun={320} jendela={false} />
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

// ---------------------------------------------------------------- Grafik tingkat harga
// Garis tingkat harga yang terus naik tapi makin landai.
// Tinggi garis = harga. Kemiringan garis = inflasi (kecepatan naik).
const G = { x0: 150, x1: 930, y0: 1060, y1: 470 };
const tingkat = (t: number) => 0.18 + 0.82 * (1 - Math.pow(1 - t, 2.4));
const titikGaris = (t: number) => [G.x0 + (G.x1 - G.x0) * t, G.y0 - (G.y0 - G.y1) * tingkat(t)] as const;

const GrafikHarga: React.FC<{ gambar: number; titik: number; tangen: number; dasarAwal?: number; kurung?: number }> = ({
  gambar,
  titik,
  tangen,
  dasarAwal = 0,
  kurung = 0,
}) => {
  const n = 60;
  const pts = Array.from({ length: n + 1 }, (_, i) => titikGaris((i / n) * gambar));
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const [tx, ty] = titikGaris(titik);
  const [ax, ay] = titikGaris(Math.max(0, titik - 0.01));
  const [bx, by] = titikGaris(Math.min(1, titik + 0.01));
  const sudut = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
  const [, yAwal] = titikGaris(0);
  const [, yAkhir] = titikGaris(1);
  return (
    <g>
      {[0.25, 0.5, 0.75].map((k) => (
        <rect key={k} x={G.x0} y={G.y0 - (G.y0 - G.y1) * k} width={G.x1 - G.x0} height={3} fill={m.kota2} />
      ))}
      <rect x={G.x0} y={G.y0} width={G.x1 - G.x0} height={6} rx={3} fill={m.pudar} />
      {dasarAwal > 0
        ? Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={G.x0 + i * 58} y={yAwal - 3} width={32 * dasarAwal} height={6} rx={3} fill={m.pudar} />
          ))
        : null}
      {kurung > 0 ? (
        <g opacity={kurung}>
          <rect x={G.x1 + 30} y={yAkhir} width={14} height={(yAwal - yAkhir) * kurung} rx={7} fill={m.oranye} />
        </g>
      ) : null}
      <path d={d} stroke={m.putih} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {tangen > 0 ? (
        <g transform={`translate(${tx} ${ty}) rotate(${sudut})`} opacity={tangen}>
          <rect x={-150} y={-6} width={300} height={12} rx={6} fill={m.oranye} />
          <path d="M 150 -22 L 186 0 L 150 22 Z" fill={m.oranye} />
        </g>
      ) : null}
      {gambar > 0 ? <circle cx={tx} cy={ty} r={24} fill={m.oranye} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- 9. Metafora: harga = tinggi garis, inflasi = kemiringan
export const Metafora: React.FC = () => {
  const f = useCurrentFrame();
  const gambar = lerp(f, 8, 120, 0.02, 1);
  const lab1 = lerp(f, 20, 32, 0, 1);
  const lab2 = lerp(f, 40, 52, 0, 1);
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, x: 600, y: 900, s: 1.12 }, { f: 160, x: 540, y: 960, s: 1 }]}>
        <Langit seed={9}>
          <circle cx={930} cy={260} r={70} fill={m.bulan} />
          <Kota turun={560} jendela={false} />
          <GrafikHarga gambar={gambar} titik={gambar} tangen={lerp(f, 14, 24, 0, 1)} />
        </Langit>
      </Kamera>
      <div style={{ position: "absolute", left: 96, top: 270, opacity: lab1 }}>
        <span style={{ fontFamily: huruf.display, fontWeight: 600, fontSize: 60, color: m.putih }}>harga</span>
        <span style={{ fontFamily: huruf.teks, fontWeight: 700, fontSize: 38, color: m.pudar }}> = tinggi garis</span>
      </div>
      <div style={{ position: "absolute", left: 96, top: 350, opacity: lab2 }}>
        <span style={{ fontFamily: huruf.display, fontWeight: 600, fontSize: 60, color: m.oranye }}>inflasi</span>
        <span style={{ fontFamily: huruf.teks, fontWeight: 700, fontSize: 38, color: m.pudar }}> = kemiringan garis</span>
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
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, x: 760, y: 820, s: 1.35 }, { f: 70, x: 540, y: 960, s: 1 }, { f: 210, x: 540, y: 960, s: 1.02 }]}>
        <Langit seed={10}>
          <Kota turun={280} jendela={false} />
          <rect x={96} y={560} width={a * skala} height={100} rx={26} fill={m.kota3} />
          <rect x={96} y={830} width={b * skala} height={100} rx={26} fill={m.oranye} />
          <Cabai x={585} y={790} s={0.6} r={-14} />
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

// ---------------------------------------------------------------- 11. Mengintip dompet dengan kaca pembesar
export const Dompet: React.FC = () => {
  const f = useCurrentFrame();
  const buka = lerp(f, 12, 30, 0, 1);
  const kaca = lerp(f, 26, 50, 0, 1);
  const goyang = Math.sin(f / 14) * 10 * kaca;
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, x: 540, y: 940, s: 1 }, { f: 150, x: 540, y: 900, s: 1.14 }]}>
        <Langit seed={11}>
          <Kota turun={300} jendela={false} />
          <rect x={330} y={700 + 60 * (1 - buka)} width={300} height={120} rx={18} fill={m.bulan} />
          <circle cx={640} cy={760 + 60 * (1 - buka)} r={36} fill={m.putih} />
          <rect x={260} y={760} width={560} height={340} rx={52} fill={m.kota3} />
          <rect x={300} y={790} width={480} height={22} rx={11} fill={m.kota2} />
          <g transform={`translate(260 760) rotate(${-14 * buka}) translate(0 ${-150 * buka})`}>
            <rect x={0} y={0} width={560} height={170} rx={52} fill={m.kota2} />
            <rect x={470} y={60} width={80} height={56} rx={22} fill={m.bulan} />
          </g>
          {/* kaca pembesar: cincin tebal + gagang, mengintip ke dalam dompet */}
          <g transform={`translate(${740 + 260 * (1 - kaca) + goyang} ${640 - 120 * (1 - kaca)}) rotate(-30)`} opacity={kaca}>
            <rect x={-18} y={110} width={36} height={170} rx={18} fill={m.oranye} />
            <circle r={120} fill={m.putih} />
            <circle r={88} fill={m.langit} />
            <circle cx={-30} cy={-34} r={18} fill={m.kota3} />
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
  const fase2 = KESIMPULAN_FASE[0];
  const dasar = lerp(f, 10, 30, 0, 1);
  const kurung = lerp(f, 30, 52, 0, 1);
  const titik = lerp(f, fase2, fase2 + 50, 0.35, 0.97);
  const lab1 = lerp(f, 40, 52, 0, 1);
  const lab2 = lerp(f, fase2 + 30, fase2 + 42, 0, 1);
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, x: 600, y: 900, s: 1.04 }, { f: 290, x: 560, y: 940, s: 1 }]}>
        <Langit seed={12}>
          <Kota turun={560} jendela={false} />
          <GrafikHarga gambar={1} titik={f < fase2 ? 1 : titik} tangen={f < fase2 ? 0 : lerp(f, fase2, fase2 + 10, 0, 1)} dasarAwal={dasar} kurung={kurung} />
          <text x={G.x0} y={titikGaris(0)[1] + 54} fontFamily={huruf.mono} fontSize={28} fill={m.pudar} opacity={dasar}>
            harga awal
          </text>
          <g opacity={lab1}>
            <Pil x={760} y={titikGaris(1)[1] - 80} teks="harga tetap tinggi" ukuran={42} />
          </g>
        </Langit>
      </Kamera>
      <div style={{ position: "absolute", left: 96, top: 270, opacity: lab2 }}>
        <span style={{ fontFamily: huruf.display, fontWeight: 600, fontSize: 60, color: m.oranye }}>kenaikan</span>
        <span style={{ fontFamily: huruf.teks, fontWeight: 700, fontSize: 38, color: m.pudar }}> makin landai</span>
      </div>
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
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, y: 960, s: 1 }, { f: 76, y: 940, s: 1.06 }]}>
        <Langit seed={13}>
          <circle cx={540} cy={420} r={140} fill={m.bulan} />
          <Kota turun={200} />
        </Langit>
      </Kamera>
      <div style={{ position: "absolute", top: 690, left: 0, right: 0, textAlign: "center", fontFamily: huruf.display, fontWeight: 600, color: m.putih }}>
        <Mendarat mulai={2} style={{ fontSize: 96 }}>
          Sekarang kamu
        </Mendarat>
        <Mendarat mulai={10} style={{ fontSize: 96 }}>
          jadi tahu, <span style={{ color: m.oranye }}>kan?</span>
        </Mendarat>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 14. Penutup
export const Penutup: React.FC = () => {
  const f = useCurrentFrame();
  const tulisan = lerp(f, 2, 14, 0, 1);
  const tag = lerp(f, 8, 20, 0, 1);
  return (
    <AbsoluteFill>
      <Langit seed={14}>
        <circle cx={540} cy={420} r={110} fill={m.bulan} />
        <Kota turun={240} />
      </Langit>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center" }}>
        <div
          style={{
            fontFamily: huruf.display,
            fontWeight: 600,
            fontSize: 150,
            letterSpacing: "-0.02em",
            color: m.putih,
            opacity: tulisan,
            transform: `scale(${1.3 - 0.3 * tulisan})`,
          }}
        >
          intip<span style={{ color: m.bulan }}>dompet</span>
        </div>
        <div style={{ fontFamily: huruf.teks, fontWeight: 700, fontSize: 52, color: m.pudar, marginTop: 10, opacity: tag, transform: `translateY(${30 * (1 - tag)}px)` }}>
          Urusan uang, kita <span style={{ color: m.oranye }}>intip.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
