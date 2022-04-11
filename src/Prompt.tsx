import * as React from "react";
import { useAppStateStore, appStateStore } from "./store";

const PromptImpl = ({ message }: { message: string }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    logseq.showMainUI({ autoFocus: true });
    setTimeout(() => {
      inputRef.current?.focus();
      logseq.Editor.getEditingCursorPosition().then((pos) => {
        if (dialogRef.current && pos) {
          dialogRef.current.style.left = `${pos.rect.left + pos.left}px`;
          dialogRef.current.style.top = `${pos.rect.top + pos.top}px`;
          dialogRef.current.style.opacity = "1";
        }
      });
    });
    return () => {
      logseq.hideMainUI({ restoreEditingCursor: true });
    };
  }, []);
  const onSubmit = () => {
    if (appStateStore.value.type === "prompt") {
      if (inputRef.current?.value) {
        appStateStore.value.input = inputRef.current?.value;
      } else {
        appStateStore.value = { type: "hovering" };
      }
    }
  };
  return (
    <div className="link_preview__prompt-backdrop" onClick={() => onSubmit()}>
      <div ref={dialogRef} className="link_preview__prompt">
        <form onSubmit={onSubmit}>
          <input
            className="link_preview__prompt-input"
            ref={inputRef}
            title={message}
            placeholder={message}
            style={{ width: "320px" }}
          />
        </form>
      </div>
    </div>
  );
};

export const Prompt = () => {
  const state = useAppStateStore();
  if (state.value.type === "prompt") {
    return <PromptImpl message={state.value.message} />;
  }
  return null;
};
