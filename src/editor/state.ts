import { atom } from "recoil";
import { Mode, Point } from "../types";

export const cameraState = atom<Point & { scale: number }>({
  key: "camera",
  default: { x: 0, y: 0, scale: 1 },
});

export const modeState = atom<Mode>({
  key: "mode",
  default: "draw",
});

export const pointerPressureState = atom<boolean>({
  key: "pointerPressure",
  default: false,
});

export const smoothingState = atom<boolean>({
  key: "smoothing",
  default: true,
});

export const thicknessState = atom<string>({
  key: "thickness",
  default: "1",
});

export const colorState = atom<string>({
  key: "color",
  default: "#000000",
});
