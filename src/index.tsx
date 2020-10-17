import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import consts from "./consts";
import {
  generateMiniature,
  screenToCameraSpace,
  translate,
  zoom,
  zoomTo,
} from "./editor/helpers";
import { setupIndexedDb } from "./editor/indexedDb";
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
  exportState,
} from "./editor/scene";
import { Mode } from "./types";

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
let pointerDown = false;
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

    if (shape.state === "invisible") {
      continue;
    }

    ctx.beginPath();
    ctx.strokeStyle = shape.color;

    if (shape.state === "erased") {
      ctx.setLineDash([consts.DASH_LENGTH, consts.DASH_LENGTH]);
    } else {
      ctx.setLineDash([]);
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
  pointerDown = true;

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
  pointerDown = false;

  if (mode === "draw") {
    finishShape();
  } else if (mode === "erase") {
    finishErase();
  }
  render();
};

const handlePointerMove = (event: PointerEvent) => {
  if (event.target !== canvas) {
    return;
  }

  if (pointerDown) {
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

    render();
  }
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

  if (event.key.toLowerCase() === "m") {
    generateMiniature(canvas);
  }
};

const handleResize = () => {
  resetSizes();
  render();
};

render();

const download = document.getElementById("download");

if (!download) {
  throw new Error("HTML is missing download");
}

download.onclick = () => {
  const state = exportState();
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/plain;charset=utf-8,${encodeURIComponent(state)}`
  );
  element.setAttribute("download", "download.json");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const App = () => {
  useEffect(() => {
    setupIndexedDb();

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("keypress", handleKeyPress);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keypress", handleKeyPress);
      window.removeEventListener("resize", handleResize);
    };
  });
  return <div>test</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
