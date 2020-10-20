import React from "react";
import { styled } from "../../components/colorTheme";
import IconButton from "../../components/IconButton";
import Label from "../../components/Label";
import * as Icons from "../../icons";

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Actions = () => {
  return (
    <div style={{ marginBottom: 16 }}>
      <Label>Actions</Label>
      <Row>
        <IconButton Icon={Icons.New} onPress={() => {}} tooltip="New file" />
        <IconButton Icon={Icons.Save} onPress={() => {}} tooltip="Save" />
        <IconButton
          Icon={Icons.Import}
          onPress={() => {}}
          tooltip="Import file"
        />
      </Row>
      <Row>
        <IconButton Icon={Icons.Undo} onPress={() => {}} tooltip="Undo" />
        <IconButton Icon={Icons.Redo} onPress={() => {}} tooltip="Redo" />
      </Row>
    </div>
  );
};

export default Actions;