import React from "react";
import useSWR from "swr";
import {
  useAppVisible,
  useDebounceValue,
  useHoveringExternalLink,
} from "./utils";
import "./style.css";

const domain = "https://pengx17.vercel.app";

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
  | ApplicationResponse;

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

// Credits: adopted directly from innos.io
const PreviewCard = ({ data }: { data: ReturnType<typeof adaptMeta> }) => {
  return (
    <a
      className="root"
      href={data.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="card-container">
        <div className="text-container">
          <div className="text-container-title">{data.title}</div>
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

const useLinkPreview = (anchor: HTMLAnchorElement | null) => {
  const { data, error } = useSWR(anchor?.href ?? null, fetcher);

  return React.useMemo(() => {
    return anchor
      ? adaptMeta({
          contentType: "",
          url: anchor.href,
          anchorText: anchor.textContent,
          error,
          ...(data ?? {}),
        })
      : null;
  }, [anchor, data]);
};

function App() {
  const visible = useAppVisible();
  const anchor = useHoveringExternalLink();
  const debouncedAnchor = useDebounceValue(anchor, 200);
  const data = useLinkPreview(debouncedAnchor);

  React.useEffect(() => {
    if (data && debouncedAnchor) {
      logseq.showMainUI();
      const elemBoundingRect = debouncedAnchor.getBoundingClientRect();
      const width = data.images?.length > 0 ? 720 : 400;
      let left = (elemBoundingRect.left + elemBoundingRect.right - width) / 2;
      const right = left + width;
      const oversize = Math.max(right - top.visualViewport.width, 0);
      left = Math.max(left - oversize, 0);
      let vOffset =
        elemBoundingRect.top - 148 > 0
          ? elemBoundingRect.top - 148
          : elemBoundingRect.top + 30;
      logseq.setMainUIInlineStyle({
        zIndex: 11,
        top: vOffset + `px`,
        left: left + `px`,
        width: width + `px`,
      });
    } else {
      logseq.hideMainUI();
    }
  }, [data]);

  if (visible && data) {
    return <PreviewCard data={data} />;
  }
  return null;
}

export default App;
