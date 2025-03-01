import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { SessionAcions } from "../types/session-actions-interface";
import { SessionState } from "../types/session-store-interface";
export type SessionStore = SessionState & SessionAcions;
const UnAuthenticatedSession: SessionState = {
  accessToken: undefined,
  refreshToken: undefined,
  userId: undefined,
  trustedSesion: undefined,
};

/**
 * This is the persistent implementation of the Session Store
 * @param initState
 * @returns Store of the State
 */
export const createPersistentSessionStore = (
  initState: SessionState = UnAuthenticatedSession
) =>
  create<SessionStore>()(
    persist(
      immer((set, get) => ({
        ...initState,
        setAccessToken: (newToken: string | undefined) => {
          set({ accessToken: newToken });
        },
        setRefreshToken: (newToken: string | undefined) => {
          set({ refreshToken: newToken });
        },
        setUserId: (newUserId: number | undefined) => {
          set({ userId: newUserId });
        },
        setTrustedSession: (isTrusted: boolean | undefined) => {
          set({ trustedSesion: isTrusted });
        },
        isAuthenticated: () => {
          return get().accessToken != undefined;
        },
        clearAccessToken: () => {
          set({ accessToken: undefined });
        },
        reset: () => {
          set(initState);
        },
      })),
      {
        name: "hangout-session",
        onRehydrateStorage(state) {
          console.log("current state before rehydration: ", state);
          return (state, error) => {
            error
              ? console.error("Error during state rehydration: ", error)
              : console.log("rehydrated state: ", state);
          };
        },
        merge: (persistedState: unknown, currentState) => {
          const prevState = persistedState as SessionState;
          console.log("Persisted State: ", persistedState);
          console.log("Current State: ", currentState);
          const mergedState: SessionStore = { ...currentState, ...prevState };
          console.log("merged state: ", mergedState);
          return mergedState;
        },
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
