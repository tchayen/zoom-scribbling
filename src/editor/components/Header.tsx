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

const IconLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
`;

const Header = () => {
  const { colorMode } = useTheme();
  const openTabs = useOnlyOneTab();

  return (
    <TopBar>
      <div style={{ display: "flex" }}>
        <Link to="/">
          <IconLink>
            <Icons.Picture color={colorMode === "dark" ? "white" : "black"} />
          </IconLink>
        </Link>
        <Link to="/directory">
          <IconLink>
            <Icons.Folder color={colorMode === "dark" ? "white" : "black"} />
          </IconLink>
        </Link>
        <Link to="/settings">
          <IconLink>
            <Icons.Person color={colorMode === "dark" ? "white" : "black"} />
          </IconLink>
        </Link>
        You have {openTabs} open tabs
      </div>
      <ColorModeToggle />
    </TopBar>
  );
};

export default Header;
