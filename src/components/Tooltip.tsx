import React, { useRef } from "react";
import { useTooltip } from "@react-aria/tooltip";
import { mergeProps } from "@react-aria/utils";
import { useTooltipTriggerState } from "@react-stately/tooltip";

type Props = {
  children: string;
};

function Tooltip(props: Props) {
  let { tooltipProps } = useTooltip(props);

  return (
    <span
      style={{
        position: "absolute",
        left: "5px",
        top: "100%",
        marginTop: "10px",
        backgroundColor: "white",
        color: "black",
        padding: "5px",
      }}
      {...mergeProps(props, tooltipProps)}
    >
      {props.children}
    </span>
  );
}

function WithTooltip(props) {
  let state = useTooltipTriggerState(props);
  let ref = useRef();

  // Get props for the trigger and its tooltip
  let { triggerProps, tooltipProps } = useTooltipTrigger(props, state, ref);

  return (
    <span style={{ position: "relative" }}>
      <button ref={ref} {...triggerProps}>
        I have a tooltip
      </button>
      {state.isOpen && (
        <Tooltip {...tooltipProps}>
          And the tooltip tells you more information.
        </Tooltip>
      )}
    </span>
  );
}
