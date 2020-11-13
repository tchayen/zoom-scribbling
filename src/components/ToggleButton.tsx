import React, { createContext, useContext, useRef } from "react";
import { RadioGroupState, useRadioGroupState } from "@react-stately/radio";
import { AriaRadioGroupProps } from "@react-types/radio";
import { useFocusRing } from "@react-aria/focus";
import { useRadio, useRadioGroup } from "@react-aria/radio";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { mergeProps } from "@react-aria/utils";
import { styled, useTheme } from "./colorTheme";
import { useTooltipTriggerState } from "@react-stately/tooltip";
import { useTooltipTrigger } from "@react-aria/tooltip";
import Label from "./Label";
import colors from "./colors";
import Tooltip from "./Tooltip";

const ToggleContext = createContext<{
  state: RadioGroupState;
  isDisabled: boolean;
} | null>(null);

const ToggleButtonComponent = styled.div<{
  isFocusVisible: boolean;
  isSelected: boolean;
}>`
  -webkit-appearance: none;
  outline: none;
  padding: 4px;
  height: 32px;
  background-color: ${(props) =>
    props.isSelected ? props.theme.primaryDimmed : "transparent"};
`;

const Row = styled.label<{ isDisabled: boolean }>`
  position: relative;
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 32px;
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

const Shortcut = styled.span`
  color: ${(props) => props.theme.secondaryText};
`;

type Props = {
  Icon: any;
  value: string;
  tooltip: string;
  shortcut?: string;
};

export const ToggleButton = (props: Props) => {
  const ref = useRef(null);
  const context = useContext(ToggleContext);
  const state = useTooltipTriggerState(props as any);
  const { triggerProps, tooltipProps } = useTooltipTrigger(
    props as any,
    state,
    ref
  );

  const { inputProps } = useRadio(
    props,
    context!.state as RadioGroupState,
    ref
  );
  const { isFocusVisible, focusProps } = useFocusRing();
  const { colorMode } = useTheme();

  if (context === null) {
    return null;
  }

  return (
    <Row isDisabled={context.isDisabled}>
      <VisuallyHidden>
        <input
          {...mergeProps(inputProps, focusProps)}
          disabled={context.isDisabled}
          ref={ref}
        />
      </VisuallyHidden>
      <ToggleButtonComponent
        isFocusVisible={isFocusVisible}
        isSelected={context.state.selectedValue === inputProps.value}
        {...triggerProps}
      >
        <props.Icon color={colors[colorMode].mainText} />
      </ToggleButtonComponent>
      {state.isOpen && (
        <Tooltip {...tooltipProps}>
          {props.tooltip}
          {props.shortcut && (
            <>
              {" "}
              <Shortcut>{props.shortcut}</Shortcut>
            </>
          )}
        </Tooltip>
      )}
    </Row>
  );
};

type ToggleButtonGroupProps = {
  children: React.ReactNode;
} & AriaRadioGroupProps;

export const ToggleButtonGroup = (props: ToggleButtonGroupProps) => {
  const { children, label } = props;
  const state = useRadioGroupState(props);
  const { radioGroupProps, labelProps } = useRadioGroup(props, state);

  return (
    <div {...radioGroupProps}>
      <Label {...labelProps} isDisabled={props.isDisabled}>
        {label}
      </Label>
      <div style={{ display: "flex", gap: 8 }}>
        <ToggleContext.Provider
          value={{ state, isDisabled: !!props.isDisabled }}
        >
          {children}
        </ToggleContext.Provider>
      </div>
    </div>
  );
};
