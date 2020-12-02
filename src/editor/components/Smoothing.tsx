import React from "react";
import { useRecoilState } from "recoil";
import Label from "../../components/Label";
import Switch from "../../components/Switch";
import { smoothingState } from "../state";
import LabelTooltip from "./LabelTooltip";

const Smoothing = () => {
  const [smoothing, setSmoothing] = useRecoilState(smoothingState);
  return (
    <div>
      <Label>
        Smoothing
        <LabelTooltip tooltip="Smoothing calculates a set of Beziér curves that fit the lines and resamples points to achieve more uniform distribution of points. Done on pointer release for a whole shape." />
      </Label>
      <div style={{ marginTop: 4 }}>
        <Switch
          aria-label="Pointer pressure"
          value={smoothing}
          onChange={(value) => {
            setSmoothing(value);
          }}
        />
      </div>
    </div>
  );
};

export default Smoothing;
