// Uji gerak "Holo Dompet v2": 10 detik, satu dunia 3D, kamera terbang dari koin → meteran → kartu.
// Tujuannya menilai rasa gerak (orbit, dolly, sudut rendah, perpindahan cepat dengan blur), bukan isi final.
import React, { useLayoutEffect, useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Lingkungan, acak } from "./umum";
import {
  BayanganKontak,
  Butiran,
  H,
  Kaki,
  Kartu,
  Kepala,
  Koin2,
  Meteran,
  P,
  Pelat,
  Penggaris,
  Subtitel,
  TandaSudut,
  Tekstur,
  angkaGaya,
  useTekstur,
} from "./HoloDompet2";

export const DURASI_UJI_GERAK = 480;

// Posisi tiap "stasiun" di dunia yang sama.
const KOIN: [number, number, number] = [0, 1.1, 0];
const METER: [number, number, number] = [10, -1.6, -2];
const KARTU: [number, number, number] = [20, 0, 0];

type Kunci = { f: number; pos: [number, number, number]; lihat: [number, number, number]; fov: number; guling: number };

// Titik kunci kamera. Jalurnya spline kubik (Catmull-Rom berwaktu), jadi kamera tidak pernah berhenti
// di titik tengah: kecepatannya menyambung mulus dari satu titik ke titik berikutnya.
const KUNCI: Kunci[] = [
  { f: 0, pos: [1.4, -1.0, 4.4], lihat: [0, 1.0, 0], fov: 46, guling: -0.05 }, // sudut rendah, dekat
  { f: 75, pos: [-0.4, -0.4, 6.3], lihat: [0, 0.3, 0], fov: 42, guling: 0.01 }, // orbit kiri sambil mundur
  { f: 145, pos: [-1.8, 0.6, 8.3], lihat: [0.4, -0.2, 0], fov: 38, guling: 0.03 }, // terungkap penuh
  { f: 182, pos: [4.6, 1.8, 10.9], lihat: [8.6, -0.2, -1.8], fov: 40, guling: -0.03 }, // melayang ke meteran
  { f: 218, pos: [9.4, 1.3, 12.0], lihat: [10, -0.1, -2], fov: 38, guling: 0 },
  { f: 312, pos: [10.9, 0.3, 10.4], lihat: [10, -0.1, -2], fov: 36, guling: 0.02 }, // dorong masuk pelan
  { f: 348, pos: [14.6, 2.8, 10.6], lihat: [18.6, 0.6, -0.4], fov: 39, guling: 0.04 }, // melayang ke kartu
  { f: 384, pos: [18.2, 2.6, 8.8], lihat: [20, 0.8, 0], fov: 38, guling: 0.03 },
  { f: 480, pos: [22.6, -0.1, 8.8], lihat: [20, 0.8, 0], fov: 33, guling: -0.04 }, // orbit kanan + zoom
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Hermite kubik dengan tangen Catmull-Rom berwaktu (C1: posisi dan kecepatan menyambung). */
const spline = (f: number, ambil: (k: Kunci) => number) => {
  const n = KUNCI.length;
  if (f <= KUNCI[0].f) return ambil(KUNCI[0]);
  if (f >= KUNCI[n - 1].f) return ambil(KUNCI[n - 1]);
  let i = 0;
  while (f >= KUNCI[i + 1].f) i++;
  const tangen = (j: number) => {
    if (j === 0 || j === n - 1) return 0; // mulai dan berhenti lembut
    return (ambil(KUNCI[j + 1]) - ambil(KUNCI[j - 1])) / (KUNCI[j + 1].f - KUNCI[j - 1].f);
  };
  const t0 = KUNCI[i].f;
  const t1 = KUNCI[i + 1].f;
  const h = t1 - t0;
  const t = (f - t0) / h;
  const p0 = ambil(KUNCI[i]);
  const p1 = ambil(KUNCI[i + 1]);
  const m0 = tangen(i) * h;
  const m1 = tangen(i + 1) * h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1;
};

const kameraPada = (f: number) => ({
  pos: [0, 1, 2].map((k) => spline(f, (q) => q.pos[k])) as [number, number, number],
  lihat: [0, 1, 2].map((k) => spline(f, (q) => q.lihat[k])) as [number, number, number],
  fov: spline(f, (q) => q.fov),
  guling: spline(f, (q) => q.guling),
});

const Kamera: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const k = kameraPada(f);
  // goyang tangan halus supaya tidak terasa seperti kamera komputer
  const goyang = [Math.sin(f / 37) * 0.012, Math.sin(f / 49 + 1) * 0.01, 0];
  useLayoutEffect(() => {
    camera.position.set(k.pos[0] + goyang[0], k.pos[1] + goyang[1], k.pos[2]);
    camera.up.set(0, 1, 0);
    camera.lookAt(...k.lihat);
    camera.rotateZ(k.guling);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = k.fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
};

/** Debu melayang yang menangkap cahaya: memberi kedalaman dan parallax. */
const Debu: React.FC<{ f: number }> = ({ f }) => {
  const geo = useMemo(() => {
    const n = 420;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = -6 + acak(i) * 34;
      pos[i * 3 + 1] = -2 + acak(i + 100) * 6;
      pos[i * 3 + 2] = -6 + acak(i + 200) * 13;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  return (
    <points geometry={geo} position={[Math.sin(f / 90) * 0.2, f * 0.0025, 0]}>
      <pointsMaterial color="#f6dcae" size={0.035} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
};

/** Lantai panjang yang menutupi ketiga stasiun. */
const LantaiPanjang: React.FC<{ tx: Tekstur }> = ({ tx }) => (
  <group position={[10, -2.2, 0]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[240, 240]} />
      <meshPhongMaterial color="#080c18" specular="#1b2440" shininess={18} specularMap={tx.sikatGelap} />
    </mesh>
    {Array.from({ length: 31 }).map((_, i) => (
      <mesh key={`x${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[(i - 15) * 1.2, 0.002, -2]}>
        <planeGeometry args={[0.008, 22]} />
        <meshBasicMaterial color={P.struktur} transparent opacity={0.16} />
      </mesh>
    ))}
    {Array.from({ length: 11 }).map((_, i) => (
      <mesh key={`z${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 5 - i * 1.2]}>
        <planeGeometry args={[40, 0.008]} />
        <meshBasicMaterial color={P.struktur} transparent opacity={0.18 - i * 0.012} />
      </mesh>
    ))}
  </group>
);

/** Cahaya kunci hangat + target-nya, digeser mengikuti stasiun supaya bayangan selalu tajam di dekat objek. */
const CahayaKunci: React.FC<{ x: number }> = ({ x }) => {
  const { cahaya, target } = useMemo(() => {
    const c = new THREE.DirectionalLight("#FFD9A0", 2.6);
    c.castShadow = true;
    c.shadow.mapSize.set(2048, 2048);
    c.shadow.bias = -0.0004;
    const cam = c.shadow.camera as THREE.OrthographicCamera;
    cam.left = -7;
    cam.right = 7;
    cam.top = 7;
    cam.bottom = -7;
    const t = new THREE.Object3D();
    c.target = t;
    return { cahaya: c, target: t };
  }, []);
  cahaya.position.set(x - 3.5, 6, 4);
  target.position.set(x, -2, 0);
  target.updateMatrixWorld();
  return (
    <>
      <primitive object={cahaya} />
      <primitive object={target} />
    </>
  );
};

const muncul = (f: number, a: number, lama = 10) => interpolate(f, [a, a + lama], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
const hilang = (f: number, a: number, lama = 8) => interpolate(f, [a, a + lama], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });

export const HoloUjiGerak: React.FC = () => {
  const f = useCurrentFrame();
  const tx = useTekstur();
  // koin jatuh berputar lalu melayang
  const jatuh = interpolate(f, [0, 48], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.15)) });
  const koinY = lerp(3.6, KOIN[1], jatuh) + Math.sin(f / 14) * 0.05;
  const koinPutarX = lerp(Math.PI * 2, 0.12, jatuh);
  const isiMeter = interpolate(f, [222, 296], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  // geser teks searah perpindahan kamera supaya teks terasa "menempel" di dunia
  const geserTeks = (mulai: number, akhir: number) => interpolate(f, [mulai, akhir], [0, -420], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });

  return (
    <AbsoluteFill style={{ background: P.tinta }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 28% 22%, rgba(242,179,61,0.10), transparent 70%), radial-gradient(70% 45% at 70% 85%, rgba(42,74,154,0.28), transparent 70%), linear-gradient(180deg, ${P.dalam}, ${P.tinta})` }} />

<AbsoluteFill>
        <ThreeCanvas
          width={1080}
          height={1920}
          shadows
          camera={{ position: [0, 0, 8], fov: 40 }}
          gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, alpha: true }}
        >
          <Kamera f={f} />
          <Lingkungan kuat={0.55} />
          <color attach="background" args={["#090c16"]} />
          <fog attach="fog" args={["#090c16", 9, 30]} />
          <ambientLight intensity={0.12} color="#8ea2d8" />
          {/* kunci hangat mengikuti stasiun yang aktif supaya bayangan selalu jatuh di dekat objek */}
          <CahayaKunci x={kameraPada(f).lihat[0]} />
          <directionalLight position={[kameraPada(f).lihat[0] + 3, 2.5, -5]} intensity={2.2} color="#6E8BFF" />
          <pointLight position={[kameraPada(f).lihat[0], 0.5, 4]} intensity={3} color={P.amber} distance={8} />
          <LantaiPanjang tx={tx} />
          <Debu f={f} />

          {/* stasiun 1: koin */}
          <group position={[KOIN[0], koinY, KOIN[2]]} rotation={[koinPutarX, -0.42 + 0.35 * Math.sin(f / 22), 0.05]} scale={0.82}>
            <Koin2 tx={tx} />
          </group>
          <BayanganKontak tx={tx} x={KOIN[0]} s={lerp(1.2, 3.2, jatuh)} o={lerp(0.25, 0.75, jatuh)} />
          {/* koin-koin kecil di latar untuk kedalaman */}
          {[
            [-2.6, -1.4, -2.5, 0.35],
            [2.8, -0.9, -3.5, 0.3],
            [4.8, 0.2, -5, 0.28],
          ].map(([x, y, z, s], i) => (
            <group key={i} position={[x, y + Math.sin(f / 18 + i) * 0.08, z]} rotation={[0.4 + i, f * 0.02 + i, 0.3]} scale={s}>
              <Koin2 tx={tx} warna={i === 1 ? "#B9C0CC" : P.amber} />
            </group>
          ))}

          {/* stasiun 2: meteran */}
          <group position={METER}>
            <Meteran tx={tx} isi={isiMeter} f={f} />
          </group>

          {/* stasiun 3: kartu */}
          <group position={[KARTU[0], KARTU[1] + Math.sin(f / 16) * 0.06, KARTU[2]]} rotation={[-0.5, -0.3 + f * 0.003, 0.14]} scale={0.85}>
            <Kartu tx={tx} />
          </group>
          <BayanganKontak tx={tx} x={KARTU[0]} s={4.2} o={0.6} />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
      <TandaSudut />
      <Penggaris f={f} />

      {/* ---------- teks per stasiun ---------- */}
      {f < 190 ? (
        <AbsoluteFill style={{ opacity: hilang(f, 156, 28), transform: `translateX(${geserTeks(150, 188)}px)` }}>
          <Kepala bab={1} judul="DEPOSITO · CONTOH" />
          <div style={{ position: "absolute", top: 1130, width: "100%", textAlign: "center", ...angkaGaya, fontSize: 300, lineHeight: 0.9, transform: `scale(${interpolate(f, [0, 18], [1.12, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })})` }}>
            6<span style={{ fontSize: 170, verticalAlign: "top", marginLeft: 8 }}>%</span>
          </div>
          <div style={{ position: "absolute", top: 1400, width: "100%", textAlign: "center", fontFamily: H.serif, fontStyle: "italic", fontSize: 108, color: P.amber, opacity: muncul(f, 40, 16), transform: `translateY(${(1 - muncul(f, 40, 18)) * 18}px)`, textShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
            aman nggak?
          </div>
          <Kaki sumber="BUNGA CONTOH, BUKAN DATA BANK TERTENTU" />
        </AbsoluteFill>
      ) : null}

      {f >= 190 && f < 352 ? (
        <AbsoluteFill style={{ opacity: hilang(f, 318, 28) * muncul(f, 196, 20), transform: `translateX(${geserTeks(314, 350) + (1 - muncul(f, 196, 24)) * 300}px)` }}>
          <Kepala bab={2} judul="BATAS PENJAMINAN" />
          <Pelat x={110} y={250} w={860} kode="LPS-01" label="TINGKAT BUNGA PENJAMINAN" muncul={muncul(f, 210, 18)}>
            <div style={{ ...angkaGaya, fontSize: 176, lineHeight: 1 }}>3,75%</div>
            <div style={{ fontFamily: H.mono, fontSize: 22, letterSpacing: "0.08em", color: P.abu, marginTop: 10 }}>RUPIAH · BANK UMUM · 01.10.2026 – 31.01.2027</div>
          </Pelat>
          <div style={{ position: "absolute", right: 130, top: 1170, fontFamily: H.mono, fontSize: 26, color: P.merah, letterSpacing: "0.1em", opacity: muncul(f, 280, 16) }}>6% → TIDAK DIJAMIN</div>
          <Subtitel teks="Di atas 3,75%, seluruh simpananmu nggak dijamin." />
          <Kaki sumber="SUMBER: LPS · DIAKSES 09.11.2026" />
        </AbsoluteFill>
      ) : null}

      {f >= 352 ? (
        <AbsoluteFill style={{ opacity: muncul(f, 356, 22), transform: `translateX(${(1 - muncul(f, 356, 26)) * 300}px)` }}>
          <Kepala bab={3} judul="NILAI MAKSIMAL" />
          <Pelat x={110} y={250} w={600} kode="LPS-02" label="JAMINAN MAKSIMAL" muncul={muncul(f, 378, 18)}>
            <div style={{ ...angkaGaya, fontSize: 128, lineHeight: 1 }}>
              Rp2<span style={{ fontSize: 64, letterSpacing: "-0.01em", marginLeft: 14 }}>miliar</span>
            </div>
            <div style={{ fontFamily: H.mono, fontSize: 22, letterSpacing: "0.08em", color: P.abu, marginTop: 10 }}>PER NASABAH · PER BANK</div>
          </Pelat>
          <Subtitel teks="Ingat, jaminannya maksimal Rp2 miliar per nasabah per bank." />
          <Kaki sumber="SUMBER: LPS · DIAKSES 09.11.2026" />
        </AbsoluteFill>
      ) : null}

      <Butiran f={f} />
    </AbsoluteFill>
  );
};
