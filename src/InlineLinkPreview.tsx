import * as React from "react";
import { LinkCard } from "./LinkCard";
import { useLinkPreviewMetadata } from "./use-link-preview-metadata";
import { getCardSize } from "./utils";

/**
 * @deprecated
 */
export const InlineLinkPreview = () => {
  const url = window.frameElement?.getAttribute("data-url");
  const data = useLinkPreviewMetadata(url);

  React.useEffect(() => {
    if (data && window.frameElement) {
      const iframe = window.frameElement as HTMLIFrameElement;
      const [width, height] = getCardSize(data);
      iframe.style.maxWidth = `calc(100% - 38px)`;
      iframe.style.width = `${width}px`;
      iframe.style.height = `${height}px`;
    }
  }, [data]);

  return data ? <LinkCard data={data} /> : null;
};
