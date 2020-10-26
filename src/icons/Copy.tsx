import React from "react";

type Props = {
  color: string;
};

const Copy = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M23.5 4.5h-19v19h19v-19z" stroke={props.color} />
      <path d="M20 .5H.5V20" stroke={props.color} />
    </svg>
  );
};

export default Copy;
