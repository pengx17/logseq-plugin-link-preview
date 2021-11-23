import * as React from "react";
import "./style.css";
import { LinkPreviewMetadata } from "./use-link-preview-metadata";
import { getCardSize } from "./utils";

// Credits: adopted from innos.io
export const LinkCard = ({ data, ...rest }: { data: LinkPreviewMetadata }) => {
  const [width, height] = getCardSize(data);
  return (
    <a style={{ width, height }} className="link_preview__root" {...rest}>
      <div className="link_preview__card-container">
        <div className="link_preview__text-container">
          {data.title && (
            <div className="link_preview__text-container-title">
              {data.title}
            </div>
          )}
          <div className="link_preview__text-container-description">
            {data.description}
          </div>
          <div className="link_preview__text-container-url-container">
            {data.favicons?.length > 0 && (
              <img src={data.favicons[0]} width={16} height={16} />
            )}
            <span className="text-container-url">{data.url}</span>
          </div>
        </div>
        {data.images?.[0] && (
          <div className="link_preview__cover-container">
            <img
              className="link_preview__cover-image"
              src={data.images[0]}
              alt="cover"
            />
          </div>
        )}
      </div>
    </a>
  );
};
