import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import cookieStorage from "../cookie-storage";
import { SessionAcions } from "../types/session-actions-interface";
import { SessionState } from "../types/session-store-interface";
export type SessionStore = SessionState & SessionAcions;
const UnAuthenticatedSession: SessionState = {
  accessToken: undefined,
  refreshToken: undefined,
  trustedSesion: undefined,
  hydrated: false,
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
        setTrustedSession: (isTrusted: boolean | undefined) => {
          set({ trustedSesion: isTrusted });
        },
        checkIfAuthenticated: () => {
          return get().accessToken != undefined;
        },
        reset: () => {
          set(initState);
        },
        setHydrated: () => {
          set({ hydrated: !get().hydrated });
        },
      })),
      {
        name: "hangout-session",
        onRehydrateStorage() {
          return (state, error) => {
            if (!error) state?.setHydrated();
          };
        },

        storage: createJSONStorage(() => cookieStorage),
      }
    )
  );
