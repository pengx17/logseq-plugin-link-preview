import * as React from "react";
import { createCache, SWRConfig } from "swr";
import { logseq as PL } from "../package.json";
import { LinkPreview } from "./LinkPreview";

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

function App() {
  return (
    <SWRConfig value={{ cache }}>
      <LinkPreview />
    </SWRConfig>
  );
}

export default App;
