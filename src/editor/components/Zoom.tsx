import React from "react";
import { useRecoilValue } from "recoil";
import Input from "../../components/Input";
import { scaleState } from "../state";

const Zoom = () => {
  const scale = useRecoilValue(scaleState);
  return (
    <Input
      onChange={() => {}}
      value={`${(scale * 100).toFixed(0)}%`}
      style={{ width: 55, border: "none" }}
    />
  );
};

export default Zoom;
