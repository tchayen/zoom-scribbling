import React from "react";
import { useRecoilState } from "recoil";
import Label from "../../components/Label";
import Switch from "../../components/Switch";
import { pointerPressureState } from "../state";
import LabelTooltip from "./LabelTooltip";

const PointerPressure = () => {
  const [pointerPressure, setPointerPressure] = useRecoilState(
    pointerPressureState
  );
  return (
    <div>
      <Label>
        Pointer pressure
        <LabelTooltip tooltip="If device providing pointer events provides it, drawn lines will take pointer pressure into account." />
      </Label>
      <div style={{ marginTop: 4 }}>
        <Switch aria-label="Pointer pressure" isSelected={pointerPressure} />
      </div>
    </div>
  );
};

export default PointerPressure;
