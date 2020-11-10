import { styled } from "./colorTheme";

const Hint = styled.span<{ error: boolean }>`
  margin-top: 8px;
  font-size: 14px;
  color: ${(props) => (props.error ? "#ff0000" : props.theme.secondaryText)};
`;

export default Hint;
