import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { styled } from "../../components/colorTheme";
import Default from "../../cursors/Default";
import Eraser from "../../cursors/Eraser";
import Grab from "../../cursors/Grab";
import Grabbed from "../../cursors/Grabbed";
import Pencil from "../../cursors/Pencil";
import { Mode } from "../../types";
import {
  colorState,
  isCursorInSelectionState,
  modeState,
  movingSelectionState,
  thicknessState,
} from "../state";

const cursors = {
  default: {
    component: Default,
    offset: { x: 0, y: 0 },
  },
  erase: {
    component: Eraser,
    offset: { x: 8, y: -16 },
  },
  draw: {
    component: Pencil,
    offset: { x: 0, y: -16 },
  },
  selectDrag: {
    component: Grab,
    offset: { x: 0, y: 0 },
  },
  selectDragging: {
    component: Grabbed,
    offset: { x: 0, y: 0 },
  },
};

const Element = styled.div<{ hidden: boolean }>`
  pointer-events: none;
  z-index: 10000;
  position: fixed;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
`;

const Dot = styled.div<{ size: number; color: string }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 100%;
  border: 1px solid ${(props) => props.color};
  translate: (
    ${(props) => 1 - props.size / 2}px,
    ${(props) => 4 - props.size / 2}px
  );
  position: absolute;
  mix-blend-mode: difference;
`;

const Cursor = ({ canvas }) => {
  const ref = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const mode = useRecoilValue(modeState);
  const isCursorInSelection = useRecoilValue(isCursorInSelectionState);
  const movingSelection = useRecoilValue(movingSelectionState);
  const thickness = useRecoilValue(thicknessState);
  const color = useRecoilValue(colorState);
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);

  const modeToCursor = useCallback(
    (mode: Mode) => {
      switch (mode) {
        case "draw":
          return cursors.draw;
        case "erase":
          return cursors.erase;
        case "select":
          if (movingSelection) {
            return cursors.selectDragging;
          } else if (isCursorInSelection) {
            return cursors.selectDrag;
          } else {
            return cursors.default;
          }
        default:
          return cursors.default;
      }
    },
    [isCursorInSelection, movingSelection]
  );

  const handleMouseLeave = useCallback(() => {
    setHidden(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setHidden(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    setClicked(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setClicked(false);
  }, []);

  const updateMousePosition = useCallback(() => {
    const x = position.current.x + modeToCursor(mode).offset.x;
    const y = position.current.y + modeToCursor(mode).offset.y;
    ref.current!.style.top = `${y}px`;
    ref.current!.style.left = `${x}px`;
  }, [mode, modeToCursor]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      position.current.x = event.clientX;
      position.current.y = event.clientY;
      updateMousePosition();
    },
    [updateMousePosition]
  );

  useEffect(() => {
    updateMousePosition();
  }, [updateMousePosition]);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    canvas,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  ]);

  const Component = modeToCursor(mode).component;

  return (
    <Element ref={ref} hidden={hidden}>
      {mode === "draw" && <Dot color={color} size={Number(thickness)} />}
      <Component />
    </Element>
  );
};

export default Cursor;
