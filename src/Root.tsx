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
    <Composition id="BungaDepositoLPS" component={BungaDepositoLPS} durationInFrames={DURASI_DEPOSITO} fps={30} width={1080} height={1920} />
    <Composition id="InflasiSinematik" component={InflasiSinematik} durationInFrames={DURASI_V3} fps={30} width={1080} height={1920} />
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
