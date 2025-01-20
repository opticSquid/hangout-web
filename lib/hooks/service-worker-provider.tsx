"use client";
import { createContext, ReactNode, useContext, useRef } from "react";
import {
  createServiceWorkerStore,
  ServiceWorkerStore,
} from "../stores/service-worker-store";
import { useStore } from "zustand";

type serviceWorkerStoreApi = ReturnType<typeof createServiceWorkerStore>;
const serviceWorkerContext = createContext<serviceWorkerStoreApi | undefined>(
  undefined
);
interface serviceWorkerStoreProviderProps {
  children: ReactNode;
}
export const ServiceWorkerStoreProvider = ({
  children,
}: serviceWorkerStoreProviderProps) => {
  const storeRef = useRef<serviceWorkerStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createServiceWorkerStore();
  }
  return (
    <serviceWorkerContext.Provider value={storeRef.current}>
      {children}
    </serviceWorkerContext.Provider>
  );
};
export const useServiceWorkerStore = <T,>(
  selector: (store: ServiceWorkerStore) => T
): T => {
  const serviceWorkerStoreContext = useContext(serviceWorkerContext);
  if (!serviceWorkerStoreContext) {
    throw new Error(
      "useServiceWorkerStore must be used within ServiceWorkerStoreProvider"
    );
  } else {
    return useStore(serviceWorkerStoreContext, selector);
  }
};
