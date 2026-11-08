import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kamera, Kota, Langit, Sumber, Teks, easeMasuk, lerp } from "../../komponen/Panggung";
import { huruf, m, persen } from "../../tema/malam";

// Muncul dari ukuran besar lalu mendarat (tanpa memantul).
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

const Label: React.FC<{ x: number; y: number; teks: string; warna?: string; latar?: string; ukuran?: number; skala?: number }> = ({
  x,
  y,
  teks,
  warna = m.langit,
  latar = m.bulan,
  ukuran = 34,
  skala = 1,
}) => {
  const w = teks.length * ukuran * 0.56 + ukuran * 1.4;
  const h = ukuran * 1.8;
  return (
    <g transform={`translate(${x} ${y}) scale(${skala})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={latar} />
      <text x={0} y={ukuran * 0.36} textAnchor="middle" fontFamily={huruf.display} fontWeight={600} fontSize={ukuran} fill={warna}>
        {teks}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------- 1. Judul
export const Judul: React.FC = () => {
  const f = useCurrentFrame();
  const tag = (i: number) => {
    const mulai = 14 + i * 7;
    const p = lerp(f, mulai, mulai + 40, 0, 1, easeMasuk);
    return { y: 1150 - 280 * p + Math.sin((f + i * 13) / 14) * 8, o: Math.min(1, p * 3) };
  };
  const posTag = [150, 330, 750, 930, 540];
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, y: 1010, s: 1.1 }, { f: 90, y: 960, s: 1 }]}>
        <Langit seed={1}>
          <circle cx={820} cy={330} r={96} fill={m.bulan} />
          {posTag.map((x, i) => {
            const t = tag(i);
            return (
              <g key={i} opacity={t.o}>
                <Label x={x} y={t.y} teks="▲ Rp" ukuran={30} />
              </g>
            );
          })}
          <Kota />
        </Langit>
      </Kamera>
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: huruf.display,
          fontWeight: 600,
          fontSize: 126,
          lineHeight: 1.02,
          color: m.putih,
        }}
      >
        <Mendarat mulai={4}>Inflasi terkendali,</Mendarat>
        <Mendarat mulai={12}>kok belanja</Mendarat>
        <Mendarat mulai={20}>
          makin <span style={{ color: m.oranye }}>mahal?</span>
        </Mendarat>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2. Keranjang belanja
export const Keranjang: React.FC = () => {
  const f = useCurrentFrame();
  const pop = (mulai: number) => lerp(f, mulai, mulai + 10, 0, 1);
  const tagItem: [number, number, number][] = [
    [470, 560, 30],
    [660, 520, 42],
    [800, 640, 54],
  ];
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, x: 560, y: 1010, s: 0.94 }, { f: 190, x: 590, y: 990, s: 1.04 }]}>
        <Langit seed={2}>
          <circle cx={240} cy={330} r={70} fill={m.bulan} />
          <Kota turun={220} />
          {/* isi keranjang */}
          <g transform="rotate(-7 470 760)">
            <rect x={390} y={620} width={170} height={240} rx={40} fill={m.bulan} />
            <rect x={420} y={700} width={110} height={18} rx={9} fill={m.kota3} />
          </g>
          <rect x={600} y={560} width={90} height={260} rx={36} fill={m.putih} />
          <rect x={620} y={530} width={50} height={50} rx={14} fill={m.kota3} />
          <ellipse cx={770} cy={770} rx={48} ry={60} fill={m.putih} />
          <ellipse cx={840} cy={790} rx={44} ry={56} fill={m.bulan} />
          {/* keranjang */}
          <path d="M 330 820 L 870 820 L 820 1100 L 380 1100 Z" fill={m.kota2} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={420 + i * 105} y={870} width={56} height={190} rx={28} fill={m.kota1} />
          ))}
          <rect x={300} y={790} width={600} height={64} rx={32} fill={m.kota3} />
          {/* label harga naik */}
          {tagItem.map(([x, y, mulai], i) => {
            const p = pop(mulai);
            const denyut = 1 + 0.06 * Math.max(0, Math.sin((f - mulai - 20) / 6)) * (f > mulai + 20 ? 1 : 0);
            return (
              <g key={i} opacity={Math.min(1, p * 2)}>
                <Label x={x} y={y - 120 - 20 * (1 - p)} teks="▲ naik" ukuran={34} skala={(1.5 - 0.5 * p) * denyut} />
              </g>
            );
          })}
        </Langit>
      </Kamera>
      <Teks
        mulai={14}
        teks="Pernah nggak kamu merasa harga kebutuhan sehari-hari *makin* *mahal,* padahal katanya inflasi Indonesia masih *terkendali?*"
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 3. Kamera mendongak ke bulan
export const KeLangit: React.FC = () => {
  const f = useCurrentFrame();
  const lampu = (i: number) => (Math.sin(f / 9 + i * 2.1) > 0.2 ? m.bulan : m.kota1);
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, y: 1060, s: 1 }, { f: 18, y: 1040, s: 1 }, { f: 80, y: 380, s: 1.18 }]}>
        <Langit seed={3}>
          <circle cx={540} cy={330} r={120} fill={m.bulan} />
          <Kota />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={[48, 300, 760, 900, 1000, 170][i]} y={[1300, 1350, 1290, 1420, 1330, 1440][i]} width={40} height={30} rx={6} fill={lampu(i)} />
          ))}
        </Langit>
      </Kamera>
      <Teks mulai={6} teks="Nah, ini sebenarnya ada *penjelasannya.*" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4. Inflasi tahunan (gauge)
const CX = 540;
const CY = 800;
const R = 350;
const MAKS = 6;
const titik = (v: number, r = R) => {
  const a = Math.PI - (v / MAKS) * Math.PI;
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)] as const;
};
const busur = (dari: number, ke: number, r = R) => {
  const [x1, y1] = titik(dari, r);
  const [x2, y2] = titik(ke, r);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
};

export const Tahunan: React.FC = () => {
  const f = useCurrentFrame();
  const v = lerp(f, 24, 80, 0, 3.23);
  const sudut = -90 + (v / MAKS) * 180;
  const angka = persen(v);
  const pita = lerp(f, 60, 74, 0, 1);
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, x: 540, y: 800, s: 1.3 }, { f: 55, y: 960, s: 1 }, { f: 185, y: 960, s: 1.02 }]}>
        <Langit seed={4}>
          <circle cx={930} cy={260} r={150} fill={m.bulan} />
          <path d={busur(0, MAKS)} stroke={m.kota2} strokeWidth={70} fill="none" strokeLinecap="round" />
          <g opacity={pita}>
            <path d={busur(1.5, 3.5)} stroke={m.kota3} strokeWidth={70} fill="none" />
            <rect x={titik(2.5, R + 92)[0] - 170} y={titik(2.5, R + 92)[1] - 30} width={340} height={60} rx={30} fill={m.kota3} />
            <text
              x={titik(2.5, R + 92)[0]}
              y={titik(2.5, R + 92)[1] + 10}
              textAnchor="middle"
              fontFamily={huruf.mono}
              fontSize={26}
              fill={m.bulan}
            >
              sasaran BI 2,5 ± 1%
            </text>
          </g>
          {[0, 3, 6].map((t) => {
            const [x, y] = titik(t, R - 90);
            return (
              <text key={t} x={x} y={y + 10} textAnchor="middle" fontFamily={huruf.mono} fontSize={28} fill={m.pudar}>
                {t}%
              </text>
            );
          })}
          <g transform={`translate(${CX} ${CY}) rotate(${sudut})`}>
            <rect x={-11} y={-R + 40} width={22} height={R - 40} rx={11} fill={m.putih} />
          </g>
          <circle cx={CX} cy={CY} r={lerp(f, 0, 22, 120, 36)} fill={lerp(f, 0, 22, 0, 1) < 1 ? m.bulan : m.putih} />
          <circle cx={CX} cy={CY} r={12} fill={m.oranye} opacity={lerp(f, 16, 24, 0, 1)} />
        </Langit>
      </Kamera>
      <div style={{ position: "absolute", top: 880, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: huruf.display, fontWeight: 600, fontSize: 168, color: m.putih, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {angka}
        </div>
        <div style={{ fontFamily: huruf.mono, fontSize: 30, color: m.pudar, marginTop: 14 }}>inflasi tahunan · Oktober 2026</div>
      </div>
      <Sumber teks="Sumber: BPS, rilis 2 November 2026" y={1130} mulai={30} />
      <Teks
        mulai={12}
        teks="Berdasarkan data BPS, inflasi Indonesia pada Oktober 2026 tercatat sebesar *3,23* *persen* secara tahunan."
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5. Inflasi bulanan
export const Bulanan: React.FC = () => {
  const f = useCurrentFrame();
  const skala = 800 / 4; // px per 1%
  const lebarTahunan = 3.23 * skala;
  const lebarBulanan = lerp(f, 22, 48, 0, 0.22) * skala;
  const angkaBulanan = persen(lerp(f, 22, 48, 0, 0.22));
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, x: 560, y: 900, s: 1 }, { f: 100, x: 540, y: 900, s: 1.04 }]}>
        <Langit seed={5}>
          <Kota turun={260} />
        </Langit>
      </Kamera>
      <div style={{ position: "absolute", left: 96, top: 360, fontFamily: huruf.mono, fontSize: 30, color: m.pudar }}>Oktober 2026</div>
      <div style={{ position: "absolute", left: 96, top: 440 }}>
        <div style={{ fontFamily: huruf.teks, fontWeight: 700, fontSize: 44, color: m.bulan }}>tahunan</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 14 }}>
          <div style={{ width: lebarTahunan, height: 96, borderRadius: 24, background: m.kota3 }} />
          <div style={{ fontFamily: huruf.display, fontWeight: 600, fontSize: 76, color: m.putih }}>3,23%</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 96, top: 700 }}>
        <div style={{ fontFamily: huruf.teks, fontWeight: 700, fontSize: 44, color: m.bulan }}>bulanan</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 14 }}>
          <div style={{ width: Math.max(lebarBulanan, 6), height: 96, borderRadius: 24, background: m.oranye }} />
          <div style={{ fontFamily: huruf.display, fontWeight: 600, fontSize: 76, color: m.oranye, fontVariantNumeric: "tabular-nums" }}>
            {angkaBulanan}
          </div>
        </div>
      </div>
      <Sumber teks="Sumber: BPS, rilis 2 November 2026" y={930} mulai={20} />
      <Teks mulai={12} teks="Sementara itu, inflasi bulanan hanya *0,22* *persen.*" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 6. Jangan salah paham
export const SalahPaham: React.FC = () => {
  const f = useCurrentFrame();
  const p = lerp(f, 10, 24, 0, 1);
  return (
    <AbsoluteFill>
      <Kamera kunci={[{ f: 0, r: -3, s: 1.04 }, { f: 40, r: 0, s: 1 }, { f: 160, s: 1.03 }]}>
        <Langit seed={6}>
          <Kota turun={300} jendela={false} />
        </Langit>
      </Kamera>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: huruf.display, fontWeight: 600, color: m.putih }}>
        <div style={{ fontSize: 112 }}>
          <Mendarat mulai={2}>inflasi rendah</Mendarat>
        </div>
        <div
          style={{
            fontSize: 250,
            lineHeight: 1,
            color: m.oranye,
            transform: `rotate(${(1 - p) * -90}deg) scale(${2 - p})`,
            opacity: Math.min(1, p * 2),
          }}
        >
          ≠
        </div>
        <div style={{ fontSize: 112 }}>
          <Mendarat mulai={18}>harga murah</Mendarat>
        </div>
      </div>
      <Teks mulai={10} teks="Tapi jangan salah paham. Inflasi yang rendah *bukan* *berarti* harga barang kembali murah." />
    </AbsoluteFill>
  );
};
