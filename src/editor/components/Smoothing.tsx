import React from "react";
import { useRecoilState } from "recoil";
import Label from "../../components/Label";
import Switch from "../../components/Switch";
import { smoothingState } from "../state";

const Smoothing = () => {
  const [smoothing, setSmoothing] = useRecoilState(smoothingState);
  return (
    <div>
      <Label>Smoothing</Label>
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
