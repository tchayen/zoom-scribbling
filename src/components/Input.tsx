import React, { useRef } from "react";
import { useTextField } from "@react-aria/textfield";
import { AriaTextFieldProps } from "@react-types/textfield";
import { styled } from "./colorTheme";

import Hint from "./Hint";
import Label from "./Label";

const Box = styled.div<{ isDisabled: boolean }>`
  display: flex;
  flex-direction: column;
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

const InputComponent = styled.input`
  font-family: Inter, sans-serif;
  font-size: 14px;
  padding-left: 8px;
  padding-right: 8px;
  height: 32px;
  color: ${(props) => props.theme.mainText};
  border: 1px solid ${(props) => props.theme.border};
  background-color: ${(props) => props.theme.background};
  border-radius: 0px;

  &:focus {
    border-color: ${(props) => props.theme.primary};
    outline: 4px solid ${(props) => props.theme.primaryDimmed};
  }

  &:placeholder-shown {
    color: ${(props) => props.theme.secondaryText};
  }
`;

type Props = {
  label?: string;
  error?: boolean;
  hint?: string | false;
  isDisabled?: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
};

const Input = (props: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const { labelProps, inputProps } = useTextField(props as any, ref);

  return (
    <Box isDisabled={!!props.isDisabled}>
      {props.label && <Label {...labelProps}>{props.label}</Label>}
      <InputComponent
        {...inputProps}
        onChange={props.onChange}
        value={props.value}
        disabled={props.isDisabled}
        style={props.style}
        ref={ref}
      />
      {props.hint && <Hint error={!!props.error}>{props.hint}</Hint>}
    </Box>
  );
};

export default Input;
