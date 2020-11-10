import { styled } from "./colorTheme";

const Label = styled.label<{ isDisabled?: boolean }>`
  color: ${(props) => props.theme.mainText};
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 14px;
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

export default Label;
