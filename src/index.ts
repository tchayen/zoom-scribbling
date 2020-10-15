// TODO
// - Add unit tests to fix bugs with undo/redo and erasing.
// - Fix bug with undoing during drawing.
// - Resize throttling.

import { screenToCameraSpace, translate, zoom, zoomTo } from "./helpers";
import {
  redo,
  undo,
  shapes,
  startShape,
  finishShape,
  appendLine,
  appendErase,
  finishErase,
  startErase,
} from "./scene";
import { Mode, Shape } from "./types";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const buffer = document.createElement("canvas");
buffer.width = canvas.width;
buffer.height = canvas.height;
const bufferCtx = buffer.getContext("2d");

if (ctx === null) {
  throw new Error("Failed to create canvas context.");
}

if (bufferCtx === null) {
  throw new Error("Failed to create buffer canvas context.");
}

bufferCtx.drawImage(canvas, 0, 0);
ctx.drawImage(buffer, 0, 0);

const resetSizes = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buffer.width = canvas.width;
  buffer.height = canvas.height;
};

const scaleElement = document.getElementById("scale");

if (scaleElement === null) {
  throw new Error("HTML is missing #scale.");
}

let scale = 1;
let camera = { x: 0, y: 0 };
let mouseDown = false;
let mode: Mode = "draw";

const updateText = () => {
  const value = (scale * 100).toFixed(0);
  const cameraX = camera.x.toFixed(0);
  const cameraY = camera.y.toFixed(0);
  scaleElement.innerHTML = `(${cameraX}, ${cameraY}) · ${value}% · ${mode} mode`;
};

const reset = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.translate(-camera.x, -camera.y);
  ctx.scale(scale, scale);
};

const render = () => {
  reset();

  for (const shape of shapes) {
    if (shape.points.length < 2) {
      continue;
    }

    if (!shape.visible) {
      continue;
    }

    ctx.beginPath();
    ctx.strokeStyle = shape.color;

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

  if (mode === "draw") {
    startShape(point);
  } else if (mode === "erase") {
    startErase(point);
  }
};

const handlePointerUp = (event: PointerEvent) => {
  mouseDown = false;

  if (mode === "draw") {
    finishShape();
  } else if (mode === "erase") {
    finishErase();
  }
  render();
};

const handlePointerMove = (event: PointerEvent) => {
  if (mouseDown) {
    const point = screenToCameraSpace(
      { x: event.offsetX, y: event.offsetY },
      camera,
      scale
    );

    if (mode === "draw") {
      appendLine(point);
    } else if (mode === "erase") {
      appendErase(point);
    }
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
    camera = translate(camera, { x: event.deltaX, y: event.deltaY }, scale);
  }
  render();
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() === "z") {
    if (event.metaKey || event.ctrlKey) {
      if (event.shiftKey) {
        redo();
        render();
      } else {
        undo();
        render();
      }
    }
  }

  if (event.key === ")" && event.shiftKey) {
    const zoomed = zoomTo(1, scale, camera);
    camera = zoomed.camera;
    scale = zoomed.scale;
    render();
  }

  if (event.key.toLowerCase() === "e") {
    mode = "erase";
  }

  if (event.key.toLowerCase() === "d") {
    mode = "draw";
  }
};

const handleResize = () => {
  resetSizes();
  render();
};

render();

window.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerdown", handlePointerDown);
window.addEventListener("pointerup", handlePointerUp);
window.addEventListener("wheel", handleWheel);
window.addEventListener("keypress", handleKeyPress);
window.addEventListener("resize", handleResize);
