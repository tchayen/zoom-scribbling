import colors, { ColorMode } from "../components/colors";
import consts from "../consts";
import { Point } from "../types";
import { invertHex } from "./helpers";
import { shapes } from "./scene";

const reset = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  camera: Point,
  scale: number,
  colorMode: ColorMode
) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = colors[colorMode].background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.translate(-camera.x, -camera.y);
  ctx.scale(scale, scale);
};

const render = (
  ctx: CanvasRenderingContext2D | null,
  canvas: HTMLCanvasElement,
  camera: Point,
  scale: number,
  colorMode: ColorMode
) => {
  if (ctx === null) {
    console.log("No ctx");
    return;
  }

  reset(ctx, canvas, camera, scale, colorMode);

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

    // if (shape.state === "erased") {
    //   ctx.setLineDash([consts.DASH_LENGTH, consts.DASH_LENGTH]);
    // } else {
    //   ctx.setLineDash([]);
    // }

    if (shape.state === "erased") {
      ctx.strokeStyle = "#ff00ff";
    }

    ctx.moveTo(shape.points[0].x, shape.points[0].y);
    for (let i = 1; i < shape.points.length; i++) {
      ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }

    ctx.stroke();
    ctx.closePath();
  }
};

export default render;
