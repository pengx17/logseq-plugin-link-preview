import { logseq as PL, version } from "../package.json";
import { debounce } from "./utils";

export function localStorageProvider() {
  const cacheId = `${PL.id}-${version}`;

  class CacheMap extends Map<string, any> {
    persist = debounce(() => {
      localStorage.setItem(cacheId, JSON.stringify(Array.from(this.entries())));
    }, 1000);
    set = (key: string, value: any) => {
      this.persist();
      return super.set(key, value);
    };
  }
  // When initializing, we restore the data from `localStorage` into a map.
  return new CacheMap(JSON.parse(localStorage.getItem(cacheId) ?? "[]"));
}