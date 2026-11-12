import React from "react";
import { Composition } from "remotion";
import { REELS } from "./brand";
import { DURASI_ISI, DURASI_PENUTUP, NaikBerapa, NaikBerapaProps } from "./seri/NaikBerapa";
import { ROBOT_DURASI, RobotLiftoff } from "./seri/RobotLiftoff";
import { DURASI_INFLASI, InflasiTerkendali } from "./video/inflasi/InflasiTerkendali";
import "./tema/malam";
import { BLUEPRINT_DURASI, RobotBlueprint } from "./seri/RobotBlueprint";
import { UjiTiga } from "./tiga/UjiTiga";
import "./catatan/tema";
import { DURASI_CATATAN, InflasiCatatan } from "./catatan/demo/InflasiCatatan";
import { DURASI_V3, InflasiSinematik } from "./video/v3/Video";
import { InflasiBlueprint } from "./video/inflasiBp/InflasiBlueprint";
import { DURASI_BP } from "./video/inflasiBp/linimasa";
import { BungaDepositoLPS, DURASI_DEPOSITO } from "./produksi/bunga-deposito-lps/Video";
import { HoloDompet } from "./konsep/HoloDompet";
import { KotaUang } from "./konsep/KotaUang";
import { HoloDompet2 } from "./konsep/HoloDompet2";
import { DURASI_PAPAN, DepositoPapan } from "./papan/demo/DepositoPapan";
import { BrandBoardPapan, FotoProfilPapan } from "./papan/BrandBoard";
import { DataSampul, SampulDeposito, SampulPapan } from "./papan/Sampul";
import { CarouselPapan, PropsCarousel, SLIDE_H, SLIDE_W } from "./papan/Carousel";
import contohCarousel from "./papan/demo/carousel-emas.json";
import { GaleriIlustrasi } from "./papan/demo/GaleriIlustrasi";
import { DURASI_UJI_GERAK, HoloUjiGerak } from "./konsep/HoloUjiGerak";
import { ChromeMinimal } from "./konsep/ChromeMinimal";
import { DURASI_KONSEP } from "./konsep/umum";
import { BungaDepositoLPSv2, DURASI_DEPOSITO_V2 } from "./produksi/bunga-deposito-lps-v2/Video";
import { DURASI_PAYLATER, PaylaterReels } from "./produksi/paylater-1212/Video";
import { DURASI_GAYA_HIDUP, GayaHidupReels } from "./produksi/gaya-hidup-ikut-naik/Video";
import contohNaikBerapa from "../data/naik-berapa-contoh.json";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="NaikBerapa"
      component={NaikBerapa}
      durationInFrames={DURASI_ISI + DURASI_PENUTUP}
      fps={REELS.fps}
      width={REELS.width}
      height={REELS.height}
      defaultProps={contohNaikBerapa as NaikBerapaProps}
    />
    <Composition
      id="InflasiTerkendali"
      component={InflasiTerkendali}
      durationInFrames={DURASI_INFLASI}
      fps={REELS.fps}
      width={REELS.width}
      height={REELS.height}
    />
    <Composition id="InflasiCatatan" component={InflasiCatatan} durationInFrames={DURASI_CATATAN} fps={30} width={1080} height={1920} />
    <Composition id="PaylaterReels" component={PaylaterReels} durationInFrames={DURASI_PAYLATER} fps={30} width={1080} height={1920} />
    <Composition id="GayaHidupReels" component={GayaHidupReels} durationInFrames={DURASI_GAYA_HIDUP} fps={30} width={1080} height={1920} />
    <Composition id="BungaDepositoLPSv2" component={BungaDepositoLPSv2} durationInFrames={DURASI_DEPOSITO_V2} fps={30} width={1080} height={1920} />
    <Composition id="BungaDepositoLPS" component={BungaDepositoLPS} durationInFrames={DURASI_DEPOSITO} fps={30} width={1080} height={1920} />
    <Composition id="InflasiSinematik" component={InflasiSinematik} durationInFrames={DURASI_V3} fps={30} width={1080} height={1920} />
    <Composition id="KonsepHolo" component={HoloDompet} durationInFrames={DURASI_KONSEP} fps={30} width={1080} height={1920} />
    <Composition id="KonsepHolo2" component={HoloDompet2} durationInFrames={DURASI_KONSEP} fps={30} width={1080} height={1920} />
    <Composition id="SampulDeposito" component={SampulDeposito} durationInFrames={1} fps={30} width={1080} height={1920} />
    {/* Sampul Reels generik: node scripts/sampul.mjs <keluar.jpg> --atas ... --angka ... --bawah ... [--label ...] */}
    <Composition
      id="SampulPapan"
      component={SampulPapan}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ label: "sebelum taruh uang, cek ini", atas: "Deposito", angka: "6%", bawah: "aman nggak?" } as DataSampul}
    />
    <Composition id="GaleriIlustrasi" component={GaleriIlustrasi} durationInFrames={1} fps={30} width={2700} height={1500} />
    {/* Carousel Papan Kapur: node scripts/carousel.mjs <carousel.json> <folder-keluar> */}
    <Composition
      id="CarouselPapan"
      component={CarouselPapan}
      durationInFrames={1}
      fps={30}
      width={SLIDE_W}
      height={SLIDE_H}
      defaultProps={{ data: contohCarousel, slide: 0 } as PropsCarousel}
    />
    <Composition id="BrandBoardPapan" component={BrandBoardPapan} durationInFrames={1} fps={30} width={2400} height={3000} />
    <Composition id="FotoProfilPapan" component={FotoProfilPapan} durationInFrames={1} fps={30} width={1080} height={1080} />
    <Composition id="DepositoPapan" component={DepositoPapan} durationInFrames={DURASI_PAPAN} fps={30} width={1080} height={1920} />
    <Composition id="HoloUjiGerak" component={HoloUjiGerak} durationInFrames={DURASI_UJI_GERAK} fps={30} width={1080} height={1920} />
    <Composition id="KonsepKota" component={KotaUang} durationInFrames={DURASI_KONSEP} fps={30} width={1080} height={1920} />
    <Composition id="KonsepChrome" component={ChromeMinimal} durationInFrames={DURASI_KONSEP} fps={30} width={1080} height={1920} />
    <Composition id="UjiTiga" component={UjiTiga} durationInFrames={30} fps={30} width={1080} height={1920} />
    <Composition
      id="InflasiBlueprint"
      component={InflasiBlueprint}
      durationInFrames={DURASI_BP}
      fps={REELS.fps}
      width={REELS.width}
      height={REELS.height}
    />
    <Composition
      id="RobotBlueprint"
      component={RobotBlueprint}
      durationInFrames={BLUEPRINT_DURASI}
      fps={REELS.fps}
      width={REELS.width}
      height={REELS.height}
    />
    <Composition
      id="RobotLiftoff"
      component={RobotLiftoff}
      durationInFrames={ROBOT_DURASI}
      fps={REELS.fps}
      width={REELS.width}
      height={REELS.height}
    />
  </>
);
