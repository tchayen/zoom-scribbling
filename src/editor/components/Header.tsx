import React from "react";
import { Link } from "react-router-dom";
import * as Icons from "../../icons";
import { styled, useTheme } from "../../components/colorTheme";
import ColorModeToggle from "./ColorModeToggle";
import useOnlyOneTab from "../useOnlyOneTab";

const TopBar = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 4px;
  justify-content: space-between;
  height: 40px;
  background-color: ${(props) => props.theme.grayBackground};
`;

const Header = () => {
  const { colorMode } = useTheme();
  const openTabs = useOnlyOneTab();

  return (
    <TopBar>
      <div style={{ display: "flex" }}>
        <Link to="/">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 32,
              height: 32,
            }}
          >
            <Icons.Picture color={colorMode === "dark" ? "white" : "black"} />
          </div>
        </Link>
        <Link to="/directory">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 32,
              height: 32,
            }}
          >
            <Icons.Folder color={colorMode === "dark" ? "white" : "black"} />
          </div>
        </Link>
        You have {openTabs} open tabs
      </div>
      <ColorModeToggle />
    </TopBar>
  );
};

export default Header;
