import React, { useMemo } from "react";
import * as THREE from "three";

// Cabai merah 3D: profil lathe (pangkal tebal, meruncing), lalu dibengkokkan.
export const geometriCabai = (panjang = 3, lengkung = 0.5) => {
  const pts: THREE.Vector2[] = [];
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const r = 0.26 * Math.pow(Math.min(1, t * 7), 0.5) * Math.pow(1 - t, 0.7) + (t < 1 ? 0.004 : 0);
    pts.push(new THREE.Vector2(r, -t * panjang));
  }
  const g = new THREE.LatheGeometry(pts, 48);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = -y / panjang;
    pos.setX(i, pos.getX(i) + lengkung * Math.pow(t, 2.2) * panjang * 0.35);
    // sedikit kerutan permukaan
    const a = Math.atan2(pos.getZ(i), pos.getX(i));
    const k = 1 + 0.03 * Math.sin(a * 5 + t * 6);
    pos.setZ(i, pos.getZ(i) * k);
  }
  g.computeVertexNormals();
  return g;
};

export const Cabai3D: React.FC<{ posisi?: [number, number, number]; rotasi?: [number, number, number]; skala?: number; warna?: string }> = ({
  posisi = [0, 0, 0],
  rotasi = [0, 0, 0],
  skala = 1,
  warna = "#d21f1b",
}) => {
  const geo = useMemo(() => geometriCabai(), []);
  return (
    <group position={posisi} rotation={rotasi} scale={skala}>
      <group position={[0, 1.5, 0]}>
        <mesh geometry={geo} castShadow receiveShadow>
          <meshPhysicalMaterial color={warna} roughness={0.25} clearcoat={0.9} clearcoatRoughness={0.15} sheen={0.2} />
        </mesh>
        {/* kelopak dan tangkai */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.2, 0.12, 24]} />
          <meshStandardMaterial color="#3f7d2b" roughness={0.6} />
        </mesh>
        <mesh position={[-0.08, 0.32, 0]} rotation={[0, 0, 0.5]} castShadow>
          <cylinderGeometry args={[0.045, 0.06, 0.6, 12]} />
          <meshStandardMaterial color="#4f8a35" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
