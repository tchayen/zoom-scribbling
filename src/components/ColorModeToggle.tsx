import React from "react";
import { useFocusRing } from "@react-aria/focus";
import { styled, useTheme } from "./colorTheme";
import Sun from "../../public/sun.svg";
import Moon from "../../public/moon.svg";

const ToggleButton = styled.button<{
  isFocusVisible: boolean;
  isDisabled: boolean;
}>`
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  background-color: transparent;
  border: none;
  outline: none;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${(props) =>
    props.isFocusVisible ? `0 0 0 4px ${props.theme.primaryDimmed}` : "none"};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

type Props = {
  isDisabled: boolean;
};

const ColorModeToggle = ({ isDisabled }: Props) => {
  const { setColorMode, colorMode } = useTheme();
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <ToggleButton
      disabled={isDisabled}
      isDisabled={isDisabled}
      onClick={() => {
        setColorMode(colorMode === "dark" ? "light" : "dark");
      }}
      isFocusVisible={isFocusVisible}
      {...focusProps}
    >
      {colorMode === "dark" ? <Sun /> : <Moon />}
    </ToggleButton>
  );
};

export default ColorModeToggle;
