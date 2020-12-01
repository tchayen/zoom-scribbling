import React, { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "./components/colorTheme";
import { setupIndexedDb } from "./helpers/indexedDb";
import Editor from "./editor/components/Editor";

const App = () => {
  useEffect(() => {
    setupIndexedDb();
  }, []);

  return (
    <Router>
      <Switch>
        {/* <Route path="/directory">settings</Route> */}
        {/* <Route path="/settings">settings</Route> */}
        <Route path="/">
          <Editor />
        </Route>
      </Switch>
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
