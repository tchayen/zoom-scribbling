import React, { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { styled, ThemeProvider } from "./components/colorTheme";
import { setupIndexedDb } from "./editor/indexedDb";
import Editor from "./editor/components/Editor";
import Header from "./editor/components/Header";
import Tools from "./editor/components/Tools";

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
  useEffect(() => {
    setupIndexedDb();
  }, []);

  return (
    <Router>
      <Column>
        <Switch>
          <Route path="/directory">
            <Column>
              <Header />
            </Column>
          </Route>
          <Route path="/settings">
            <Column>
              <Header />
              settings
            </Column>
          </Route>
          <Route path="/">
            <Column>
              <Row>
                <Editor />
              </Row>
            </Column>
          </Route>
        </Switch>
      </Column>
    </Router>
  );
};

const element = document.getElementById("root");

ReactDOM.render(
  <StrictMode>
    <RecoilRoot>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </StrictMode>,
  element
);
