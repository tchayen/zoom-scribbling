import React from "react";
import { useRecoilValue } from "recoil";
import Input from "../../components/Input";
import { scaleState } from "../state";

const Zoom = () => {
  const scale = useRecoilValue(scaleState);
  return (
    <Input
      label="Zoom"
      value={`${(scale * 100).toFixed(0)}%`}
      onChange={() => {}}
      style={{ width: 55, border: "none" }}
    />
  );
};

export default Zoom;
