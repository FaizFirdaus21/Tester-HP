import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { tilt, waktu, whip, zoom } from "../../komponen/Transisi";
import { m } from "../../tema/malam";
import { Bulanan, Judul, Keranjang, KeLangit, SalahPaham, Tahunan } from "./AdeganA";
import urutan from "./urutan.json";
import { AdeganCabai, CABAI_FASE, Dompet, Disalahpahami, KESIMPULAN_FASE, Kesimpulan, Metafora, Pangan, Penutup, TahuKan } from "./AdeganB";

// Urutan, durasi, dan transisi diambil dari urutan.json (juga dipakai untuk storyboard).
type Transisi = { jenis: "whip-kiri" | "whip-kanan" | "whip-atas" | "zoom" | "tilt"; durasi: number; x?: number; y?: number };
type Langkah = { id: string; durasi: number; C: React.FC; t: Transisi | null };

const KOMPONEN: Record<string, React.FC> = {
  judul: Judul,
  keranjang: Keranjang,
  "ke-langit": KeLangit,
  tahunan: Tahunan,
  bulanan: Bulanan,
  "salah-paham": SalahPaham,
  cabai: AdeganCabai,
  disalahpahami: Disalahpahami,
  metafora: Metafora,
  pangan: Pangan,
  dompet: Dompet,
  kesimpulan: Kesimpulan,
  "tahu-kan": TahuKan,
  penutup: Penutup,
};

export const LANGKAH: Langkah[] = (urutan as { id: string; durasi: number; transisi: Transisi | null }[]).map((u) => ({
  id: u.id,
  durasi: u.durasi,
  C: KOMPONEN[u.id],
  t: u.transisi,
}));

if (LANGKAH.find((l) => l.id === "cabai")!.durasi !== CABAI_FASE[0] + CABAI_FASE[1] + CABAI_FASE[2]) {
  throw new Error("Durasi cabai di urutan.json tidak cocok dengan CABAI_FASE");
}
if (LANGKAH.find((l) => l.id === "kesimpulan")!.durasi !== KESIMPULAN_FASE[0] + KESIMPULAN_FASE[1]) {
  throw new Error("Durasi kesimpulan di urutan.json tidak cocok dengan KESIMPULAN_FASE");
}

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
