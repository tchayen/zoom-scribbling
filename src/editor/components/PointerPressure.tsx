import React from "react";
import { useRecoilState } from "recoil";
import Label from "../../components/Label";
import Switch from "../../components/Switch";
import { pointerPressureState } from "../state";

const PointerPressure = () => {
  const [pointerPressure, setPointerPressure] = useRecoilState(
    pointerPressureState
  );
  return (
    <div style={{ marginBottom: 16 }}>
      <Label>Pointer pressure</Label>
      <div style={{ marginTop: 4 }}>
        <Switch aria-label="Pointer pressure" value={pointerPressure} />
      </div>
    </div>
  );
};

export default PointerPressure;
