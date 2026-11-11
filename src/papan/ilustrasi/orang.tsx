// Orang setengah badan dalam gaya kapur: kepala, rambut berarsir, wajah berekspresi, baju berwarna
// dengan bayangan arsir, dan lengan berpose. Pusat (cx, cy), tinggi kepala-sampai-pinggang = s.
import React from "react";
import { Tulis } from "../Komponen";
import { k } from "../tema";
import { BatangEmas } from "./benda";
import { Bentuk, Bidang, Gr, SUDAH, elips, halus, persegi, persegiBulat, skala } from "./dasar";

export type Pose = "netral" | "hp" | "struk" | "mikir" | "kaget" | "jempol" | "tunjuk" | "emas";
export type Ekspresi = "senyum" | "kaget" | "mikir" | "datar" | "cemas";

type P = [number, number];

export const Orang: React.FC<{ cx: number; cy: number; s: number; pose?: Pose; ekspresi?: Ekspresi; baju?: string; teks?: string; cermin?: boolean }> = ({
  cx,
  cy,
  s,
  pose = "netral",
  ekspresi = "senyum",
  baju = k.biru,
  teks,
  cermin = false,
}) => {
  const top = cy - s / 2;
  const m = cermin ? -1 : 1; // cermin: tangan aktif di kiri
  const S = (pts: P[]) => skala(cx, top, s)(pts.map(([x, y]) => [x * m, y] as P));
  const tebalGaris = Math.max(4, s * 0.012);
  const lengan = Math.max(16, s * 0.075);

  // ---------- badan
  const badan = halus(S([[-0.08, 0.345], [-0.25, 0.375], [-0.31, 0.48], [-0.3, 1.0], [0.3, 1.0], [0.31, 0.48], [0.25, 0.375], [0.08, 0.345]]), true, 2);
  const bayangBadan = halus(S([[0.12, 0.36], [0.25, 0.375], [0.31, 0.48], [0.3, 1.0], [0.12, 1.0]]), true, 1);
  // ---------- kepala & rambut
  const kepala = skala(cx, top, s)([[0, 0.16]])[0];
  const rambut = halus(
    S(
      ([[-0.14, 0.17], [-0.15, 0.07], [-0.1, 0.01], [0, -0.01], [0.1, 0.01], [0.15, 0.07], [0.145, 0.15], [0.1, 0.09], [0.04, 0.1], [-0.02, 0.07], [-0.08, 0.1], [-0.12, 0.15]] as P[]).map(
        ([x, y]) => [x * 1.12, 0.16 + (y - 0.16) * 1.12] as P,
      ),
    ),
    true,
    2,
  );

  // ---------- lengan per pose: [bahu, siku, tangan] untuk tangan aktif (kanan) dan tangan pasif (kiri)
  const bahuK: P = [0.27, 0.41];
  const bahuKi: P = [-0.27, 0.41];
  // lengan yang turun berakhir di tepi bawah (terpotong seperti foto setengah badan), tanpa tangan
  let aktif: P[] = [bahuK, [0.33, 0.7], [0.3, 1.0]];
  let pasif: P[] = [bahuKi, [-0.33, 0.7], [-0.3, 1.0]];
  if (pose === "hp") aktif = [bahuK, [0.38, 0.8], [0.12, 0.66]];
  if (pose === "struk") aktif = [bahuK, [0.48, 0.38], [0.45, 0.14]];
  if (pose === "mikir") aktif = [bahuK, [0.3, 0.68], [0.06, 0.31]];
  if (pose === "jempol") aktif = [bahuK, [0.48, 0.66], [0.46, 0.4]];
  if (pose === "tunjuk") aktif = [bahuK, [0.47, 0.52], [0.64, 0.43]];
  if (pose === "emas") aktif = [bahuK, [0.46, 0.7], [0.3, 0.5]];
  if (pose === "kaget") {
    aktif = [bahuK, [0.47, 0.42], [0.36, 0.19]];
    pasif = [bahuKi, [-0.47, 0.42], [-0.36, 0.19]];
  }
  const tangan = (p: P) => skala(cx, top, s)([[p[0] * m, p[1]]])[0];

  // ---------- wajah
  const mata = [-0.053, 0.053].map((x) => skala(cx, top, s)([[x * m, 0.17]])[0]);
  const alisY = ekspresi === "kaget" || ekspresi === "cemas" ? 0.105 : 0.12;
  const mulut =
    ekspresi === "senyum"
      ? halus(S([[-0.055, 0.222], [0, 0.25], [0.055, 0.222]]), false, 2)
      : ekspresi === "mikir"
        ? S([[-0.035, 0.236], [0.045, 0.226]])
        : ekspresi === "cemas"
          ? halus(S([[-0.05, 0.244], [0, 0.229], [0.05, 0.244]]), false, 2)
          : S([[-0.04, 0.236], [0.04, 0.236]]);

  return (
    <>
      {/* badan */}
      <Bentuk pts={badan} warna={baju} garis={k.putih} isi={0.32} tebal={tebalGaris} />
      <Bidang pts={bayangBadan} warna={baju} isi={0} arsir={0.6} sudut={35} />
      <Gr pts={S([[-0.08, 0.345], [0, 0.44], [0.08, 0.345]])} tebal={tebalGaris} />
      <Gr pts={S([[-0.035, 0.3], [-0.035, 0.35]])} tebal={tebalGaris} />
      <Gr pts={S([[0.035, 0.3], [0.035, 0.35]])} tebal={tebalGaris} />
      {/* lengan pasif lalu kepala */}
      <Gr pts={halus(S(pasif), false, 2)} warna={baju} tebal={lengan} />
      {pose === "kaget" ? <Bentuk pts={elips(tangan(pasif[2])[0], tangan(pasif[2])[1], s * 0.042)} warna={k.putih} isi={0.18} tebal={tebalGaris * 0.8} /> : null}
      <Bentuk pts={elips(kepala[0], kepala[1], s * 0.14, s * 0.157)} warna={k.putih} isi={0.12} tebal={tebalGaris} />
      <Bentuk pts={rambut} warna={k.putih} isi={0.25} arsir={0.55} tebal={tebalGaris} sudut={-30} />
      {mata.map((p, i) => (
        <Bidang key={i} pts={elips(p[0], p[1], s * (ekspresi === "kaget" ? 0.017 : 0.012))} warna={k.putih} isi={1} />
      ))}
      {mata.map((p, i) => (
        <Gr key={`a${i}`} pts={[[p[0] - s * 0.025, top + s * (alisY + (i === 0 && ekspresi === "mikir" ? -0.012 : 0))], [p[0] + s * 0.025, top + s * alisY]]} tebal={tebalGaris * 0.8} />
      ))}
      {ekspresi === "kaget" ? <Bentuk pts={elips(cx, top + s * 0.24, s * 0.024, s * 0.032)} warna={k.merah} isi={0.5} tebal={tebalGaris * 0.8} /> : <Gr pts={mulut} tebal={tebalGaris * 0.9} />}
      {/* pipi merona saat senyum */}
      {ekspresi === "senyum" ? [-0.09, 0.09].map((x, i) => <Bidang key={i} pts={elips(cx + x * s, top + s * 0.215, s * 0.024, s * 0.014)} warna={k.merah} isi={0.45} />) : null}
      {/* lengan aktif di depan badan */}
      <Gr pts={halus(S(aktif), false, 2)} warna={baju} tebal={lengan} />
      <Gr pts={halus(S(aktif), false, 2)} warna={k.putih} tebal={2} />
      {pose !== "netral" ? <Bentuk pts={elips(tangan(aktif[2])[0], tangan(aktif[2])[1], s * 0.045)} warna={k.putih} isi={0.18} tebal={tebalGaris * 0.8} /> : null}
      {pose === "hp" ? (
        <>
          <Bentuk pts={persegiBulat(cx + (0.04 * m - 0.06) * s, top + 0.47 * s, 0.12 * s, 0.2 * s, s * 0.018)} warna={k.putih} isi={0.1} tebal={tebalGaris} />
          <Bidang pts={persegi(cx + (0.04 * m - 0.045) * s, top + 0.49 * s, 0.09 * s, 0.15 * s)} warna={k.biru} isi={0.55} />
        </>
      ) : null}
      {pose === "struk" ? (
        <>
          <Bentuk
            pts={S([[0.34, -0.22], [0.58, -0.22], [0.58, 0.08], [0.55, 0.06], [0.52, 0.08], [0.49, 0.06], [0.46, 0.08], [0.43, 0.06], [0.4, 0.08], [0.37, 0.06], [0.34, 0.08], [0.34, -0.22]])}
            warna={k.putih}
            isi={0.16}
            tebal={tebalGaris}
          />
          {[-0.16, -0.11, -0.06, -0.01].map((y, i) => (
            <Gr key={i} pts={S([[0.38, y], [i === 3 ? 0.5 : 0.54, y]])} tebal={tebalGaris * 0.6} />
          ))}
          {teks ? <Tulis x={cx + 0.46 * m * s} y={top + 0.04 * s} teks={teks} ukuran={s * 0.06} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" /> : null}
        </>
      ) : null}
      {pose === "emas" ? <BatangEmas cx={cx + 0.3 * m * s} cy={top + 0.43 * s} s={0.36 * s} /> : null}
      {pose === "jempol" ? <Gr pts={S([[0.47, 0.37], [0.47, 0.25]])} warna={k.putih} tebal={s * 0.035} /> : null}
      {pose === "tunjuk" ? <Gr pts={S([[0.68, 0.425], [0.76, 0.41]])} warna={k.putih} tebal={s * 0.025} /> : null}
      {pose === "mikir" ? (
        <>
          {[
            [0.24, 0.0, 0.025],
            [0.32, -0.08, 0.04],
          ].map(([x, y, r], i) => (
            <Bentuk key={i} pts={elips(cx + x * m * s, top + y * s, r * s)} warna={k.putih} isi={0.08} tebal={tebalGaris * 0.8} />
          ))}
          <Bentuk pts={elips(cx + 0.5 * m * s, top - 0.24 * s, 0.13 * s, 0.11 * s)} warna={k.putih} isi={0.08} tebal={tebalGaris} />
          <Tulis x={cx + 0.5 * m * s} y={top - 0.24 * s} teks={teks ?? "?"} ukuran={s * (teks ? 0.07 : 0.15)} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" />
        </>
      ) : null}
      {pose === "kaget" ? (
        <>
          {[
            [[0.18, -0.03], [0.24, -0.1]],
            [[0.0, -0.06], [0.0, -0.14]],
            [[-0.18, -0.03], [-0.24, -0.1]],
          ].map((g, i) => (
            <Gr key={i} pts={S(g as P[])} warna={k.kuning} tebal={tebalGaris} />
          ))}
        </>
      ) : null}
    </>
  );
};
