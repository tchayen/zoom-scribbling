import React, { useEffect, useRef } from "react";
import { AriaSwitchProps } from "@react-types/switch";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useFocusRing } from "@react-aria/focus";
import { useSwitch } from "@react-aria/switch";
import { useToggleState } from "@react-stately/toggle";
import { mergeProps } from "@react-aria/utils";
import { styled, useTheme } from "./colorTheme";

const Box = styled.div<{ isDisabled: boolean }>`
  position: relative;
  height: 16px;
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

const Dot = styled.div<{
  isSelected: boolean;
  isFocusVisible: boolean;
  isDarkMode: boolean;
}>`
  width: 16px;
  height: 16px;
  // TODO: if darkMode then gray else white (for the default case).
  background-color: ${(props) =>
    props.isDarkMode
      ? props.isSelected
        ? props.theme.primary
        : props.theme.mainText
      : props.isSelected
      ? props.theme.primary
      : props.theme.background};
  border-radius: 8px;
  position: absolute;
  left: ${(props) => (props.isSelected ? "16px" : 0)};
  top: 0;
  box-shadow: ${(props) =>
    props.isFocusVisible
      ? `0 0 0 4px ${
          props.isDarkMode
            ? props.theme.primaryDimmedStronger
            : props.theme.primaryDimmed
        }`
      : "0 1px 3px rgba(0, 0, 0, 0.25)"};
  transition: background-color 150ms, left 150ms;
`;

const Bar = styled.div<{ isSelected: boolean; isDarkMode: boolean }>`
  width: 32px;
  height: 12px;
  position: absolute;
  left: 0;
  top: 2px;
  // TODO: if darkMode then darkGray, else gray (for the default case).
  background-color: ${(props) =>
    props.isSelected
      ? props.theme.primaryDimmed
      : props.isDarkMode
      ? props.theme.secondaryText
      : props.theme.border};
  border-radius: 6px;
`;

type Props = AriaSwitchProps;

const Switch = (props: Props) => {
  const state = useToggleState(props);
  const ref = useRef(null);
  const { inputProps } = useSwitch(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { colorMode } = useTheme();

  return (
    <label
      style={{ display: "flex", alignItems: "center" }}
      aria-label={props["aria-label"]}
    >
      <VisuallyHidden>
        <input {...mergeProps(inputProps, focusProps)} ref={ref} />
      </VisuallyHidden>
      <Box isDisabled={!!props.isDisabled}>
        <Bar isSelected={state.isSelected} isDarkMode={colorMode === "dark"} />
        <Dot
          isSelected={state.isSelected}
          isFocusVisible={isFocusVisible}
          isDarkMode={colorMode === "dark"}
        />
      </Box>
    </label>
  );
};

export default Switch;
