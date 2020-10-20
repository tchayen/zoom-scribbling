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
    <>
      <Label>Pointer pressure</Label>
      <Switch aria-label="Pointer pressure" value={pointerPressure} />
    </>
  );
};

export default PointerPressure;
