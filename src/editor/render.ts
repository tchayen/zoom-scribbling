import colors, { ColorMode } from "../components/colors";
import { Point } from "../types";
import { invertHex } from "../helpers/colors";
import { shapes, selection } from "./scene";

const reset = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  camera: Point & { scale: number },
  colorMode: ColorMode
) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = colors[colorMode].background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.translate(-camera.x, -camera.y);
  ctx.scale(camera.scale, camera.scale);
};

const render = (
  ctx: CanvasRenderingContext2D | null,
  canvas: HTMLCanvasElement,
  camera: Point & { scale: number },
  colorMode: ColorMode,
  cleanMode?: boolean
) => {
  const start = performance.now();

  if (ctx === null) {
    throw new Error("No ctx");
  }

  reset(ctx, canvas, camera, colorMode);

  for (const shape of shapes) {
    if (shape.points.length < 2) {
      continue;
    }

    if (shape.state === "invisible") {
      continue;
    }

    ctx.beginPath();
    ctx.lineWidth = shape.thickness;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle =
      colorMode === "dark" ? invertHex(shape.color) : shape.color;

    if (!cleanMode && shape.state === "erased") {
      ctx.setLineDash([10, 10 + shape.thickness]);
    } else if (!cleanMode && shape.state === "selected") {
      ctx.setLineDash([3, 3 + shape.thickness]);
    } else {
      ctx.setLineDash([]);
    }

    const points = shape.simplified || shape.points;

    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
    ctx.closePath();
  }

  if (!cleanMode && selection !== null) {
    ctx.setLineDash([]);

    const rectangle = [
      selection.start.x,
      selection.start.y,
      selection.end.x - selection.start.x,
      selection.end.y - selection.start.y,
    ];

    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";

    ctx.fillRect(...rectangle);

    ctx.strokeStyle = "#000";
    ctx.lineCap = "square";
    ctx.lineJoin = "bevel";
    ctx.lineWidth = 1 / camera.scale;

    ctx.strokeRect(...rectangle);
  }

  const end = performance.now();

  // console.log(`${end - start}ms`);
};

export default render;
