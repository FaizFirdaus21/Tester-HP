import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { tilt, waktu, whip, zoom } from "../../komponen/Transisi";
import { m } from "../../tema/malam";
import { Bulanan, Judul, Keranjang, LepasLandas, SalahPaham, Tahunan } from "./AdeganA";
import { AdeganCabai, CABAI_FASE, Dompet, Disalahpahami, KESIMPULAN_FASE, Kesimpulan, Metafora, Pangan, Penutup, TahuKan } from "./AdeganB";

// Urutan adegan dan transisi. `t` = transisi SETELAH adegan itu (null = potongan langsung).
type Langkah = { id: string; durasi: number; C: React.FC; t: null | { jenis: "whip-kiri" | "whip-kanan" | "whip-atas" | "zoom" | "tilt"; durasi: number; x?: number; y?: number } };

export const LANGKAH: Langkah[] = [
  { id: "judul", durasi: 90, C: Judul, t: { jenis: "zoom", durasi: 12, x: 540, y: 980 } },
  { id: "keranjang", durasi: 190, C: Keranjang, t: { jenis: "whip-kiri", durasi: 10 } },
  { id: "lepas-landas", durasi: 80, C: LepasLandas, t: { jenis: "tilt", durasi: 14 } },
  { id: "tahunan", durasi: 185, C: Tahunan, t: { jenis: "whip-kiri", durasi: 10 } },
  { id: "bulanan", durasi: 100, C: Bulanan, t: null },
  { id: "salah-paham", durasi: 160, C: SalahPaham, t: { jenis: "zoom", durasi: 12, x: 540, y: 640 } },
  { id: "cabai", durasi: CABAI_FASE[0] + CABAI_FASE[1] + CABAI_FASE[2], C: AdeganCabai, t: null },
  { id: "disalahpahami", durasi: 66, C: Disalahpahami, t: { jenis: "tilt", durasi: 14 } },
  { id: "metafora", durasi: 160, C: Metafora, t: { jenis: "whip-kiri", durasi: 10 } },
  { id: "pangan", durasi: 210, C: Pangan, t: { jenis: "zoom", durasi: 12, x: 540, y: 880 } },
  { id: "dompet", durasi: 150, C: Dompet, t: { jenis: "tilt", durasi: 14 } },
  { id: "kesimpulan", durasi: KESIMPULAN_FASE[0] + KESIMPULAN_FASE[1], C: Kesimpulan, t: { jenis: "zoom", durasi: 12, x: 540, y: 640 } },
  { id: "tahu-kan", durasi: 76, C: TahuKan, t: { jenis: "whip-atas", durasi: 10 } },
  { id: "penutup", durasi: 54, C: Penutup, t: null },
];

export const DURASI_INFLASI = LANGKAH.reduce((n, l) => n + l.durasi - (l.t ? l.t.durasi : 0), 0);

const presentasi = (t: NonNullable<Langkah["t"]>) => {
  if (t.jenis === "zoom") return zoom(t.x, t.y);
  if (t.jenis === "tilt") return tilt();
  if (t.jenis === "whip-kanan") return whip("kanan");
  if (t.jenis === "whip-atas") return whip("atas");
  return whip("kiri");
};

export const InflasiTerkendali: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: m.langit }}>
    <TransitionSeries>
      {LANGKAH.flatMap((l) => {
        const el = [
          <TransitionSeries.Sequence key={l.id} durationInFrames={l.durasi}>
            <l.C />
          </TransitionSeries.Sequence>,
        ];
        if (l.t) {
          el.push(<TransitionSeries.Transition key={`${l.id}-t`} presentation={presentasi(l.t) as never} timing={waktu(l.t.durasi)} />);
        }
        return el;
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
