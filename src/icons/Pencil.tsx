import * as React from "react";

type Props = {
  color: string;
};

const Pencil = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12.5 5.5l-12 12v6h6l12-12m-6-6l4-4 6 6-4 4m-6-6l6 6"
        stroke={props.color}
      />
    </svg>
  );
};

export default Pencil;
