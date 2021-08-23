import * as React from "react";
import { createCache, SWRConfig } from "swr";
import { logseq as PL } from "../package.json";
import { HoverLinkPreview } from "./HoverLinkPreview";
import { InlineLinkPreview } from "./InlineLinkPreview";

function createProvider() {
  const cacheId = PL.id + "_cache";
  const map = new Map(JSON.parse(localStorage.getItem(cacheId) ?? "[]"));

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem(cacheId, appCache);
  });

  return map;
}

const provider = createProvider();
const { cache } = createCache(provider);

function App({ inline }: { inline: boolean }) {
  return (
    <SWRConfig value={{ cache }}>
      {inline ? <InlineLinkPreview /> : <HoverLinkPreview />}
    </SWRConfig>
  );
}

export default App;
