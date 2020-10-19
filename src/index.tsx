import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Button from "./components/Button";
import ColorModeToggle from "./components/ColorModeToggle";
import colors, { ColorMode } from "./components/colors";
import { styled, ThemeProvider, useTheme } from "./components/colorTheme";
import Input from "./components/Input";
import Switch from "./components/Switch";
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

const reset = (
  ctx: CanvasRenderingContext2D,
  camera: Point,
  scale: number,
  colorMode: ColorMode
) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = colors[colorMode].background;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.translate(-camera.x, -camera.y);
  ctx.scale(scale, scale);
};

const render = (
  ctx: CanvasRenderingContext2D | null,
  camera: Point,
  scale: number,
  colorMode: ColorMode
) => {
  if (ctx === null) {
    console.log("No ctx");
    return;
  }

  reset(ctx, camera, scale, colorMode);

  for (const shape of shapes) {
    if (shape.points.length < 2) {
      continue;
    }

    if (shape.state === "invisible") {
      continue;
    }

    ctx.beginPath();
    ctx.strokeStyle = colors[colorMode].mainText;

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

const Sidebar = styled.div`
  background-color: ${(props) => props.theme.grayBackground};
  padding: 16px;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100vh;
`;

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

  const { colorMode } = useTheme();

  const [scale, setScale] = useState(1);
  const [camera, setCamera] = useState<Point>({ x: 0, y: 0 });
  const [pointerDown, setPointerDown] = useState(false);
  const [mode, setMode] = useState<Mode>("draw");

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
    render(getCtx(), camera, scale, colorMode);
  }, [camera, mode, scale, colorMode]);

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

        render(getCtx(), camera, scale, colorMode);
      }
    },
    [camera, mode, pointerDown, scale, colorMode]
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
      render(getCtx(), camera, scale, colorMode);
    },
    [camera, scale, colorMode]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      if (event.key.toLowerCase() === "z") {
        if (event.metaKey || event.ctrlKey) {
          if (event.shiftKey) {
            redo();
            render(getCtx(), camera, scale, colorMode);
          } else {
            undo();
            render(getCtx(), camera, scale, colorMode);
          }
        }
      }

      if (event.key === ")" && event.shiftKey) {
        const zoomed = zoomTo(1, scale, camera);
        setCamera(zoomed.camera);
        setScale(zoomed.scale);
        render(getCtx(), camera, scale, colorMode);
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
    [camera, scale, colorMode]
  );

  const handleResize = useCallback(() => {
    resetSizes();
    render(getCtx(), camera, scale, colorMode);
  }, [camera, scale, colorMode]);

  useEffect(() => {
    setupIndexedDb();
  }, []);

  useEffect(() => {
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
    render(getCtx(), camera, scale, colorMode);
  });

  const value = (scale * 100).toFixed(0);
  const cameraX = camera.x.toFixed(0);
  const cameraY = camera.y.toFixed(0);

  return (
    <>
      <Sidebar>
        <ColorModeToggle />
        <div style={{ display: "flex" }}>
          <Button>-</Button>
          <Input label="test" onChange={() => {}} />
          <Button>+</Button>
        </div>
        {/* <Switch /> */}
      </Sidebar>
      <div id="scale" className="text">
        ({cameraX}, {cameraY}) · {value}% · {mode} mode
      </div>
      <canvas ref={canvas}></canvas>
    </>
  );
};

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
