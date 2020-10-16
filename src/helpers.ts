import { Line, Point } from "./types";

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
    y: (point.y + camera.y) / scale,
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

export const zoomTo = (
  targetScale: number,
  currentScale: number,
  camera: Point
) => {
  const previous = currentScale;
  const delta = targetScale - previous;
  const center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  camera.x = camera.x + ((camera.x + center.x) * delta) / previous;
  camera.y = camera.y + ((camera.y + center.y) * delta) / previous;

  return {
    scale: 1,
    camera,
  };
};

export const translate = (camera: Point, delta: Point, scale: number) => {
  const factor = 25;
  const x = delta.x !== 0 ? Math.sign(delta.x) * scale * factor : 0;
  const y = delta.y !== 0 ? Math.sign(delta.y) * scale * factor : 0;

  return {
    x: camera.x + x,
    y: camera.y + y,
  };
};

export const cameraSpaceToTile = (point: Point) => {
  return {
    x: Math.floor(point.x / TILE_SIZE),
    y: Math.floor(point.y / TILE_SIZE),
  };
};

export const intersect = ([a, b]: Line, [c, d]: Line) => {
  let det = (b.x - a.x) * (d.y - c.y) - (d.x - c.x) * (b.y - a.y);
  if (det === 0) {
    return false;
  } else {
    const lambda =
      ((d.y - c.y) * (d.x - a.x) + (c.x - d.x) * (d.y - a.y)) / det;
    const gamma = ((a.y - b.y) * (d.x - a.x) + (b.x - a.x) * (d.y - a.y)) / det;
    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
  }
};
