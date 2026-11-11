// Sampul Reels gaya Papan Kapur (1080×1920). Isi penting di tengah supaya aman
// untuk potongan grid profil Instagram (3:4, y 240–1680) dan feed (4:5, y 285–1635).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SimbolKapur } from "./BrandBoard";
import { Coret, FilterKapur, Tulis, garis, lingkaran } from "./Komponen";
import { k } from "./tema";

const SUDAH = -9999;

export type DataSampul = { atas: string; angka: string; bawah: string; label?: string };

export const SampulPapan: React.FC<DataSampul> = ({ atas, angka, bawah, label }) => (
  <AbsoluteFill style={{ background: "#0f0d0b", overflow: "hidden" }}>
    <FilterKapur />
    <Img src={staticFile("papan/papan.jpg")} style={{ position: "absolute", left: -540, top: -2400, width: 2160, height: 7680 }} />
    <AbsoluteFill style={{ background: "radial-gradient(80% 55% at 50% 45%, rgba(255,244,220,0.09), transparent 60%, rgba(0,0,0,0.5))" }} />
    {label ? <Tulis x={540} y={470} teks={label} ukuran={56} gaya="tipis" warna={k.biru} mulai={SUDAH} rata="center" /> : null}
    <Tulis x={540} y={620} teks={atas} ukuran={150} gaya="tebal" mulai={SUDAH} rata="center" />
    <Tulis x={540} y={930} teks={angka} ukuran={430} gaya="tebal" warna={k.kuning} mulai={SUDAH} rata="center" tebalFilter />
    <Coret pts={garis(260, 1150, 820, 1140, 3, 5)} mulai={SUDAH} warna={k.kuning} tebal={14} kapur={false} />
    <Tulis x={540} y={1290} teks={bawah} ukuran={150} gaya="hias" warna={k.merah} mulai={SUDAH} rata="center" />
    <Coret pts={lingkaran(540, 930, 400, 230, 7)} mulai={SUDAH} warna={k.merah} tebal={7} kapur={false} />
    <SimbolKapur x={330} y={1440} s={90} />
    <Tulis x={440} y={1486} teks="@intipdompet" ukuran={64} gaya="tebal" mulai={SUDAH} />
  </AbsoluteFill>
);

export const SampulDeposito: React.FC = () => <SampulPapan label="sebelum taruh uang, cek ini" atas="Deposito" angka="6%" bawah="aman nggak?" />;
