import * as React from "react";
import { useAppStateStore, appStateStore } from "./store";

const PromptImpl = ({ message }: { message: string }) => {
  React.useEffect(() => {
    logseq.showMainUI({ autoFocus: true });

    return () => {
      logseq.hideMainUI({ restoreEditingCursor: true });
    };
  }, []);
  return (
    <dialog open>
      <form method="dialog">
        <p>{message}</p>
        <button>OK</button>
      </form>
    </dialog>
  );
};

export const Prompt = ({}: {}) => {
  const state = useAppStateStore();
  if (state.type === "prompt") {
    return <PromptImpl message={state.message} />;
  }
  return null;
};
