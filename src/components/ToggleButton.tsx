import React, { createContext, useContext, useRef } from "react";
import { RadioGroupState, useRadioGroupState } from "@react-stately/radio";
import { AriaRadioGroupProps } from "@react-types/radio";
import { useFocusRing } from "@react-aria/focus";
import { useRadio, useRadioGroup } from "@react-aria/radio";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { mergeProps } from "@react-aria/utils";
import { styled, useTheme } from "./colorTheme";
import Label from "./Label";
import colors from "./colors";

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
  background-color: ${(props) =>
    props.isSelected ? props.theme.primaryDimmed : "transparent"};
  box-shadow: ${(props) =>
    props.isFocusVisible ? `0 0 0 4px ${props.theme.primaryDimmed}` : "none"};
`;

const Row = styled.label<{ isDisabled: boolean }>`
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 24px;
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

type Props = {
  Icon: any;
  value: string;
};

export const ToggleButton = (props: Props) => {
  const context = useContext(ToggleContext);

  const ref = useRef(null);
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
      >
        <props.Icon color={colors[colorMode].mainText} />
      </ToggleButtonComponent>
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
      <div style={{ display: "flex" }}>
        <ToggleContext.Provider
          value={{ state, isDisabled: !!props.isDisabled }}
        >
          {children}
        </ToggleContext.Provider>
      </div>
    </div>
  );
};
