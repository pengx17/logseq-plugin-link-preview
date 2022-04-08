import "@logseq/libs";
import React from "react";
import * as ReactDOM from "react-dom/client";
import { logseq as LS } from "../package.json";

import App from "./App";
import { registerMacro as registerMacroRender } from "./macro";

function main() {
  registerMacroRender();

  if (top) {
    const root = ReactDOM.createRoot(document.getElementById("app")!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

console.info(`#${LS.id}: MAIN`);
logseq.ready(main).catch(console.error);
