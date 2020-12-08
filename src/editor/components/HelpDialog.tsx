import React from "react";
import { styled } from "../../components/colorTheme";
import Dialog, { DialogTrigger } from "../../components/Dialog";

const Key = styled.code`
  font-family: "Roboto Mono", monospace;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.mainText};
  background-color: ${(props) => props.theme.grayBackground};
  padding: 0 4px;
`;

const HelpDialog = ({ state }) => {
  // TODO: add info about scrolling with CMD to zoom and undo/redo
  return (
    <DialogTrigger label="Open dialog" state={state}>
      <Dialog title="Help" confirmLabel="Close" isDismissable>
        <p>
          <Key>H</Key> to open this dialog
        </p>
        <p>
          <Key>D</Key> to enter drawing mode
        </p>
        <p>
          <Key>E</Key> to enter erasing mode
        </p>
        <p>
          <Key>T</Key> to toggle between light and dark color theme
        </p>
        <p>
          <Key>CTRL</Key> + <Key>Z</Key> to undo
        </p>
        <p>
          <Key>SHIFT</Key> + <Key>CTRL</Key> + <Key>Z</Key> to redo
        </p>
        <p>
          <Key>CTRL</Key> + <Key>SCROLL</Key> to zoom
        </p>
        <p>
          <Key>SHIFT</Key> + <Key>-</Key> to unzoom
        </p>
        <p>
          <Key>SHIFT</Key> + <Key>+</Key> to zoom
        </p>
        <p>
          <Key>SHIFT</Key> + <Key>0</Key> to reset zoom
        </p>
        <p>
          <Key>-</Key> to decrease pen thickness
        </p>
        <p>
          <Key>=</Key> to increase pen thickness
        </p>
      </Dialog>
    </DialogTrigger>
  );
};

export default HelpDialog;
