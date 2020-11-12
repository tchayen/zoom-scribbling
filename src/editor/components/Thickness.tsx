import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import { useTextField } from "@react-aria/textfield";
import Button from "../../components/Button";
import { InputComponent } from "../../components/Input";
import Label from "../../components/Label";
import { clamp } from "../helpers";
import { thicknessState } from "../state";

const Thickness = () => {
  const label = "Thickness";
  // labelProps were empty for empty props.
  const props = { label };

  const ref = useRef<HTMLInputElement>(null);
  const { labelProps, inputProps } = useTextField(props, ref);
  const [thickness, setThickness] = useRecoilState(thicknessState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThickness(event.target.value);
  };

  const handleBlur = () => {
    const asNumber = Number(thickness) || 1;
    const clamped = clamp(asNumber, 1, 10).toString();
    if (clamped !== thickness) {
      setThickness(clamped);
    }
  };

  const handleDecrease = () =>
    setThickness(`${clamp(Number(thickness) - 1, 1, 10)}`);

  const handleIncrease = () =>
    setThickness(`${clamp(Number(thickness) + 1, 1, 10)}`);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Label {...labelProps}>{label}</Label>
      <div style={{ display: "flex" }}>
        <Button
          secondary
          style={{ width: 32, marginRight: 8 }}
          onPress={handleDecrease}
        >
          -
        </Button>
        <InputComponent
          {...inputProps}
          onChange={handleChange}
          onBlur={handleBlur}
          value={thickness.toString()}
          style={{ width: 32, border: "none", marginRight: 8 }}
          ref={ref}
        />
        <Button secondary style={{ width: 32 }} onPress={handleIncrease}>
          +
        </Button>
      </div>
    </div>
  );
};

export default Thickness;
