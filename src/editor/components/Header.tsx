import React from "react";
import { Link } from "react-router-dom";
import * as Icons from "../../icons";
import { styled, useTheme } from "../../components/colorTheme";
import ColorModeToggle from "./ColorModeToggle";
import IconButton from "../../components/IconButton";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();
  const handleOnClick = (to: string) => () => history.push(to);

  return (
    <TopBar>
      <div style={{ display: "flex" }}>
        {/* <IconLink>
          <IconButton
            Icon={Icons.Picture}
            onPress={handleOnClick("/")}
            tooltip="Drawing canvas"
            isDisabled={false}
          />
        </IconLink>
        <IconLink>
          <IconButton
            Icon={Icons.Folder}
            onPress={handleOnClick("/directory")}
            tooltip="Files"
            isDisabled={false}
          />
        </IconLink>
        <IconLink>
          <IconButton
            Icon={Icons.Person}
            onPress={handleOnClick("/settings")}
            tooltip="Settings"
            isDisabled={false}
          />
        </IconLink> */}
      </div>
      <ColorModeToggle />
    </TopBar>
  );
};

export default Header;
