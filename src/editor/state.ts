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

export const pointerPressureState = atom<boolean>({
  key: "pointerPressure",
  default: false,
});

export const thicknessState = atom<string>({
  key: "thickness",
  default: "1",
});

export const colorState = atom<string>({
  key: "color",
  default: "#000000",
});
