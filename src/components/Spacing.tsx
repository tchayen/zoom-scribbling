import React, { Children } from "react";
import { styled } from "../colorTheme";

const Box = styled.div`
  display: flex;
  flex-direction: column;
`;

const Element = styled.div`
  margin-bottom: 16px;
`;

const Spacing = ({ children }: any) => {
  return (
    <Box>
      {Children.map(children, (child) => (
        <Element>{child}</Element>
      ))}
    </Box>
  );
};

export default Spacing;
