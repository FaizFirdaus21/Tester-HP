import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { font, persen, sorot } from "./gaya";
import { AngkaBesar, L, Label, Naskah, Sinema, eIO } from "./Umum";

// Satuan dunia -> piksel layar untuk kamera di z=9, fov 30.
const PX = 398;
const keY = (v: number) => -2.2 + (v / 6) * 5; // nilai % -> posisi y lokal termometer
const S = 0.34; // skala termometer
const OY = 0.62; // posisi y termometer di dunia
const layarY = (y: number) => 960 - (OY + y * S) * PX;
const TX = 0.82; // posisi x termometer

export const AdeganTermometer: React.FC = () => {
  const f = useCurrentFrame();
  const v = L(f, 26, 96, 0, 3.23);
  const pita = L(f, 70, 86, 0, 1);
  const goyang = Math.sin(f / 50) * 0.1;
  const tinggiCair = keY(v) - -2.45;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 40%, #2c6f7a 0%, #123a48 55%, #081c26 100%)" }}>
      <AbsoluteFill style={{ transform: `scale(${L(f, 0, 185, 1.12, 1, eIO)})` }}>
        <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0, 9], fov: 30 }} style={{ position: "absolute" }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 6]} intensity={2.2} />
          <pointLight position={[-3, -1, 4]} intensity={18} color="#9fe8ff" />
          <group position={[TX, OY, 0]} rotation={[0, goyang, 0]} scale={S}>
            {/* papan skala */}
            <mesh position={[0, 0.2, -0.32]}>
              <boxGeometry args={[1.25, 6.3, 0.12]} />
              <meshStandardMaterial color="#eef3f2" roughness={0.5} />
            </mesh>
            {/* zona sasaran BI 1,5% - 3,5% */}
            <mesh position={[0, (keY(1.5) + keY(3.5)) / 2, -0.25]} scale={[1, pita, 1]}>
              <boxGeometry args={[1.22, keY(3.5) - keY(1.5), 0.02]} />
              <meshStandardMaterial color="#5fd39a" roughness={0.6} transparent opacity={0.75} />
            </mesh>
            {/* garis skala */}
            {Array.from({ length: 25 }).map((_, i) => {
              const val = i / 4;
              const besar = i % 4 === 0;
              return (
                <mesh key={i} position={[-0.38 - (besar ? 0.05 : 0), keY(val), -0.24]}>
                  <boxGeometry args={[besar ? 0.3 : 0.16, 0.025, 0.02]} />
                  <meshStandardMaterial color="#20343c" />
                </mesh>
              );
            })}
            {/* tabung kaca */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 5.6, 32, 1, true]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.05} transparent opacity={0.22} clearcoat={1} side={2} />
            </mesh>
            <mesh position={[0, 3.05, 0]}>
              <sphereGeometry args={[0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.05} transparent opacity={0.22} clearcoat={1} />
            </mesh>
            {/* cairan */}
            <mesh position={[0, -2.9, 0]}>
              <sphereGeometry args={[0.46, 40, 24]} />
              <meshPhysicalMaterial color="#e2342a" roughness={0.15} clearcoat={1} />
            </mesh>
            <mesh position={[0, -2.45 + tinggiCair / 2, 0]}>
              <cylinderGeometry args={[0.13, 0.13, Math.max(0.01, tinggiCair), 24]} />
              <meshPhysicalMaterial color="#e2342a" roughness={0.15} clearcoat={1} />
            </mesh>
            <mesh position={[0, -2.9, 0]}>
              <sphereGeometry args={[0.52, 40, 24]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.05} transparent opacity={0.18} clearcoat={1} />
            </mesh>
          </group>
        </ThreeCanvas>
        {[0, 3, 6].map((val) => (
          <div key={val} style={{ position: "absolute", left: 540 + (TX - 0.62 * S) * PX - 90, top: layarY(keY(val)) - 20, fontFamily: font.mono, fontWeight: 700, fontSize: 30, color: "#d9eef2" }}>
            {val}%
          </div>
        ))}
        <Label x={70} y={layarY(keY(2.5)) - 24} teks="zona sasaran BI 2,5 ± 1% →" o={pita} latar="rgba(40,140,100,0.85)" ukuran={26} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 70, top: 300, fontFamily: font.mono, fontSize: 30, color: "#a8d8e0", fontWeight: 600 }}>INFLASI TAHUNAN · OKT 2026</div>
      <div style={{ position: "absolute", left: 40, top: 350, width: 600 }}>
        <AngkaBesar teks={persen(v)} y={0} ukuran={190} warna={sorot} />
      </div>
      <div style={{ position: "absolute", left: 70, top: 1070, fontFamily: font.mono, fontSize: 24, color: "#8fb9c2", opacity: L(f, 40, 50, 0, 1) }}>Sumber: BPS, rilis 2 November 2026</div>
      <Naskah mulai={12} y={1180} teks="Berdasarkan data BPS, inflasi Indonesia pada Oktober 2026 tercatat sebesar *3,23* *persen* secara tahunan." />
      <Sinema vignette={0.5} />
    </AbsoluteFill>
  );
};
