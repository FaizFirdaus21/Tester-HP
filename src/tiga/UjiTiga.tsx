import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame } from "remotion";
import { Cabai3D } from "./Cabai3D";

export const UjiTiga: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 1, 7], fov: 35 }} shadows style={{ background: "#2a1410" }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={2.4} castShadow />
      <pointLight position={[-3, 1, 2]} intensity={10} color="#ffb070" />
      <Cabai3D rotasi={[0.3, f * 0.05, -0.4]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#6b4428" roughness={0.9} />
      </mesh>
    </ThreeCanvas>
  );
};
