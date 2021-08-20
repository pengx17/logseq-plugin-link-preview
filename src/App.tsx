import * as React from "react";
import useSWR from "swr";
import "./style.css";
import { useDebounceValue, useHoveringExternalLink } from "./utils";

// Change this if you want to self-deploy
const domain = "https://logseq-plugin-link-preview.vercel.app/";

const fetcher = (url: string) =>
  fetch(`${domain}/api/link-preview?url=${encodeURIComponent(url)}`).then(
    (res) => {
      if (res.status >= 400) {
        throw res.statusText;
      }
      return res.json();
    }
  );

interface BaseType {
  mediaType: string;
  contentType: string;
  favicons: string[];

  url: string;
  anchorText: string;
  error: any;
}

interface PlaceholderType extends BaseType {
  contentType: "placeholder";
}

interface HTMLResponse extends BaseType {
  title: string;
  siteName: string;
  description: string;
  images: string[];
  videos: string[];
  contentType: `text/html${string}`;
}

interface AudioResponse extends BaseType {
  contentType: `audio/${string}`;
}

interface ImageResponse extends BaseType {
  contentType: `image/${string}`;
}

interface VideoResponse extends BaseType {
  contentType: `video/${string}`;
}

interface ApplicationResponse extends BaseType {
  contentType: `application/${string}`;
}

type Metadata =
  | HTMLResponse
  | AudioResponse
  | ImageResponse
  | VideoResponse
  | ApplicationResponse
  | PlaceholderType;

const isHTML = (d: Metadata): d is HTMLResponse => {
  return (d as any).contentType.startsWith("text/html");
};

const isVideo = (d: Metadata): d is VideoResponse => {
  return (d as any).contentType.startsWith("video/");
};

const isAudio = (d: Metadata): d is AudioResponse => {
  return (d as any).contentType.startsWith("audio/");
};

const isImage = (d: Metadata): d is ImageResponse => {
  return (d as any).contentType.startsWith("image/");
};

const adaptMeta = (d: Metadata) => {
  if (isHTML(d)) {
    return d;
  }

  if (isVideo(d)) {
    return {
      ...d,
      images: [],
      title: d.anchorText ?? d.url,
      description: <video controls src={d.url} />,
      url: d.url,
    };
  }

  if (isAudio(d)) {
    return {
      ...d,
      images: [],
      title: d.anchorText ?? d.url,
      description: <audio controls src={d.url} />,
    };
  }

  if (isImage(d)) {
    return {
      ...d,
      images: [],
      title: d.anchorText ?? d.url,
      description: <img src={d.url} />,
    };
  }

  return {
    ...d,
    images: [],
    title: d.anchorText ?? d.url,
    description:
      d.error != null ? "Failed to load link metadata" : "loading ...",
  };
};

type LinkPreviewMetadata = Pick<
  Metadata,
  "anchorText" | "contentType" | "error" | "favicons" | "mediaType" | "url"
> & {
  title: string;
  description: React.ReactNode;
  images?: string[];
};

const useLinkPreview = (
  anchor: HTMLAnchorElement | null
): LinkPreviewMetadata | null => {
  const { data, error } = useSWR(anchor?.href ?? null, fetcher);

  return React.useMemo(() => {
    return anchor
      ? adaptMeta({
          contentType: "placeholder",
          url: anchor.href,
          anchorText:
            anchor.textContent === anchor.href ? "" : anchor.textContent,
          error,
          ...(data ?? {}),
        })
      : null;
  }, [anchor, data]);
};

// Credits: adopted from innos.io
export const PreviewCard = ({ data }: { data: LinkPreviewMetadata }) => {
  return (
    <a
      className="root"
      href={data.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="card-container">
        <div className="text-container">
          {data.title && (
            <div className="text-container-title">{data.title}</div>
          )}
          <div className="text-container-description">{data.description}</div>
          <div className="text-container-url-container">
            {data.favicons?.length > 0 && (
              <img src={data.favicons[0]} width={16} height={16} />
            )}
            <span className="text-container-url">{data.url}</span>
          </div>
        </div>
        {data.images?.[0] && (
          <div className="cover-container">
            <img className="cover-image" src={data.images[0]} alt="cover" />
          </div>
        )}
      </div>
    </a>
  );
};

const getCardSize = (data: LinkPreviewMetadata) => {
  // If link has cover image
  const width = data.images && data.images.length > 0 ? 720 : 400;

  // If link showing placeholder
  let height = 140;

  if (
    data.contentType.startsWith("text/html") ||
    data.contentType.startsWith("audio")
  ) {
    height = 140;
  } else if (
    data.contentType.startsWith("image") ||
    data.contentType.startsWith("video")
  ) {
    height = 300;
  } else {
    height = 100;
  }
  if (!data.description) {
    height -= 60;
  }

  return [width, height];
};

const useAdaptViewPort = (
  data: LinkPreviewMetadata | null,
  anchor: HTMLAnchorElement | null
) => {
  React.useEffect(() => {
    if (data && anchor) {
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
        zIndex: 11,
        top: vOffset + `px`,
        left: left + `px`,
        width: width + `px`,
        height: height + `px`,
      });
    } else {
      logseq.hideMainUI();
    }
  }, [anchor, data]);
};

function App() {
  const anchor = useHoveringExternalLink();
  const debouncedAnchor = useDebounceValue(anchor, 200);
  const data = useLinkPreview(debouncedAnchor);

  useAdaptViewPort(data, debouncedAnchor);

  if (data) {
    return <PreviewCard data={data} />;
  }
  return null;
}

export default App;
