import { screenToCameraSpace, translate, zoom } from "./helpers";
import { Shape } from "./types";

const size = 600;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext("2d");

const buffer = document.createElement("canvas");
buffer.width = canvas.width;
buffer.height = canvas.height;
const bufferCtx = buffer.getContext("2d");
bufferCtx.drawImage(canvas, 0, 0);
ctx.drawImage(buffer, 0, 0);

const box = document.getElementById("box");
box.style.width = `${size}px`;
box.style.height = `${size}px`;

let scale = 1;
let camera = { x: 0, y: 0 };
let mouseDown = false;

const shapes: Shape[] = [];

const updateText = () => {
  const value = (scale * 100).toFixed(0);
  document.getElementById("scale").innerHTML = `${value}%`;
};

const reset = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillRect(0, 0, size, size);

  ctx.translate(-camera.x, -camera.y);
  ctx.scale(scale, scale);
};

const render = () => {
  reset();

  for (const shape of shapes) {
    ctx.beginPath();

    if (shape.points.length < 2) {
      continue;
    }

    ctx.moveTo(shape.points[0].x, shape.points[0].y);
    for (let i = 1; i < shape.points.length; i++) {
      ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }

    ctx.stroke();
    ctx.closePath();
  }

  updateText();
};

const handlePointerDown = (event: PointerEvent) => {
  mouseDown = true;
  const point = screenToCameraSpace(
    { x: event.offsetX, y: event.offsetY },
    camera,
    scale
  );

  shapes.push({
    points: [point]
  });
};

const handlePointerUp = (event: PointerEvent) => {
  mouseDown = false;
};

const handlePointerMove = (event: PointerEvent) => {
  if (mouseDown) {
    const point = screenToCameraSpace(
      { x: event.offsetX, y: event.offsetY },
      camera,
      scale
    );

    shapes[shapes.length - 1].points.push(point);
  }
  render();
};

const handleWheel = (event: WheelEvent) => {
  if (event.metaKey || event.ctrlKey) {
    const zoomed = zoom(
      Math.sign(event.deltaY),
      { x: event.offsetX, y: event.offsetY },
      camera,
      scale
    );
    camera = zoomed.camera;
    scale = zoomed.scale;
  } else {
    camera = translate(camera, { x: event.deltaX, y: event.deltaY });
  }
  render();
};

render();

document.addEventListener("pointermove", handlePointerMove);
document.addEventListener("pointerdown", handlePointerDown);
document.addEventListener("pointerup", handlePointerUp);
document.addEventListener("wheel", handleWheel);
