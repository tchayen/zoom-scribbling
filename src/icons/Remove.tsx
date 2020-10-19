import * as React from "react";

type Props = {
  color: string;
};

const Remove = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M2 3.5h5m15 0h-5m-10 0l2-3h6l2 3m-10 0h10M4 6l2 17.5h12L20 6"
        stroke={props.color}
      />
    </svg>
  );
};

export default Remove;
