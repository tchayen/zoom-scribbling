import React, { Component, ReactComponentElement, ReactElement } from "react";
import { useFocusRing } from "@react-aria/focus";
import { styled, useTheme } from "./colorTheme";
import colors from "./colors";

const Button = styled.button<{
  isFocusVisible: boolean;
  isDisabled: boolean;
}>`
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
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
  Icon: any;
  onPress: () => void;
  tooltip: string;
  isDisabled?: boolean;
};

const IconButton = ({ Icon, onPress, tooltip, isDisabled }: Props) => {
  const { focusProps, isFocusVisible } = useFocusRing();
  const { colorMode } = useTheme();

  return (
    <Button
      disabled={isDisabled}
      isDisabled={!!isDisabled}
      onClick={onPress}
      isFocusVisible={isFocusVisible}
      {...focusProps}
    >
      <Icon color={colors[colorMode].mainText} />
    </Button>
  );
};

export default IconButton;
