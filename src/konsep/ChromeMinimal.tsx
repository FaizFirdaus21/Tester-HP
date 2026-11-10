// Arah C: "Chrome Minimal". Hitam, tipografi besar, satu objek 3D utama per adegan.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { F, Kamera, Koin, Lingkungan, masuk, useAdegan } from "./umum";

const C = { latar: "#060606", putih: "#f5f5f2", abu: "#8a8a86", hijau: "#c6ff3d", merah: "#ff3b3b" };

const Brankas: React.FC<{ buka: number; f: number }> = ({ buka, f }) => (
  <group rotation={[0.15, -0.55 + Math.sin(f / 40) * 0.08, 0]}>
    <mesh>
      <boxGeometry args={[2.4, 2.4, 2.4]} />
      <meshPhysicalMaterial color="#d8dde3" metalness={0.15} roughness={0.05} transmission={0.85} thickness={1.2} ior={1.45} transparent />
    </mesh>
    {/* isi: tumpukan koin */}
    {[0, 1, 2, 3].map((i) => (
      <group key={i} position={[0, -0.95 + i * 0.17, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.55}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Koin warna="#e9e9e4" kasar={0.08} />
        </group>
      </group>
    ))}
    {/* pintu berengsel */}
    <group position={[1.2, 0, 1.22]} rotation={[0, -buka * 1.2, 0]}>
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[2.36, 2.36, 0.12]} />
        <meshStandardMaterial color="#cfd3d8" metalness={1} roughness={0.12} />
      </mesh>
      <mesh position={[-1.2, 0, 0.1]}>
        <torusGeometry args={[0.45, 0.07, 16, 64]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.05} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-1.2, 0, 0.12]} rotation={[0, 0, (i * Math.PI) / 3 + f * 0.03]}>
          <boxGeometry args={[0.9, 0.06, 0.06]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.05} />
        </mesh>
      ))}
    </group>
  </group>
);

const Pilar: React.FC<{ jatuh: number }> = ({ jatuh }) => (
  <group>
    {Array.from({ length: 14 }).map((_, i) => {
      const x = (i % 7) * 0.62 - 1.86;
      const z = Math.floor(i / 7) * -1.2;
      const k = Math.min(1, Math.max(0, jatuh * 1.6 - i * 0.04));
      return (
        <group key={i} position={[x, -1.2, z]} rotation={[0, 0, -k * 1.45]}>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 1.8, 32]} />
            <meshStandardMaterial color="#e6e6e6" metalness={1} roughness={0.12} />
          </mesh>
        </group>
      );
    })}
  </group>
);

const Subtitel: React.FC<{ teks: string }> = ({ teks }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top: 1340, textAlign: "center", fontFamily: F.sans, fontWeight: 700, fontSize: 46, lineHeight: 1.25, color: C.putih }}>{teks}</div>
);

export const ChromeMinimal: React.FC = () => {
  const { f, adegan, t } = useAdegan();
  const m = masuk(t, 3, 10);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #1c1c1c 0%, ${C.latar} 60%)` }}>
      {/* tipografi raksasa DI BELAKANG objek 3D */}
      {adegan === 0 ? (
        <div style={{ position: "absolute", top: 520, width: "100%", textAlign: "center", fontFamily: F.display, fontSize: 560, lineHeight: 1, letterSpacing: "-0.05em", color: C.putih }}>6%</div>
      ) : null}
      {adegan === 2 ? (
        <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: F.display, fontSize: 520, lineHeight: 1, letterSpacing: "-0.05em", color: C.merah }}>14</div>
      ) : null}
      <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0, 7], fov: 35 }} gl={{ toneMapping: THREE.ACESFilmicToneMapping, alpha: true }}>
        <Lingkungan kuat={1.2} />
        <ambientLight intensity={0.15} />
        <spotLight position={[3, 6, 5]} angle={0.5} penumbra={0.8} intensity={140} />
        <pointLight position={[-4, -1, 3]} intensity={25} color={adegan === 2 ? C.merah : C.hijau} />
        {adegan === 0 ? (
          <>
            <Kamera pos={[0, 0, 7]} lihat={[0, 0, 0]} fov={35} />
            <group position={[0.75 - t * 0.01, -1.05, 1.5]} rotation={[0.35, -0.55 + 0.2 * Math.sin(f / 15), 0.2]} scale={0.6}>
              <Koin warna="#eeeeea" kasar={0.06} />
            </group>
          </>
        ) : null}
        {adegan === 1 ? (
          <>
            <Kamera pos={[0, 0.4, 12.5 - t * 0.03]} lihat={[0, -0.3, 0]} fov={35} />
            <group position={[0, -0.6, 0]} scale={0.85}>
              <Brankas buka={masuk(t, 4, 20) * 0.55} f={f} />
            </group>
          </>
        ) : null}
        {adegan === 2 ? (
          <>
            <Kamera pos={[0, 1.2, 10]} lihat={[0, -1.2, -0.6]} fov={35} />
            <group position={[0, -0.9, 0]}>
              <Pilar jatuh={masuk(t, 0, 26)} />
            </group>
          </>
        ) : null}
        {adegan === 3 ? (
          <>
            <Kamera pos={[0, 0, 7]} lihat={[0, 0, 0]} fov={35} />
            <group position={[0, 1.0, 0]} rotation={[0.25, 0.45 * Math.sin(f / 15), 0]} scale={0.5}>
              <Koin warna="#eeeeea" kasar={0.06} />
            </group>
          </>
        ) : null}
      </ThreeCanvas>
      {/* lapisan teks depan */}
      <div style={{ position: "absolute", left: 70, top: 130, fontFamily: F.mono, fontSize: 24, letterSpacing: "0.2em", color: C.abu }}>INTIPDOMPET — 0{adegan + 1}/04</div>
      {adegan === 0 ? (
        <>
          <div style={{ position: "absolute", top: 1150, left: 90, fontFamily: F.display, fontSize: 130, color: C.hijau, opacity: m, transform: `translateY(${(1 - m) * 30}px)` }}>Aman?</div>
          <div style={{ position: "absolute", top: 400, width: "100%", textAlign: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 40, color: C.abu }}>bunga deposito (contoh)</div>
        </>
      ) : null}
      {adegan === 1 ? (
        <>
          <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center" }}>
            <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 40, color: C.abu }}>batas bunga dijamin LPS</div>
            <div style={{ fontFamily: F.display, fontSize: 200, lineHeight: 1, color: C.putih, opacity: m }}>3,75%</div>
          </div>
          <Subtitel teks="Lewat dari itu, pokok dan bunga nggak dijamin." />
        </>
      ) : null}
      {adegan === 2 ? (
        <>
          <div style={{ position: "absolute", top: 760, width: "100%", textAlign: "center", fontFamily: F.kondens, fontWeight: 700, fontSize: 64, color: C.putih }}>BPR & BPRS DILIKUIDASI</div>
          <div style={{ position: "absolute", top: 840, width: "100%", textAlign: "center", fontFamily: F.mono, fontSize: 24, color: C.abu }}>hingga Okt 2026 · sumber: KSSK</div>
          <Subtitel teks="Bank bisa tutup. Tahun ini sudah empat belas." />
        </>
      ) : null}
      {adegan === 3 ? (
        <div style={{ position: "absolute", top: 980, left: 80, right: 80, opacity: m }}>
          <div style={{ fontFamily: F.display, fontSize: 90, lineHeight: 1.0, color: C.putih, letterSpacing: "-0.02em" }}>Bunga tinggi boleh,</div>
          <div style={{ fontFamily: F.display, fontSize: 90, lineHeight: 1.0, color: C.hijau, letterSpacing: "-0.02em" }}>asal tahu risikonya.</div>
          <div style={{ marginTop: 50, fontFamily: F.mono, fontSize: 26, letterSpacing: "0.18em", color: C.abu }}>@INTIPDOMPET · URUSAN UANG, KITA INTIP</div>
          <div style={{ marginTop: 14, fontFamily: F.sans, fontSize: 28, color: C.abu }}>Konten edukasi, bukan ajakan membeli.</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
