import * as React from "react";
import { createCache, SWRConfig } from "swr";
import { logseq as PL } from "../package.json";
import { HoverLinkPreview } from "./HoverLinkPreview";
import { InlineLinkPreview } from "./InlineLinkPreview";

function createProvider() {
  const cacheId = PL.id + "_cache";
  // TODO: migrate to LSPluginFileStorage
  const map = new Map(JSON.parse(localStorage.getItem(cacheId) ?? "[]"));

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem(cacheId, appCache);
  });

  return map;
}

const provider = createProvider();
const { cache } = createCache(provider);

// FIXME: adapt for dynamic theme mode change
const useAdaptBackgroundColor = () => {
  React.useEffect(() => {
    if (frameElement) {
      const baseStyle = getComputedStyle(frameElement);
      const bgColor = baseStyle.getPropertyValue(
        "--ls-secondary-background-color"
      );
      const primaryTextColor = baseStyle.getPropertyValue(
        "--ls-primary-text-color"
      );
      const secondaryTextColor = baseStyle.getPropertyValue(
        "--ls-secondary-text-color"
      );
      const borderColor = baseStyle.getPropertyValue("--ls-border-color");
      document.documentElement.style.setProperty("--background-color", bgColor);
      document.documentElement.style.setProperty("--border-color", borderColor);
      document.documentElement.style.setProperty(
        "--primary-text-color",
        primaryTextColor
      );
      document.documentElement.style.setProperty(
        "--secondary-text-color",
        secondaryTextColor
      );
    }
  }, []);
};

function App({ inline }: { inline: boolean }) {
  useAdaptBackgroundColor();
  return (
    <SWRConfig value={{ cache }}>
      {inline ? <InlineLinkPreview /> : <HoverLinkPreview />}
    </SWRConfig>
  );
}

export default App;
