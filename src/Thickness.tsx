import React, { useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";
import Label from "./components/Label";
import { clamp } from "./editor/helpers";

// TODO:
// - Make label focus input by copy-pasting relevant parts from <Input /> and
//   using imported styled.InputComponent

const Thickness = () => {
  const [thickness, setThickness] = useState("1");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThickness(event.target.value);
  };

  const handleBlur = () => {
    const clamped = clamp(Number(thickness), 1, 10).toString();
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
      <Label>Thickness</Label>
      <div style={{ display: "flex" }}>
        <Button
          secondary
          style={{ width: 32, marginRight: 8 }}
          onPress={handleDecrease}
        >
          -
        </Button>
        <Input
          onChange={handleChange}
          style={{ width: 32, border: "none", marginRight: 8 }}
          value={thickness.toString()}
          onBlur={handleBlur}
          aria-label="dupa"
        />
        <Button secondary style={{ width: 32 }} onPress={handleIncrease}>
          +
        </Button>
      </div>
    </div>
  );
};

export default Thickness;
