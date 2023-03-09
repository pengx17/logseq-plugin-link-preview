import * as React from "react";
import { SWRConfig } from "swr";
import { localStorageProvider } from "./cache";
import { HoverLinkPreview } from "./HoverLinkPreview";
import { Prompt } from "./Prompt";
import { useAppStateStore } from "./store";

const useAdaptBackgroundColor = () => {
  setTimeout(() => {
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
  }, 2000);
};

function App() {
  useAdaptBackgroundColor();
  setTimeout(() => {
    // Listen for theme activated
    logseq.App.onThemeChanged(() => {
        useAdaptBackgroundColor();
    });
    // Listen for theme mode changed
    logseq.App.onThemeModeChanged(() => {
        useAdaptBackgroundColor();
    });
  }, 2000)
  const appState = useAppStateStore();
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      {appState.value.type === 'hovering' && <HoverLinkPreview />}
      {appState.value.type === 'prompt' && <Prompt />}
    </SWRConfig>
  );
}

export default App;
