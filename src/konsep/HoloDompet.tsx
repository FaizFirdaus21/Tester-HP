// Arah A: "Holo Dompet". Navy gelap, panel kaca hologram cyan/kuning, objek 3D melayang.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { F, Kamera, Koin, Lingkungan, masuk, useAdegan } from "./umum";

const C = { latar: "#050b1c", cyan: "#4fe3ff", kuning: "#ffd23f", putih: "#eaf6ff", redup: "#6f86b3", merah: "#ff4d6d" };

const Grid: React.FC<{ f: number }> = ({ f }) => (
  <group position={[0, -2.2, 0]}>
    <gridHelper args={[40, 40, C.cyan, "#123a66"]} position={[0, 0, (f * 0.03) % 1]} />
  </group>
);

const Cincin: React.FC<{ r: number; rot: [number, number, number]; warna?: string; tebal?: number }> = ({ r, rot, warna = C.cyan, tebal = 0.012 }) => (
  <mesh rotation={rot}>
    <torusGeometry args={[r, tebal, 8, 160]} />
    <meshBasicMaterial color={warna} transparent opacity={0.85} />
  </mesh>
);

const Panel: React.FC<{ x: number; y: number; w: number; h?: number; muncul: number; children: React.ReactNode; aksen?: string }> = ({ x, y, w, h, muncul, children, aksen = C.cyan }) => (
  <div
    style={{
      position: "absolute", left: x, top: y, width: w, height: h,
      padding: "28px 34px", borderRadius: 26,
      background: "linear-gradient(160deg, rgba(79,227,255,0.16), rgba(20,40,90,0.35))",
      border: `2px solid ${aksen}88`, boxShadow: `0 0 40px ${aksen}33, inset 0 0 30px ${aksen}22`,
      backdropFilter: "blur(14px)", opacity: muncul, transform: `translateY(${(1 - muncul) * 40}px)`,
      color: C.putih, fontFamily: F.sans,
    }}
  >
    <div style={{ position: "absolute", left: 18, top: 14, width: 26, height: 3, background: aksen }} />
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode; warna?: string }> = ({ children, warna = C.cyan }) => (
  <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: "0.18em", color: warna, textTransform: "uppercase" }}>{children}</div>
);

const Subtitel: React.FC<{ teks: string }> = ({ teks }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top: 1340, textAlign: "center", fontFamily: F.sans, fontWeight: 700, fontSize: 46, lineHeight: 1.25, color: C.putih, textShadow: "0 2px 18px #000" }}>{teks}</div>
);

const Adegan3D: React.FC<{ adegan: number; t: number; f: number }> = ({ adegan, t, f }) => {
  if (adegan === 0) {
    return (
      <>
        <Kamera pos={[0, 0.4, 7]} lihat={[0, 0.2, 0]} fov={38} />
        <group position={[0, 0.75, 0]} rotation={[0.15, 0.5 * Math.sin(f / 18), 0]} scale={0.85}>
          <Koin warna="#f2c14e" />
        </group>
        <Cincin r={1.7} rot={[Math.PI / 2 + 0.3, 0, f * 0.02]} />
        <Cincin r={2.1} rot={[Math.PI / 2 + 0.3, 0, -f * 0.015]} warna={C.kuning} tebal={0.008} />
        <Grid f={f} />
      </>
    );
  }
  if (adegan === 1) {
    // pengukur bunga: busur 0–6%, batas LPS 3,75%
    const isi = masuk(t, 2, 18);
    const sudut = (p: number) => Math.PI * (1 - p / 6);
    return (
      <>
        <Kamera pos={[0, -0.6, 9.5]} lihat={[0, 0.2, 0]} fov={40} />
        <group position={[0, -0.9, 0]} rotation={[-0.2, Math.sin(f / 30) * 0.15, 0]}>
          <mesh>
            <torusGeometry args={[2, 0.12, 16, 120, Math.PI]} />
            <meshStandardMaterial color="#14305c" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh rotation={[0, 0, sudut(3.75)]}>
            <torusGeometry args={[2, 0.16, 16, 120, Math.PI - sudut(3.75)]} />
            <meshStandardMaterial color={C.cyan} emissive={C.cyan} emissiveIntensity={0.9} />
          </mesh>
          <mesh rotation={[0, 0, sudut(6 * isi)]}>
            <torusGeometry args={[2, 0.17, 16, 120, Math.max(0.001, sudut(3.75) - sudut(Math.max(3.75, 6 * isi)))]} />
            <meshStandardMaterial color={C.merah} emissive={C.merah} emissiveIntensity={1} />
          </mesh>
          {/* jarum */}
          <group rotation={[0, 0, sudut(6 * isi) - Math.PI / 2]}>
            <mesh position={[0, 1, 0.1]}>
              <boxGeometry args={[0.06, 2, 0.06]} />
              <meshStandardMaterial color={C.putih} emissive={C.putih} emissiveIntensity={0.6} />
            </mesh>
          </group>
          <mesh position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.18, 32, 16]} />
            <meshStandardMaterial color="#c9d6ea" metalness={1} roughness={0.15} />
          </mesh>
        </group>
        <Grid f={f} />
      </>
    );
  }
  if (adegan === 2) {
    // kartu ATM + perisai wireframe
    return (
      <>
        <Kamera pos={[0, 0.2, 7]} lihat={[0, 0.4, 0]} fov={38} />
        <group position={[0, 0.3, 0]} rotation={[0.35, -0.5 + f * 0.01, 0.12]} scale={0.62}>
          <mesh>
            <boxGeometry args={[3.2, 2, 0.06]} />
            <meshPhysicalMaterial color="#1b3a8a" metalness={0.5} roughness={0.2} clearcoat={1} />
          </mesh>
          <mesh position={[-0.9, 0.2, 0.04]}>
            <boxGeometry args={[0.55, 0.42, 0.02]} />
            <meshStandardMaterial color={C.kuning} metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.55, 0.04]}>
            <boxGeometry args={[2.6, 0.06, 0.01]} />
            <meshBasicMaterial color={C.cyan} />
          </mesh>
        </group>
        <mesh position={[0, 0.5, 0]} rotation={[0, f * 0.012, 0]}>
          <icosahedronGeometry args={[2.4, 2]} />
          <meshBasicMaterial color={C.cyan} wireframe transparent opacity={0.28} />
        </mesh>
        <Grid f={f} />
      </>
    );
  }
  // penutup: logo koin kecil + cincin
  return (
    <>
      <Kamera pos={[0, 0, 7]} lihat={[0, 0.6, 0]} fov={38} />
      {[-1.15, 0, 1.15].map((x, i) => (
        <group key={x} position={[x, 2.0 + Math.sin(f / 10 + i) * 0.1, -1]} rotation={[0.2, 0.5 * Math.sin(f / 15 + i * 2), 0]} scale={0.42}>
          <Koin warna={i === 1 ? "#f2c14e" : "#9fd8ff"} />
        </group>
      ))}
      <Cincin r={2.6} rot={[Math.PI / 2 + 0.25, 0, f * 0.02]} />
      <Grid f={f} />
    </>
  );
};

export const HoloDompet: React.FC = () => {
  const { f, adegan, t } = useAdegan();
  const m = masuk(t, 4, 12);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, #12306a 0%, ${C.latar} 65%)` }}>
      <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0, 7], fov: 38 }} gl={{ toneMapping: THREE.ACESFilmicToneMapping }}>
        <Lingkungan kuat={0.9} />
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 4, 5]} intensity={60} color={C.cyan} />
        <pointLight position={[-4, 2, 3]} intensity={40} color={C.kuning} />
        <Adegan3D adegan={adegan} t={t} f={f} />
      </ThreeCanvas>
      {/* HUD tetap */}
      <div style={{ position: "absolute", left: 60, top: 120, right: 60, display: "flex", justifyContent: "space-between" }}>
        <Label>intipdompet // 0{adegan + 1}</Label>
        <Label warna={C.redup}>LIVE DATA · NOV 2026</Label>
      </div>
      {adegan === 0 ? (
        <>
          <div style={{ position: "absolute", top: 1010, width: "100%", textAlign: "center", color: C.putih, fontFamily: F.display, fontSize: 250, lineHeight: 1, textShadow: `0 0 50px ${C.cyan}88`, opacity: masuk(t, 0, 6) }}>6%</div>
          <div style={{ position: "absolute", top: 1245, width: "100%", textAlign: "center", color: C.kuning, fontFamily: F.kondens, fontWeight: 700, fontSize: 92, letterSpacing: "0.08em", opacity: m }}>AMAN NGGAK?</div>
          <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center" }}>
            <Label>bunga deposito · contoh</Label>
          </div>
        </>
      ) : null}
      {adegan === 1 ? (
        <>
          <Panel x={90} y={300} w={900} muncul={m}>
            <Label>batas bunga dijamin LPS</Label>
            <div style={{ fontFamily: F.display, fontSize: 170, lineHeight: 1.05, color: C.putih }}>3,75%</div>
            <div style={{ fontSize: 34, color: C.redup }}>bank umum · 1 Okt 2026 – 31 Jan 2027</div>
          </Panel>
          <div style={{ position: "absolute", left: 130, top: 1170, fontFamily: F.mono, fontSize: 34, color: C.cyan }}>0%</div>
          <div style={{ position: "absolute", right: 130, top: 1170, fontFamily: F.mono, fontSize: 34, color: C.merah }}>6% ✕ tidak dijamin</div>
          <Subtitel teks="Di atas 3,75%, seluruh simpananmu nggak dijamin." />
        </>
      ) : null}
      {adegan === 2 ? (
        <>
          <Panel x={90} y={250} w={560} muncul={m} aksen={C.kuning}>
            <Label warna={C.kuning}>jaminan maks.</Label>
            <div style={{ fontFamily: F.display, fontSize: 104, color: C.putih }}>Rp2 M</div>
            <div style={{ fontSize: 30, color: C.redup }}>per nasabah, per bank</div>
          </Panel>
          <Panel x={560} y={1060} w={430} muncul={masuk(t, 10, 12)}>
            <Label>status</Label>
            <div style={{ fontFamily: F.kondens, fontWeight: 700, fontSize: 64, color: C.cyan }}>TERLINDUNGI</div>
          </Panel>
          <Subtitel teks="Ingat, jaminannya maksimal Rp2 miliar per nasabah per bank." />
        </>
      ) : null}
      {adegan === 3 ? (
        <>
          <div style={{ position: "absolute", top: 820, width: "100%", textAlign: "center", opacity: m }}>
            <div style={{ fontFamily: F.display, fontSize: 92, color: C.putih, lineHeight: 1.05 }}>Bunga tinggi boleh,</div>
            <div style={{ fontFamily: F.display, fontSize: 92, color: C.kuning, lineHeight: 1.05 }}>asal tahu risikonya.</div>
            <div style={{ marginTop: 50 }}><Label>intipdompet · urusan uang, kita intip</Label></div>
            <div style={{ marginTop: 18, fontFamily: F.sans, fontSize: 28, color: C.redup }}>Konten edukasi, bukan ajakan membeli.</div>
          </div>
        </>
      ) : null}
      {/* garis pindai */}
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 6px)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
