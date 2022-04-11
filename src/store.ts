import { useSyncExternalStore } from "react";

// A super naive implementation of an external store
class ExternalStore<T> {
  listeners: Set<() => void>;
  constructor(private _value: T) {
    this.listeners = new Set();
  }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  get value() {
    return this._value;
  }

  set value(v: T) {
    if (this._value !== v) {
      this._value = v;
      this.listeners.forEach((l) => l());
    }
  }

  snapshot = () => {
    return this.value;
  };
}

type AppState =
  | {
      type: "hovering";
    }
  | {
      type: "prompt";
      message: string;
      input: string;
    };

export const appStateStore = new ExternalStore<AppState>({ type: "hovering" });

export const useAppStateStore = () => {
  return useSyncExternalStore(appStateStore.subscribe, appStateStore.snapshot);
};
