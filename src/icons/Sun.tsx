import * as React from "react";

type Props = {
  color: string;
};

const Sun = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={5.5} stroke={props.color} />
      <path
        d="M12 4V0M12 24v-4M24 12h-4M20.485 3.515L17.5 6.5M3.515 3.515L6.5 6.5M3.515 20.485L6.5 17.5M20.485 20.485L17.5 17.5M4 12H0"
        stroke={props.color}
      />
    </svg>
  );
};

export default Sun;
