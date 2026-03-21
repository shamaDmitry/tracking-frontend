import { createContext, useContext } from "react";
import { MapStore } from "./MapStore";
import { AuthStore } from "./AuthStore";

export class RootStore {
  mapStore: MapStore;
  authStore: AuthStore;

  constructor() {
    this.mapStore = new MapStore();
    this.authStore = new AuthStore();
  }
}

export const StoreContext = createContext<RootStore | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within a StoreContext.Provider");
  }

  return context;
};
