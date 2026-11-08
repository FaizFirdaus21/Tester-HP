import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
// Reels: kualitas tinggi supaya teks dan grafik tetap tajam setelah dikompres Instagram.
Config.setCrf(16);
