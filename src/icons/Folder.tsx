import * as React from "react";

type Props = {
  color: string;
};

const Folder = (props: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M0.5 20.5V3.5H7.5L11.5 6.5H19.5V9.5M0.5 20.5H19.5L22.5 9.5H19.5M0.5 20.5L3.5 9.5H19.5"
        stroke={props.color}
      />
    </svg>
  );
};

export default Folder;
