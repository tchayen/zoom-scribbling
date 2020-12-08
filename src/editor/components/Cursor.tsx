import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { styled } from "../../components/colorTheme";
import { Mode } from "../../types";
import {
  colorState,
  isCursorInSelectionState,
  modeState,
  thicknessState,
} from "../state";

const cursors = {
  default: {
    image:
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAYAAAAGAx/kAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFuSURBVHgBvZTPToNAEMaXbS3aUCkE1BiM+Dfx4Am9GC/Giy/A+5B4MenRs4nx4GvxKPh9MJgVigIx3eSXbUr3tzPTGZT6z1UUBTeL4LOlRi4rTdMJdhs8g20wFfGgpeXwksFprV+wO2BrqIyiBTikKI5j5rkKgmCRJMkgmfY8z7Vt+5SiPM9HyyZLLOwXqqx78S1Dmivf93fx/ayPrBZd1iJTxshE9mdk/Mdaoo7IfpVNpEYtUVOG57WsvdhDTK1L1CWTJu6X2joZa6aqdmmlqfuImrIwDNm001ZEzdSMQ11wAmYSSFWjZkSG5BM8gUfwAO7Bjap6LlTVaOm1NTIkH+AOXMuzc3AGjsE+cIGdZZluplZ2tkjewS04cRxnj885LkRqMzfSskwR/9Jy1sAbSORmVw7wN5q3SwS1wGoWm7dw+l/BFThikw6afrmhfh8dsIjGOGg1YFkSFWXzKIp2sE9HvXLlkJZW+FHAja8vgrn7fFX2s7wAAAAASUVORK5CYII=")',
    offset: {
      x: -2,
      y: -2,
    },
  },
  erase: {
    image:
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGPSURBVHgBvZRNToNQFIV5pYBUsMVAk8Y26aDRhpioYQNdgDPbpThyAFOjK3BQww7cgUsh0cQ4ZAd4Ll6aJ7/txJuc3NdQPs79AUX5xxBRFPWQVc5COTQ2m426WCwMHH3ofjKZDJD7h8JUiG68gT5Go1GG/AgNgyDQkHudBHJCT9c0LcDPzzAMsyRJsvl8TrBnx3GGyFqrs9Vq1ecSdpAiZFiXMyrHrIM0wdhZrwKRy2mKEuxE+R3ADnLU5qQOxgN4IAP5foAOIxqN+A0Xp0J0TzeOYyVN0y8c3z3PUxXaE0CuytPB8jW6oWv4/zd0C015OPmuhGSTIHIP6mAS5A46h05939cL0Ax6oZvbYBJkbRjGBbLHvaUe54exruuXyNsmWAdE5FuMgwWdQdfQaxnG0ynKIYjLkD8vseA9sEzTrMBkJ9Cy4qQUgl4NZJucYYoE20pO1ih9adu2iwdUnFRg5Mx1XYJNIerZE4+YpuMRZN9vUlHmsWVZY5Q64945BGHXe4fgAVAJAxbtSW1PivgBkHY4lIVdkmsAAAAASUVORK5CYII=")',
    offset: {
      x: -3,
      y: -16,
    },
  },
  draw: {
    image:
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAH8SURBVHgBtVU9TwJBFLw7vTtQETEkBBMTQKIJFQYjLbUVDTUU1la2JvwSS0UrCgupKC2JDXb+BRJitDGeM8dbsxCEBfQlk3eE3Zm38/bDsv45bGu1cLTvQPDrgEWChblABDiX7K7AN05eKpVIFgduMpkMq74FdinUbDaXFwmCgJV78Xg8gdyq1+sBgxm/74EkBLmapUTsfD7vS6WtarUa6KGJ8H9vURFbJiUUOa3p9XpjImLXBbC5iICqfMwWkusijUaD5A+RSCSDvGUqEJLTc8dxfshVKBGuCGMfgWNgjyswaTZt8XcQeuWTIeQd4BTIARzvWnPOWEhOW6ZVrkJs6biuS/IsxxcKBW9m9ZhnKfJZlQs5bSn7vp+Trct5zqzqbY38zoRcs8Wb57vN5c3zXNmikYe2WAb32po12l5Xk4doCrneUKNDFR6kWCyWRH7qdrsmlYfkwej6mBt2Op3eQN4HhoPBYKrn2C1lHKSskPtSmJEAl7gNnBWLxZCUIu12Wz9E4W6RHhl5rse6VHWJ+epOeQOegWvghJVzK0pDHVMBWxNgg2vAEfACvAIfIjQkQP7e7/c/8f1lLRjcQbwBU7DhAPkQOR+NRtkTNn5LHpnlnlg5IF4qlaIIXyraxZ6w8SRek92y/BtOkUqlsl6r1bgalVcjnRJ/Ssb4BhvkbEXEEfl/AAAAAElFTkSuQmCC")',
    offset: {
      x: -2,
      y: -18,
    },
  },
};

const Image = styled.div<{
  hidden: boolean;
  clicked: boolean;
  image: string;
}>`
  width: 24px;
  height: 24px;
  background-color: #000;
  background: ${(props) => props.image};
  background-repeat: no-repeat;
  // transform: translate(-50%, -50%);
  opacity: ${(props) => (props.hidden ? 0 : 1)};
  position: absolute;
  // mix-blend-mode: difference;
`;

const Element = styled.div`
  pointer-events: none;
  z-index: 10000;
  position: fixed;
  width: 24px;
  height: 24px;
`;

const Dot = styled.div<{ size: number; color: string }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 100%;
  border: 1px solid ${(props) => props.color};
  left: ${(props) => 4 - 6 * (props.size / 10)}px;
  bottom: ${(props) => 6 * (1 - props.size / 10)}px;
  position: absolute;
  mix-blend-mode: difference;
  // 1 - 4
  // 10 - -2
`;

const Cursor = ({ canvas }) => {
  const ref = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const mode = useRecoilValue(modeState);
  const isCursorInSelection = useRecoilValue(isCursorInSelectionState);
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
          // TODO: add also moving state so there is a grabbable and grabbed cursors
          if (isCursorInSelection) {
            return cursors.erase;
          } else {
            return cursors.default;
          }
        default:
          return cursors.default;
      }
    },
    [isCursorInSelection]
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

  return (
    <Element ref={ref}>
      {mode === "draw" && <Dot color={color} size={Number(thickness)} />}
      <Image
        hidden={hidden}
        clicked={clicked}
        image={modeToCursor(mode).image}
      />
    </Element>
  );
};

export default Cursor;
