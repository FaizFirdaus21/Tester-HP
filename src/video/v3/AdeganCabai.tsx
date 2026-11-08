import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { geometriCabai } from "../../tiga/Cabai3D";
import { font, rupiah, sorot } from "./gaya";
import { Bokeh, L, Label, Naskah, Sinema, eIO } from "./Umum";

export const CABAI_FASE3 = [170, 180, 140] as const;

const KAM = { pos: [0, 3.6, 8.2] as [number, number, number], rot: [-0.42, 0, 0] as [number, number, number], fov: 34 };
const proyek = (x: number, y: number, z: number) => {
  const c = new THREE.PerspectiveCamera(KAM.fov, 1080 / 1920, 0.1, 100);
  c.position.set(...KAM.pos);
  c.rotation.set(...KAM.rot);
  c.updateMatrixWorld();
  const v = new THREE.Vector3(x, y, z).project(c);
  return [(v.x * 0.5 + 0.5) * 1080, (-v.y * 0.5 + 0.5) * 1920] as const;
};

const acak = (i: number) => {
  const x = Math.sin((i + 1) * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const CabaiJatuh: React.FC<{ f: number }> = ({ f }) => {
  const geo = useMemo(() => geometriCabai(2.2, 0.55), []);
  const tangkai = useMemo(() => new THREE.CylinderGeometry(0.04, 0.055, 0.45, 10), []);
  const kelopak = useMemo(() => new THREE.SphereGeometry(0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const isi = Array.from({ length: 9 }, (_, i) => {
    const sudut = acak(i) * Math.PI * 2;
    const r = 0.1 + acak(i + 3) * 0.55;
    return {
      x: Math.cos(sudut) * r,
      z: Math.sin(sudut) * r * 0.7,
      yDiam: 0.46 + (i % 3) * 0.11,
      rot: [(acak(i + 5) - 0.5) * 0.3, acak(i + 7) * Math.PI * 2, Math.PI / 2 + (acak(i + 9) - 0.5) * 0.3] as [number, number, number],
      mulai: 4 + i * 3,
    };
  });
  return (
    <>
      {isi.map((c, i) => {
        const t = f - c.mulai;
        const jatuh = Math.max(0, Math.min(1, t / 12));
        const y = t < 0 ? 8 : t < 12 ? 8 - (8 - c.yDiam) * jatuh * jatuh : c.yDiam + Math.abs(Math.sin((t - 12) / 2.6)) * 0.25 * Math.exp(-(t - 12) / 6);
        return (
          <group key={i} position={[c.x, y, c.z]} rotation={c.rot} scale={0.55}>
            <group position={[0.2, 1.1, 0]}>
              <mesh geometry={geo}>
                <meshPhysicalMaterial color={i % 4 === 0 ? "#b5160f" : "#d8221a"} roughness={0.22} clearcoat={1} clearcoatRoughness={0.12} />
              </mesh>
              <mesh geometry={kelopak} position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}>
                <meshStandardMaterial color="#3f7d2b" roughness={0.6} />
              </mesh>
              <mesh geometry={tangkai} position={[-0.05, 0.2, 0]} rotation={[0, 0, 0.5]}>
                <meshStandardMaterial color="#4f8a35" roughness={0.6} />
              </mesh>
            </group>
          </group>
        );
      })}
    </>
  );
};

const Papan: React.FC<{ teks: string; f: number; ganti: number }> = ({ teks, f, ganti }) => {
  const p = L(f, ganti, ganti + 10, 0, 1);
  return (
    <div style={{ position: "absolute", left: 70, top: 250, perspective: 800 }}>
      <div style={{ width: 2, height: 60, background: "#3a2a1c", marginLeft: 120 }} />
      <div
        style={{
          padding: "22px 34px",
          background: "#24382c",
          border: "10px solid #7a5530",
          borderRadius: 10,
          color: "#f4f1e6",
          fontFamily: font.utama,
          fontWeight: 800,
          fontSize: 40,
          transform: `rotateX(${(1 - p) * 90}deg)`,
          transformOrigin: "50% 0%",
          boxShadow: "0 16px 30px rgba(0,0,0,0.4)",
        }}
      >
        {teks}
      </div>
    </div>
  );
};

export const AdeganCabai: React.FC = () => {
  const f = useCurrentFrame();
  const [g, h] = [CABAI_FASE3[0], CABAI_FASE3[0] + CABAI_FASE3[1]];
  const [dx, dy] = proyek(0, 0.03, 0.92);
  // nilai pada layar timbangan
  let harga = L(f, 34, 60, 0, 40000);
  if (f >= 96) harga = L(f, 96, 120, 40000, 50000);
  const glitch = f >= h + 18 && f < h + 52;
  const tampil = glitch ? (Math.floor(f / 3) % 2 ? "40.000?" : "50.000") : new Intl.NumberFormat("id-ID").format(Math.round(harga / 100) * 100);
  const papan = f < 90 ? "TAHUN LALU" : f < g ? "TAHUN INI" : "BULAN DEPAN";
  const gantiPapan = f < 90 ? 6 : f < g ? 90 : g;
  // kamera: dorong masuk saat cabai jatuh, mundur, lalu dekat ke layar timbangan
  const zoom = f < 60 ? L(f, 0, 60, 1.3, 1.0, eIO) : f < h + 10 ? L(f, 60, h, 1.0, 1.06, eIO) : f < h + 60 ? L(f, h + 10, h + 34, 1.06, 1.35, eIO) : L(f, h + 60, h + 90, 1.35, 1.02, eIO);
  const fokusY = f < 60 ? L(f, 0, 60, 900, 960) : f < h + 10 ? 960 : f < h + 60 ? L(f, h + 10, h + 34, 960, dy) : L(f, h + 60, h + 90, dy, 960);
  const stempel = L(f, h + 60, h + 70, 0, 1);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #4a2a1c 0%, #22120c 60%, #120806 100%)" }}>
      <Bokeh warna={["#ffb45a", "#ffd88a", "#ff7a3a"]} jumlah={18} area={[0, 80, 1080, 900]} o={0.55} seed={4} />
      <AbsoluteFill style={{ transform: `translate(0px, ${960 - fokusY}px) scale(${zoom})`, transformOrigin: `540px ${fokusY}px` }}>
        <ThreeCanvas width={1080} height={1920} camera={{ position: KAM.pos, rotation: KAM.rot, fov: KAM.fov }} shadows style={{ position: "absolute" }}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[-3, 7, 4]} intensity={2.6} color="#ffe2b8" castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[3, 2, 3]} intensity={14} color="#ff9a5a" />
          <pointLight position={[0, 3, -3]} intensity={10} color="#ffd9a0" />
          {/* meja kayu */}
          <mesh position={[0, -0.35, 0]} receiveShadow>
            <boxGeometry args={[12, 0.3, 8]} />
            <meshStandardMaterial color="#7a4a26" roughness={0.75} />
          </mesh>
          {/* timbangan */}
          <mesh position={[0, 0.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.6, 0.42, 1.8]} />
            <meshStandardMaterial color="#e3e6e8" roughness={0.35} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.03, 0.905]}>
            <boxGeometry args={[1.5, 0.28, 0.02]} />
            <meshStandardMaterial color="#121a16" roughness={0.3} emissive="#0a1a0e" />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.25, 1.18, 0.08, 48]} />
            <meshStandardMaterial color="#c8ccd0" roughness={0.22} metalness={0.85} />
          </mesh>
          <CabaiJatuh f={f} />
        </ThreeCanvas>
        {/* layar timbangan */}
        <div
          style={{
            position: "absolute",
            left: dx - 140,
            top: dy - 26,
            width: 280,
            textAlign: "right",
            fontFamily: font.mono,
            fontWeight: 800,
            fontSize: 44,
            color: glitch ? "#ffb4a0" : "#8dff9a",
            textShadow: "0 0 12px rgba(120,255,140,0.7)",
            lineHeight: 1,
          }}
        >
          {tampil}
          <span style={{ fontSize: 16, marginLeft: 6 }}>Rp/kg</span>
        </div>
      </AbsoluteFill>
      <Papan teks={papan} f={f} ganti={gantiPapan} />
      {/* harga besar */}
      <div style={{ position: "absolute", right: 70, top: 300, textAlign: "right", fontFamily: font.utama, fontWeight: 800, color: "#fff", fontSize: 100, lineHeight: 1, textShadow: "0 10px 30px rgba(0,0,0,0.5)", opacity: L(f, 30, 40, 0, 1) }}>
        {glitch ? "Rp40.000?" : rupiah(Math.round(harga / 100) * 100)}
      </div>
      <Label x={650} y={430} teks="▲ +25% setahun" latar="#e2342a" o={f >= g ? 0 : L(f, 118, 128, 0, 1)} ukuran={32} rata="left" />
      <Label x={600} y={430} teks="inflasi cabai: 0%" latar="rgba(255,255,255,0.92)" warna="#22120c" o={f >= g && f < h ? L(f, g + 70, g + 82, 0, 1) : 0} ukuran={34} />
      <div style={{ position: "absolute", left: 160, top: 760, transform: `rotate(-10deg) scale(${1.6 - 0.6 * stempel})`, opacity: stempel, border: "10px solid #ff3b2f", borderRadius: 14, padding: "10px 30px", color: "#ff3b2f", fontFamily: font.utama, fontWeight: 800, fontSize: 96, letterSpacing: "0.04em", background: "rgba(20,8,6,0.35)" }}>
        BELUM TENTU
      </div>
      <div style={{ position: "absolute", left: 70, top: 540, fontFamily: font.mono, fontSize: 24, color: "#d8b8a0" }}>contoh ilustrasi · harga per kg</div>
      <Sequence durationInFrames={g}>
        <Naskah mulai={14} y={1170} teks="Bayangkan tahun lalu harga cabai Rp40 ribu sekilo. Tahun ini naik menjadi *Rp50* *ribu.*" />
      </Sequence>
      <Sequence from={g} durationInFrames={CABAI_FASE3[1]}>
        <Naskah mulai={6} y={1170} teks="Kalau bulan depan harganya tetap Rp50 ribu, inflasinya bisa saja *nol* untuk cabai tersebut." />
      </Sequence>
      <Sequence from={h}>
        <Naskah mulai={6} y={1170} teks="Tapi apakah harganya kembali menjadi Rp40 ribu? Ya, *belum* *tentu.*" />
      </Sequence>
      <Sinema vignette={0.6} />
      {void sorot}
    </AbsoluteFill>
  );
};
