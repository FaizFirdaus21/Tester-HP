import React from "react";
import { Composition } from "remotion";
import { REELS } from "./brand";
import { DURASI_ISI, DURASI_PENUTUP, NaikBerapa, NaikBerapaProps } from "./seri/NaikBerapa";
import { ROBOT_DURASI, RobotLiftoff } from "./seri/RobotLiftoff";
import { DURASI_INFLASI, InflasiTerkendali } from "./video/inflasi/InflasiTerkendali";
import "./tema/malam";
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
