import * as React from "react";

type Props = {
  color: string;
};

const Erase = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 8l6-6 9 9-6 6M7 8l-5 5 9 9 5-5M7 8l9 9"
        stroke={props.color}
      />
    </svg>
  );
};

export default Erase;
