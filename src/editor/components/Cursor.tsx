import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { styled } from "../../components/colorTheme";
import { Mode } from "../../types";
import { modeState } from "../state";

const cursors = {
  default: {
    image:
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAYAAAAGAx/kAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFuSURBVHgBvZTPToNAEMaXbS3aUCkE1BiM+Dfx4Am9GC/Giy/A+5B4MenRs4nx4GvxKPh9MJgVigIx3eSXbUr3tzPTGZT6z1UUBTeL4LOlRi4rTdMJdhs8g20wFfGgpeXwksFprV+wO2BrqIyiBTikKI5j5rkKgmCRJMkgmfY8z7Vt+5SiPM9HyyZLLOwXqqx78S1Dmivf93fx/ayPrBZd1iJTxshE9mdk/Mdaoo7IfpVNpEYtUVOG57WsvdhDTK1L1CWTJu6X2joZa6aqdmmlqfuImrIwDNm001ZEzdSMQ11wAmYSSFWjZkSG5BM8gUfwAO7Bjap6LlTVaOm1NTIkH+AOXMuzc3AGjsE+cIGdZZluplZ2tkjewS04cRxnj885LkRqMzfSskwR/9Jy1sAbSORmVw7wN5q3SwS1wGoWm7dw+l/BFThikw6afrmhfh8dsIjGOGg1YFkSFWXzKIp2sE9HvXLlkJZW+FHAja8vgrn7fFX2s7wAAAAASUVORK5CYII=")',
    offset: {
      x: 9,
      y: 10,
    },
  },
  erase: {
    image:
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGPSURBVHgBvZRNToNQFIV5pYBUsMVAk8Y26aDRhpioYQNdgDPbpThyAFOjK3BQww7cgUsh0cQ4ZAd4Ll6aJ7/txJuc3NdQPs79AUX5xxBRFPWQVc5COTQ2m426WCwMHH3ofjKZDJD7h8JUiG68gT5Go1GG/AgNgyDQkHudBHJCT9c0LcDPzzAMsyRJsvl8TrBnx3GGyFqrs9Vq1ecSdpAiZFiXMyrHrIM0wdhZrwKRy2mKEuxE+R3ADnLU5qQOxgN4IAP5foAOIxqN+A0Xp0J0TzeOYyVN0y8c3z3PUxXaE0CuytPB8jW6oWv4/zd0C015OPmuhGSTIHIP6mAS5A46h05939cL0Ax6oZvbYBJkbRjGBbLHvaUe54exruuXyNsmWAdE5FuMgwWdQdfQaxnG0ynKIYjLkD8vseA9sEzTrMBkJ9Cy4qQUgl4NZJucYYoE20pO1ih9adu2iwdUnFRg5Mx1XYJNIerZE4+YpuMRZN9vUlHmsWVZY5Q64945BGHXe4fgAVAJAxbtSW1PivgBkHY4lIVdkmsAAAAASUVORK5CYII=")',
    offset: {
      x: 4,
      y: -5,
    },
  },
  draw: {
    image:
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAH8SURBVHgBtVU9TwJBFLw7vTtQETEkBBMTQKIJFQYjLbUVDTUU1la2JvwSS0UrCgupKC2JDXb+BRJitDGeM8dbsxCEBfQlk3eE3Zm38/bDsv45bGu1cLTvQPDrgEWChblABDiX7K7AN05eKpVIFgduMpkMq74FdinUbDaXFwmCgJV78Xg8gdyq1+sBgxm/74EkBLmapUTsfD7vS6WtarUa6KGJ8H9vURFbJiUUOa3p9XpjImLXBbC5iICqfMwWkusijUaD5A+RSCSDvGUqEJLTc8dxfshVKBGuCGMfgWNgjyswaTZt8XcQeuWTIeQd4BTIARzvWnPOWEhOW6ZVrkJs6biuS/IsxxcKBW9m9ZhnKfJZlQs5bSn7vp+Trct5zqzqbY38zoRcs8Wb57vN5c3zXNmikYe2WAb32po12l5Xk4doCrneUKNDFR6kWCyWRH7qdrsmlYfkwej6mBt2Op3eQN4HhoPBYKrn2C1lHKSskPtSmJEAl7gNnBWLxZCUIu12Wz9E4W6RHhl5rse6VHWJ+epOeQOegWvghJVzK0pDHVMBWxNgg2vAEfACvAIfIjQkQP7e7/c/8f1lLRjcQbwBU7DhAPkQOR+NRtkTNn5LHpnlnlg5IF4qlaIIXyraxZ6w8SRek92y/BtOkUqlsl6r1bgalVcjnRJ/Ssb4BhvkbEXEEfl/AAAAAElFTkSuQmCC")',
    offset: {
      x: 8,
      y: -7,
    },
  },
};
const Element = styled.div<{
  hidden: boolean;
  clicked: boolean;
  image: string;
}>`
  width: 24px;
  height: 24px;
  background-color: #000;
  background: ${(props) => props.image};
  background-repeat: no-repeat;
  z-index: 10000;
  position: fixed;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
  // mix-blend-mode: difference;
`;

const modeToCursor = (mode: Mode) => {
  switch (mode) {
    case "draw":
      return cursors.draw;
    case "erase":
      return cursors.erase;
    case "select":
      return cursors.default;
    default:
      return cursors.default;
  }
};

const Cursor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const mode = useRecoilValue(modeState);
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);

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
  }, [mode]);

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
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  ]);

  return (
    <Element
      ref={ref}
      hidden={hidden}
      clicked={clicked}
      image={modeToCursor(mode).image}
    />
  );
};

export default Cursor;
