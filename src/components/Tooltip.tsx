import React from "react";
import { useTooltip } from "@react-aria/tooltip";
import { mergeProps } from "@react-aria/utils";
import { styled } from "./colorTheme";
import consts from "../consts";

type Props = {
  children: any;
};

const Box = styled.div`
  font-size: 14px;
  font-family: ${consts.FONT_STACK};
  font-weight: 400;
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 8px;
  text-align: left;
  background-color: ${(props) => props.theme.background};
  border: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.mainText};
  padding: 4px;
  z-index: 10;
`;

const Tooltip = (props: Props) => {
  let { tooltipProps } = useTooltip(props);

  return <Box {...mergeProps(props, tooltipProps)}>{props.children}</Box>;
};

export default Tooltip;
