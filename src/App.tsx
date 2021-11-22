import * as React from "react";
import { SWRConfig } from "swr";
import { localStorageProvider } from "./cache";
import { HoverLinkPreview } from "./HoverLinkPreview";
import { InlineLinkPreview } from "./InlineLinkPreview";

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
      document.documentElement.style.setProperty(
        "--ls-secondary-background-color",
        bgColor
      );
      document.documentElement.style.setProperty(
        "--ls-border-color",
        borderColor
      );
      document.documentElement.style.setProperty(
        "--ls-primary-text-color",
        primaryTextColor
      );
      document.documentElement.style.setProperty(
        "--ls-secondary-text-color",
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
