// Arah B: "Kota Uang". Kota 3D low-poly, kamera terbang, gedung = grafik.
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { F, Kamera, Lingkungan, acak, masuk, useAdegan } from "./umum";

const C = { langit1: "#0b1030", langit2: "#3b1d4f", senja: "#ff8a5c", putih: "#f4f1ff", kuning: "#ffd23f", merah: "#ff4d5e", tosca: "#3ee6c4", redup: "#9a93c9" };

const teksturJendela = () => {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#1a1f3d";
  g.fillRect(0, 0, 64, 128);
  for (let y = 4; y < 128; y += 10) {
    for (let x = 4; x < 64; x += 12) {
      const nyala = acak(x * 31 + y) > 0.45;
      g.fillStyle = nyala ? (acak(x + y * 7) > 0.8 ? "#ffd27a" : "#ffeccc") : "#2a3058";
      g.fillRect(x, y, 7, 5);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};

type Gedung = { x: number; z: number; w: number; d: number; h: number; i: number };

const Kota: React.FC<{ runtuh?: number; sorot?: boolean }> = ({ runtuh = 0, sorot = false }) => {
  const tex = useMemo(teksturJendela, []);
  const gedung: Gedung[] = useMemo(() => {
    const g: Gedung[] = [];
    let i = 0;
    for (let gx = -6; gx <= 6; gx++) {
      for (let gz = -10; gz <= 3; gz++) {
        if (Math.abs(gx) < 1) continue; // jalan utama
        const h = 0.6 + Math.pow(acak(i * 3), 2) * 4.5 * (1 - Math.abs(gz) / 16);
        g.push({ x: gx * 1.25, z: gz * 1.25, w: 0.8 + acak(i) * 0.25, d: 0.8 + acak(i + 9) * 0.25, h, i });
        i++;
      }
    }
    return g;
  }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0d1028" roughness={0.9} />
      </mesh>
      {/* garis jalan menyala */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -4]}>
        <planeGeometry args={[0.08, 40]} />
        <meshBasicMaterial color={C.tosca} />
      </mesh>
      {gedung.map((b) => {
        const kena = runtuh > 0 && b.i % 9 === 0 && b.i < 14 * 9;
        const miring = kena ? runtuh * (0.6 + acak(b.i) * 0.6) : 0;
        const turun = kena ? runtuh * b.h * 0.35 : 0;
        return (
          <mesh key={b.i} position={[b.x, b.h / 2 - turun, b.z]} rotation={[miring * (acak(b.i + 2) - 0.5), 0, miring * (acak(b.i + 4) > 0.5 ? 1 : -1)]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            {kena ? (
              <meshStandardMaterial color="#3a1020" emissive={C.merah} emissiveIntensity={1.2} roughness={0.6} />
            ) : (
              <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.55} color="#8c90c0" roughness={0.6} metalness={0.2} />
            )}
          </mesh>
        );
      })}
      {sorot ? (
        // menara "6%" yang menyala di ujung jalan
        <group position={[0, 0, -5]}>
          <mesh position={[0, 3.2, 0]}>
            <boxGeometry args={[1.3, 6.4, 1.3]} />
            <meshStandardMaterial color="#2a2140" emissive={C.kuning} emissiveIntensity={0.35} metalness={0.6} roughness={0.25} />
          </mesh>
          <mesh position={[0, 6.6, 0]}>
            <coneGeometry args={[0.5, 1.2, 4]} />
            <meshStandardMaterial color={C.kuning} emissive={C.kuning} emissiveIntensity={1.2} />
          </mesh>
          <pointLight position={[0, 7.5, 1]} intensity={40} color={C.kuning} />
        </group>
      ) : null}
    </group>
  );
};

const Subtitel: React.FC<{ teks: string }> = ({ teks }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top: 1340, textAlign: "center", fontFamily: F.sans, fontWeight: 700, fontSize: 46, lineHeight: 1.25, color: C.putih, textShadow: "0 2px 18px #000" }}>{teks}</div>
);

const Tag: React.FC<{ x: number; y: number; teks: string; warna: string; muncul: number }> = ({ x, y, teks, warna, muncul }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: muncul, transform: `scale(${0.8 + 0.2 * muncul})`, transformOrigin: "left bottom" }}>
    <div style={{ background: warna, color: "#0b1030", fontFamily: F.kondens, fontWeight: 700, fontSize: 56, padding: "6px 22px", borderRadius: 12 }}>{teks}</div>
    <div style={{ width: 4, height: 90, background: warna, marginLeft: 24 }} />
  </div>
);

export const KotaUang: React.FC = () => {
  const { f, adegan, t } = useAdegan();
  const m = masuk(t, 4, 12);
  const kamera: { pos: [number, number, number]; lihat: [number, number, number]; fov: number } =
    adegan === 0
      ? { pos: [0, 1.0 + t * 0.01, 9 - t * 0.06], lihat: [0, 3.5, -5], fov: 50 }
      : adegan === 1
        ? { pos: [9 - t * 0.05, 9, 9], lihat: [0, 0, -3], fov: 40 }
        : adegan === 2
          ? { pos: [10 - t * 0.04, 13, 10], lihat: [0, 0, -4], fov: 42 }
          : { pos: [0, 6 + t * 0.05, 14], lihat: [0, 2, -6], fov: 50 };
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.langit1} 0%, ${C.langit2} 55%, ${C.senja} 100%)` }}>
      <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 2, 10], fov: 45 }} gl={{ toneMapping: THREE.ACESFilmicToneMapping, alpha: true }}>
        <Lingkungan kuat={0.4} />
        <fog attach="fog" args={["#2a1840", 10, 38]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[-6, 10, 4]} intensity={1.3} color="#c8b8ff" />
        <pointLight position={[0, 2, 2]} intensity={20} color={C.tosca} />
        <Kamera {...kamera} />
        <Kota runtuh={adegan === 2 ? masuk(t, 2, 22) : 0} sorot={adegan === 0} />
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,8,30,0.75) 0%, transparent 30%, transparent 62%, rgba(8,8,30,0.85) 78%, rgba(8,8,30,0.85) 100%)" }} />
      <div style={{ position: "absolute", left: 60, top: 120, fontFamily: F.mono, fontSize: 26, letterSpacing: "0.18em", color: C.redup }}>KOTA UANG · 0{adegan + 1}</div>
      {adegan === 0 ? (
        <>
          <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: F.display, fontSize: 210, color: C.kuning, textShadow: "0 0 40px #ffd23f88", opacity: masuk(t, 0, 6) }}>6%</div>
          <div style={{ position: "absolute", top: 450, width: "100%", textAlign: "center", fontFamily: F.kondens, fontWeight: 700, fontSize: 88, color: C.putih, opacity: m }}>DEPOSITO INI AMAN?</div>
        </>
      ) : null}
      {adegan === 1 ? (
        <>
          <Tag x={150} y={520} teks="≤ 3,75% DIJAMIN" warna={C.tosca} muncul={m} />
          <Tag x={600} y={760} teks="6% ✕" warna={C.merah} muncul={masuk(t, 10, 10)} />
          <Subtitel teks="LPS cuma menjamin bunga sampai 3,75%." />
        </>
      ) : null}
      {adegan === 2 ? (
        <>
          <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: F.display, fontSize: 260, color: C.merah, textShadow: "0 0 40px #ff4d5e88" }}>14</div>
          <div style={{ position: "absolute", top: 520, width: "100%", textAlign: "center", fontFamily: F.kondens, fontWeight: 700, fontSize: 64, color: C.putih }}>BPR & BPRS DILIKUIDASI · 2026</div>
          <div style={{ position: "absolute", top: 600, width: "100%", textAlign: "center", fontFamily: F.mono, fontSize: 24, color: C.redup }}>sumber: KSSK, 3 Nov 2026</div>
          <Subtitel teks="Hingga Oktober, 14 BPR dan BPRS sudah dilikuidasi." />
        </>
      ) : null}
      {adegan === 3 ? (
        <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", opacity: m }}>
          <div style={{ fontFamily: F.display, fontSize: 88, color: C.putih, lineHeight: 1.05 }}>Bunga tinggi boleh,</div>
          <div style={{ fontFamily: F.display, fontSize: 88, color: C.kuning, lineHeight: 1.05 }}>asal tahu risikonya.</div>
          <div style={{ marginTop: 40, fontFamily: F.mono, fontSize: 26, letterSpacing: "0.18em", color: C.tosca }}>INTIPDOMPET · URUSAN UANG, KITA INTIP</div>
          <div style={{ marginTop: 14, fontFamily: F.sans, fontSize: 28, color: C.redup }}>Konten edukasi, bukan ajakan membeli.</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
