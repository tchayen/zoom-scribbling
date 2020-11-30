import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTheme } from "../../components/colorTheme";
import consts from "../../consts";
import { screenToCameraSpace, translate, zoom, zoomTo } from "../math";
import render from "../render";
import HelpDialog from "./HelpDialog";
import {
  appendErase,
  appendLine,
  finishErase,
  finishShape,
  finishSelection,
  redo,
  startErase,
  startShape,
  undo,
  reset,
  startSelection,
  updateSelection,
  removeSelection,
  selection,
} from "../scene";
import { cameraState, colorState, modeState, thicknessState } from "../state";
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

    canvas.current.width = window.innerWidth * consts.DEVICE_PIXEL_RATIO;
    canvas.current.height =
      (window.innerHeight - consts.TOPBAR_HEIGHT) * consts.DEVICE_PIXEL_RATIO;

    canvas.current.style.width = `${window.innerWidth}px`;
    canvas.current.style.height = `${
      window.innerHeight - consts.TOPBAR_HEIGHT
    }px`;
  };

  const { colorMode, setColorMode } = useTheme();
  const [camera, setCamera] = useRecoilState(cameraState);
  const [mode, setMode] = useRecoilState(modeState);
  const [thickness, setThickness] = useRecoilState(thicknessState);
  const color = useRecoilValue(colorState);
  const [pointerDown, setPointerDown] = useState(false);

  const downloadSelection = () => {
    if (selection === null) {
      return;
    }

    const width =
      (selection.end.x - selection.start.x + 1) * consts.DEVICE_PIXEL_RATIO;
    const height =
      (selection.end.y - selection.start.y + 1) * consts.DEVICE_PIXEL_RATIO;

    const copy = document.createElement("canvas");

    copy.width = width;
    copy.height = height;

    const copyCtx = copy.getContext("2d");

    if (copyCtx === null) {
      throw new Error("Failed to create a copy context");
    }

    render(
      copyCtx,
      copy,
      {
        ...camera,
        x: camera.x + selection.start.x,
        y: camera.y + selection.start.y,
      },
      colorMode,
      true
    );

    const url = copy.toDataURL("image/png");

    const element = document.createElement("a");
    element.setAttribute("href", url);
    element.setAttribute("download", "selection.png");
    element.style.display = "none";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      setPointerDown(true);

      const point = screenToCameraSpace(
        {
          x: event.offsetX * consts.DEVICE_PIXEL_RATIO,
          y: event.offsetY * consts.DEVICE_PIXEL_RATIO,
        },
        camera
      );

      if (mode === "draw") {
        startShape(point, Number(thickness), color);
      } else if (mode === "erase") {
        startErase(point);
      } else if (mode === "select") {
        startSelection(point);
      }
    },
    [camera, mode, thickness, color]
  );

  const handlePointerUp = useCallback(() => {
    setPointerDown(false);

    if (mode === "draw") {
      finishShape();
    } else if (mode === "erase") {
      finishErase();
    } else if (mode === "select") {
      finishSelection();
    }
  }, [mode]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (event.target !== canvas.current) {
        return;
      }

      if (pointerDown) {
        const point = screenToCameraSpace(
          {
            x: event.offsetX * consts.DEVICE_PIXEL_RATIO,
            y: event.offsetY * consts.DEVICE_PIXEL_RATIO,
          },
          camera
        );

        if (mode === "draw") {
          appendLine(point);
        } else if (mode === "erase") {
          appendErase(point);
        } else if (mode === "select") {
          updateSelection(point);
        }

        render(getCtx(), canvas.current!, camera, colorMode);
      }
    },
    [camera, mode, pointerDown, colorMode]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (event.ctrlKey) {
        const zoomed = zoom(
          Math.sign(event.deltaY),
          {
            x: event.offsetX * consts.DEVICE_PIXEL_RATIO,
            y: event.offsetY * consts.DEVICE_PIXEL_RATIO,
          },
          camera
        );
        setCamera(zoomed);
      } else {
        setCamera({
          ...translate(camera, { x: event.deltaX, y: event.deltaY }),
          scale: camera.scale,
        });
      }
    },
    [camera, setCamera]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      if (event.key.toLowerCase() === "z") {
        if (event.ctrlKey) {
          if (event.shiftKey) {
            redo();
            render(getCtx(), canvas.current!, camera, colorMode);
          } else {
            undo();
            render(getCtx(), canvas.current!, camera, colorMode);
          }
        }
      }

      if (event.key === ")") {
        const center = {
          x: canvas.current!.width / 2,
          y: canvas.current!.height / 2,
        };

        const zoomed = zoomTo(1, camera.scale, center, camera);
        setCamera(zoomed);
      }

      if (event.key.toLowerCase() === "e") {
        setMode("erase");
        canvas.current!.style.cursor = consts.ERASE_CURSOR;
      }

      if (event.key.toLowerCase() === "d") {
        setMode("draw");
        canvas.current!.style.cursor = consts.DRAW_CURSOR;
      }

      if (event.key.toLowerCase() === "s") {
        setMode("select");
        canvas.current!.style.cursor = consts.DEFAULT_CURSOR;
      }

      if (event.key.toLowerCase() === "t") {
        setColorMode(colorMode === "dark" ? "light" : "dark");
      }

      if (event.code === "Minus") {
        if (event.shiftKey) {
          const zoomed = zoom(
            -1,
            {
              x: canvas.current!.width / 2,
              y: canvas.current!.height / 2,
            },
            camera
          );
          setCamera(zoomed);
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
            {
              x: canvas.current!.width / 2,
              y: canvas.current!.height / 2,
            },
            camera
          );
          setCamera(zoomed);
        } else {
          if (Number(thickness) < 10) {
            setThickness(`${Number(thickness) + 1}`);
          }
        }
      }
    },
    [
      camera,
      thickness,
      setThickness,
      colorMode,
      setCamera,
      setMode,
      setColorMode,
    ]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === "Backspace") {
      // removeSelection()
    }
  }, []);

  const handleResize = useCallback(() => {
    resetSizes();
    render(getCtx(), canvas.current!, camera, colorMode);
  }, [camera, colorMode]);

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
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", handleResize);

    return () => {
      canvasNode.removeEventListener("pointermove", handlePointerMove);
      canvasNode.removeEventListener("pointerdown", handlePointerDown);
      canvasNode.removeEventListener("pointerup", handlePointerUp);
      canvasNode.removeEventListener("wheel", handleWheel);

      window.removeEventListener("keypress", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    handlePointerMove,
    handlePointerDown,
    handlePointerUp,
    handleWheel,
    handleKeyPress,
    handleKeyUp,
    handleResize,
  ]);

  // Main render 'loop'.
  useEffect(() => {
    render(getCtx(), canvas.current!, camera, colorMode);
  });

  return (
    <div>
      <Header
        reset={() => {
          reset();
          render(getCtx(), canvas.current!, camera, colorMode);
        }}
        files={() => {}}
        save={() => {}}
        undo={() => {
          undo();
          render(getCtx(), canvas.current!, camera, colorMode);
        }}
        redo={() => {
          redo();
          render(getCtx(), canvas.current!, camera, colorMode);
        }}
      />
      <Tools
        removeSelection={() => {
          removeSelection();
          render(getCtx(), canvas.current!, camera, colorMode);
        }}
        downloadSelection={downloadSelection}
      />
      <canvas ref={canvas}></canvas>
      <HelpDialog />
    </div>
  );
};

export default Editor;
