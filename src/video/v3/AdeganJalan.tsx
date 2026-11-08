import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { font, sorot } from "./gaya";
import { Bokeh, L, Label, Lapis, Naskah, Sinema, eIO } from "./Umum";

// Jalan menanjak: tinggi = harga, laju menanjak = inflasi.
const PANJANG = 2600;
const elev = (u: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), 2.4);
const titikJalan = (u: number) => [200 + u * PANJANG, 1520 - 980 * elev(u)] as const;

const Mobil: React.FC<{ x: number; y: number; sudut: number; roda: number; malam: boolean }> = ({ x, y, sudut, roda, malam }) => (
  <g transform={`translate(${x} ${y}) rotate(${sudut})`}>
    {malam ? <path d="M 120 -40 L 520 -110 L 520 40 Z" fill="#fff3c0" opacity={0.25} /> : null}
    <rect x={-120} y={-100} width={240} height={64} rx={26} fill="#f4c542" />
    <path d="M -70 -100 L -40 -150 L 50 -150 L 85 -100 Z" fill="#f4c542" />
    <path d="M -54 -104 L -34 -140 L 0 -140 L 0 -104 Z M 8 -104 L 8 -140 L 44 -140 L 70 -104 Z" fill={malam ? "#ffe7a0" : "#a9dcf2"} />
    <rect x={104} y={-86} width={18} height={14} rx={4} fill="#fff6c8" />
    {[-70, 72].map((wx) => (
      <g key={wx} transform={`translate(${wx} -36) rotate(${roda})`}>
        <circle r={34} fill="#1c1c22" />
        <circle r={14} fill="#c9ccd2" />
        <rect x={-3} y={-30} width={6} height={22} fill="#c9ccd2" />
      </g>
    ))}
  </g>
);

const Speedometer: React.FC<{ laju: number }> = ({ laju }) => {
  const sudut = -120 + 240 * laju;
  return (
    <svg width={260} height={200} viewBox="-130 -130 260 200">
      <path d="M -104 60 A 120 120 0 1 1 104 60" stroke="rgba(255,255,255,0.25)" strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d="M -104 60 A 120 120 0 1 1 104 60" stroke={sorot} strokeWidth={18} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${0.82 * laju} 1`} />
      <g transform={`rotate(${sudut})`}>
        <rect x={-5} y={-100} width={10} height={100} rx={5} fill="#fff" />
      </g>
      <circle r={14} fill="#fff" />
    </svg>
  );
};

export const AdeganJalan: React.FC<{ mode?: "siang" | "malam" }> = ({ mode = "siang" }) => {
  const f = useCurrentFrame();
  const malam = mode === "malam";
  const u = malam ? L(f, 0, 200, 0.9, 0.99, eIO) : L(f, 50, 220, 0, 0.9, (t) => 1 - Math.pow(1 - t, 2.2));
  const u2 = Math.min(1, u + 0.01);
  const [cx, cy] = titikJalan(u);
  const [cx2, cy2] = titikJalan(u2);
  const sudut = (Math.atan2(cy2 - cy, cx2 - cx) * 180) / Math.PI;
  const lajuMentah = malam ? 0.02 : (elev(L(f + 1, 50, 220, 0, 0.9, (t) => 1 - Math.pow(1 - t, 2.2))) - elev(L(f - 1, 50, 220, 0, 0.9, (t) => 1 - Math.pow(1 - t, 2.2)))) / 2;
  const laju = malam ? L(f, 0, 60, 0.12, 0.03) : Math.min(1, lajuMentah / 0.02);
  const zoom = malam ? L(f, 0, 290, 0.85, 0.62, eIO) : 0.92;
  const kx = cx - 560;
  const ky = cy - (malam ? 1000 : 900);
  const tinggi = Math.round(elev(u) * 100);
  return (
    <AbsoluteFill style={{ background: malam ? "linear-gradient(#060a1e 0%, #141c45 55%, #2a2350 100%)" : "linear-gradient(#2b1b4a 0%, #8a3f6b 40%, #ff8a5a 70%, #ffd08a 100%)" }}>
      {malam ? (
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <circle key={i} cx={(i * 197) % 1080} cy={(i * 331) % 1100} r={1.5 + (i % 3)} fill="#fff" opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 20 + i))} />
          ))}
          <circle cx={860} cy={300} r={80} fill="#f3efe0" />
        </svg>
      ) : (
        <div style={{ position: "absolute", left: 640, top: 900, width: 360, height: 360, borderRadius: "50%", background: "#ffe2a8", boxShadow: "0 0 200px 90px rgba(255,190,120,0.55)" }} />
      )}
      <Lapis dalam={5} kx={kx} ky={ky} zoom={zoom}>
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
          <path d="M -800 1500 L -400 1050 L -100 1250 L 300 900 L 700 1200 L 1100 950 L 1500 1300 L 2000 1000 L 2400 1500 L 2400 2600 L -800 2600 Z" fill={malam ? "#1a1f45" : "#7a3d6e"} />
        </svg>
      </Lapis>
      <Lapis dalam={2.5} kx={kx} ky={ky} zoom={zoom}>
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
          <path d="M -900 1700 Q -300 1250 300 1550 Q 800 1300 1400 1500 Q 2000 1200 2800 1550 L 2800 2800 L -900 2800 Z" fill={malam ? "#141836" : "#5a2f5c"} />
          {malam
            ? Array.from({ length: 70 }).map((_, i) => (
                <circle key={i} cx={-600 + ((i * 113) % 2600)} cy={1650 + ((i * 59) % 500)} r={4 + (i % 3) * 2} fill={i % 4 ? "#ffcf6a" : "#ff9a5a"} opacity={0.6 + 0.4 * Math.sin(f / 9 + i)} />
              ))
            : null}
        </svg>
      </Lapis>
      <Lapis dalam={1} kx={kx} ky={ky} zoom={zoom}>
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
          {(() => {
            const n = 60;
            const pts = Array.from({ length: n + 1 }, (_, i) => titikJalan((i / n) * 1.08));
            const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
            return (
              <>
                <path d={`${d} L ${pts[n][0]} 3200 L ${pts[0][0] - 600} 3200 L ${pts[0][0] - 600} ${pts[0][1]} Z`} fill={malam ? "#0f1430" : "#3d2246"} />
                <path d={d} stroke={malam ? "#2b2f4a" : "#2a2230"} strokeWidth={44} fill="none" />
                <path d={d} stroke="#ffe9a8" strokeWidth={6} fill="none" strokeDasharray="34 30" opacity={0.85} />
                {Array.from({ length: 9 }).map((_, i) => {
                  const [px, py] = titikJalan(i / 8);
                  return (
                    <g key={i}>
                      <rect x={px - 4} y={py - 170} width={8} height={150} fill={malam ? "#565a7a" : "#2a1a2e"} />
                      {malam ? <circle cx={px} cy={py - 172} r={12} fill="#ffe7a0" style={{ filter: "drop-shadow(0 0 14px #ffd27a)" }} /> : null}
                    </g>
                  );
                })}
              </>
            );
          })()}
          <Mobil x={cx} y={cy - 18} sudut={sudut} roda={f * (malam ? 1 : 18 * laju + 2)} malam={malam} />
          {malam ? (
            <>
              <path d={`M ${cx + 180} ${titikJalan(0)[1]} L ${cx + 180} ${cy - 20}`} stroke={sorot} strokeWidth={8} strokeDasharray="20 14" />
              <path d={`M ${titikJalan(0)[0] - 300} ${titikJalan(0)[1]} L ${cx + 260} ${titikJalan(0)[1]}`} stroke="rgba(255,255,255,0.5)" strokeWidth={4} strokeDasharray="16 14" />
            </>
          ) : null}
        </svg>
      </Lapis>
      <Lapis dalam={0.7} kx={kx} ky={ky} zoom={zoom} blur={6}>
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <path key={i} d={`M ${-200 + i * 260} 2400 q 20 -160 40 0 q 20 -200 40 0 q 20 -140 40 0`} fill={malam ? "#0a0d22" : "#2a1630"} />
          ))}
        </svg>
      </Lapis>
      {!malam ? <Bokeh warna={["#ffd08a", "#ff9a6b"]} jumlah={8} area={[0, 200, 1080, 800]} o={0.3} seed={7} /> : null}
      {/* HUD */}
      <div style={{ position: "absolute", right: 60, top: 250, textAlign: "center", opacity: malam ? 1 : L(f, 70, 82, 0, 1) }}>
        <Speedometer laju={laju} />
        <div style={{ fontFamily: font.utama, fontWeight: 800, fontSize: 40, color: sorot, marginTop: -10 }}>inflasi</div>
        <div style={{ fontFamily: font.mono, fontWeight: 600, fontSize: 24, color: "#fff" }}>= kecepatan naik</div>
      </div>
      <div style={{ position: "absolute", left: 60, top: 250, display: "flex", gap: 18, alignItems: "flex-end", opacity: malam ? 1 : L(f, 90, 102, 0, 1) }}>
        <div style={{ width: 26, height: 360, borderRadius: 13, background: "rgba(255,255,255,0.2)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${tinggi}%`, background: "#fff", borderRadius: 13 }} />
        </div>
        <div>
          <div style={{ fontFamily: font.utama, fontWeight: 800, fontSize: 40, color: "#fff" }}>harga</div>
          <div style={{ fontFamily: font.mono, fontWeight: 600, fontSize: 24, color: "#fff" }}>= ketinggian</div>
        </div>
      </div>
      {malam ? (
        <>
          <Label x={540} y={700} rata="center" teks="harga: tetap tinggi" latar="rgba(255,210,63,0.95)" warna="#1a1430" o={L(f, 30, 42, 0, 1)} ukuran={36} />
          <Label x={540} y={780} rata="center" teks="kenaikan: melambat" latar="rgba(255,255,255,0.9)" warna="#1a1430" o={L(f, 150, 162, 0, 1)} ukuran={36} />
          <Sequence durationInFrames={125}>
            <Naskah mulai={20} y={1170} teks="Kesimpulannya: harga bisa *tetap* *mahal* meskipun inflasi sudah terkendali." />
          </Sequence>
          <Sequence from={125}>
            <Naskah mulai={6} y={1170} teks="Karena yang melambat adalah *kenaikan* *harganya,* bukan harga barangnya yang kembali turun." />
          </Sequence>
        </>
      ) : (
        <>
          <Sequence durationInFrames={66}>
            <Naskah mulai={0} y={720} ukuran={92} kps={4} teks="Inilah yang sering *disalahpahami.*" />
          </Sequence>
          <Sequence from={66}>
            <Naskah mulai={6} y={1170} teks="Inflasi mengukur seberapa cepat harga *naik,* bukan seberapa *murah* harga barang." />
          </Sequence>
        </>
      )}
      <Sinema vignette={0.5} />
    </AbsoluteFill>
  );
};
