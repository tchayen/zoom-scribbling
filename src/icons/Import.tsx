import * as React from "react";

type Props = {
  color: string;
};

const Import = (props: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M2 11.5H17.5M17.5 11.5L11 5M17.5 11.5L11 18M21.5 4V19"
        stroke={props.color}
      />
    </svg>
  );
};

export default Import;
