import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTheme } from "../../components/colorTheme";
import consts from "../../consts";
import { screenToCameraSpace, translate, zoom, zoomTo } from "../helpers";
import render from "../render";
import {
  appendErase,
  appendLine,
  finishErase,
  finishShape,
  redo,
  startErase,
  startShape,
  undo,
} from "../scene";
import {
  cameraState,
  colorState,
  modeState,
  scaleState,
  thicknessState,
} from "../state";

const Editor = () => {
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
  const thickness = useRecoilValue(thicknessState);
  const color = useRecoilValue(colorState);
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
        startShape(point, Number(thickness), color);
      } else if (mode === "erase") {
        startErase(point);
      }
    },
    [camera, mode, scale, thickness, color]
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

        render(getCtx(), canvas.current!, camera, scale, colorMode);
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
            render(getCtx(), canvas.current!, camera, scale, colorMode);
          } else {
            undo();
            render(getCtx(), canvas.current!, camera, scale, colorMode);
          }
        }
      }

      if (event.key === ")" && event.shiftKey) {
        const zoomed = zoomTo(1, scale, canvas.current!, camera);
        setCamera(zoomed.camera);
        setScale(zoomed.scale);
      }

      if (event.key.toLowerCase() === "e") {
        setMode("erase");
      }

      if (event.key.toLowerCase() === "d") {
        setMode("draw");
      }

      if (event.key.toLowerCase() === "t") {
        setColorMode(colorMode === "dark" ? "light" : "dark");
      }

      if (event.key.toLowerCase() === "m") {
        console.log("Turned off!");
        // generateMiniature(canvas.current);
      }
    },
    [camera, scale, colorMode, setCamera, setMode, setScale, setColorMode]
  );

  const handleResize = useCallback(() => {
    resetSizes();
    render(getCtx(), canvas.current!, camera, scale, colorMode);
  }, [camera, scale, colorMode]);

  useEffect(() => {
    resetSizes();

    if (canvas.current === null) {
      return;
    }

    const canvasNode = canvas.current;

    canvasNode.addEventListener("pointermove", handlePointerMove);
    canvasNode.addEventListener("pointerdown", handlePointerDown);
    canvasNode.addEventListener("pointerup", handlePointerUp);
    canvasNode.addEventListener("wheel", handleWheel);

    window.addEventListener("keypress", handleKeyPress);
    window.addEventListener("resize", handleResize);

    return () => {
      canvasNode.removeEventListener("pointermove", handlePointerMove);
      canvasNode.removeEventListener("pointerdown", handlePointerDown);
      canvasNode.removeEventListener("pointerup", handlePointerUp);
      canvasNode.removeEventListener("wheel", handleWheel);

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
    render(getCtx(), canvas.current!, camera, scale, colorMode);
  });

  return <canvas ref={canvas}></canvas>;
};

export default Editor;