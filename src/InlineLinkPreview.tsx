import * as React from "react";
import { LinkCard } from "./LinkCard";
import { useLinkPreviewMetadata } from "./use-link-preview-metadata";
import { getCardSize } from "./utils";

export const InlineLinkPreview = () => {
  const url = window.frameElement?.getAttribute("data-url");
  const data = useLinkPreviewMetadata(url);

  React.useEffect(() => {
    if (data && window.frameElement) {
      const [width, height] = getCardSize(data);
      (
        window.frameElement as HTMLIFrameElement
      ).style.maxWidth = `calc(100% - 38px)`;
      (window.frameElement as HTMLIFrameElement).style.width = `${width}px`;
      (window.frameElement as HTMLIFrameElement).style.height = `${height}px`;
    }
  }, [data]);

  return data ? <LinkCard data={data} /> : null;
};
