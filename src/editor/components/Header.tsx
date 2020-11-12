import React from "react";
import * as Icons from "../../icons";
import { styled } from "../../components/colorTheme";
import ColorModeToggle from "./ColorModeToggle";
import IconButton from "../../components/IconButton";
import Zoom from "./Zoom";

const TopBar = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 4px;
  justify-content: space-between;
  height: 40px;
  background-color: ${(props) => props.theme.grayBackground};
`;

const Buttons = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 4px;
  margin-right: 4px;
`;

const Header = () => {
  return (
    <TopBar>
      <Buttons>
        <IconButton Icon={Icons.New} onPress={() => {}} tooltip="New file" />
        <IconButton Icon={Icons.Save} onPress={() => {}} tooltip="Save" />
        <IconButton Icon={Icons.Folder} onPress={() => {}} tooltip="Files" />
        <IconButton Icon={Icons.Undo} onPress={() => {}} tooltip="Undo" />
        <IconButton Icon={Icons.Redo} onPress={() => {}} tooltip="Redo" />
        <ColorModeToggle />
      </Buttons>
      <Zoom />
    </TopBar>
  );
};

export default Header;
