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

const HelpDialog = () => {
  return (
    <DialogTrigger startOpen label="Open dialog">
      <Dialog title="Help" confirmLabel="Close" isDismissable>
        <p>
          <Key>h</Key> to open this dialog
        </p>
        <p>
          <Key>d</Key> to draw
        </p>
        <p>
          <Key>e</Key> to erase
        </p>
        <p>
          <Key>t</Key> to toggle color theme
        </p>
        <p>
          <Key>shift</Key> + <Key>-</Key> to unzoom
        </p>
        <p>
          <Key>shift</Key> + <Key>+</Key> to zoom
        </p>
        <p>
          <Key>-</Key> to decrease thickness
        </p>
        <p>
          <Key>+</Key> to increase thickness
        </p>
      </Dialog>
    </DialogTrigger>
  );
};

export default HelpDialog;
