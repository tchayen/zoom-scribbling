import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import { scaleState, cameraState, modeState } from "./editor/state";
import Actions from "./editor/components/Actions";
import { styled, ThemeProvider, useTheme } from "./components/colorTheme";
import IconButton from "./components/IconButton";
import Input from "./components/Input";
import Label from "./components/Label";
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
  startShape,
  finishShape,
  appendLine,
  appendErase,
  finishErase,
  startErase,
  exportState,
} from "./editor/scene";
import * as Icons from "./icons";
import Thickness from "./editor/components/Thickness";
import Tools from "./editor/components/Tools";
import render from "./editor/render";
import PointerPressure from "./editor/components/PointerPressure";

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
  width: ${consts.TOOLBAR_WIDTH}px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: space-between;
  /* width: ${window.innerWidth - consts.TOOLBAR_WIDTH}px; */
  height: 40px;
  background-color: ${(props) => props.theme.grayBackground};
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

    canvas.current.width = window.innerWidth - consts.TOOLBAR_WIDTH;
    canvas.current.height = window.innerHeight - consts.TOPBAR_HEIGHT;
  };

  const { colorMode, setColorMode } = useTheme();
  const [scale, setScale] = useRecoilState(scaleState);
  const [camera, setCamera] = useRecoilState(cameraState);
  const [mode, setMode] = useRecoilState(modeState);
  const [pointerDown, setPointerDown] = useState(false);

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
  }, [mode]);

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
    },
    [camera, scale, setCamera, setScale]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
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
    [camera, scale, colorMode, setCamera, setMode, setScale]
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

  // Main render 'loop'.
  useEffect(() => {
    render(getCtx(), camera, scale, colorMode);
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidebar>
        <Actions />
        <Tools />
        <Thickness />
        <PointerPressure />
        <Input
          label="Zoom"
          value={`${(scale * 100).toFixed(0)}%`}
          onChange={() => {}}
          style={{ width: 55, border: "none" }}
        />
      </Sidebar>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TopBar>
          <div>
            {/* <Icons.Picture color="black" />
            <Icons.Folder color="black" /> */}
          </div>
          <IconButton
            Icon={colorMode === "dark" ? Icons.Sun : Icons.Moon}
            onPress={() => {
              setColorMode(colorMode === "dark" ? "light" : "dark");
            }}
            tooltip="Toggle color mode"
          />
        </TopBar>
        <canvas ref={canvas}></canvas>
      </div>
    </div>
  );
};

ReactDOM.render(
  <RecoilRoot>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </RecoilRoot>,
  document.getElementById("root")
);
