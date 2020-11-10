import React from "react";

type Props = {
  color: string;
};

const Pin = (props: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 21L9.5 14.5M9.5 14.5L6 11L11.5 8.5L15 2L22 9L15.5 12.5L13 18L9.5 14.5Z"
        stroke={props.color}
      />
    </svg>
  );
};

export default Pin;
