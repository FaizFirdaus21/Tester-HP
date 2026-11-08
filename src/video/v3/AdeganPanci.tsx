import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { geometriCabai } from "../../tiga/Cabai3D";
import { font, persen, sorot } from "./gaya";
import { L, Naskah, Sinema, eIO } from "./Umum";

const acak = (i: number) => {
  const x = Math.sin((i + 1) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const Panci: React.FC<{ x: number; r: number; h: number; f: number; gejolak: number; warnaKuah: string; cabai?: boolean }> = ({ x, r, h, f, gejolak, warnaKuah, cabai }) => {
  const geo = useMemo(() => geometriCabai(1.3, 0.5), []);
  const gelembung = Array.from({ length: Math.round(18 * gejolak) + 3 }, (_, i) => {
    const siklus = 18 - gejolak * 8;
    const t = ((f + acak(i) * 40) % siklus) / siklus;
    const a = acak(i + 3) * Math.PI * 2;
    const d = acak(i + 5) * r * 0.75;
    return { x: Math.cos(a) * d, z: Math.sin(a) * d, s: 0.05 + 0.16 * Math.sin(t * Math.PI) * (0.4 + gejolak), key: i };
  });
  const tutupY = h / 2 + 0.06 + Math.abs(Math.sin(f / 2.2)) * 0.12 * gejolak;
  const tutupRot = Math.sin(f / 1.7) * 0.08 * gejolak;
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[r, r * 0.95, h, 48, 1, true]} />
        <meshStandardMaterial color="#b9bec4" metalness={0.85} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -h / 2, 0]}>
        <cylinderGeometry args={[r * 0.95, r * 0.95, 0.04, 48]} />
        <meshStandardMaterial color="#8a8f95" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* kuah */}
      <mesh position={[0, h / 2 - 0.12 + Math.sin(f / 3) * 0.015 * gejolak, 0]}>
        <cylinderGeometry args={[r * 0.96, r * 0.96, 0.04, 48]} />
        <meshStandardMaterial color={warnaKuah} roughness={0.3} />
      </mesh>
      {gelembung.map((b) => (
        <mesh key={b.key} position={[b.x, h / 2 - 0.1, b.z]} scale={b.s}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#ffd9b8" roughness={0.2} transparent opacity={0.85} />
        </mesh>
      ))}
      {cabai
        ? [0, 1, 2].map((i) => (
            <group key={i} position={[Math.cos(i * 2.1 + f / 20) * r * 0.45, h / 2 - 0.08 + Math.sin(f / 4 + i) * 0.05 * gejolak, Math.sin(i * 2.1 + f / 20) * r * 0.45]} rotation={[Math.PI / 2, f / 25 + i, 0.2]}>
              <mesh geometry={geo}>
                <meshPhysicalMaterial color="#d8221a" roughness={0.25} clearcoat={1} />
              </mesh>
            </group>
          ))
        : null}
      {/* pegangan */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (r + 0.18), h / 2 - 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.04, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.5} />
        </mesh>
      ))}
      {/* tutup bergetar, sedikit terbuka */}
      <group position={[r * 0.3 * gejolak, tutupY, 0]} rotation={[tutupRot, 0, tutupRot + 0.12 * gejolak]}>
        <mesh>
          <cylinderGeometry args={[r * 1.02, r * 1.02, 0.05, 48]} />
          <meshStandardMaterial color="#c9ced3" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.1, 16, 8]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>
      {/* api kompor */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * r * 0.6, -h / 2 - 0.12, Math.sin(a) * r * 0.6]} scale={[0.06, 0.12 + 0.08 * gejolak + Math.sin(f / 2 + i) * 0.03, 0.06]}>
            <coneGeometry args={[1, 1.6, 8]} />
            <meshBasicMaterial color={i % 2 ? "#4aa8ff" : "#7cc4ff"} />
          </mesh>
        );
      })}
    </group>
  );
};

const Uap: React.FC<{ x: number; kuat: number }> = ({ x, kuat }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: Math.round(10 * kuat) }).map((_, i) => {
        const t = ((f + i * 9) % 70) / 70;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 80 + Math.sin(i * 1.7 + t * 4) * 70,
              top: 760 - t * 520,
              width: 160 + t * 160,
              height: 160 + t * 160,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.5)",
              filter: "blur(28px)",
              opacity: (1 - t) * 0.7 * kuat,
            }}
          />
        );
      })}
    </>
  );
};

export const AdeganPanci: React.FC = () => {
  const f = useCurrentFrame();
  const a = L(f, 20, 60, 0, 3.23);
  const b = L(f, 40, 90, 0, 5.81);
  const zoom = L(f, 0, 210, 1.0, 1.12, eIO);
  return (
    <AbsoluteFill style={{ background: "#2a2f36" }}>
      {/* dinding ubin dapur */}
      <AbsoluteFill style={{ background: "linear-gradient(#f2efe8, #d8d2c6)", backgroundImage: "linear-gradient(rgba(0,0,0,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.08) 2px, transparent 2px)", backgroundSize: "120px 120px", backgroundColor: "#ece6da" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 980, bottom: 0, background: "linear-gradient(#1c1f24, #0e1013)" }} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "62% 48%" }}>
        <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 4.6, 11.6], rotation: [-0.44, 0, 0], fov: 34 }} style={{ position: "absolute" }}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[2, 6, 5]} intensity={2.2} color="#fff1dc" />
          <pointLight position={[0, 0, 3]} intensity={8} color="#ffb070" />
          <Panci x={-1.05} r={0.7} h={0.8} f={f} gejolak={0.15} warnaKuah="#c98a4a" />
          <Panci x={1.0} r={1.0} h={1.1} f={f} gejolak={1} warnaKuah="#c2361f" cabai />
        </ThreeCanvas>
        <Uap x={360} kuat={0.25} />
        <Uap x={700} kuat={1} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 300, width: 400, textAlign: "center", fontFamily: font.utama, color: "#2a2f36" }}>
        <div style={{ fontWeight: 800, fontSize: 96, fontVariantNumeric: "tabular-nums" }}>{persen(a)}</div>
        <div style={{ fontWeight: 700, fontSize: 34 }}>inflasi umum</div>
      </div>
      <div style={{ position: "absolute", right: 40, top: 230, width: 560, textAlign: "center", fontFamily: font.utama }}>
        <div style={{ fontWeight: 800, fontSize: 150, color: "#e2342a", fontVariantNumeric: "tabular-nums", lineHeight: 1, transform: `rotate(${Math.sin(f / 2) * 1.5 * (b > 5 ? 1 : 0)}deg)` }}>{persen(b)}</div>
        <div style={{ fontWeight: 800, fontSize: 40, color: "#2a2f36", background: sorot, display: "inline-block", padding: "4px 16px", borderRadius: 10, marginTop: 8 }}>pangan bergejolak</div>
      </div>
      <div style={{ position: "absolute", left: 60, top: 1100, fontFamily: font.mono, fontSize: 24, color: "#cfd3d8" }}>Sumber: BPS & Bank Indonesia · tahunan, Oktober 2026</div>
      <Naskah mulai={14} y={1160} teks="Bahkan, menurut Bank Indonesia, kelompok pangan bergejolak masih mengalami inflasi tahunan sebesar *5,81* *persen* pada Oktober 2026." ukuran={58} />
      <Sinema vignette={0.45} />
    </AbsoluteFill>
  );
};
