import "@logseq/libs";
import React from "react";
import * as ReactDOM from "react-dom";
import { logseq as LS } from "../package.json";

import App from "./App";
import { registerMacro as registerMacroRender } from "./macro";

function main() {
  registerMacroRender();

  if (top) {
    // FIXME: the following cannot use "createRoot" API yet due to
    // https://github.com/vercel/swr/issues/1904
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById("app")!
    );
  }
}

console.info(`#${LS.id}: MAIN`);
logseq.ready(main).catch(console.error);
