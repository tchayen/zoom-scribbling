import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import { useTextField } from "@react-aria/textfield";
import { useTheme } from "../../components/colorTheme";
import { InputComponent } from "../../components/Input";
import Label from "../../components/Label";
import { invertHex } from "../../helpers/colors";
import { colorState } from "../state";

const Color = () => {
  const label = "Color";
  const ref = useRef<HTMLInputElement>(null);
  const { labelProps, inputProps } = useTextField({ label }, ref);
  const { colorMode } = useTheme();
  const [color, setColor] = useRecoilState(colorState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setColor(event.target.value);

  return (
    <div>
      <Label {...labelProps}>{label}</Label>
      <div style={{ display: "flex", flexDirection: "row", marginTop: 4 }}>
        <div
          style={{
            width: 40,
            height: 32,
            marginRight: 8,
            backgroundColor: colorMode === "dark" ? invertHex(color) : color,
          }}
        />
        <InputComponent
          {...inputProps}
          onChange={handleChange}
          value={color}
          style={{ width: 80 }}
          ref={ref}
        />
      </div>
    </div>
  );
};

export default Color;
