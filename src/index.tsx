import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { scaleState } from "./editor/state";
import Actions from "./editor/components/Actions";
import { styled, ThemeProvider, useTheme } from "./components/colorTheme";
import IconButton from "./components/IconButton";
import Input from "./components/Input";
import consts from "./consts";
import { setupIndexedDb } from "./editor/indexedDb";
import * as Icons from "./icons";
import Thickness from "./editor/components/Thickness";
import Tools from "./editor/components/Tools";
import PointerPressure from "./editor/components/PointerPressure";
import Color from "./editor/components/Color";
import Editor from "./editor/components/Editor";

// download.onclick = () => {
//   const state = exportState();
//   const element = document.createElement("a");
//   element.setAttribute(
//     "href",
//     `data:text/plain;charset=utf-8,${encodeURIComponent(state)}`
//   );
//   element.setAttribute("download", "download.json");
//   element.style.display = "none";
//   document.body.appendChild(element);
//   element.click();
//   document.body.removeChild(element);
// };

const Sidebar = styled.div`
  background-color: ${(props) => props.theme.grayBackground};
  padding: 16px;
  width: ${consts.TOOLBAR_WIDTH}px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 4px;
  justify-content: space-between;
  height: 40px;
  background-color: ${(props) => props.theme.grayBackground};
`;

const Row = styled.div`
  display: flex;
  width: 100vw;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const App = () => {
  const { colorMode, setColorMode } = useTheme();
  const scale = useRecoilValue(scaleState);

  useEffect(() => {
    setupIndexedDb();
  }, []);

  const sidebar = (
    <Sidebar>
      <Actions />
      <Tools />
      <Thickness />
      <PointerPressure />
      <Color />
      <Input
        label="Zoom"
        value={`${(scale * 100).toFixed(0)}%`}
        onChange={() => {}}
        style={{ width: 55, border: "none" }}
      />
    </Sidebar>
  );

  const header = (
    <TopBar>
      <div style={{ display: "flex" }}>
        <Link to="/">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 32,
              height: 32,
            }}
          >
            <Icons.Picture color={colorMode === "dark" ? "white" : "black"} />
          </div>
        </Link>
        <Link to="/directory">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 32,
              height: 32,
            }}
          >
            <Icons.Folder color={colorMode === "dark" ? "white" : "black"} />
          </div>
        </Link>
      </div>
      <IconButton
        Icon={colorMode === "dark" ? Icons.Sun : Icons.Moon}
        onPress={() => {
          setColorMode(colorMode === "dark" ? "light" : "dark");
        }}
        tooltip="Toggle color mode"
      />
    </TopBar>
  );

  return (
    <Router>
      <Column>
        <Switch>
          <Route path="/directory">
            <Row>
              <Column>{header}Your drawings will be listed here</Column>
            </Row>
          </Route>
          <Route path="/settings">
            <Row>
              <Column>{header}Settings</Column>
            </Row>
          </Route>
          <Route path="/">
            <Row>
              {sidebar}
              <Column>
                {header}
                <Editor />
              </Column>
            </Row>
          </Route>
        </Switch>
      </Column>
    </Router>
  );
};

ReactDOM.render(
  <RecoilRoot>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </RecoilRoot>,
  document.getElementById("root")
);
