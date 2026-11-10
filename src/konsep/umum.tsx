// Bahan bersama untuk contoh frame arah template baru (futuristik + 3D).
// Bukan template final: tiap komposisi berisi 4 adegan, 30 frame per adegan.
import React, { useLayoutEffect, useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "Archivo", url: staticFile("fonts/Archivo-800.woff2"), weight: "800" });
loadFont({ family: "Plus Jakarta Sans", url: staticFile("fonts/PlusJakartaSans-Variable.woff2"), weight: "200 800" });
loadFont({ family: "JetBrains Mono", url: staticFile("fonts/JetBrainsMono-Variable.woff2"), weight: "100 800" });
loadFont({ family: "Barlow Condensed", url: staticFile("fonts/BarlowCondensed-600.woff2"), weight: "600" });
loadFont({ family: "Barlow Condensed", url: staticFile("fonts/BarlowCondensed-700.woff2"), weight: "700" });

export const F = {
  display: '"Archivo", sans-serif',
  sans: '"Plus Jakarta Sans", sans-serif',
  mono: '"JetBrains Mono", monospace',
  kondens: '"Barlow Condensed", sans-serif',
};

export const PER_ADEGAN = 30;
export const DURASI_KONSEP = PER_ADEGAN * 4;

/** Nomor adegan (0–3) dan frame lokal di dalam adegan. */
export const useAdegan = () => {
  const f = useCurrentFrame();
  return { f, adegan: Math.min(3, Math.floor(f / PER_ADEGAN)), t: f % PER_ADEGAN };
};

export const masuk = (t: number, mulai = 0, lama = 12) => {
  const x = Math.min(1, Math.max(0, (t - mulai) / lama));
  return 1 - Math.pow(1 - x, 3);
};

/** Lingkungan pantul prosedural supaya bahan chrome/kaca terlihat (tanpa HDRI dari internet). */
export const Lingkungan: React.FC<{ kuat?: number }> = ({ kuat = 1 }) => {
  const { gl, scene } = useThree();
  const env = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const t = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    return t;
  }, [gl]);
  useLayoutEffect(() => {
    scene.environment = env;
    scene.environmentIntensity = kuat;
  }, [env, scene, kuat]);
  return null;
};

/** Kamera yang posisinya diatur tiap frame. */
export const Kamera: React.FC<{ pos: [number, number, number]; lihat: [number, number, number]; fov?: number }> = ({ pos, lihat, fov }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(...pos);
    camera.lookAt(...lihat);
    if (fov && camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
};

/** Koin: badan silinder + bibir torus + muka timbul. */
export const Koin: React.FC<{ warna?: string; logam?: number; kasar?: number; emisi?: string }> = ({ warna = "#e8b021", logam = 1, kasar = 0.18, emisi = "#000000" }) => (
  <group>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[1, 1, 0.16, 96]} />
      <meshStandardMaterial color={warna} metalness={logam} roughness={kasar} emissive={emisi} />
    </mesh>
    {[0.085, -0.085].map((z) => (
      <mesh key={z} position={[0, 0, z]}>
        <torusGeometry args={[0.98, 0.045, 16, 96]} />
        <meshStandardMaterial color={warna} metalness={logam} roughness={kasar * 0.7} />
      </mesh>
    ))}
    {[0.09, -0.09].map((z) => (
      <mesh key={`r${z}`} position={[0, 0, z]}>
        <torusGeometry args={[0.72, 0.03, 12, 96]} />
        <meshStandardMaterial color={warna} metalness={logam} roughness={kasar * 0.7} />
      </mesh>
    ))}
  </group>
);

/** Pola acak deterministik. */
export const acak = (i: number) => {
  const x = Math.sin((i + 1) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
