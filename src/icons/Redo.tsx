import * as React from "react";

type Props = {
  color: string;
};

const Undo = (props: Props) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20.5 12C20.5 23 3.5 23 3.5 12C3.5 2.5 15.5 1 19.5 7.5M19.5 7.5V2M19.5 7.5H14"
        stroke={props.color}
      />
    </svg>
  );
};

export default Undo;
