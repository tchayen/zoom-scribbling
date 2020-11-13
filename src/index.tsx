import React, { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "./components/colorTheme";
import { setupIndexedDb } from "./helpers/indexedDb";
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
