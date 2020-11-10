import React from "react";
import { styled } from "../../components/colorTheme";
import consts from "../../consts";
import Actions from "./Actions";
import Color from "./Color";
import PointerPressure from "./PointerPressure";
import Thickness from "./Thickness";
import Tools from "./Tools";
import Zoom from "./Zoom";

const SidebarComponent = styled.div`
  background-color: ${(props) => props.theme.grayBackground};
  padding: 16px;
  width: ${consts.TOOLBAR_WIDTH}px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Sidebar = () => (
  <SidebarComponent>
    {/* <Actions /> */}
    <Tools />
    <Thickness />
    {/* <PointerPressure /> */}
    {/* <Color /> */}
    <Zoom />
  </SidebarComponent>
);

export default Sidebar;
