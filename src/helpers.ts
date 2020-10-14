import { Point } from "./types";

export const TILE_SIZE = 1000;

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const screenToCameraSpace = (
  point: Point,
  camera: Point,
  scale: number
) => {
  return {
    x: (point.x + camera.x) / scale,
    y: (point.y + camera.y) / scale
  };
};

export const zoom = (
  direction: number,
  pointer: Point,
  camera: Point,
  scale: number
) => {
  const previous = scale;
  const next = clamp(scale + direction * 0.05, 0.25, 2);
  const delta = next - previous;

  camera.x = camera.x + ((camera.x + pointer.x) * delta) / previous;
  camera.y = camera.y + ((camera.y + pointer.y) * delta) / previous;
  scale = next;

  return { scale, camera };
};

export const translate = (camera: Point, delta: Point) => {
  return {
    x: camera.x + delta.x,
    y: camera.y + delta.y
  };
};

export const cameraSpaceToTile = (point: Point) => {
  return {
    x: Math.floor(point.x / TILE_SIZE),
    y: Math.floor(point.y / TILE_SIZE)
  };
};
