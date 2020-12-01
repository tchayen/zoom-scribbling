import React from "react";
import { useRecoilState } from "recoil";
import { styled } from "../../components/colorTheme";
import IconButton from "../../components/IconButton";
import { ToggleButton, ToggleButtonGroup } from "../../components/ToggleButton";
import * as Icons from "../../icons";
import { modeState } from "../state";
import Color from "./Color";
import PointerPressure from "./PointerPressure";
import Smoothing from "./Smoothing";
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

const Tools = ({ removeSelection, downloadSelection }) => {
  const [mode, setMode] = useRecoilState(modeState);
  return (
    <Box>
      <ToggleButtonGroup
        aria-label="Tools"
        value={mode}
        onChange={(mode) => {
          setMode(mode as any);
          // TODO: update cursor.
        }}
      >
        <ToggleButton
          value="draw"
          Icon={Icons.Pencil}
          tooltip="Draw"
          shortcut="D"
          aria-label="Draw"
        />
        <ToggleButton
          value="erase"
          Icon={Icons.Erase}
          tooltip="Erase"
          shortcut="E"
          aria-label="Erase"
        />
        <ToggleButton
          value="select"
          Icon={Icons.Selection}
          tooltip="Select"
          shortcut="S"
          aria-label="Select"
        />
      </ToggleButtonGroup>
      {mode === "draw" && (
        <>
          <Thickness />
          <Color />
          <PointerPressure />
          <Smoothing />
        </>
      )}
      {mode === "select" && (
        <div style={{ display: "flex" }}>
          <IconButton
            onPress={downloadSelection}
            tooltip="Save selection as PNG"
            Icon={Icons.Download}
          />
          <IconButton
            onPress={removeSelection}
            tooltip="Remove selected"
            Icon={Icons.Remove}
          />
        </div>
      )}
    </Box>
  );
};

export default Tools;
