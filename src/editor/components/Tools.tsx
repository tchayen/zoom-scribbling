import React from "react";
import { useRecoilState } from "recoil";
import { styled } from "../../components/colorTheme";
import { ToggleButton, ToggleButtonGroup } from "../../components/ToggleButton";
import * as Icons from "../../icons";
import { modeState } from "../state";
import Color from "./Color";
import PointerPressure from "./PointerPressure";
import Thickness from "./Thickness";

const Box = styled.div`
  position: absolute;
  left: 8px;
  top: ${40 + 8}px;
  background-color: ${(props) => props.theme.grayBackground};
  padding: 16px;
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const Tools = () => {
  const [mode, setMode] = useRecoilState(modeState);
  return (
    <Box>
      <ToggleButtonGroup value={mode} onChange={(mode) => setMode(mode as any)}>
        <ToggleButton
          value="draw"
          Icon={Icons.Pencil}
          tooltip="Draw"
          aria-label="Draw"
        />
        <ToggleButton
          value="erase"
          Icon={Icons.Erase}
          tooltip="Erase"
          aria-label="Erase"
        />
        <ToggleButton
          value="select"
          Icon={Icons.Selection}
          tooltip="Select"
          aria-label="Select"
        />
      </ToggleButtonGroup>
      {mode === "draw" && <Thickness />}
      {mode === "draw" && <Color />}
      {mode === "draw" && <PointerPressure />}
    </Box>
  );
};

export default Tools;
