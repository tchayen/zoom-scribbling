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
          <Key>d</Key> to enter drawing mode
        </p>
        <p>
          <Key>e</Key> to enter erasing mode
        </p>
        <p>
          <Key>t</Key> to toggle between light and dark color theme
        </p>
        <p>
          <Key>shift</Key> + <Key>-</Key> to unzoom
        </p>
        <p>
          <Key>shift</Key> + <Key>+</Key> to zoom
        </p>
        <p>
          <Key>shift</Key> + <Key>0</Key> to reset zoom
        </p>
        <p>
          <Key>-</Key> to decrease pen thickness
        </p>
        <p>
          <Key>+</Key> to increase pen thickness
        </p>
      </Dialog>
    </DialogTrigger>
  );
};

export default HelpDialog;
