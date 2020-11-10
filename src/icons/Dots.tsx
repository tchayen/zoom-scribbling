import React from "react";

type Props = {
  color: string;
};

const Dots = (props: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="11" y="6" width="2" height="2" rx="1" fill={props.color} />
      <rect x="11" y="16" width="2" height="2" rx="1" fill={props.color} />
      <rect x="11" y="11" width="2" height="2" rx="1" fill={props.color} />
    </svg>
  );
};

export default Dots;
