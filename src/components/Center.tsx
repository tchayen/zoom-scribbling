import React from "react";

type Props = {
  children: React.ReactNode;
};

const Center = ({ children }: Props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    {children}
  </div>
);

export default Center;
