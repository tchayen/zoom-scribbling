import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "../components/ToggleButton";
import * as Icons from "../icons";
import { Mode } from "../types";

const Tools = () => {
  const [mode, setMode] = useState<Mode>("draw");
  return (
    <>
      <ToggleButtonGroup
        label="Tools"
        value={mode}
        onChange={(mode) => setMode(mode as any)}
      >
        <ToggleButton value="draw" Icon={Icons.Pencil} />
        <ToggleButton value="erase" Icon={Icons.Erase} />
        <ToggleButton value="select" Icon={Icons.Selection} />
      </ToggleButtonGroup>
    </>
  );
};

export default Tools;
