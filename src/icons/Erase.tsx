import * as React from "react";

type Props = {
  color: string;
};

const Erase = (props: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 10L13 2L22 11L14 19M5 10L2 13L11 22L14 19M5 10L14 19"
        stroke={props.color}
      />
    </svg>
  );
};

export default Erase;
