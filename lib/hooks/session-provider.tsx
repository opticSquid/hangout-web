"use client";

import {
  createPersistentSessionStore,
  SessionStore,
} from "@/lib/stores/session-store";
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand/react";

type SessionStoreApi = ReturnType<typeof createPersistentSessionStore>;
const SessionStoreContext = createContext<SessionStoreApi | undefined>(
  undefined
);

interface SessionStoreProviderProps {
  children: ReactNode;
}
export const SessionStoreProvider = ({
  children,
}: SessionStoreProviderProps) => {
  const storeRef = useRef<SessionStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createPersistentSessionStore();
  }
  return (
    <SessionStoreContext.Provider value={storeRef.current}>
      {children}
    </SessionStoreContext.Provider>
  );
};

export const useSessionStore = <T,>(
  selector: (store: SessionStore) => T
): T => {
  const sessionStoreContext = useContext(SessionStoreContext);
  if (!sessionStoreContext) {
    throw new Error("useSessionStore must be used within SessionStoreProvider");
  } else {
    return useStore(sessionStoreContext, selector);
  }
};
