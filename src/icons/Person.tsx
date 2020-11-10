import React from "react";

type Props = {
  color: string;
};

const Person = (props: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="7" r="5.5" stroke={props.color} />
      <path d="M0.5 23C0.5 13 23.5 13 23.5 23" stroke={props.color} />
    </svg>
  );
};

export default Person;
