import React from "react";

const Eraser = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6.75 15L1 9.25L3.25 7L9.25 1L15 6.75L9 12.75L6.75 15Z"
        fill="white"
      />
      <path
        d="M3.25 7L9.25 1L15 6.75L9 12.75M3.25 7L1 9.25L6.75 15L9 12.75M3.25 7L9 12.75"
        stroke="black"
      />
    </svg>
  );
};

export default Eraser;
