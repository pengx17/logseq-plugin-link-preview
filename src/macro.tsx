import "@logseq/libs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { localStorageProvider } from "./cache";
import { LinkCard } from "./LinkCard";
import rawStyle from "./style.css";
import {
  fetchLinkPreviewMetadata,
  toLinkPreviewMetadata,
} from "./use-link-preview-metadata";

const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const macroPrefix = ":linkpreview";

export const registerMacro = () => {
  // FIXME: seems not working because Logseq will capture mousedown events on blocks
  logseq.provideModel({
    openExternalLink(e: any) {
      const { url } = e.dataset;
      logseq.App.openExternalLink(url);
    },
  });
  logseq.provideStyle(rawStyle);
  logseq.App.onMacroRendererSlotted(async ({ payload, slot }) => {
    const [type, url] = payload.arguments;
    if (!type?.startsWith(macroPrefix)) {
      return;
    }

    const cache = localStorageProvider();
    let cached = cache.get(`inlinereq$` + url);
    const render = () => {
      const inner = ReactDOMServer.renderToStaticMarkup(
        <LinkCard data={toLinkPreviewMetadata(url, null, cached)} />
      );
      logseq.provideUI({
        key: "linkpreview",
        slot,
        reset: true,
        template: `<span data-on-click="openExternalLink" data-url="${url}">${inner}</span>`,
      });
    };
    render();
    if (!cached) {
      cached = await fetchLinkPreviewMetadata(url);
      cache.set(`inlinereq$` + url, cached);
      render();
    }
  });

  // This command only support to replace the whole block
  logseq.Editor.registerSlashCommand("Convert to Link Card 🪧", async () => {
    const maybeUrl = (await logseq.Editor.getEditingBlockContent()).trim();
    const id = await logseq.Editor.getCurrentBlock();

    if (urlRegex.test(maybeUrl) && id) {
      const newContent = `{{renderer ${macroPrefix},${maybeUrl}}}`;
      logseq.Editor.updateBlock(id.uuid, newContent);
    } else {
      logseq.App.showMsg(
        "The block content does not seem to be a valid URL",
        "warning"
      );
    }
  });
};
