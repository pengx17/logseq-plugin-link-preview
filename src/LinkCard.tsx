import * as React from "react";
import "./style.css";
import { LinkPreviewMetadata } from "./use-link-preview-metadata";

// Credits: adopted from innos.io
export const LinkCard = ({ data }: { data: LinkPreviewMetadata }) => {
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
