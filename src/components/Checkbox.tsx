import React, { useRef } from "react";
import { AriaCheckboxProps } from "@react-types/checkbox";
import { useCheckbox } from "@react-aria/checkbox";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import { useToggleState } from "@react-stately/toggle";
import { styled } from "../colorTheme";

const Tick = () => (
  <svg
    width="13"
    height="10"
    viewBox="0 0 13 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", top: 3, left: 2 }}
  >
    <path
      d="M4.5 8L3.79289 8.70711L4.5 9.41421L5.20711 8.70711L4.5 8ZM0.292893 5.20711L3.79289 8.70711L5.20711 7.29289L1.70711 3.79289L0.292893 5.20711ZM5.20711 8.70711L12.2071 1.70711L10.7929 0.292893L3.79289 7.29289L5.20711 8.70711Z"
      fill="white"
    />
  </svg>
);

const CheckboxComponent = styled.input<{
  isFocusVisible: boolean;
  isSelected: boolean;
}>`
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid
    ${(props) =>
      props.isSelected || props.isFocusVisible
        ? props.theme.primary
        : props.theme.border};
  border-radius: 0;
  margin: 0;
  background-color: ${(props) =>
    props.isSelected ? props.theme.primary : props.theme.background};
  box-shadow: ${(props) =>
    props.isFocusVisible ? `0 0 0 4px ${props.theme.primaryDimmed}` : "none"};
  outline: none;
`;

type Props = {
  children?: any;
} & AriaCheckboxProps;

const Checkbox = (props: Props) => {
  const { children } = props;
  const state = useToggleState(props);
  const ref = useRef(null);
  const { inputProps } = useCheckbox(props, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <label
      style={{
        display: "block",
        position: "relative",
        opacity: props.isDisabled ? 0.5 : 1,
      }}
    >
      <CheckboxComponent
        isFocusVisible={isFocusVisible}
        isSelected={state.isSelected}
        {...mergeProps(inputProps, focusProps)}
        ref={ref}
      />
      {state.isSelected && <Tick />}
      {children}
    </label>
  );
};

export default Checkbox;
