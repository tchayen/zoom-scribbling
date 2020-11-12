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

const Header = ({ reset, save, files, undo, redo, help }) => {
  return (
    <TopBar>
      <Buttons>
        <IconButton Icon={Icons.New} onPress={reset} tooltip="New file ⌘N" />
        {/* <IconButton Icon={Icons.Save} onPress={save} tooltip="Save ⌘S" /> */}
        {/* <IconButton Icon={Icons.Folder} onPress={files} tooltip="Files ⌘D" /> */}
        <IconButton Icon={Icons.Undo} onPress={undo} tooltip="Undo ⌘Z" />
        <IconButton Icon={Icons.Redo} onPress={redo} tooltip="Redo ⇧⌘Z" />
        <IconButton Icon={Icons.Help} onPress={help} tooltip="Files H" />
        <ColorModeToggle />
      </Buttons>
      <Zoom />
    </TopBar>
  );
};

export default Header;
