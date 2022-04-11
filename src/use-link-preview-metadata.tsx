import * as React from "react";
import useSWRImmutable from "swr/immutable";

import { getLinkPreview } from "link-preview-js";

export const fetcher = async (url: string) => {
  const data = await getLinkPreview(Array.isArray(url) ? url[0] : url, {
    timeout: 3000,
    // TODO: this is not doable in the browser context
    // headers: {
    //   "user-agent": "googlebot",
    // },
  });

  return data;
};

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

export type LinkPreviewMetadata = Pick<
  Metadata,
  "anchorText" | "contentType" | "error" | "favicons" | "mediaType" | "url"
> & {
  title: string;
  description: React.ReactNode;
  images?: string[];
};

export function toLinkPreviewMetadata(
  url?: string | null,
  altText?: string | null,
  data?: any,
  error?: any
) {
  return adaptMeta({
    contentType: "placeholder",
    url: url,
    anchorText: altText !== url ? altText : "",
    error,
    ...(data ?? {}),
  });
}

export async function fetchLinkPreviewMetadata(
  url: string,
  altText?: string | null
) {
  let data: any;
  let error: any;
  try {
    data = await fetcher(url);
  } catch (err) {
    error = err;
  }
  return toLinkPreviewMetadata(url, altText, data, error);
}

export const useLinkPreviewMetadata = (
  url?: string | null,
  altText?: string | null
): LinkPreviewMetadata | null => {
  const { data, error } = useSWRImmutable(url || null, fetcher);
  return React.useMemo(() => {
    return url ? toLinkPreviewMetadata(url, altText, data, error) : null;
  }, [url, altText, data, error]);
};
