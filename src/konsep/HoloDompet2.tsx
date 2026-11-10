// Arah A v2: "Holo Dompet" yang diperhalus.
// Ide gaya: panel instrumen malam. Bukan cyan-neon generik, tapi amber koin di atas tinta biru-hitam,
// teks putih hangat, bayangan nyata di lantai, tekstur logam, butiran film, dan tanda HUD kecil.
import React, { useMemo } from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { loadFont } from "@remotion/fonts";
import * as THREE from "three";
import { Kamera, Lingkungan, acak, masuk, useAdegan } from "./umum";

loadFont({ family: "Bricolage Grotesque", url: staticFile("fonts/BricolageGrotesque-Variable.woff2"), weight: "200 800" });
loadFont({ family: "Instrument Serif", url: staticFile("fonts/InstrumentSerif-Italic.woff2"), style: "italic", weight: "400" });
loadFont({ family: "IBM Plex Mono", url: staticFile("fonts/IBMPlexMono-400.woff2"), weight: "400" });
loadFont({ family: "IBM Plex Mono", url: staticFile("fonts/IBMPlexMono-500.woff2"), weight: "500" });

export const P = {
  tinta: "#07090F",
  dalam: "#0C1220",
  panel: "#111A2E",
  struktur: "#2A4A9A",
  amber: "#F2B33D",
  amberRedup: "#8A6420",
  kertas: "#ECE7DA",
  abu: "#7A8499",
  abuGelap: "#3A4256",
  merah: "#E5484D",
  hijau: "#4CC38A",
};

const H = {
  angka: '"Bricolage Grotesque", sans-serif',
  serif: '"Instrument Serif", serif',
  mono: '"IBM Plex Mono", monospace',
};

// ---------- tekstur prosedural (dibuat sekali di browser) ----------
const kanvas = (w: number, h: number, gambar: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  gambar(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  return t;
};

/** Muka koin: garis bubut melingkar, tulisan keliling, "Rp" timbul. Dipakai sebagai bump + roughness. */
const teksturMukaKoin = () =>
  kanvas(1024, 1024, (g) => {
    g.fillStyle = "#808080";
    g.fillRect(0, 0, 1024, 1024);
    for (let r = 10; r < 512; r += 3) {
      g.strokeStyle = `rgba(${acak(r) > 0.5 ? 255 : 0},${acak(r) > 0.5 ? 255 : 0},${acak(r) > 0.5 ? 255 : 0},${0.04 + acak(r + 1) * 0.06})`;
      g.beginPath();
      g.arc(512, 512, r, 0, Math.PI * 2);
      g.stroke();
    }
    g.lineWidth = 10;
    g.strokeStyle = "#e6e6e6";
    g.beginPath();
    g.arc(512, 512, 440, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = "#e6e6e6";
    g.font = "600 46px monospace";
    g.textAlign = "center";
    const teks = "INTIP DOMPET · URUSAN UANG · KITA INTIP · ";
    for (let i = 0; i < teks.length; i++) {
      const a = (i / teks.length) * Math.PI * 2 - Math.PI / 2;
      g.save();
      g.translate(512 + Math.cos(a) * 385, 512 + Math.sin(a) * 385);
      g.rotate(a + Math.PI / 2);
      g.fillText(teks[i], 0, 0);
      g.restore();
    }
    g.font = "800 300px sans-serif";
    g.textBaseline = "middle";
    g.fillText("Rp", 512, 530);
  });

/** Sisi koin bergerigi. */
const teksturGerigi = () =>
  kanvas(1024, 32, (g) => {
    for (let x = 0; x < 1024; x += 8) {
      g.fillStyle = "#ffffff";
      g.fillRect(x, 0, 4, 32);
      g.fillStyle = "#202020";
      g.fillRect(x + 4, 0, 4, 32);
    }
  });

/** Logam disikat (kartu, pelat meteran). */
const teksturSikat = (gelap = false) =>
  kanvas(1024, 512, (g) => {
    g.fillStyle = gelap ? "#4a4a4a" : "#808080";
    g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 2600; i++) {
      const y = acak(i) * 512;
      const v = Math.floor(90 + acak(i + 7) * 90);
      g.strokeStyle = `rgba(${v},${v},${v},0.18)`;
      g.beginPath();
      g.moveTo(acak(i + 3) * 1024 - 200, y);
      g.lineTo(acak(i + 3) * 1024 + 300 + acak(i + 5) * 400, y + (acak(i + 9) - 0.5) * 2);
      g.stroke();
    }
  });

/** Bayangan kontak lembut di bawah objek. */
const teksturBayangan = () =>
  kanvas(256, 256, (g) => {
    const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, "rgba(0,0,0,0.75)");
    r.addColorStop(0.5, "rgba(0,0,0,0.3)");
    r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
  });

/** Muka kartu: nama, nomor, logo nirsentuh. */
const teksturMukaKartu = () =>
  kanvas(1600, 1000, (g) => {
    g.fillStyle = "rgba(0,0,0,0)";
    g.clearRect(0, 0, 1600, 1000);
    g.fillStyle = "rgba(236,231,218,0.85)";
    g.font = "500 64px monospace";
    g.fillText("4026  ••••  ••••  0375", 110, 690);
    g.font = "500 40px monospace";
    g.fillStyle = "rgba(236,231,218,0.55)";
    g.fillText("NASABAH CONTOH", 110, 840);
    g.fillText("11/27", 1250, 840);
    g.font = "800 72px sans-serif";
    g.fillStyle = "rgba(242,179,61,0.95)";
    g.fillText("intip", 110, 170);
    g.fillStyle = "rgba(236,231,218,0.9)";
    g.fillText("dompet", 285, 170);
    g.strokeStyle = "rgba(236,231,218,0.6)";
    g.lineWidth = 8;
    for (let i = 0; i < 3; i++) {
      g.beginPath();
      g.arc(1380, 160, 30 + i * 26, -0.7, 0.7);
      g.stroke();
    }
  });

const useTekstur = () =>
  useMemo(
    () => ({
      muka: (() => {
        const t = teksturMukaKoin();
        t.center.set(0.5, 0.5);
        t.rotation = -Math.PI / 2;
        t.wrapS = THREE.RepeatWrapping;
        t.repeat.set(-1, 1);
        t.flipY = false;
        return t;
      })(),
      gerigi: (() => {
        const t = teksturGerigi();
        t.wrapS = THREE.RepeatWrapping;
        t.repeat.set(4, 1);
        return t;
      })(),
      sikat: teksturSikat(),
      sikatGelap: teksturSikat(true),
      bayangan: teksturBayangan(),
      kartu: teksturMukaKartu(),
    }),
    [],
  );
type Tekstur = ReturnType<typeof useTekstur>;

// ---------- objek 3D ----------
const Koin2: React.FC<{ tx: Tekstur; warna?: string }> = ({ tx, warna = P.amber }) => {
  const sisi = <meshStandardMaterial attach="material-0" color={warna} metalness={1} roughness={0.32} bumpMap={tx.gerigi} bumpScale={1.2} />;
  const muka = (i: number) => (
    <meshStandardMaterial attach={`material-${i}`} color={warna} metalness={1} roughness={0.28} roughnessMap={tx.muka} bumpMap={tx.muka} bumpScale={2.2} />
  );
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[1, 1, 0.14, 128]} />
      {sisi}
      {muka(1)}
      {muka(2)}
    </mesh>
  );
};

const BayanganKontak: React.FC<{ tx: Tekstur; x?: number; z?: number; s: number; o?: number }> = ({ tx, x = 0, z = 0, s, o = 0.8 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, -2.19, z]}>
    <planeGeometry args={[s, s]} />
    <meshBasicMaterial map={tx.bayangan} transparent opacity={o} depthWrite={false} />
  </mesh>
);

const Lantai: React.FC<{ tx: Tekstur }> = ({ tx }) => (
  <group position={[0, -2.2, 0]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshPhongMaterial color="#080c18" specular="#1b2440" shininess={18} specularMap={tx.sikatGelap} />
    </mesh>
    {/* garis grid tipis, hanya dekat kamera */}
    {Array.from({ length: 13 }).map((_, i) => (
      <mesh key={`x${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[(i - 6) * 1.2, 0.002, 0]}>
        <planeGeometry args={[0.008, 18]} />
        <meshBasicMaterial color={P.struktur} transparent opacity={0.22 - Math.abs(i - 6) * 0.03} />
      </mesh>
    ))}
    {Array.from({ length: 9 }).map((_, i) => (
      <mesh key={`z${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 4 - i * 1.2]}>
        <planeGeometry args={[18, 0.008]} />
        <meshBasicMaterial color={P.struktur} transparent opacity={0.2 - i * 0.02} />
      </mesh>
    ))}
  </group>
);

/** Meteran bergaya instrumen: segmen-segmen kecil, bukan busur polos. */
const Meteran: React.FC<{ tx: Tekstur; isi: number; f: number }> = ({ tx, isi, f }) => {
  const N = 48;
  const nilaiJarum = 6 * isi;
  const sudut = (p: number) => Math.PI * (1 - p / 6);
  return (
    <group rotation={[-0.12, Math.sin(f / 40) * 0.08, 0]}>
      {/* pelat */}
      <mesh position={[0, 0.9, -0.02]} receiveShadow>
        <circleGeometry args={[2.45, 96, 0, Math.PI]} />
        <meshLambertMaterial color="#0e1628" />
      </mesh>
      <group position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {Array.from({ length: N + 1 }).map((_, i) => {
          const p = (i / N) * 6;
          const a = sudut(p);
          const panjang = i % 8 === 0 ? 0.42 : 0.24;
          const aman = p <= 3.75;
          const menyala = p <= nilaiJarum + 0.001;
          const warna = aman ? P.amber : P.merah;
          return (
            <mesh key={i} position={[Math.cos(a) * 2.05, 0.04, -Math.sin(a) * 2.05]} rotation={[0, a, 0]}>
              <boxGeometry args={[panjang, 0.05, 0.05]} />
              <meshStandardMaterial color={menyala ? warna : P.abuGelap} emissive={menyala ? warna : "#000000"} emissiveIntensity={menyala ? 1.4 : 0} />
            </mesh>
          );
        })}
        {/* jarum, melempar bayangan ke pelat */}
        <group rotation={[0, sudut(nilaiJarum), 0]} position={[0, 0.16, 0]}>
          <mesh position={[0.95, 0, 0]} castShadow>
            <boxGeometry args={[1.9, 0.05, 0.07]} />
            <meshStandardMaterial color={P.kertas} metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.22, 0.16, 48]} />
          <meshStandardMaterial color="#c9ccd2" metalness={1} roughness={0.2} roughnessMap={tx.muka} />
        </mesh>
      </group>
    </group>
  );
};

const Kartu: React.FC<{ tx: Tekstur }> = ({ tx }) => (
  <group>
    <mesh castShadow>
      <boxGeometry args={[3.2, 2.0, 0.05]} />
      <meshStandardMaterial color="#20283c" metalness={0.9} roughness={0.36} roughnessMap={tx.sikat} />
    </mesh>
    <mesh position={[0, 0, 0.0265]}>
      <planeGeometry args={[3.2, 2.0]} />
      <meshStandardMaterial map={tx.kartu} transparent metalness={0.2} roughness={0.5} />
    </mesh>
    <mesh position={[-1.02, 0.18, 0.03]} castShadow>
      <boxGeometry args={[0.46, 0.36, 0.012]} />
      <meshStandardMaterial color={P.amber} metalness={1} roughness={0.25} bumpMap={tx.gerigi} bumpScale={0.6} />
    </mesh>
  </group>
);

// ---------- lapisan 2D ----------
/** Butiran film: bintik gelap dan terang beralfa rendah (tanpa mix-blend, karena blend tidak bekerja di atas kanvas WebGL). */
const Butiran: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width="1080" height="1920">
      <filter id="butirGelap" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 30} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.6 0 0 0 0.95" />
      </filter>
      <filter id="butirTerang" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={(f % 30) + 50} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.6 0 0 0 -0.95" />
      </filter>
      <rect width="1080" height="1920" filter="url(#butirGelap)" opacity="0.22" />
      <rect width="1080" height="1920" filter="url(#butirTerang)" opacity="0.10" />
    </svg>
  </AbsoluteFill>
);

const TandaSudut: React.FC = () => {
  const s = (x: number, y: number, rx: number, ry: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: 34, height: 34, borderLeft: rx ? undefined : `2px solid ${P.abu}`, borderRight: rx ? `2px solid ${P.abu}` : undefined, borderTop: ry ? undefined : `2px solid ${P.abu}`, borderBottom: ry ? `2px solid ${P.abu}` : undefined, opacity: 0.55 }} />
  );
  return (
    <>
      {s(48, 92, 0, 0)}
      {s(998, 92, 1, 0)}
      {s(48, 1790, 0, 1)}
      {s(998, 1790, 1, 1)}
    </>
  );
};

/** Penggaris vertikal di tepi kiri: detail kecil yang membuat bingkai terasa seperti alat ukur. */
const Penggaris: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: 52, top: 300, height: 900, width: 40, overflow: "hidden", opacity: 0.5 }}>
    <div style={{ transform: `translateY(${-(f * 1.2) % 60}px)` }}>
      {Array.from({ length: 22 }).map((_, i) => (
        <div key={i} style={{ height: 60, display: "flex", alignItems: "flex-start", gap: 6 }}>
          <div style={{ width: i % 5 === 0 ? 18 : 9, height: 1.5, background: P.abu, marginTop: 0 }} />
          {i % 5 === 0 ? <div style={{ fontFamily: H.mono, fontSize: 14, color: P.abu, marginTop: -8 }}>{String(i * 10).padStart(3, "0")}</div> : null}
        </div>
      ))}
    </div>
  </div>
);

const Kepala: React.FC<{ bab: number; judul: string }> = ({ bab, judul }) => (
  <div style={{ position: "absolute", left: 110, right: 110, top: 112, display: "flex", justifyContent: "space-between", fontFamily: H.mono, fontWeight: 500, fontSize: 22, letterSpacing: "0.16em", color: P.abu }}>
    <span>
      <span style={{ color: P.amber }}>●</span>&nbsp; INTIPDOMPET / BAB {String(bab).padStart(2, "0")}
    </span>
    <span>{judul}</span>
  </div>
);

const Kaki: React.FC<{ sumber: string }> = ({ sumber }) => (
  <div style={{ position: "absolute", left: 110, right: 110, top: 1752, display: "flex", justifyContent: "space-between", fontFamily: H.mono, fontSize: 18, letterSpacing: "0.12em", color: P.abu, opacity: 0.8 }}>
    <span>{sumber}</span>
    <span>KONTEN EDUKASI</span>
  </div>
);

/** Pelat label: sudut terpotong, garis 1px, bayangan jatuh realistis (bukan glow). */
const Pelat: React.FC<{ x: number; y: number; w: number; kode: string; label: string; muncul: number; aksen?: string; children: React.ReactNode }> = ({ x, y, w, kode, label, muncul, aksen = P.amber, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, opacity: muncul, transform: `translateY(${(1 - muncul) * 24}px)`, filter: "drop-shadow(0 22px 26px rgba(0,0,0,0.55)) drop-shadow(0 2px 3px rgba(0,0,0,0.6))" }}>
    <div
      style={{
        clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
        background: `linear-gradient(170deg, rgba(30,42,70,0.92), rgba(14,20,36,0.94))`,
        padding: "0 0 26px 0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 30px", borderBottom: `1px solid ${P.abuGelap}`, fontFamily: H.mono, fontWeight: 500, fontSize: 20, letterSpacing: "0.16em", color: P.abu }}>
        <span style={{ color: aksen }}>{label}</span>
        <span>{kode}</span>
      </div>
      <div style={{ padding: "18px 30px 0 30px" }}>{children}</div>
    </div>
    <div style={{ position: "absolute", inset: 0, border: `1px solid ${aksen}55`, clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))", pointerEvents: "none" }} />
  </div>
);

const Subtitel: React.FC<{ teks: string }> = ({ teks }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1280, height: 260, background: "linear-gradient(180deg, transparent, rgba(7,9,15,0.7) 40%, rgba(7,9,15,0.7) 70%, transparent)" }} />
    <div style={{ position: "absolute", left: 110, right: 110, top: 1340, textAlign: "center", fontFamily: H.angka, fontWeight: 600, fontSize: 46, lineHeight: 1.28, color: P.kertas, fontVariationSettings: '"opsz" 32' }}>{teks}</div>
  </>
);

const angkaGaya: React.CSSProperties = {
  fontFamily: H.angka,
  fontWeight: 700,
  fontVariationSettings: '"opsz" 96',
  letterSpacing: "-0.045em",
  fontVariantNumeric: "tabular-nums lining-nums",
  color: P.kertas,
  // aberasi kromatik halus: dua bayangan berwarna 1,5 px
  textShadow: "1.5px 0 rgba(229,72,77,0.35), -1.5px 0 rgba(90,130,255,0.35), 0 14px 40px rgba(0,0,0,0.6)",
};

// ---------- komposisi ----------
export const HoloDompet2: React.FC = () => {
  const { f, adegan, t } = useAdegan();
  const tx = useTekstur();
  const m = masuk(t, 4, 12);
  return (
    <AbsoluteFill style={{ background: P.tinta }}>
      {/* cahaya ruang: hangat dari kiri atas, dingin pantulan dari bawah */}
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 28% 22%, rgba(242,179,61,0.10), transparent 70%), radial-gradient(70% 45% at 70% 85%, rgba(42,74,154,0.28), transparent 70%), linear-gradient(180deg, ${P.dalam}, ${P.tinta})` }} />
      <ThreeCanvas
        width={1080}
        height={1920}
        shadows
        camera={{ position: [0, 0, 8], fov: 38 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, alpha: true }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Lingkungan kuat={0.55} />
        <fog attach="fog" args={[P.tinta, 9, 22]} />
        <ambientLight intensity={0.12} color="#8ea2d8" />
        {/* kunci hangat, lempar bayangan */}
        <directionalLight position={[-3.5, 6, 4]} intensity={2.6} color="#FFD9A0" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-radius={6} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} />
        {/* cahaya tepi dingin dari belakang */}
        <directionalLight position={[3, 2.5, -5]} intensity={2.2} color="#6E8BFF" />
        <pointLight position={[0, 0.5, 4]} intensity={3} color={P.amber} distance={8} />
        <Lantai tx={tx} />

        {adegan === 0 ? (
          <>
            <Kamera pos={[0.25, 0.1, 8]} lihat={[0, 0.1, 0]} fov={36} />
            <group position={[0, 1.2 + Math.sin(f / 14) * 0.06, 0]} rotation={[0.12, -0.42 + 0.3 * Math.sin(f / 22), 0.05]} scale={0.82}>
              <Koin2 tx={tx} />
            </group>
            <BayanganKontak tx={tx} s={3.2} o={0.75} />
          </>
        ) : null}
        {adegan === 1 ? (
          <>
            <Kamera pos={[0, 0.6, 11]} lihat={[0, -0.5, 0]} fov={38} />
            <group position={[0, -1.6, 0]}>
              <Meteran tx={tx} isi={masuk(t, 0, 22)} f={f} />
            </group>
          </>
        ) : null}
        {adegan === 2 ? (
          <>
            <Kamera pos={[0.3, 0.8, 8.5]} lihat={[0, -0.2, 0]} fov={38} />
            <group position={[0.15, 0.15 + Math.sin(f / 16) * 0.05, 0]} rotation={[-0.55, -0.35 + f * 0.004, 0.16]} scale={0.82}>
              <Kartu tx={tx} />
            </group>
            <BayanganKontak tx={tx} s={4.2} o={0.6} x={0.25} />
          </>
        ) : null}
        {adegan === 3 ? (
          <>
            <Kamera pos={[0, 2.2, 8]} lihat={[0, -0.4, 0]} fov={36} />
            {/* tumpukan koin */}
            {Array.from({ length: 7 }).map((_, i) => (
              <group key={i} position={[-0.9 + acak(i) * 0.08, -2.12 + i * 0.145, acak(i + 3) * 0.08]} rotation={[-Math.PI / 2, 0, acak(i) * 6]} scale={0.62}>
                <Koin2 tx={tx} />
              </group>
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <group key={`b${i}`} position={[0.75 + acak(i + 11) * 0.08, -2.12 + i * 0.145, -0.3]} rotation={[-Math.PI / 2, 0, acak(i + 2) * 6]} scale={0.62}>
                <Koin2 tx={tx} warna="#B9C0CC" />
              </group>
            ))}
            <BayanganKontak tx={tx} s={4} o={0.7} />
          </>
        ) : null}
      </ThreeCanvas>

      {/* vinyet halus */}
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />

      <TandaSudut />
      <Penggaris f={f} />

      {adegan === 0 ? (
        <>
          <Kepala bab={1} judul="DEPOSITO · CONTOH" />
          <div style={{ position: "absolute", top: 1000, width: "100%", textAlign: "center", ...angkaGaya, fontSize: 300, lineHeight: 0.9, opacity: masuk(t, 0, 5) }}>
            6<span style={{ fontSize: 170, verticalAlign: "top", marginLeft: 8 }}>%</span>
          </div>
          <div style={{ position: "absolute", top: 1272, width: "100%", textAlign: "center", fontFamily: H.serif, fontStyle: "italic", fontSize: 108, color: P.amber, opacity: m, transform: `translateY(${(1 - m) * 16}px)`, textShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
            aman nggak?
          </div>
          <Kaki sumber="BUNGA CONTOH, BUKAN DATA BANK TERTENTU" />
        </>
      ) : null}
      {adegan === 1 ? (
        <>
          <Kepala bab={2} judul="BATAS PENJAMINAN" />
          <Pelat x={110} y={250} w={860} kode="LPS-01" label="TINGKAT BUNGA PENJAMINAN" muncul={m}>
            <div style={{ ...angkaGaya, fontSize: 176, lineHeight: 1 }}>3,75%</div>
            <div style={{ fontFamily: H.mono, fontSize: 22, letterSpacing: "0.08em", color: P.abu, marginTop: 10 }}>RUPIAH · BANK UMUM · 01.10.2026 – 31.01.2027</div>
          </Pelat>
          <div style={{ position: "absolute", left: 150, top: 1160, fontFamily: H.mono, fontSize: 24, color: P.amber, letterSpacing: "0.1em" }}>0% DIJAMIN</div>
          <div style={{ position: "absolute", right: 150, top: 1160, fontFamily: H.mono, fontSize: 24, color: P.merah, letterSpacing: "0.1em" }}>6% TIDAK DIJAMIN</div>
          <Subtitel teks="Di atas 3,75%, seluruh simpananmu nggak dijamin." />
          <Kaki sumber="SUMBER: LPS · DIAKSES 09.11.2026" />
        </>
      ) : null}
      {adegan === 2 ? (
        <>
          <Kepala bab={3} judul="NILAI MAKSIMAL" />
          <Pelat x={110} y={250} w={600} kode="LPS-02" label="JAMINAN MAKSIMAL" muncul={m}>
            <div style={{ ...angkaGaya, fontSize: 128, lineHeight: 1 }}>
              Rp2<span style={{ fontSize: 64, letterSpacing: "-0.01em", marginLeft: 14 }}>miliar</span>
            </div>
            <div style={{ fontFamily: H.mono, fontSize: 22, letterSpacing: "0.08em", color: P.abu, marginTop: 10 }}>PER NASABAH · PER BANK</div>
          </Pelat>
          <Pelat x={600} y={1110} w={370} kode="✓" label="SYARAT" muncul={masuk(t, 10, 12)} aksen={P.hijau}>
            <div style={{ fontFamily: H.angka, fontWeight: 600, fontSize: 36, lineHeight: 1.2, color: P.kertas }}>bunga ≤ 3,75%</div>
          </Pelat>
          <Subtitel teks="Ingat, jaminannya maksimal Rp2 miliar per nasabah per bank." />
          <Kaki sumber="SUMBER: LPS · DIAKSES 09.11.2026" />
        </>
      ) : null}
      {adegan === 3 ? (
        <>
          <Kepala bab={4} judul="KESIMPULAN" />
          <div style={{ position: "absolute", top: 380, left: 110, right: 110, opacity: m, transform: `translateY(${(1 - m) * 20}px)` }}>
            <div style={{ fontFamily: H.angka, fontWeight: 700, fontSize: 100, lineHeight: 0.98, letterSpacing: "-0.035em", color: P.kertas, fontVariationSettings: '"opsz" 96' }}>Bunga tinggi boleh,</div>
            <div style={{ fontFamily: H.serif, fontStyle: "italic", fontSize: 118, lineHeight: 1.0, color: P.amber, marginTop: 6 }}>asal tahu risikonya.</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 56 }}>
              <div style={{ width: 60, height: 1.5, background: P.amber }} />
              <div style={{ fontFamily: H.mono, fontWeight: 500, fontSize: 24, letterSpacing: "0.16em", color: P.kertas }}>@INTIPDOMPET</div>
            </div>
            <div style={{ fontFamily: H.mono, fontSize: 20, letterSpacing: "0.12em", color: P.abu, marginTop: 14, marginLeft: 78 }}>URUSAN UANG, KITA INTIP.</div>
          </div>
          <Kaki sumber="KONTEN EDUKASI, BUKAN AJAKAN MEMBELI" />
        </>
      ) : null}

      <Butiran f={f} />
    </AbsoluteFill>
  );
};
