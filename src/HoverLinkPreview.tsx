import * as React from "react";
import { useDebounce } from "react-use";
import { LinkCard } from "./LinkCard";
import {
  LinkPreviewMetadata,
  useLinkPreviewMetadata,
} from "./use-link-preview-metadata";
import { getCardSize, usePreventFocus } from "./utils";

import "./hovering.css";

function useDebounceValue<T>(v: T, timeout: number = 50) {
  const [state, setState] = React.useState(v);
  useDebounce(
    () => {
      setState(v);
    },
    timeout,
    [v]
  );
  return state;
}

const useHoveringExternalLink = () => {
  const [anchor, setAnchor] = React.useState<HTMLAnchorElement | null>(null);
  const currentAnchor = React.useRef(anchor);

  React.useEffect(() => {
    const enterAnchorListener = (e: MouseEvent) => {
      const target = e.composedPath()[0] as HTMLAnchorElement;
      if (
        target.tagName === "A" &&
        target.href &&
        target.className.includes("external-link")
      ) {
        setAnchor(target);
        currentAnchor.current = target;
        target.addEventListener(
          "mouseleave",
          () => {
            setAnchor(null);
          },
          { once: true }
        );
      }
    };

    const enterIframeListener = (e: MouseEvent) => {
      setAnchor(currentAnchor.current);
      document.addEventListener(
        "mouseleave",
        () => {
          setAnchor(null);
        },
        { once: true }
      );
    };

    top?.document.addEventListener("mouseenter", enterAnchorListener, true);
    document.addEventListener("mouseenter", enterIframeListener, true);
    return () => {
      top?.document.removeEventListener(
        "mouseenter",
        enterAnchorListener,
        true
      );
      document.removeEventListener("mouseenter", enterIframeListener, true);
    };
  }, []);
  return anchor;
};

const useAdaptViewPort = (
  data: LinkPreviewMetadata | null,
  anchor: HTMLAnchorElement | null
) => {
  React.useEffect(() => {
    if (data && anchor && top) {
      logseq.showMainUI();
      const elemBoundingRect = anchor.getBoundingClientRect();
      const [width, height] = getCardSize(data);
      let left = (elemBoundingRect.left + elemBoundingRect.right - width) / 2;
      const right = left + width;
      const oversize = Math.max(right - top.visualViewport.width, 0);
      left = Math.max(left - oversize, 0);
      let vOffset =
        elemBoundingRect.top - height > 0
          ? elemBoundingRect.top - height - 8
          : elemBoundingRect.top + elemBoundingRect.height + 8;
      logseq.setMainUIInlineStyle({
        top: vOffset + `px`,
        left: left + `px`,
        width: width + `px`,
        height: height + `px`,
        zIndex: 20,
        filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))",
        position: "fixed",
      });
    } else {
      logseq.hideMainUI();
    }
  }, [anchor, data]);
};

export const HoverLinkPreview = () => {
  const anchor = useHoveringExternalLink();
  const debouncedAnchor = useDebounceValue(anchor, 200);
  const data = useLinkPreviewMetadata(
    debouncedAnchor?.href,
    debouncedAnchor?.innerText
  );
  usePreventFocus();
  useAdaptViewPort(data, debouncedAnchor);

  if (data) {
    return (
      <LinkCard
        data={data}
        // @ts-expect-error
        href={data.url}
        rel="noopener noreferrer"
        target="_blank"
      />
    );
  }
  return null;
};
