import "@logseq/libs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { localStorageProvider } from "./cache";
import { LinkCard } from "./LinkCard";
import { waitForPrompt } from "./store";
import rawStyle from "./style.css";
import minStyle from "./min-style.tcss?raw";

import {
  fetchLinkPreviewMetadata,
  getOpenGraphMetadata,
  toLinkPreviewMetadata,
} from "./use-link-preview-metadata";
import { urlRegex } from "./utils";

const macroPrefix = ":linkpreview";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  // This command only support to replace the whole block for now
  logseq.Editor.registerSlashCommand(
    "[Link Preview] Convert current link to a Link Card 🪧",
    async () => {
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
    }
  );

  logseq.Editor.registerSlashCommand(
    "[Link Preview] Insert a static Link Card (will be very long)",
    async () => {
      const id = await logseq.Editor.getCurrentBlock();
      const url = await waitForPrompt("Give a valid URL");
      if (!urlRegex.test(url)) {
        logseq.App.showMsg("This does not seem to be a valid URL", "warning");
      } else if (id) {
        if (id && urlRegex.test(url)) {
          const marker = `Fetching metadata for ${url} ... ⏳`;
          await logseq.Editor.insertAtEditingCursor(marker);
          await logseq.Editor.exitEditingMode();
          let res = "";
          const d = delay(1000); // wait at least 1s
          try {
            const meta = await getOpenGraphMetadata(url);
            res = ReactDOMServer.renderToStaticMarkup(
              <>
                <LinkCard data={toLinkPreviewMetadata(url, null, meta)} />
                <style>{minStyle}</style>
              </>
            );
            res = res.replace(
              'inject-placeholder="true"',
              'onmousedown="(function(e){e.stopPropagation();})(event)"'
            );
          } catch (err) {
            res = "Failed to get metadata for " + url;
          }
          await d;
          // It seems Logseq does not have the latest content in the API too soon
          const blockContent = await logseq.Editor.getBlock(id.uuid, {
            includeChildren: true,
          });
          if (blockContent?.content.includes(marker)) {
            logseq.Editor.updateBlock(
              id.uuid,
              blockContent?.content.replace(marker, res)
            );
          }
          console.log(blockContent);
        }
      }
    }
  );
};
