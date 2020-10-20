import { atom } from "recoil";
import { Mode, Point } from "../types";

export const scaleState = atom<number>({
  key: "scale",
  default: 1,
});

export const cameraState = atom<Point>({
  key: "camera",
  default: { x: 0, y: 0 },
});

export const modeState = atom<Mode>({
  key: "mode",
  default: "draw",
});
