import React, { useRef } from "react";
import { useButton } from "@react-aria/button";
import { AriaButtonProps } from "@react-types/button";
import { mergeProps } from "@react-aria/utils";
import { useFocusRing } from "@react-aria/focus";
import { styled } from "./colorTheme";

const ButtonComponent = styled.button<{
  isDisabled: boolean;
  isFocusVisible: boolean;
  isPressed: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isPressed ? "#0033a3" : props.theme.primary};
  border-radius: 0;
  height: 32px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${(props) => props.theme.background};
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};

  &:focus {
    outline: ${(props) =>
      props.isFocusVisible ? `4px solid ${props.theme.primaryDimmed}` : "none"};
  }

  &:hover {
    // In rare situation the button might be pressed by keyboard but hover would override it.
    background-color: ${(props) => (props.isPressed ? "#0033a3" : "#004dbd")};
  }

  &:active {
    background-color: #0033a3;
  }
`;

type Props = {
  isDisabled?: boolean;
  children: string;
  style?: React.CSSProperties;
} & AriaButtonProps;

const Button = (props: Props) => {
  const ref = useRef(null);
  const { buttonProps, isPressed } = useButton(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <ButtonComponent
      isDisabled={!!props.isDisabled}
      isFocusVisible={isFocusVisible}
      isPressed={isPressed}
      ref={ref}
      style={props.style}
      {...mergeProps(focusProps, buttonProps)}
    >
      {props.children}
    </ButtonComponent>
  );
};

export default Button;
