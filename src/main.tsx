import "@logseq/libs";
import "virtual:windi.css";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { isInlineMode } from "./utils";

const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

function main(inline: boolean) {
  if (!inline) {
    logseq.Editor.registerSlashCommand("Convert to Link Card 🪧", async () => {
      const maybeUrl = (await logseq.Editor.getEditingBlockContent()).trim();
      const id = await logseq.Editor.getCurrentBlock();

      if (urlRegex.test(maybeUrl) && id) {
        const newContent = ` <iframe data-url='${maybeUrl}' src='${logseq.baseInfo.entry}'></iframe> `;
        logseq.Editor.updateBlock(id.uuid, newContent);
      } else {
        logseq.App.showMsg(
          "The block content does not seem to be a valid URL",
          "warning"
        );
      }
    });
  }

  ReactDOM.render(
    <React.StrictMode>
      <App inline={inline} />
    </React.StrictMode>,
    document.getElementById("app")
  );
}

if (isInlineMode()) {
  main(true);
} else {
  const pluginId = logseq.baseInfo.id;
  console.info(`#${pluginId}: MAIN`);
  logseq.ready(() => main(false)).catch(console.error);
}
