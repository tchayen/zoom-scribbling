import React from "react";
import * as Icons from "../../icons";
import { useTheme } from "../../components/colorTheme";
import IconButton from "../../components/IconButton";

const ColorModeToggle = () => {
  const { colorMode, setColorMode } = useTheme();
  return (
    <IconButton
      Icon={colorMode === "dark" ? Icons.Sun : Icons.Moon}
      onPress={() => {
        setColorMode(colorMode === "dark" ? "light" : "dark");
      }}
      tooltip="Toggle color mode"
    />
  );
};

export default ColorModeToggle;
