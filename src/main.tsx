import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { registerMacro as registerMacroRender } from "./macro";
import { isInlineMode } from "./utils";

function main(inline: boolean) {
  if (!inline) {
    registerMacroRender();
  }

  if (top) {
    ReactDOM.render(
      <React.StrictMode>
        <App inline={inline} />
      </React.StrictMode>,
      document.getElementById("app")
    );
  }
}

if (isInlineMode()) {
  main(true);
} else {
  const pluginId = logseq.baseInfo.id;
  console.info(`#${pluginId}: MAIN`);
  logseq.ready(() => main(false)).catch(console.error);
}
