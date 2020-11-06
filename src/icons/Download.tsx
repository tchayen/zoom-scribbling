import React from "react";

type Props = {
  color: string;
};

const Download = (props: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14 14.5L18.2788 14.5C25 14.5 24 6.5 16.5 6.50001C16.5 -1.43051e-05 7.50009 -7.15256e-05 7.5 6.50001C3.33786e-06 6.50001 -0.596119 14.875 5.27885 14.875H9.00001M11.5 12L11.5 22M11.5 22L6.5 17M11.5 22L16.5 17"
        stroke={props.color}
      />
    </svg>
  );
};

export default Download;
