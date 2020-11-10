import React from "react";
import { styled } from "../../components/colorTheme";
import IconButton from "../../components/IconButton";
import Label from "../../components/Label";
import * as Icons from "../../icons";

// const Row = styled.div`
//   display: flex;
//   flex-direction: row;
// `;

const Actions = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Label>Actions</Label>
      <div
        style={{
          marginBottom: 16,
          display: "grid",
          gridGap: 8,
          gridTemplateColumns: "24px 24px 24px",
        }}
      >
        <IconButton Icon={Icons.New} onPress={() => {}} tooltip="New file" />
        <IconButton Icon={Icons.Save} onPress={() => {}} tooltip="Save" />
        <IconButton
          Icon={Icons.Import}
          onPress={() => {}}
          tooltip="Import file"
        />

        <IconButton Icon={Icons.Undo} onPress={() => {}} tooltip="Undo" />
        <IconButton Icon={Icons.Redo} onPress={() => {}} tooltip="Redo" />
        <IconButton Icon={Icons.Share} onPress={() => {}} tooltip="Share" />
      </div>
    </div>
  );
};

export default Actions;
