import React from "react";

type Props = {
  color: string;
};

const Download = (props: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12.5 2L12.5 17.5M12.5 17.5L19 11M12.5 17.5L6 11M20 21.5L5 21.5"
        stroke={props.color}
      />
    </svg>
  );
};

export default Download;
