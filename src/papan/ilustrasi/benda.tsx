// Benda kapur berwarna untuk adegan infografis. Pusat (cx, cy), ukuran kira-kira s.
import React from "react";
import { Titik, Tulis, garis, ikonBank } from "../Komponen";
import { k } from "../tema";
import { Bentuk, Bidang, Gr, SUDAH, elips, halus, persegi, persegiBulat, skala } from "./dasar";

export type OpsiBenda = { teks?: string; miring?: number; warna?: string };
type FB = React.FC<{ cx: number; cy: number; s: number } & OpsiBenda>;
type P = [number, number];

const tebalDari = (s: number) => Math.max(4, s * 0.02);

export const BatangEmas: React.FC<{ cx: number; cy: number; s: number }> = ({ cx, cy, s }) => {
  const S = skala(cx, cy, s);
  const t = tebalDari(s) * 0.9;
  return (
    <>
      <Bentuk pts={S([[-0.5, 0.2], [-0.36, -0.14], [0.36, -0.14], [0.5, 0.2], [-0.5, 0.2]])} warna={k.kuning} garis={k.kuning} isi={0.5} tebal={t} />
      <Bentuk pts={S([[-0.36, -0.14], [-0.28, -0.26], [0.44, -0.26], [0.36, -0.14], [-0.36, -0.14]])} warna={k.kuning} garis={k.kuning} isi={0.75} tebal={t} />
      <Bentuk pts={S([[0.36, -0.14], [0.44, -0.26], [0.58, 0.08], [0.5, 0.2], [0.36, -0.14]])} warna={k.kuning} garis={k.kuning} isi={0.2} arsir={0.7} tebal={t} />
      <Gr pts={S([[-0.3, 0.1], [-0.2, -0.06]])} warna={k.putih} tebal={t} />
      <Gr pts={S([[-0.18, 0.12], [-0.12, 0.02]])} warna={k.putih} tebal={t * 0.8} />
    </>
  );
};

const Emas: FB = ({ cx, cy, s }) => <BatangEmas cx={cx} cy={cy} s={s} />;

const EmasTumpuk: FB = ({ cx, cy, s }) => (
  <>
    <BatangEmas cx={cx - s * 0.28} cy={cy + s * 0.18} s={s * 0.55} />
    <BatangEmas cx={cx + s * 0.32} cy={cy + s * 0.18} s={s * 0.55} />
    <BatangEmas cx={cx + s * 0.02} cy={cy - s * 0.1} s={s * 0.55} />
  </>
);

const Koin: FB = ({ cx, cy, s, teks }) => {
  const t = tebalDari(s);
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const y = cy + s * 0.3 - i * s * 0.12;
        return (
          <React.Fragment key={i}>
            <Bentuk pts={[...elips(cx - s * 0.1, y + s * 0.04, s * 0.3, s * 0.1)]} warna={k.kuning} garis={k.kuning} isi={0.35} arsir={i === 0 ? 0.5 : 0} tebal={t} />
            <Bentuk pts={elips(cx - s * 0.1, y, s * 0.3, s * 0.1)} warna={k.kuning} garis={k.kuning} isi={0.55} tebal={t} />
          </React.Fragment>
        );
      })}
      <Bentuk pts={elips(cx + s * 0.32, cy + s * 0.12, s * 0.2, s * 0.24)} warna={k.kuning} garis={k.kuning} isi={0.5} tebal={t} />
      <Tulis x={cx + s * 0.32} y={cy + s * 0.12} teks={teks ?? "Rp"} ukuran={s * 0.14} gaya="tebal" warna={k.putih} mulai={SUDAH} rata="center" />
    </>
  );
};

const Uang: FB = ({ cx, cy, s, teks }) => {
  const t = tebalDari(s);
  return (
    <>
      {[2, 1, 0].map((i) => (
        <Bentuk key={i} pts={persegi(cx - s * 0.5 + i * s * 0.05, cy - s * 0.26 - i * s * 0.06, s, s * 0.52)} warna={k.hijauTerang} garis={k.hijauTerang} isi={0.22 + (2 - i) * 0.08} tebal={t} />
      ))}
      <Bentuk pts={elips(cx, cy, s * 0.13)} warna={k.hijauTerang} garis={k.putih} isi={0.2} tebal={t} />
      <Tulis x={cx} y={cy} teks={teks ?? "Rp"} ukuran={s * 0.13} gaya="tebal" warna={k.putih} mulai={SUDAH} rata="center" />
    </>
  );
};

const Hp: FB = ({ cx, cy, s, teks }) => {
  const t = tebalDari(s);
  const w = s * 0.52;
  return (
    <>
      <Bentuk pts={persegiBulat(cx - w / 2, cy - s / 2, w, s, s * 0.07)} warna={k.putih} isi={0.08} tebal={t} />
      <Bidang pts={persegi(cx - w / 2 + s * 0.04, cy - s / 2 + s * 0.09, w - s * 0.08, s * 0.78)} warna={k.biru} isi={0.42} />
      <Gr pts={[[cx - s * 0.05, cy - s * 0.45], [cx + s * 0.05, cy - s * 0.45]]} tebal={t * 0.8} />
      {/* layar aplikasi: grafik kecil + angka */}
      <Gr
        pts={halus([[cx - w / 2 + s * 0.08, cy + s * 0.05], [cx - s * 0.05, cy - s * 0.05], [cx + s * 0.02, cy + s * 0.0], [cx + w / 2 - s * 0.08, cy - s * 0.15]], false, 2)}
        warna={k.kuning}
        tebal={t}
      />
      {[0, 1, 2].map((i) => (
        <Bidang key={i} pts={persegi(cx - w / 2 + s * 0.08 + i * s * 0.13, cy + s * 0.12, s * 0.09, s * 0.07)} warna={k.putih} isi={0.35} />
      ))}
      {teks ? <Tulis x={cx} y={cy - s * 0.26} teks={teks} ukuran={s * 0.09} gaya="tebal" warna={k.putih} mulai={SUDAH} rata="center" /> : null}
    </>
  );
};

const Kartu: FB = ({ cx, cy, s, teks }) => {
  const t = tebalDari(s);
  const h = s * 0.63;
  return (
    <>
      <Bentuk pts={persegiBulat(cx - s / 2, cy - h / 2, s, h, s * 0.06)} warna={k.biru} isi={0.38} tebal={t} />
      <Bidang pts={persegi(cx + s * 0.15, cy - h / 2 + s * 0.02, s * 0.33, h - s * 0.04)} warna={k.biru} isi={0} arsir={0.5} />
      <Gr pts={garis(cx - s / 2, cy - h * 0.2, cx + s / 2, cy - h * 0.2, 4, 1)} warna={k.putih} tebal={s * 0.06} />
      <Bentuk pts={persegiBulat(cx - s * 0.38, cy + h * 0.02, s * 0.17, s * 0.13, s * 0.02)} warna={k.kuning} garis={k.kuning} isi={0.7} tebal={t * 0.8} />
      <Tulis x={cx - s * 0.38} y={cy + h * 0.36} teks={teks ?? "•••• 1234"} ukuran={s * 0.075} warna={k.putih} mulai={SUDAH} />
    </>
  );
};

const Tas: FB = ({ cx, cy, s }) => {
  const S = skala(cx, cy, s);
  const t = tebalDari(s);
  return (
    <>
      <Bentuk pts={S([[-0.36, -0.2], [0.36, -0.2], [0.44, 0.5], [-0.44, 0.5], [-0.36, -0.2]])} warna={k.merah} garis={k.putih} isi={0.4} tebal={t} />
      <Bidang pts={S([[0.12, -0.2], [0.36, -0.2], [0.44, 0.5], [0.12, 0.5]])} warna={k.merah} isi={0} arsir={0.6} />
      <Gr pts={halus(S([[-0.18, -0.2], [-0.17, -0.42], [0.17, -0.42], [0.18, -0.2]]), false, 3)} tebal={t} />
    </>
  );
};

const Kalender: FB = ({ cx, cy, s, teks }) => {
  const t = tebalDari(s);
  const x = cx - s / 2;
  const y = cy - s * 0.45;
  return (
    <>
      <Bentuk pts={persegi(x, y, s, s * 0.9)} warna={k.putih} isi={0.08} tebal={t} />
      <Bentuk pts={persegi(x, y, s, s * 0.22)} warna={k.merah} garis={k.putih} isi={0.6} tebal={t} />
      {[0.25, 0.75].map((f, i) => (
        <Gr key={i} pts={[[x + s * f, y - s * 0.07], [x + s * f, y + s * 0.07]]} tebal={t * 1.4} />
      ))}
      {teks ? <Tulis x={cx} y={y + s * 0.11} teks={teks} ukuran={s * 0.12} gaya="tebal" warna={k.putih} mulai={SUDAH} rata="center" /> : null}
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2, 3].map((c) => {
          const px = x + s * (0.15 + c * 0.235);
          const py = y + s * (0.38 + r * 0.17);
          const tanda = r === 1 && c === 2;
          return <Bentuk key={`${r}${c}`} pts={elips(px, py, s * (tanda ? 0.07 : 0.025))} warna={tanda ? k.kuning : k.putih} garis={tanda ? k.kuning : k.putih} isi={tanda ? 0.3 : 0.6} tebal={t * 0.7} />;
        }),
      )}
    </>
  );
};

const Bank: FB = ({ cx, cy, s, teks }) => {
  const t = tebalDari(s);
  const h = s * 0.9;
  return (
    <>
      <Bidang pts={[[cx - s / 2, cy - h * 0.25], [cx, cy - h / 2], [cx + s / 2, cy - h * 0.25]]} warna={k.putih} isi={0.18} />
      <Bidang pts={persegi(cx - s / 2, cy + h * 0.32, s, h * 0.08)} warna={k.putih} isi={0.2} arsir={0.5} />
      {ikonBank(cx, cy, s, 5).map((pts, i) => (
        <Gr key={i} pts={pts} tebal={t} />
      ))}
      {teks ? <Tulis x={cx} y={cy - h * 0.33} teks={teks} ukuran={s * 0.09} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" /> : null}
    </>
  );
};

const Timbangan: FB = ({ cx, cy, s, miring = -10 }) => {
  const t = tebalDari(s);
  const a = (miring * Math.PI) / 180;
  const lengan = s * 0.42;
  const atas: P = [cx, cy - s * 0.32];
  const ujung = (arah: number): P => [atas[0] + Math.cos(a) * lengan * arah, atas[1] + Math.sin(a) * lengan * arah];
  const piring = (p: P, w: string) => (
    <>
      <Gr pts={[p, [p[0] - s * 0.13, p[1] + s * 0.28]]} tebal={t * 0.6} />
      <Gr pts={[p, [p[0] + s * 0.13, p[1] + s * 0.28]]} tebal={t * 0.6} />
      <Bentuk pts={halus([[p[0] - s * 0.17, p[1] + s * 0.28], [p[0], p[1] + s * 0.36], [p[0] + s * 0.17, p[1] + s * 0.28], [p[0] - s * 0.17, p[1] + s * 0.28]], false, 2)} warna={w} isi={0.45} tebal={t} />
    </>
  );
  return (
    <>
      <Bentuk pts={persegi(cx - s * 0.22, cy + s * 0.42, s * 0.44, s * 0.08)} warna={k.putih} isi={0.2} arsir={0.5} tebal={t} />
      <Gr pts={[[cx, cy + s * 0.42], atas]} tebal={t * 1.3} />
      <Gr pts={[ujung(-1), ujung(1)]} tebal={t * 1.3} />
      <Bentuk pts={elips(atas[0], atas[1], s * 0.03)} warna={k.kuning} garis={k.kuning} isi={0.8} tebal={t * 0.7} />
      {piring(ujung(-1), k.kuning)}
      {piring(ujung(1), k.merah)}
    </>
  );
};

const Label: FB = ({ cx, cy, s, teks, warna = k.kuning, miring = 0 }) => {
  const a = (miring * Math.PI) / 180;
  const putar = (pts: P[]): P[] => pts.map(([x, y]) => [cx + (x * Math.cos(a) - y * Math.sin(a)) * s, cy + (x * Math.sin(a) + y * Math.cos(a)) * s]);
  const t = tebalDari(s);
  return (
    <>
      <Bentuk pts={putar([[-0.5, 0], [-0.32, -0.22], [0.5, -0.22], [0.5, 0.22], [-0.32, 0.22], [-0.5, 0]])} warna={warna} garis={warna} isi={0.4} tebal={t} />
      <Bentuk pts={elips(putar([[-0.33, 0]])[0][0], putar([[-0.33, 0]])[0][1], s * 0.035)} warna={k.putih} isi={0} tebal={t * 0.7} />
      {teks ? <Tulis x={putar([[0.1, 0]])[0][0]} y={putar([[0.1, 0]])[0][1]} teks={teks} ukuran={s * 0.15} gaya="tebal" warna={k.putih} mulai={SUDAH} rata="center" miring={miring} /> : null}
    </>
  );
};

const Kalkulator: FB = ({ cx, cy, s, teks }) => {
  const t = tebalDari(s);
  const w = s * 0.7;
  const x = cx - w / 2;
  const y = cy - s / 2;
  return (
    <>
      <Bentuk pts={persegiBulat(x, y, w, s, s * 0.05)} warna={k.biru} isi={0.35} tebal={t} />
      <Bentuk pts={persegi(x + s * 0.07, y + s * 0.07, w - s * 0.14, s * 0.2)} warna={k.putih} isi={0.15} tebal={t * 0.8} />
      {teks ? <Tulis x={x + w - s * 0.1} y={y + s * 0.17} teks={teks} ukuran={s * 0.11} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="right" /> : null}
      {[0, 1, 2, 3].flatMap((r) =>
        [0, 1, 2].map((c) => (
          <Bentuk
            key={`${r}${c}`}
            pts={persegiBulat(x + s * (0.08 + c * 0.19), y + s * (0.34 + r * 0.15), s * 0.14, s * 0.1, s * 0.02)}
            warna={r === 3 && c === 2 ? k.kuning : k.putih}
            garis={r === 3 && c === 2 ? k.kuning : k.putih}
            isi={r === 3 && c === 2 ? 0.6 : 0.15}
            tebal={t * 0.6}
          />
        )),
      )}
    </>
  );
};

const Meja: FB = ({ cx, cy, s }) => {
  const t = tebalDari(s) * 1.4;
  return (
    <>
      <Bidang pts={persegi(cx - s / 2, cy, s, s * 0.12)} warna={k.putih} isi={0.12} arsir={0.45} sudut={-35} />
      <Gr pts={garis(cx - s / 2 - s * 0.02, cy, cx + s / 2 + s * 0.02, cy, 7, 2)} tebal={t} />
      <Gr pts={[[cx - s * 0.44, cy], [cx - s * 0.44, cy + s * 0.12]]} tebal={t * 0.7} />
      <Gr pts={[[cx + s * 0.44, cy], [cx + s * 0.44, cy + s * 0.12]]} tebal={t * 0.7} />
    </>
  );
};

const Gelembung: FB = ({ cx, cy, s, teks, warna = k.putih }) => {
  const t = tebalDari(s);
  const w = s;
  const h = s * 0.5;
  return (
    <>
      <Bentuk pts={persegiBulat(cx - w / 2, cy - h / 2, w, h, h * 0.35)} warna={warna} garis={warna} isi={0.1} tebal={t} />
      <Gr pts={[[cx - w * 0.25, cy + h / 2], [cx - w * 0.34, cy + h * 0.85], [cx - w * 0.1, cy + h / 2]]} warna={warna} tebal={t} />
      {/* teks panjang dikecilkan supaya muat di dalam gelembung */}
      {teks ? <Tulis x={cx} y={cy} teks={teks} ukuran={Math.min(s * 0.2, (w * 0.85) / (teks.length * 0.55))} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" /> : null}
    </>
  );
};

// Garis coret merah (mencoret harga) dan silang merah.
const CoretMerah: FB = ({ cx, cy, s }) => <Gr pts={garis(cx - s / 2, cy + s * 0.12, cx + s / 2, cy - s * 0.12, 13, 3)} warna={k.merah} tebal={Math.max(8, s * 0.04)} />;
const Silang: FB = ({ cx, cy, s }) => (
  <>
    <Gr pts={garis(cx - s * 0.4, cy - s * 0.4, cx + s * 0.4, cy + s * 0.4, 51, 3)} warna={k.merah} tebal={Math.max(9, s * 0.05)} />
    <Gr pts={garis(cx + s * 0.4, cy - s * 0.4, cx - s * 0.4, cy + s * 0.4, 52, 3)} warna={k.merah} tebal={Math.max(9, s * 0.05)} />
  </>
);

// ---------------------------------------------------------------- benda tambahan (batch carousel 14–16 Nov)
const Piring: FB = ({ cx, cy, s }) => {
  const t = tebalDari(s);
  const rx = s * 0.5;
  const ry = s * 0.3;
  // tiga porsi: nasi (putih, 50%), lauk (merah, 30%), sayur (hijau, 20%)
  const irisan = (a0: number, a1: number): Titik[] => [
    [cx, cy],
    ...Array.from({ length: 13 }, (_, i) => {
      const a = a0 + ((a1 - a0) * i) / 12;
      return [cx + Math.cos(a) * rx * 0.78, cy + Math.sin(a) * ry * 0.78] as Titik;
    }),
    [cx, cy],
  ];
  const tau = Math.PI * 2;
  return (
    <>
      <Bentuk pts={elips(cx, cy, rx, ry)} warna={k.putih} isi={0.08} tebal={t} />
      <Bentuk pts={irisan(-Math.PI / 2, -Math.PI / 2 + tau * 0.5)} warna={k.putih} isi={0.35} tebal={t * 0.7} />
      <Bentuk pts={irisan(-Math.PI / 2 + tau * 0.5, -Math.PI / 2 + tau * 0.8)} warna={k.merah} garis={k.merah} isi={0.45} tebal={t * 0.7} />
      <Bentuk pts={irisan(-Math.PI / 2 + tau * 0.8, -Math.PI / 2 + tau)} warna={k.hijauTerang} garis={k.hijauTerang} isi={0.45} tebal={t * 0.7} />
    </>
  );
};

const Ban: FB = ({ cx, cy, s }) => {
  const t = tebalDari(s);
  return (
    <>
      <Bentuk pts={elips(cx, cy, s * 0.5)} warna={k.putih} isi={0.12} arsir={0.55} tebal={t * 1.2} />
      <Bentuk pts={elips(cx, cy, s * 0.24)} warna={k.biru} garis={k.putih} isi={0.35} tebal={t} />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return <Gr key={i} pts={[[cx + Math.cos(a) * s * 0.08, cy + Math.sin(a) * s * 0.08], [cx + Math.cos(a) * s * 0.22, cy + Math.sin(a) * s * 0.22]]} tebal={t * 0.6} />;
      })}
    </>
  );
};

// Gelas dengan es batu; `teks` "1"/"2"/"3" = tahap mencair (es makin kecil).
const Gelas: FB = ({ cx, cy, s, teks }) => {
  const t = tebalDari(s);
  const tahap = Math.max(1, Math.min(3, Number(teks) || 1));
  const S = skala(cx, cy, s);
  const es = 0.2 - (tahap - 1) * 0.06;
  return (
    <>
      <Bidang pts={S([[-0.3, 0.05], [0.3, 0.05], [0.26, 0.5], [-0.26, 0.5]])} warna={k.biru} isi={0.3} />
      <Bentuk pts={S([[-0.34, -0.5], [0.34, -0.5], [0.27, 0.5], [-0.27, 0.5], [-0.34, -0.5]])} warna={k.putih} isi={0.05} tebal={t} />
      <Bentuk pts={persegi(cx - es * s * 0.6, cy - es * s * 0.2, es * s, es * s)} warna={k.biru} garis={k.putih} isi={0.45} tebal={t * 0.7} />
      {tahap < 3 ? <Bentuk pts={persegi(cx + s * 0.02, cy - es * s * 0.1, es * s * 0.8, es * s * 0.8)} warna={k.biru} garis={k.putih} isi={0.45} tebal={t * 0.7} /> : null}
    </>
  );
};

const Bantal: FB = ({ cx, cy, s }) => {
  const t = tebalDari(s);
  const pts = halus(skala(cx, cy, s)([[-0.5, -0.24], [0, -0.3], [0.5, -0.24], [0.54, 0], [0.5, 0.24], [0, 0.3], [-0.5, 0.24], [-0.54, 0]]), true, 2);
  return (
    <>
      <Bentuk pts={pts} warna={k.putih} isi={0.18} tebal={t} />
      <Bidang pts={skala(cx, cy, s)([[0.15, -0.26], [0.5, -0.22], [0.52, 0.22], [0.15, 0.27]])} warna={k.putih} isi={0} arsir={0.45} />
    </>
  );
};

const Payung: FB = ({ cx, cy, s }) => {
  const t = tebalDari(s);
  const S = skala(cx, cy, s);
  const kanopi: Titik[] = [
    ...Array.from({ length: 21 }, (_, i) => {
      const a = Math.PI + (i / 20) * Math.PI;
      return [cx + Math.cos(a) * s * 0.5, cy - s * 0.05 + Math.sin(a) * s * 0.4] as Titik;
    }),
    ...S([[0.33, -0.02], [0.17, -0.07], [0, -0.02], [-0.17, -0.07], [-0.33, -0.02], [-0.5, -0.05]]),
  ];
  return (
    <>
      <Bentuk pts={kanopi} warna={k.biru} garis={k.putih} isi={0.45} tebal={t} />
      <Gr pts={S([[0, -0.45], [0, 0.42]])} tebal={t} />
      <Gr pts={halus(S([[0, 0.42], [0, 0.5], [-0.1, 0.5], [-0.1, 0.42]]), false, 2)} tebal={t} />
    </>
  );
};

const Keran: FB = ({ cx, cy, s }) => {
  const t = tebalDari(s);
  const S = skala(cx, cy, s);
  return (
    <>
      <Bentuk pts={S([[-0.5, -0.4], [0.05, -0.4], [0.15, -0.3], [0.15, -0.05], [0.0, -0.05], [0.0, -0.25], [-0.5, -0.25], [-0.5, -0.4]])} warna={k.putih} isi={0.2} arsir={0.4} tebal={t} />
      <Gr pts={S([[-0.12, -0.4], [-0.12, -0.52]])} tebal={t * 1.4} />
      <Gr pts={S([[-0.22, -0.52], [-0.02, -0.52]])} tebal={t * 1.4} />
      {[0.08, 0.25, 0.42].map((y, i) => (
        <Bentuk key={i} pts={halus(S([[0.075, y - 0.05], [0.11, y + 0.03], [0.075, y + 0.06], [0.04, y + 0.03]]), true, 2)} warna={k.biru} garis={k.biru} isi={0.6} tebal={t * 0.6} />
      ))}
    </>
  );
};

const Ember: FB = ({ cx, cy, s }) => {
  const t = tebalDari(s);
  const S = skala(cx, cy, s);
  return (
    <>
      <Bidang pts={S([[-0.38, -0.05], [0.38, -0.05], [0.3, 0.45], [-0.3, 0.45]])} warna={k.biru} isi={0.45} />
      <Bentuk pts={S([[-0.42, -0.4], [0.42, -0.4], [0.32, 0.45], [-0.32, 0.45], [-0.42, -0.4]])} warna={k.putih} isi={0.05} tebal={t} />
      <Gr pts={halus(S([[-0.42, -0.4], [-0.3, -0.65], [0.3, -0.65], [0.42, -0.4]]), false, 3)} tebal={t * 0.8} />
    </>
  );
};

const Kunci: FB = ({ cx, cy, s }) => {
  const t = tebalDari(s);
  const S = skala(cx, cy, s);
  return (
    <>
      <Bentuk pts={elips(cx - s * 0.3, cy, s * 0.18)} warna={k.kuning} garis={k.kuning} isi={0.5} tebal={t} />
      <Bidang pts={elips(cx - s * 0.3, cy, s * 0.06)} warna={k.papan} isi={1} />
      <Bentuk pts={S([[-0.12, -0.05], [0.5, -0.05], [0.5, 0.05], [-0.12, 0.05], [-0.12, -0.05]])} warna={k.kuning} garis={k.kuning} isi={0.6} tebal={t} />
      <Gr pts={S([[0.32, 0.05], [0.32, 0.16]])} warna={k.kuning} tebal={t * 1.4} />
      <Gr pts={S([[0.44, 0.05], [0.44, 0.13]])} warna={k.kuning} tebal={t * 1.4} />
    </>
  );
};

const Gembok: FB = ({ cx, cy, s }) => {
  const t = tebalDari(s);
  const S = skala(cx, cy, s);
  return (
    <>
      <Gr pts={halus(S([[-0.22, 0.0], [-0.22, -0.32], [0, -0.45], [0.22, -0.32], [0.22, 0.0]]), false, 3)} tebal={s * 0.07} />
      <Bentuk pts={persegiBulat(cx - s * 0.36, cy - s * 0.02, s * 0.72, s * 0.52, s * 0.06)} warna={k.kuning} garis={k.kuning} isi={0.55} tebal={t} />
      <Bidang pts={elips(cx, cy + s * 0.18, s * 0.06)} warna={k.papan} isi={1} />
      <Gr pts={S([[0, 0.22], [0, 0.34]])} warna={k.papan} tebal={s * 0.04} />
    </>
  );
};

const BolaSalju: FB = ({ cx, cy, s }) => {
  const t = tebalDari(s);
  return (
    <>
      <Bentuk pts={elips(cx, cy, s * 0.5)} warna={k.putih} isi={0.3} tebal={t} />
      <Bidang pts={halus([[cx + s * 0.1, cy - s * 0.45], [cx + s * 0.48, cy - s * 0.1], [cx + s * 0.4, cy + s * 0.3], [cx + s * 0.05, cy + s * 0.48], [cx + s * 0.25, cy]], true, 2)} warna={k.biru} isi={0} arsir={0.5} />
    </>
  );
};

const Dompet: FB = ({ cx, cy, s, teks }) => {
  const t = tebalDari(s);
  return (
    <>
      <Bentuk pts={persegiBulat(cx - s * 0.5, cy - s * 0.32, s, s * 0.64, s * 0.08)} warna={k.merah} garis={k.putih} isi={0.4} tebal={t} />
      <Bentuk pts={persegiBulat(cx + s * 0.12, cy - s * 0.12, s * 0.42, s * 0.24, s * 0.06)} warna={k.merah} garis={k.putih} isi={0.6} tebal={t} />
      <Bidang pts={elips(cx + s * 0.25, cy, s * 0.035)} warna={k.kuning} isi={1} />
      {teks ? <Tulis x={cx - s * 0.18} y={cy} teks={teks} ukuran={s * 0.16} gaya="tebal" warna={k.putih} mulai={SUDAH} rata="center" /> : null}
    </>
  );
};

const CentangHijau: FB = ({ cx, cy, s }) => (
  <Gr pts={[[cx - s * 0.4, cy], [cx - s * 0.1, cy + s * 0.35], [cx + s * 0.45, cy - s * 0.4]]} warna={k.hijauTerang} tebal={Math.max(9, s * 0.09)} />
);

export const BENDA: Record<string, FB> = {
  centang: CentangHijau,
  piring: Piring,
  ban: Ban,
  gelas: Gelas,
  bantal: Bantal,
  payung: Payung,
  keran: Keran,
  ember: Ember,
  kunci: Kunci,
  gembok: Gembok,
  bolaSalju: BolaSalju,
  dompet: Dompet,
  coret: CoretMerah,
  silang: Silang,
  emas: Emas,
  emasTumpuk: EmasTumpuk,
  koin: Koin,
  uang: Uang,
  hp: Hp,
  kartu: Kartu,
  tas: Tas,
  kalender: Kalender,
  bank: Bank,
  timbangan: Timbangan,
  label: Label,
  kalkulator: Kalkulator,
  meja: Meja,
  gelembung: Gelembung,
};
