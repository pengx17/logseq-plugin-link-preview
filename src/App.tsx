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

const example = {
  url: "https://discord.com/channels/@me",
  title: "Discord - A New Way to Chat with Friends & Communities",
  siteName: "Discord",
  description:
    "Discord is the easiest way to communicate over voice, video, and text.  Chat, hang out, and stay close with your friends and communities.",
  mediaType: "website",
  contentType: "text/html",
  images: ["https://discord.com/assets/ee7c382d9257652a88c8f7b7f22a994d.png"],
  videos: [],
  favicons: ["https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico"],
};

// Credits: taken directly from innos.io
const PreviewCard = ({ data }: { data: typeof example }) => {
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
              <img src={data.favicons[0]} width={16} height={16} alt="favico" />
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

const useLinkPreview = (anchor: HTMLAnchorElement | null): typeof example => {
  const { data } = useSWR(anchor?.href ?? null, fetcher);

  return React.useMemo(() => {
    if (data && data.contentType === "text/html") {
      return data;
    } else if (anchor) {
      return {
        url: anchor.href,
        title: anchor.textContent,
        description: data ? data.description : "loading ...",
        ...(data ?? {}),
      };
    }
    return null;
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
      logseq.setMainUIInlineStyle({
        zIndex: 11,
        top: `${elemBoundingRect.top - 120}px`,
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
