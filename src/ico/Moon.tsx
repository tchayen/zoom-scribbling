import * as React from "react";

type Props = {
  color: string;
};

const Moon = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M22.5 16.073C13.643 17.46 7.51 11.215 8.87 1.5c-18.398 9.715 2.047 31.92 13.63 14.573z"
        stroke={props.color}
      />
    </svg>
  );
};

export default Moon;
