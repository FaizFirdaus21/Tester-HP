import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { formatPersen, jarak, sudut, teks, warna } from "../brand";
import { CelahIntip } from "../komponen/CelahIntip";
import { GrafikBatang, TitikData } from "../komponen/GrafikBatang";
import { Penutup } from "../komponen/Penutup";
import { Watermark } from "../komponen/Watermark";

export type NaikBerapaProps = {
  contoh?: boolean; // true = angka contoh, tampilkan peringatan di layar
  label: string;
  judul: string;
  sorot: string; // kata yang diberi stabilo kuning
  satuan: string;
  data: TitikData[];
  naikItuBuruk: boolean; // harga naik = buruk untuk dompet (merah); tabungan naik = baik (hijau)
  pertanyaan: string;
  sumber: string;
  ajakan: string;
};

export const DURASI_ISI = 330; // 11 detik
export const DURASI_PENUTUP = 90; // 3 detik

const Muncul: React.FC<{ mulai: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  mulai,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - mulai, fps, config: { damping: 200 } });
  return (
    <div style={{ ...style, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)` }}>
      {children}
    </div>
  );
};

const Isi: React.FC<NaikBerapaProps> = (p) => {
  const { width } = useVideoConfig();
  const awal = p.data[0]?.nilai ?? 0;
  const akhir = p.data[p.data.length - 1]?.nilai ?? 0;
  const persen = awal ? ((akhir - awal) / awal) * 100 : 0;
  const naik = persen >= 0;
  const buruk = naik === p.naikItuBuruk;
  const warnaUbah = buruk ? warna.merah : warna.hijau;
  const rentang = p.data.length > 1 ? `${p.data[0].label}–${p.data[p.data.length - 1].label}` : "";
  const lebarIsi = width - jarak.j4 * 2;

  return (
    <AbsoluteFill style={{ backgroundColor: warna.kertas }}>
      <Watermark />
      <div
        style={{
          position: "absolute",
          left: jarak.j4,
          right: jarak.j4,
          top: jarak.amanAtas,
          bottom: jarak.amanBawah,
          display: "flex",
          flexDirection: "column",
          gap: jarak.j2,
          paddingTop: jarak.j1,
        }}
      >
        <Muncul mulai={12}>
          <div style={{ ...teks.label, color: warna.biru }}>
            Seri · {p.label}
            {p.contoh ? " · data contoh" : ""}
          </div>
        </Muncul>
        <Muncul mulai={16}>
          <div style={{ ...teks.judul, color: warna.tinta }}>
            {p.judul}{" "}
            <span style={{ backgroundColor: warna.kuningKoin, borderRadius: sudut.kecil, padding: "0 12px" }}>
              {p.sorot}
            </span>
          </div>
        </Muncul>
        <Muncul mulai={30}>
          <div style={{ backgroundColor: warna.kertas2, borderRadius: sudut.panel, paddingTop: jarak.j1 }}>
            <div style={{ ...teks.sumber, color: warna.tintaPudar, padding: `0 ${jarak.j2}px` }}>{p.satuan}</div>
            <GrafikBatang data={p.data} lebar={lebarIsi} tinggi={640} mulai={40} />
          </div>
        </Muncul>
        <Muncul mulai={40 + p.data.length * 3 + 30}>
          <div style={{ ...teks.isi, color: warna.tinta }}>
            {rentang}, {naik ? "naik" : "turun"}{" "}
            <span style={{ fontFamily: teks.angkaData.fontFamily, fontWeight: 500, color: warnaUbah }}>
              {naik ? "▲" : "▼"} {formatPersen(persen)}
            </span>
            . {p.pertanyaan}
          </div>
        </Muncul>
        <div style={{ ...teks.sumber, color: warna.tintaPudar, marginTop: "auto" }}>
          {p.sumber}
          {p.contoh ? " · angka di atas hanya contoh" : ""}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const NaikBerapa: React.FC<NaikBerapaProps> = (props) => (
  <AbsoluteFill>
    <Sequence durationInFrames={DURASI_ISI}>
      <CelahIntip>
        <Isi {...props} />
      </CelahIntip>
    </Sequence>
    <Sequence from={DURASI_ISI} durationInFrames={DURASI_PENUTUP}>
      <Penutup ajakan={props.ajakan} />
    </Sequence>
  </AbsoluteFill>
);
