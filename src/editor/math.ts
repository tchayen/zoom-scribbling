import consts from "../consts";
import { Line, Point } from "../types";

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const screenToCameraSpace = (
  point: Point,
  camera: Point & { scale: number }
) => {
  return {
    x: (point.x + camera.x) / camera.scale,
    y: (point.y + camera.y) / camera.scale,
  };
};

export const zoom = (
  direction: number,
  pointer: Point,
  camera: Point & { scale: number }
) => {
  const previous = camera.scale;
  const next = clamp(
    camera.scale + direction * consts.SCALE_FACTOR,
    consts.MIN_SCALE,
    consts.MAX_SCALE
  );
  const delta = next - previous;

  const nextCamera = {
    x: camera.x + ((camera.x + pointer.x) * delta) / previous,
    y: camera.y + ((camera.y + pointer.y) * delta) / previous,
  };

  return {
    scale: next,
    ...nextCamera,
  };
};

export const zoomTo = (
  targetScale: number,
  currentScale: number,
  center: Point,
  camera: Point
) => {
  const previous = currentScale;
  const delta = targetScale - previous;

  const next = {
    x: camera.x + ((camera.x + center.x) * delta) / previous,
    y: camera.y + ((camera.y + center.y) * delta) / previous,
  };

  return {
    scale: 1,
    ...next,
  };
};

export const translate = (camera: Point & { scale: number }, delta: Point) => {
  const x =
    delta.x !== 0
      ? Math.sign(delta.x) * camera.scale * consts.TRANSLATE_FACTOR
      : 0;
  const y =
    delta.y !== 0
      ? Math.sign(delta.y) * camera.scale * consts.TRANSLATE_FACTOR
      : 0;

  return {
    x: camera.x + x,
    y: camera.y + y,
  };
};

export const cameraSpaceToTile = (point: Point) => {
  return {
    x: Math.floor(point.x / consts.TILE_SIZE),
    y: Math.floor(point.y / consts.TILE_SIZE),
  };
};

// https://stackoverflow.com/a/24392281
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

export const rectangleContains = (
  point: Point,
  rectangle: { x: number; y: number; width: number; height: number }
) => {
  return (
    point.x >= rectangle.x &&
    point.x <= rectangle.x + rectangle.width &&
    point.y >= rectangle.y &&
    point.y <= rectangle.y + rectangle.height
  );
};
