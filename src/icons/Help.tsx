import * as React from "react";

type Props = {
  color: string;
};

const Help = (props: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="8.5"
        stroke={props.color}
      />
      <rect x="10.5" y="16" width="2" height="2" rx="1" fill={props.color} />
      <path
        d="M9 9.5C9 5.60951 15 5.57624 15 9.5C15 12 11.5 11.5 11.5 15"
        stroke={props.color}
      />
    </svg>
  );
};

export default Help;
