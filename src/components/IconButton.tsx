import React, { useRef } from "react";
import colors from "./colors";
import Tooltip from "./Tooltip";
import { mergeProps } from "@react-aria/utils";
import { useFocusRing } from "@react-aria/focus";
import { styled, useTheme } from "./colorTheme";
import { useButton } from "@react-aria/button";
import { useTooltipTriggerState } from "@react-stately/tooltip";
import { useTooltipTrigger } from "@react-aria/tooltip";

const Button = styled.button<{
  isFocusVisible: boolean;
  isDisabled: boolean;
  isPressed: boolean;
}>`
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  background-color: ${(props) =>
    props.isPressed ? props.theme.primaryDimmed : "transparent"};
  border: none;
  outline: none;
  padding: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${(props) =>
    props.isFocusVisible ? `0 0 0 4px ${props.theme.primaryDimmed}` : "none"};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

type Props = {
  Icon: any;
  onPress: () => void;
  tooltip: string;
  isDisabled?: boolean;
};

const IconButton = (props: Props) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton(props, ref);
  const state = useTooltipTriggerState(props);
  const { triggerProps, tooltipProps } = useTooltipTrigger(props, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  const { colorMode } = useTheme();

  return (
    <div style={{ position: "relative" }}>
      <Button
        ref={ref}
        disabled={props.isDisabled}
        isDisabled={!!props.isDisabled}
        onClick={props.onPress}
        isFocusVisible={isFocusVisible}
        isPressed={isPressed}
        {...mergeProps(focusProps, buttonProps, triggerProps)}
      >
        <props.Icon color={colors[colorMode].mainText} />
        {state.isOpen && <Tooltip {...tooltipProps}>{props.tooltip}</Tooltip>}
      </Button>
    </div>
  );
};

export default IconButton;
