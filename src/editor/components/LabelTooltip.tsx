import React, { useRef } from "react";
import { useTooltipTriggerState } from "@react-stately/tooltip";
import { useTooltipTrigger } from "@react-aria/tooltip";
import { styled, useTheme } from "../../components/colorTheme";
import Tooltip from "../../components/Tooltip";

const Toggler = styled.div`
  background-color: ${(props) => props.theme.secondaryText};
  border-radius: 8px;
  height: 16px;
  width: 16px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.background};
  font-weight: bold;
  margin-left: 4px;
`;

const LabelTooltip = (props: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const state = useTooltipTriggerState(props);
  const { triggerProps, tooltipProps } = useTooltipTrigger(props, state, ref);
  const { colorMode } = useTheme();
  return (
    <div style={{ position: "relative" }}>
      <Toggler ref={ref} {...triggerProps}>
        ?
      </Toggler>
      {state.isOpen && <Tooltip {...tooltipProps}>{props.tooltip}</Tooltip>}
    </div>
  );
};

export default LabelTooltip;
