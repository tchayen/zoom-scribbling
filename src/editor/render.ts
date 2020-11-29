import colors, { ColorMode } from "../components/colors";
import { Point } from "../types";
import { invertHex } from "../helpers/colors";
import { shapes, selection, simplified } from "./scene";

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
  colorMode: ColorMode
) => {
  const start = performance.now();

  if (ctx === null) {
    throw new Error("No ctx");
  }

  reset(ctx, canvas, camera, colorMode);

  for (let i = 0; i < shapes.length; i++) {
    const shape = {
      ...shapes[i],
      points: simplified[shapes[i].id] || shapes[i].points,
    };

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

  if (selection !== null) {
    const rectangle = [
      selection.start.x,
      selection.start.y,
      selection.end.x - selection.start.x,
      selection.end.y - selection.start.y,
    ];

    ctx.fillStyle = "rgba(255, 0, 255, 0.25)";

    ctx.fillRect(...rectangle);

    ctx.strokeStyle = "#ff00ff";
    ctx.lineCap = "square";
    ctx.lineJoin = "bevel";
    ctx.lineWidth = 1 / camera.scale;

    ctx.strokeRect(...rectangle);
  }

  const end = performance.now();

  // console.log(`${end - start}ms`);
};

export default render;
