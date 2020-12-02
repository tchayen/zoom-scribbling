import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { styled } from "../../components/colorTheme";
import consts from "../../consts";
import { Mode, Point } from "../../types";
import { modeState } from "../state";

const Element = styled.div<{
  position: Point;
  hidden: boolean;
  clicked: boolean;
  mode: Mode;
}>`
  width: 24px;
  height: 24px;
  background: ${(props) =>
    props.mode === "draw"
      ? consts.DRAW_CURSOR
      : props.mode === "erase"
      ? consts.ERASE_CURSOR
      : props.mode === "select"
      ? consts.DEFAULT_CURSOR
      : consts.DEFAULT_CURSOR};
  top: ${(props) => props.position.y}px;
  left: ${(props) => props.position.x}px;

  z-index: 10000;
  position: fixed;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
  /* mix-blend-mode: difference; */
`;

const Cursor = () => {
  const mode = useRecoilValue(modeState);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);

  const addEventListeners = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const removeEventListeners = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseenter", handleMouseEnter);
    document.removeEventListener("mouseleave", handleMouseLeave);
    document.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseLeave = () => {
    setHidden(true);
  };

  const handleMouseEnter = () => {
    setHidden(false);
  };

  const handleMouseDown = () => {
    setClicked(true);
  };

  const handleMouseUp = () => {
    setClicked(false);
  };

  const handleMouseMove = (event: MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    addEventListeners();
    return () => removeEventListeners();
  }, []);

  return (
    <Element
      position={position}
      hidden={hidden}
      clicked={clicked}
      mode={mode}
    />
  );
};

export default Cursor;
