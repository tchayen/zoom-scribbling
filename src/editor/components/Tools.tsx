import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "../../components/ToggleButton";
import * as Icons from "../../icons";
import { Mode } from "../../types";

const Tools = () => {
  const [mode, setMode] = useState<Mode>("draw");
  return (
    <div style={{ marginBottom: 16 }}>
      <ToggleButtonGroup
        label="Tools"
        value={mode}
        onChange={(mode) => setMode(mode as any)}
      >
        <ToggleButton value="draw" Icon={Icons.Pencil} tooltip="Draw" />
        <ToggleButton value="erase" Icon={Icons.Erase} tooltip="Erase" />
        <ToggleButton value="select" Icon={Icons.Selection} tooltip="Select" />
      </ToggleButtonGroup>
    </div>
  );
};

export default Tools;
