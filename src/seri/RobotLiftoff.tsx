import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

// Robot putih kecil lepas landas dari landasan. Ilustrasi vektor datar:
// tanpa gradasi, tanpa garis tepi, hanya bentuk geometris.
// Loop 30 frame (1 detik): jongkok, lepas landas sambil berputar sekali,
// melayang, lalu turun pelan ke landasan sehingga frame 30 sama dengan frame 0.

export const ROBOT_WARNA = {
  langit: "#1B2A4A",
  kota1: "#24365E",
  kota2: "#2E4372",
  kota3: "#3A5286",
  bulan: "#F2EEE8",
  robot: "#FFFFFF",
  oranye: "#F28C38",
} as const;

export const ROBOT_DURASI = 30;

const W = ROBOT_WARNA;
const PAD_Y = 1500; // permukaan atas landasan
const CX = 540;
const TINGGI_TERBANG = 300;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1); // mendarat melambat, tanpa memantul
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const gerak = (f: number) => {
  // 0-3: jongkok (antisipasi)
  const jongkok = interpolate(f, [0, 3, 6], [0, 1, 0], { ...clamp, easing: easeInOut });
  // 3-16: naik, 24-30: turun pelan ke landasan
  const naik = interpolate(f, [3, 16], [0, 1], { ...clamp, easing: easeOut });
  const turun = interpolate(f, [24, 30], [0, 1], { ...clamp, easing: easeInOut });
  // 16-24: melayang naik-turun pelan
  const melayang = f >= 16 && f <= 24 ? Math.sin(((f - 16) / 8) * Math.PI) * 14 : 0;
  const y = -TINGGI_TERBANG * naik * (1 - turun) - melayang;
  // satu putaran penuh saat naik
  const putar = interpolate(f, [4, 17], [0, 360], { ...clamp, easing: easeInOut });
  const skalaY = 1 - 0.1 * jongkok + 0.06 * interpolate(f, [4, 8, 12], [0, 1, 0], clamp);
  const skalaX = 1 + 0.07 * jongkok - 0.03 * interpolate(f, [4, 8, 12], [0, 1, 0], clamp);
  return { y, putar, skalaX, skalaY, ketinggian: -y / TINGGI_TERBANG };
};

const Bintang: React.FC<{ f: number }> = ({ f }) => {
  const titik = [
    [120, 260, 6], [300, 420, 4], [460, 210, 5], [640, 330, 4], [980, 250, 6],
    [180, 620, 4], [380, 760, 5], [940, 700, 4], [700, 600, 5], [90, 900, 4],
    [520, 900, 4], [1000, 980, 5], [260, 1060, 4], [820, 1080, 4],
  ];
  return (
    <>
      {titik.map(([x, y, r], i) => {
        const kedip = 0.55 + 0.45 * Math.sin((f / ROBOT_DURASI) * Math.PI * 2 + i * 1.7);
        return <circle key={i} cx={x} cy={y} r={r} fill={W.bulan} opacity={kedip} />;
      })}
    </>
  );
};

const Kota: React.FC = () => {
  // tiga lapis gedung, belakang ke depan
  const belakang = [
    [0, 1080, 150], [130, 1160, 120], [240, 1020, 140], [370, 1130, 110], [470, 1060, 160],
    [620, 1150, 120], [730, 1000, 150], [870, 1120, 120], [980, 1060, 100],
  ];
  const tengah = [
    [-20, 1260, 170], [140, 1320, 130], [260, 1230, 150], [700, 1250, 160], [850, 1310, 120], [960, 1240, 140],
  ];
  const depan = [
    [0, 1420, 220], [200, 1460, 120], [760, 1450, 140], [890, 1410, 210],
  ];
  return (
    <>
      {belakang.map(([x, y, w], i) => (
        <rect key={`b${i}`} x={x} y={y} width={w} height={1920 - y} fill={W.kota1} />
      ))}
      {tengah.map(([x, y, w], i) => (
        <g key={`t${i}`}>
          <rect x={x} y={y} width={w} height={1920 - y} fill={W.kota2} />
          {[0, 1, 2].map((r) =>
            [0, 1].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={x + 28 + c * (w / 2 - 10)}
                y={y + 40 + r * 70}
                width={w / 2 - 46}
                height={30}
                rx={6}
                fill={W.kota1}
              />
            )),
          )}
        </g>
      ))}
      {depan.map(([x, y, w], i) => (
        <rect key={`d${i}`} x={x} y={y} width={w} height={1920 - y} fill={W.kota3} />
      ))}
      <rect x={0} y={1640} width={1080} height={280} fill={W.kota3} />
    </>
  );
};

const Landasan: React.FC<{ ketinggian: number }> = ({ ketinggian }) => {
  const bayangan = 1 - 0.55 * Math.min(1, Math.max(0, ketinggian));
  return (
    <>
      <rect x={CX - 40} y={PAD_Y + 40} width={80} height={140} fill={W.kota2} />
      <rect x={CX - 200} y={PAD_Y} width={400} height={48} rx={24} fill={W.bulan} />
      <ellipse cx={CX} cy={PAD_Y + 6} rx={120 * bayangan} ry={10 * bayangan} fill={W.kota2} />
    </>
  );
};

const Asap: React.FC<{ f: number }> = ({ f }) => {
  const kepulan = [
    [-90, 0], [0, 2], [90, 1], [-160, 4], [160, 3],
  ];
  return (
    <>
      {kepulan.map(([dx, mulai], i) => {
        const t = interpolate(f, [3 + mulai, 15 + mulai], [0, 1], clamp);
        if (t <= 0 || t >= 1) return null;
        const r = 26 + 46 * t;
        return (
          <circle
            key={i}
            cx={CX + dx * (0.6 + t)}
            cy={PAD_Y - 10 - 20 * t}
            r={r}
            fill={W.bulan}
            opacity={1 - t}
          />
        );
      })}
    </>
  );
};

const Robot: React.FC = () => (
  // titik asal (0,0) = tengah bawah kaki robot
  <g>
    {/* kaki pendorong */}
    <rect x={-62} y={-44} width={44} height={44} rx={12} fill={W.robot} />
    <rect x={18} y={-44} width={44} height={44} rx={12} fill={W.robot} />
    {/* lengan */}
    <rect x={-132} y={-186} width={46} height={100} rx={23} fill={W.robot} />
    <rect x={86} y={-186} width={46} height={100} rx={23} fill={W.robot} />
    {/* badan */}
    <rect x={-96} y={-214} width={192} height={178} rx={48} fill={W.robot} />
    <circle cx={0} cy={-126} r={26} fill={W.langit} />
    {/* kepala */}
    <rect x={-120} y={-396} width={240} height={170} rx={64} fill={W.robot} />
    <rect x={-88} y={-360} width={176} height={98} rx={44} fill={W.langit} />
    <circle cx={-36} cy={-311} r={17} fill={W.robot} />
    <circle cx={36} cy={-311} r={17} fill={W.robot} />
    {/* antena dengan satu aksen oranye */}
    <rect x={-7} y={-452} width={14} height={60} rx={7} fill={W.robot} />
    <circle cx={0} cy={-462} r={24} fill={W.oranye} />
  </g>
);

export const RobotLiftoff: React.FC = () => {
  const f = useCurrentFrame();
  const g = gerak(f);
  const pusatPutar = -200; // berputar di sekitar tengah badan

  return (
    <AbsoluteFill style={{ backgroundColor: W.langit }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill={W.langit} />
        <Bintang f={f} />
        <circle cx={800} cy={430} r={120} fill={W.bulan} />
        <Kota />
        <Landasan ketinggian={g.ketinggian} />
        <Asap f={f} />
        <g transform={`translate(${CX} ${PAD_Y + g.y})`}>
          <g transform={`translate(0 ${pusatPutar}) rotate(${g.putar}) translate(0 ${-pusatPutar})`}>
            <g transform={`scale(${g.skalaX} ${g.skalaY})`}>
              <Robot />
            </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
