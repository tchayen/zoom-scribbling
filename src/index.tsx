import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "./components/colorTheme";
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
import { Mode, Point } from "./types";

const reset = (ctx: CanvasRenderingContext2D, camera: Point, scale: number) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.translate(-camera.x, -camera.y);
  ctx.scale(scale, scale);
};

const render = (
  ctx: CanvasRenderingContext2D | null,
  camera: Point,
  scale: number
) => {
  if (ctx === null) {
    console.log("No ctx");
    return;
  }

  reset(ctx, camera, scale);

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

  // updateText();
};

// download.onclick = () => {
//   const state = exportState();
//   const element = document.createElement("a");
//   element.setAttribute(
//     "href",
//     `data:text/plain;charset=utf-8,${encodeURIComponent(state)}`
//   );
//   element.setAttribute("download", "download.json");
//   element.style.display = "none";
//   document.body.appendChild(element);
//   element.click();
//   document.body.removeChild(element);
// };

const App = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const getCtx = () => {
    return canvas.current !== null ? canvas.current.getContext("2d") : null;
  };

  const resetSizes = () => {
    if (canvas.current === null) {
      return;
    }

    canvas.current.width = window.innerWidth;
    canvas.current.height = window.innerHeight;
  };

  let [scale, setScale] = useState(1);
  let [camera, setCamera] = useState<Point>({ x: 0, y: 0 });
  let [pointerDown, setPointerDown] = useState(false);
  let [mode, setMode] = useState<Mode>("draw");

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      setPointerDown(true);

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
    },
    [camera, mode, scale]
  );

  const handlePointerUp = useCallback(() => {
    setPointerDown(false);

    if (mode === "draw") {
      finishShape();
    } else if (mode === "erase") {
      finishErase();
    }
    render(getCtx(), camera, scale);
  }, [camera, mode, scale]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (event.target !== canvas.current) {
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

        render(getCtx(), camera, scale);
      }
    },
    [camera, mode, pointerDown, scale]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (event.metaKey || event.ctrlKey) {
        const zoomed = zoom(
          Math.sign(event.deltaY),
          { x: event.offsetX, y: event.offsetY },
          camera,
          scale
        );
        setCamera(zoomed.camera);
        setScale(zoomed.scale);
      } else {
        setCamera(
          translate(camera, { x: event.deltaX, y: event.deltaY }, scale)
        );
      }
      render(getCtx(), camera, scale);
    },
    [camera, scale]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "z") {
        if (event.metaKey || event.ctrlKey) {
          if (event.shiftKey) {
            redo();
            render(getCtx(), camera, scale);
          } else {
            undo();
            render(getCtx(), camera, scale);
          }
        }
      }

      if (event.key === ")" && event.shiftKey) {
        const zoomed = zoomTo(1, scale, camera);
        setCamera(zoomed.camera);
        setScale(zoomed.scale);
        render(getCtx(), camera, scale);
      }

      if (event.key.toLowerCase() === "e") {
        setMode("erase");
      }

      if (event.key.toLowerCase() === "d") {
        setMode("draw");
      }

      if (event.key.toLowerCase() === "m") {
        console.log("Turned off!");
        // generateMiniature(canvas.current);
      }
    },
    [camera, scale]
  );

  const handleResize = useCallback(() => {
    resetSizes();
    render(getCtx(), camera, scale);
  }, [camera, scale]);

  useEffect(() => {
    setupIndexedDb();
    resetSizes();

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
  }, [
    camera,
    scale,
    handlePointerMove,
    handlePointerDown,
    handlePointerUp,
    handleWheel,
    handleKeyPress,
    handleResize,
  ]);

  useEffect(() => {
    render(getCtx(), camera, scale);
  });

  const value = (scale * 100).toFixed(0);
  const cameraX = camera.x.toFixed(0);
  const cameraY = camera.y.toFixed(0);

  return (
    <ThemeProvider>
      <>
        {/* <ColorModeToggle /> */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "#fff",
            border: "1px solid #000",
            padding: 16,
          }}
        ></div>
        <div id="scale" className="text">
          ({cameraX}, {cameraY}) · {value}% · {mode} mode
        </div>
        <canvas ref={canvas}></canvas>
      </>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
