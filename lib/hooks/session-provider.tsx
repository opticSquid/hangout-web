"use client";

import { useNewSessionStore } from "@/lib/stores/session-store";
import { createContext, ReactNode, useRef } from "react";

type SessionStoreApi = ReturnType<typeof useNewSessionStore>;
const SessionStoreContext = createContext<SessionStoreApi | undefined>(
  undefined
);

interface SessionStoreProviderProps {
  children: ReactNode;
}
export const SessionStoreProvider = ({
  children,
}: SessionStoreProviderProps) => {
  const storeRef = useRef<SessionStoreApi>(useNewSessionStore());
  // if (!storeRef.current) {
  //   storeRef.current = useNewSessionStore();
  // }
  return (
    <SessionStoreContext.Provider value={storeRef.current}>
      {children}
    </SessionStoreContext.Provider>
  );
};

// export const useSessionStore = <T,>(
//   selector: (store: SessionStore) => T
// ): T => {
//   const sessionStoreContext = useContext(SessionStoreContext);
//   if (!sessionStoreContext) {
//     throw new Error("useSessionStore must be used within SessionStoreProvider");
//   } else {
//     return useStore(useNewSessionStore, selector);
//   }
// };
