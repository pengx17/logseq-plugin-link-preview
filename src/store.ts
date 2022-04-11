import { proxy, subscribe, useSnapshot } from "valtio";

type AppState =
  | {
      type: "hovering";
    }
  | {
      type: "prompt";
      message: string;
      input?: string;
    };

export const appStateStore = proxy<{ value: AppState }>({
  value: { type: "hovering" },
});

export const useAppStateStore = () => {
  return useSnapshot(appStateStore);
};

export const waitForPrompt = async (message: string) => {
  return new Promise<string>((res) => {
    appStateStore.value = { type: "prompt", message: message };
    const unsub = subscribe(appStateStore, () => {
      if (appStateStore.value.type === "prompt" && appStateStore.value.input) {
        unsub();
        const url = appStateStore.value.input;
        appStateStore.value = { type: "hovering" };
        res(url);
      }
    });
  });
};
