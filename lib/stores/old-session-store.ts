import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { SessionActions } from "../types/session-actions-interface";
import { SessionState } from "../types/session-store-interface";

export type SessionStore = SessionState & SessionActions;

const unAuthenticatedSession: SessionState = {
  accessToken: undefined,
  refreshToken: undefined,
  userId: undefined,
  isTrustedSesion: undefined,
};

/**
 * This is the persistent implementation of the Session Store
 * @param initState
 * @returns Store of the State
 */
export const createPersistentSessionStore = (
  initState: SessionState = unAuthenticatedSession
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
          set({ isTrustedSesion: isTrusted });
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

// the store itself does not need any change
export const useNewSessionStore = create(
  persist<SessionStore>(
    (set, get) => ({
      ...unAuthenticatedSession,
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
        set({ isTrustedSesion: isTrusted });
      },
      isAuthenticated: () => {
        return get().accessToken != undefined;
      },
      clearAccessToken: () => {
        set({ accessToken: undefined });
      },
      reset: () => {
        set(unAuthenticatedSession);
      },
    }),
    {
      name: "new-session",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
