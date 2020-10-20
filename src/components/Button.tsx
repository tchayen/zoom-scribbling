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
  border-radius: 0;
  height: 32px;
  padding-left: 16px;
  padding-right: 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

const PrimaryButton = styled(ButtonComponent)`
  color: ${(props) => props.theme.background};
  background-color: ${(props) =>
    props.isPressed ? "#0033a3" : props.theme.primary};

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

const SecondaryButton = styled(ButtonComponent)`
  color: ${(props) => props.theme.mainText};

  // TODO:
  // - Add colors of hover and active to theme.

  background-color: ${(props) =>
    props.isPressed ? "#aaa" : props.theme.secondaryButtonBackground};

  &:focus {
    outline: ${(props) =>
      props.isFocusVisible ? `4px solid ${props.theme.primaryDimmed}` : "none"};
  }

  &:hover {
    // In rare situation the button might be pressed by keyboard but hover would override it.
    background-color: ${(props) => (props.isPressed ? "#aaa" : "#ccc")};
  }

  &:active {
    background-color: #aaa;
  }
`;

type Props = {
  isDisabled?: boolean;
  children: string;
  style?: React.CSSProperties;
  secondary?: boolean;
} & AriaButtonProps;

const Button = (props: Props) => {
  const ref = useRef(null);
  const { buttonProps, isPressed } = useButton(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  const Component = props.secondary ? SecondaryButton : PrimaryButton;

  return (
    <Component
      // secondary={props.secondary}
      isDisabled={!!props.isDisabled}
      isFocusVisible={isFocusVisible}
      isPressed={isPressed}
      ref={ref}
      style={props.style}
      {...mergeProps(focusProps, buttonProps)}
    >
      {props.children}
    </Component>
  );
};

export default Button;
