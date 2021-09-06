import * as React from "react";
import { SWRConfig } from "swr";
import { logseq as PL, version } from "../package.json";
import { HoverLinkPreview } from "./HoverLinkPreview";
import { InlineLinkPreview } from "./InlineLinkPreview";
import { debounce } from "./utils";

function localStorageProvider() {
  class CacheMap extends Map<string, any> {
    persist = debounce(() => {
      localStorage.setItem(cacheId, JSON.stringify(Array.from(this.entries())));
    }, 1000);
    set = (key: string, value: any) => {
      this.persist();
      return super.set(key, value);
    };
  }

  const cacheId = `${PL.id}-${version}`;
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new CacheMap(JSON.parse(localStorage.getItem(cacheId) ?? "[]"));

  // We still use the map for write & read for performance.
  return map;
}

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
    <SWRConfig value={{ provider: localStorageProvider }}>
      {inline ? <InlineLinkPreview /> : <HoverLinkPreview />}
    </SWRConfig>
  );
}

export default App;
