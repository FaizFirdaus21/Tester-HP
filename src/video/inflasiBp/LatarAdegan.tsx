// Ilustrasi garis blueprint di belakang tiap adegan, mengikuti isi naskah.
// Semua digambar putih tipis dan samar supaya isi utama tetap menonjol.
import React from "react";

type P = { f: number };
const s = { stroke: "#fff", fill: "none", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const tipis = { ...s, strokeWidth: 1.4 };

const Grup: React.FC<{ o?: number; children: React.ReactNode }> = ({ o = 0.24, children }) => <g opacity={Math.min(0.5, o * 1.45)}>{children}</g>;

// ------------------------------------------------ pasar (judul)
export const LatarPasar: React.FC<P> = ({ f }) => {
  const los = (x: number, y: number, w: number) => {
    const n = 7;
    const lw = w / n;
    const gel = Array.from({ length: n }, (_, i) => `Q ${x + lw * (i + 0.5)} ${y + 150} ${x + lw * (i + 1)} ${y + 120}`).join(" ");
    return (
      <g key={x}>
        <path d={`M ${x + w * 0.2} ${y} L ${x + w * 0.8} ${y} L ${x + w} ${y + 120} L ${x} ${y + 120} Z`} {...s} />
        <path d={`M ${x} ${y + 120} ${gel}`} {...s} />
        {Array.from({ length: n - 1 }, (_, i) => (
          <path key={i} d={`M ${x + w * 0.2 + (w * 0.6 * (i + 1)) / n} ${y} L ${x + lw * (i + 1)} ${y + 120}`} {...tipis} />
        ))}
        <path d={`M ${x + 20} ${y + 130} L ${x + 20} ${y + 520} M ${x + w - 20} ${y + 130} L ${x + w - 20} ${y + 520}`} {...s} />
        <rect x={x + 10} y={y + 380} width={w - 20} height={26} {...s} />
        {[0, 1, 2].map((k) => (
          <ellipse key={k} cx={x + 60 + k * ((w - 120) / 2)} cy={y + 352} rx={(w - 120) / 6} ry={28} {...tipis} />
        ))}
        <rect x={x + 30} y={y + 410} width={w - 60} height={110} {...tipis} />
        <path d={`M ${x + 40} ${y + 440} L ${x + w - 40} ${y + 440} M ${x + 40} ${y + 470} L ${x + w - 40} ${y + 470}`} {...tipis} />
      </g>
    );
  };
  return (
    <Grup>
      {los(-60, 1260, 380)}
      {los(350, 1300, 360)}
      {los(740, 1250, 380)}
      <path d="M -20 1180 Q 540 1290 1100 1170" {...tipis} />
      {Array.from({ length: 11 }, (_, i) => {
        const t = i / 10;
        const x = -20 + 1120 * t;
        const y = 1180 + Math.sin(t * Math.PI) * 105 - t * 10 + 22;
        const nyala = 0.5 + 0.5 * Math.sin(f / 6 + i * 1.7);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={11} {...tipis} />
            <circle cx={x} cy={y} r={11} fill="#fff" opacity={0.35 * nyala} />
          </g>
        );
      })}
    </Grup>
  );
};

// ------------------------------------------------ supermarket (keranjang)
export const LatarRak: React.FC<P> = () => {
  const vx = 540;
  const vy = 900;
  const rak = (sisi: -1 | 1) => {
    const luar = sisi < 0 ? -40 : 1120;
    const dalam = sisi < 0 ? 380 : 700;
    return (
      <g key={sisi}>
        {Array.from({ length: 7 }, (_, i) => {
          const y = 120 + i * 300;
          const yd = vy + (y - vy) * 0.3;
          return (
            <g key={i}>
              <path d={`M ${luar} ${y} L ${dalam} ${yd}`} {...s} />
              {Array.from({ length: 6 }, (_, k) => {
                const t0 = k / 6;
                const t1 = (k + 0.75) / 6;
                const xa = luar + (dalam - luar) * t0;
                const xb = luar + (dalam - luar) * t1;
                const ya = y + (yd - y) * t0;
                const yb = y + (yd - y) * t1;
                const h = 200 * (1 - 0.7 * t0);
                const hb = 200 * (1 - 0.7 * t1);
                return <path key={k} d={`M ${xa} ${ya} L ${xa} ${ya - h} L ${xb} ${yb - hb} L ${xb} ${yb}`} {...tipis} />;
              })}
            </g>
          );
        })}
        <path d={`M ${dalam} ${vy - 600 * 0.3} L ${dalam} ${vy + 1300 * 0.3}`} {...tipis} />
      </g>
    );
  };
  return (
    <Grup o={0.2}>
      {rak(-1)}
      {rak(1)}
      <path d={`M 380 ${vy + 390} L -100 1960 M 700 ${vy + 390} L 1180 1960`} {...tipis} />
      {Array.from({ length: 5 }, (_, i) => {
        const y = 60 + i * 140;
        const w = 260 * (1 - i * 0.16);
        return <rect key={i} x={vx - w / 2} y={y} width={w} height={14} rx={7} {...tipis} />;
      })}
    </Grup>
  );
};

// ------------------------------------------------ kota & gedung (gauge, data BPS)
export const LatarKota: React.FC<P & { fajar?: boolean }> = ({ f, fajar }) => {
  const gedung: [number, number, number][] = [
    [0, 1360, 150],
    [150, 1240, 120],
    [270, 1320, 110],
    [380, 1180, 170],
    [550, 1280, 130],
    [680, 1200, 150],
    [830, 1340, 110],
    [940, 1260, 140],
  ];
  return (
    <Grup o={0.22}>
      {gedung.map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={1920 - y} {...s} />
          {Array.from({ length: Math.floor((1700 - y) / 60) }, (_, r) =>
            Array.from({ length: Math.floor(w / 40) - 1 }, (_, c) => (
              <rect key={`${r}-${c}`} x={x + 22 + c * 40} y={y + 30 + r * 60} width={18} height={26} {...tipis} opacity={(r * 7 + c * 3 + i) % 5 === 0 ? 1 : 0.5} />
            )),
          )}
        </g>
      ))}
      <path d="M 380 1180 L 465 1110 L 550 1180" {...s} />
      <path d="M 465 1110 L 465 1040" {...s} />
      {fajar ? (
        <g>
          <circle cx={760} cy={1180} r={140} {...s} />
          {Array.from({ length: 9 }, (_, i) => {
            const a = Math.PI + (i / 8) * Math.PI;
            return <path key={i} d={`M ${760 + Math.cos(a) * 170} ${1180 + Math.sin(a) * 170} L ${760 + Math.cos(a) * (230 + 10 * Math.sin(f / 8 + i))} ${1180 + Math.sin(a) * (230 + 10 * Math.sin(f / 8 + i))}`} {...tipis} />;
          })}
        </g>
      ) : null}
    </Grup>
  );
};

// ------------------------------------------------ meja kerja & kalender (bulanan)
export const LatarMeja: React.FC<P> = () => (
  <Grup o={0.22}>
    <g transform="translate(560 1240) rotate(-6)">
      <rect x={0} y={0} width={420} height={460} {...s} />
      <rect x={0} y={0} width={420} height={80} {...s} />
      <text x={210} y={54} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize={34} fill="#fff">
        OKT 2026
      </text>
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 7 }, (_, c) => <rect key={`${r}${c}`} x={20 + c * 56} y={110 + r * 66} width={44} height={50} {...tipis} />),
      )}
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={50 + i * 64} cy={-12} r={12} {...tipis} />
      ))}
    </g>
    <g transform="translate(90 1300) rotate(18)">
      <rect x={0} y={0} width={360} height={52} {...s} />
      {Array.from({ length: 19 }, (_, i) => (
        <path key={i} d={`M ${10 + i * 18.5} 0 L ${10 + i * 18.5} ${i % 5 === 0 ? 26 : 14}`} {...tipis} />
      ))}
    </g>
    <g transform="translate(140 1560) rotate(-24)">
      <path d="M 0 0 L 360 0 L 400 16 L 360 32 L 0 32 Z M 360 0 L 360 32" {...s} />
    </g>
    <circle cx={930} cy={260} r={90} {...s} />
    <circle cx={930} cy={260} r={70} {...tipis} />
  </Grup>
);

// ------------------------------------------------ label harga tergantung (harga murah?)
export const LatarLabel: React.FC<P> = ({ f }) => (
  <Grup o={0.22}>
    <path d="M -20 160 L 1100 160" {...s} />
    {[90, 300, 520, 760, 960].map((x, i) => {
      const ayun = Math.sin(f / 18 + i * 1.3) * 6;
      const panjang = 120 + (i % 3) * 70;
      return (
        <g key={x} transform={`translate(${x} 160) rotate(${ayun})`}>
          <path d={`M 0 0 L 0 ${panjang}`} {...tipis} />
          <path d={`M -60 ${panjang} L 60 ${panjang} L 60 ${panjang + 120} L 0 ${panjang + 160} L -60 ${panjang + 120} Z`} {...s} />
          <circle cx={0} cy={panjang + 24} r={8} {...tipis} />
          <text x={0} y={panjang + 92} textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif" fontWeight={700} fontSize={40} fill="#fff">
            Rp
          </text>
        </g>
      );
    })}
    {[140, 400, 680, 940].map((x, i) => {
      const ayun = Math.sin(f / 20 + i * 2.1) * 5;
      return (
        <g key={x} transform={`translate(${x} 1300) rotate(${ayun})`}>
          <path d="M 0 0 L 0 90" {...tipis} />
          <rect x={-70} y={90} width={140} height={90} rx={10} {...s} />
          <path d="M -40 135 L 40 135" {...tipis} />
        </g>
      );
    })}
  </Grup>
);

// ------------------------------------------------ tanaman cabai & peti (cabai)
export const LatarCabai: React.FC<P> = ({ f }) => {
  const tanaman = (x: number, cermin: number) => (
    <g transform={`translate(${x} 0) scale(${cermin} 1)`}>
      <path d="M 0 1920 C 10 1500 -30 1100 40 700" {...s} />
      {[880, 1040, 1200, 1360, 1520].map((y, i) => {
        const goyang = Math.sin(f / 22 + i) * 6;
        return (
          <g key={y} transform={`translate(${i % 2 ? 6 : 14} ${y}) rotate(${goyang})`}>
            <path d="M 0 0 C 60 -40 140 -30 200 -70" {...tipis} />
            <path d="M 80 -30 C 120 -90 200 -110 230 -90 C 200 -40 140 -20 80 -30 Z" {...tipis} />
            <path d="M 150 -50 C 160 0 150 80 120 140 C 110 90 120 20 150 -50 Z" {...s} />
          </g>
        );
      })}
    </g>
  );
  return (
    <Grup o={0.22}>
      {tanaman(30, 1)}
      {tanaman(1050, -1)}
      <g transform="translate(250 1560)">
        <path d="M 0 0 L 580 0 L 540 260 L 40 260 Z" {...s} />
        {[1, 2, 3].map((i) => (
          <path key={i} d={`M ${i * 10} ${i * 65} L ${580 - i * 10} ${i * 65}`} {...tipis} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M ${40 + i * 60} -10 C ${60 + i * 60} -60 ${100 + i * 60} -70 ${130 + i * 60} -40`} {...tipis} />
        ))}
      </g>
    </Grup>
  );
};

// ------------------------------------------------ kaca pembesar & tanda tanya (disalahpahami)
export const LatarTanya: React.FC<P> = ({ f }) => (
  <Grup o={0.2}>
    <g transform={`translate(760 1360) rotate(${-20 + Math.sin(f / 20) * 3})`}>
      <circle r={240} {...s} />
      <circle r={210} {...tipis} />
      <path d="M 170 170 L 330 330" stroke="#fff" strokeWidth={34} strokeLinecap="round" opacity={0.9} />
      <path d="M -120 -110 A 160 160 0 0 1 20 -190" {...tipis} />
    </g>
    {[
      [140, 1200, 120],
      [300, 1500, 80],
      [880, 300, 110],
      [140, 300, 70],
      [520, 1640, 60],
    ].map(([x, y, u], i) => (
      <text key={i} x={x} y={y + Math.sin(f / 14 + i) * 8} fontFamily="'Barlow Condensed', sans-serif" fontWeight={700} fontSize={u} fill="none" stroke="#fff" strokeWidth={2}>
        ?
      </text>
    ))}
  </Grup>
);

// ------------------------------------------------ kontur bukit & jalan (harga = elevasi)
export const LatarKontur: React.FC<P> = () => (
  <Grup o={0.2}>
    {Array.from({ length: 12 }, (_, i) => {
      const r = 90 + i * 70;
      return <ellipse key={i} cx={820} cy={560} rx={r * 1.25} ry={r * 0.7} transform={`rotate(-14 820 560)`} {...(i % 4 === 0 ? s : tipis)} />;
    })}
    <path d="M -40 1880 C 300 1700 500 1300 700 1000 S 860 640 820 560" {...s} strokeDasharray="18 14" />
    <path d="M 0 1500 L 160 1360 L 300 1440 L 470 1260 L 620 1420 L 780 1300 L 1080 1480" {...tipis} />
    <path d="M 800 520 L 820 470 L 840 520 Z M 820 470 L 820 430" {...s} />
  </Grup>
);

// ------------------------------------------------ dapur (pangan bergejolak)
export const LatarDapur: React.FC<P> = ({ f }) => (
  <Grup o={0.22}>
    {Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) => <rect key={`${r}${c}`} x={c * 120} y={40 + r * 120} width={120} height={120} {...tipis} opacity={0.6} />),
    )}
    <path d="M 0 1300 L 1080 1300 M 0 1340 L 1080 1340" {...s} />
    <rect x={160} y={1340} width={760} height={420} {...s} />
    {[300, 540, 780].map((x) => (
      <g key={x}>
        <ellipse cx={x} cy={1300} rx={90} ry={16} {...tipis} />
        <circle cx={x} cy={1420} r={28} {...tipis} />
      </g>
    ))}
    <g transform="translate(540 1300)">
      <path d="M -150 0 L -150 -170 L 150 -170 L 150 0" {...s} />
      <path d="M -170 -170 L 170 -170 M -150 -120 L -200 -120 M 150 -120 L 200 -120" {...s} />
      {Array.from({ length: 4 }, (_, i) => {
        const t = ((f + i * 12) % 48) / 48;
        return <path key={i} d={`M ${-90 + i * 60} ${-190 - t * 260} c 30 -30 -30 -60 0 -90`} {...tipis} opacity={1 - t} />;
      })}
    </g>
    {[140, 220, 300].map((x, i) => (
      <g key={x}>
        <path d={`M ${x} 900 L ${x} 1000`} {...tipis} />
        <path d={i === 0 ? `M ${x - 20} 1000 L ${x + 20} 1000 L ${x + 14} 1100 L ${x - 14} 1100 Z` : i === 1 ? `M ${x} 1000 m -26 0 a 26 34 0 1 0 52 0 a 26 34 0 1 0 -52 0` : `M ${x - 6} 1000 L ${x + 6} 1000 L ${x + 6} 1130 L ${x - 6} 1130 Z`} {...tipis} />
      </g>
    ))}
  </Grup>
);

// ------------------------------------------------ kamar malam (dompet)
export const LatarKamar: React.FC<P> = ({ f }) => (
  <Grup o={0.22}>
    <rect x={620} y={220} width={340} height={420} {...s} />
    <path d="M 790 220 L 790 640 M 620 430 L 960 430" {...tipis} />
    <circle cx={870} cy={320} r={46} {...s} />
    <path d="M 0 1420 L 1080 1420 M 0 1460 L 1080 1460" {...s} />
    <g transform="translate(130 1420)">
      <path d="M 0 0 L 160 0 M 80 0 L 80 -40 L 140 -300 L 60 -420" {...s} />
      <path d="M 10 -440 L 140 -480 L 150 -380 L 40 -360 Z" {...s} />
      <path d="M 50 -360 L -30 -60 M 140 -380 L 240 -80" {...tipis} opacity={0.6 + 0.4 * Math.sin(f / 5)} strokeDasharray="10 10" />
    </g>
    <rect x={780} y={1300} width={160} height={120} rx={8} {...tipis} />
    <path d="M 800 1300 L 800 1260 L 920 1260 L 920 1300" {...tipis} />
  </Grup>
);
