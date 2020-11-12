import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTheme } from "../../components/colorTheme";
import consts from "../../consts";
import { screenToCameraSpace, translate, zoom, zoomTo } from "../helpers";
import render from "../render";
import HelpDialog from "./HelpDialog";
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
import Tools from "./Tools";
import Header from "./Header";

const Editor = () => {
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

  const { colorMode, setColorMode } = useTheme();
  const [scale, setScale] = useRecoilState(scaleState);
  const [camera, setCamera] = useRecoilState(cameraState);
  const [mode, setMode] = useRecoilState(modeState);
  const [thickness, setThickness] = useRecoilState(thicknessState);
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

      if (event.key === ")") {
        const center = {
          x: canvas.current!.width / 2,
          y: canvas.current!.height / 2,
        };

        const zoomed = zoomTo(1, scale, center, camera);
        setCamera(zoomed.camera);
        setScale(zoomed.scale);
      }

      if (event.key.toLowerCase() === "e") {
        setMode("erase");
        canvas.current!.style.cursor = consts.ERASE_CURSOR;
      }

      if (event.key.toLowerCase() === "d") {
        setMode("draw");
        canvas.current!.style.cursor = consts.DRAW_CURSOR;
      }

      if (event.key.toLowerCase() === "t") {
        setColorMode(colorMode === "dark" ? "light" : "dark");
      }

      if (event.key.toLowerCase() === "m") {
        console.log("Turned off!");
        // generateMiniature(canvas.current);
      }

      if (event.code === "Minus") {
        if (event.shiftKey) {
          const zoomed = zoom(
            -1,
            { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            camera,
            scale
          );
          setCamera(zoomed.camera);
          setScale(zoomed.scale);
        } else {
          if (Number(thickness) > 1) {
            setThickness(`${Number(thickness) - 1}`);
          }
        }
      }

      if (event.code === "Equal") {
        if (event.shiftKey) {
          const zoomed = zoom(
            1,
            { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            camera,
            scale
          );
          setCamera(zoomed.camera);
          setScale(zoomed.scale);
        } else {
          if (Number(thickness) < 10) {
            setThickness(`${Number(thickness) + 1}`);
          }
        }
      }
    },
    [
      camera,
      scale,
      thickness,
      setThickness,
      colorMode,
      setCamera,
      setMode,
      setScale,
      setColorMode,
    ]
  );

  const handleResize = useCallback(() => {
    resetSizes();
    render(getCtx(), canvas.current!, camera, scale, colorMode);
  }, [camera, scale, colorMode]);

  useEffect(() => {
    if (canvas.current === null) {
      return;
    }

    canvas.current.style.cursor = consts.DRAW_CURSOR;
  }, []);

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

  return (
    <div>
      <Header
        reset={() => {}}
        files={() => {}}
        save={() => {}}
        undo={() => {
          undo();
          render(getCtx(), canvas.current!, camera, scale, colorMode);
        }}
        redo={() => {
          redo();
          render(getCtx(), canvas.current!, camera, scale, colorMode);
        }}
      />
      <Tools />
      <canvas ref={canvas}></canvas>
      <HelpDialog />
    </div>
  );
};

export default Editor;
