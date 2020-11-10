import React from "react";

type Props = {
  color: string;
};

const Share = (props: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x="14.5"
        y="2.5"
        width="5"
        height="5"
        rx="2.5"
        stroke={props.color}
      />
      <rect
        x="14.5"
        y="16.5"
        width="5"
        height="5"
        rx="2.5"
        stroke={props.color}
      />
      <rect
        x="2.5"
        y="9.5"
        width="5"
        height="5"
        rx="2.5"
        stroke={props.color}
      />
      <path
        d="M7.5 10.5L14.5 6.5M7.5 13.5L14.5 17.5M17 7.5V16.5"
        stroke={props.color}
      />
    </svg>
  );
};

export default Share;
