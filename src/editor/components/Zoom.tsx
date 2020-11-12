import React from "react";
import { useRecoilValue } from "recoil";
import Input from "../../components/Input";
import { cameraState } from "../state";

const Zoom = () => {
  const camera = useRecoilValue(cameraState);
  return (
    <Input
      aria-label="Zoom"
      onChange={() => {}}
      value={`${(camera.scale * 100).toFixed(0)}%`}
      style={{ width: 55, border: "none" }}
    />
  );
};

export default Zoom;
