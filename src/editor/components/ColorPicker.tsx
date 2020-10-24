import React, { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "../../components/colorTheme";
import { Point } from "../../types";

const MARGIN = 8;

const Box = styled.div`
  margin: 50px;
`;

const Value = styled.div`
  width: 160px;
  height: 160px;
  background: linear-gradient(0deg, #000000 0%, transparent 100%),
    linear-gradient(90deg, transparent 0%, #ff0000 100%);
  margin-bottom: 8px;
  position: relative;
`;

const Wrapper = styled.div`
  width: 160px;
  height: 16px;
  border-radius: ${MARGIN}px;
  background-color: #ff0000;
  position: relative;
`;

const Hue = styled.div`
  width: ${160 - 2 * MARGIN}px;
  height: ${2 * MARGIN}px;
  margin-left: ${MARGIN}px;
  margin-right: ${MARGIN}px;
  background: linear-gradient(
    270deg,
    #ff0000 0%,
    #ffff00 16.666%,
    #00ff00 33.333%,
    #00ffff 50%,
    #0000ff 66.666%,
    #ff00ff 83.333%,
    #ff0000 100%
  );
`;

type SelectedValueProps = {
  x: number;
  y: number;
};

const SelectedValue = styled.div.attrs<SelectedValueProps>((props) => ({
  style: {
    top: `${props.y - 8}px`,
    left: `${props.x - 8}px`,
  },
}))<SelectedValueProps>`
  width: ${2 * MARGIN}px;
  height: ${2 * MARGIN}px;
  border: 2px solid #fff;
  border-radius: ${MARGIN}px;
  position: absolute;
  cursor: grab;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

type SelectedHueProps = {
  value: number;
};

const SelectedHue = styled.div.attrs<SelectedHueProps>((props) => ({
  style: {
    left: `${props.value * 160}px`,
  },
}))<SelectedHueProps>`
  width: 16px;
  height: 16px;
  border: 3px solid #fff;
  border-radius: 9px;
  position: absolute;
  top: 0px;
  cursor: grab;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const ColorPicker = () => {
  const valueRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useState<Point>({ x: 0, y: 0 });
  const [selectedHue, setSelectedHue] = useState<number>(0);
  const [valueMouseDown, setValueMouseDown] = useState(false);
  const [hueMouseDown, setHueMouseDown] = useState(false);

  const handleValueDown = useCallback(() => {
    console.log("down value");
    setValueMouseDown(true);
    document.body.style.cursor = "grabbed";
  }, []);

  const handleValueUp = useCallback(() => {
    console.log("up value");
    setValueMouseDown(false);
  }, []);

  const handleValueMove = useCallback(
    (event: MouseEvent) => {
      console.log("move value", valueMouseDown);
      if (valueMouseDown) {
        setSelectedValue({ x: event.offsetX, y: event.offsetY });
      }
    },
    [valueMouseDown]
  );

  const handleValueOut = useCallback(() => {
    setValueMouseDown(false);
    console.log("out");
  }, []);

  const handleHueDown = useCallback(() => {
    console.log("down hue");
    setHueMouseDown(true);
    document.body.style.cursor = "grabbed";
  }, []);

  const handleHueUp = useCallback(() => {
    console.log("up hue");
    setHueMouseDown(false);
  }, []);

  const handleHueMove = useCallback(
    (event: MouseEvent) => {
      console.log("move hue");
      if (hueMouseDown) {
        setSelectedHue(event.offsetX);
      }
    },
    [hueMouseDown]
  );

  useEffect(() => {
    const value = valueRef.current;
    const hue = hueRef.current;

    if (value !== null && hue !== null) {
      value.addEventListener("mousedown", handleValueDown);
      value.addEventListener("mouseup", handleValueUp);
      value.addEventListener("mousemove", handleValueMove);
      value.addEventListener("mouseout", handleValueOut);
      hue.addEventListener("mousedown", handleHueDown);
      hue.addEventListener("mouseup", handleHueUp);
      hue.addEventListener("mousemove", handleHueMove);
    }

    return () => {
      if (value !== null && hue !== null) {
        value.removeEventListener("mousedown", handleValueDown);
        value.removeEventListener("mouseup", handleValueUp);
        value.removeEventListener("mousemove", handleValueMove);
        hue.removeEventListener("mousedown", handleHueDown);
        value.addEventListener("mouseout", handleValueOut);
        hue.removeEventListener("mouseup", handleHueUp);
        hue.removeEventListener("mousemove", handleHueMove);
      }
    };
  }, [
    handleValueDown,
    handleValueUp,
    handleValueMove,
    handleValueOut,
    handleHueDown,
    handleHueUp,
    handleHueMove,
  ]);

  return (
    <Box>
      <Value ref={valueRef}>
        <SelectedValue {...selectedValue} />
      </Value>
      <Wrapper>
        <Hue>
          <SelectedHue ref={hueRef} value={selectedHue} />
        </Hue>
      </Wrapper>
    </Box>
  );
};

export default ColorPicker;
