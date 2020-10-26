import * as React from "react";

type Props = {
  color: string;
};

const Import = (props: Props) => {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" {...props}>
      <path
        d="M3 11.5H18.5M18.5 11.5L12 5M18.5 11.5L12 18M22.5 4V19"
        stroke={props.color}
      />
    </svg>
  );
};

export default Import;
