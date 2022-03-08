import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { registerMacro as registerMacroRender } from "./macro";

function main() {
  registerMacroRender();

  if (top) {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById("app")
    );
  }
}

const pluginId = logseq.baseInfo.id;
console.info(`#${pluginId}: MAIN`);
logseq.ready(main).catch(console.error);
