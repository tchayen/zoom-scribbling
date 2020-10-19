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
        d="M3.5 12C3.5 23 20.5 23 20.5 12C20.5 2.5 8.5 1 4.5 7.5M4.5 7.5V2M4.5 7.5H10"
        stroke={props.color}
      />
    </svg>
  );
};

export default Undo;
