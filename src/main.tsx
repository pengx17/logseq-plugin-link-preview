import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import { logseq as LS } from "../package.json";

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

console.info(`#${LS.id}: MAIN`);
logseq.ready(main).catch(console.error);
