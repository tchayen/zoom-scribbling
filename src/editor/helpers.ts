import consts from "../consts";
import { Line, Point } from "../types";
import { readFromDb, saveToDb } from "./indexedDb";

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
  const next = clamp(
    scale + direction * consts.SCALE_FACTOR,
    consts.MIN_SCALE,
    consts.MAX_SCALE
  );
  const delta = next - previous;

  const nextCamera = {
    x: camera.x + ((camera.x + pointer.x) * delta) / previous,
    y: camera.y + ((camera.y + pointer.y) * delta) / previous,
  };

  return { scale: next, camera: nextCamera };
};

export const zoomTo = (
  targetScale: number,
  currentScale: number,
  canvas: HTMLCanvasElement,
  camera: Point
) => {
  const previous = currentScale;
  const delta = targetScale - previous;
  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  camera.x = camera.x + ((camera.x + center.x) * delta) / previous;
  camera.y = camera.y + ((camera.y + center.y) * delta) / previous;

  return {
    scale: 1,
    camera,
  };
};

export const translate = (camera: Point, delta: Point, scale: number) => {
  const x =
    delta.x !== 0 ? Math.sign(delta.x) * scale * consts.TRANSLATE_FACTOR : 0;
  const y =
    delta.y !== 0 ? Math.sign(delta.y) * scale * consts.TRANSLATE_FACTOR : 0;

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

const asBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result === null) {
        reject();
      } else {
        resolve(result);
      }
    });
  });

export const generateMiniature = async (canvas: HTMLCanvasElement) => {
  const blob = await asBlob(canvas);
  const id = await saveToDb(blob);
  const miniature = await readFromDb(id);

  const img = document.createElement("img");
  const url = URL.createObjectURL(miniature);
  img.src = url;

  img.style.position = "absolute";
  img.style.zIndex = "10";
  img.style.top = "0px";
  img.style.left = "0px";
  img.width = canvas.width / 6;
  img.height = canvas.height / 6;
  img.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.25)";

  document.body.appendChild(img);
};

export const invertHex = (hex: string) => {
  const number = hex.substring(1, 7);
  const inverted = (Number(`0x1${number}`) ^ 0xffffff)
    .toString(16)
    .substr(1)
    .toUpperCase();

  return `#${inverted}`;
};
