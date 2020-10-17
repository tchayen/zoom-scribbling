import React, { createContext, useContext, useRef } from "react";
import { RadioGroupState, useRadioGroupState } from "@react-stately/radio";
import { AriaRadioGroupProps } from "@react-types/radio";
import { useFocusRing } from "@react-aria/focus";
import { useRadio, useRadioGroup } from "@react-aria/radio";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { mergeProps } from "@react-aria/utils";
import { styled } from "../colorTheme";
import Label from "./Label";

const RadioContext = createContext<{
  state: RadioGroupState;
  isDisabled: boolean;
} | null>(null);

const RadioComponent = styled.div<{
  isFocusVisible: boolean;
  isSelected: boolean;
}>`
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 8px;
  border: ${(props) =>
    props.isSelected
      ? `6px solid ${props.theme.primary}`
      : `1px solid ${
          props.isFocusVisible ? props.theme.primary : props.theme.border
        }`};
  margin: 0;
  margin-right: 8px;
  outline: none;
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

const Text = styled.div`
  color: ${(props) => props.theme.mainText};
`;

type Props = {
  children: any;
  value: string;
};

export const Radio = (props: Props) => {
  const { children } = props;
  const context = useContext(RadioContext);

  const ref = useRef(null);
  const { inputProps } = useRadio(
    props,
    context!.state as RadioGroupState,
    ref
  );
  const { isFocusVisible, focusProps } = useFocusRing();

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
      <RadioComponent
        isFocusVisible={isFocusVisible}
        isSelected={context.state.selectedValue === inputProps.value}
      />
      <Text>{children}</Text>
    </Row>
  );
};

type RadioGroupProps = {
  children: React.ReactNode;
} & AriaRadioGroupProps;

export const RadioGroup = (props: RadioGroupProps) => {
  const { children, label } = props;
  const state = useRadioGroupState(props);
  const { radioGroupProps, labelProps } = useRadioGroup(props, state);

  return (
    <div {...radioGroupProps}>
      <Label {...labelProps} isDisabled={props.isDisabled}>
        {label}
      </Label>
      <RadioContext.Provider value={{ state, isDisabled: !!props.isDisabled }}>
        {children}
      </RadioContext.Provider>
    </div>
  );
};
