import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import cookieStorage from "../cookie-storage";
import { SessionAcions } from "../types/session-actions-interface";
import { SessionState } from "../types/session-store-interface";
export type SessionStore = SessionState & SessionAcions;
const UnAuthenticatedSession: SessionState = {
  accessToken:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJkZXZpY2VJZCI6IjYyNWJmYjkyLWQ3YTYtNDFmNS1iYWJhLWQ5MTU5MDU1N2QwMCIsInN1YiI6ImtpbmctYmFieSIsImlhdCI6MTczNTcyNzU4NiwiZXhwIjoxNzM1NzI3ODg2fQ.PKBIc-XNwwaH5KWHIk1OqUrV0_OwVwpTQPL-x4WeqE_BXicBTOavZjGmm0j6qDyhhqm0eywAuByQVQ_LY-7S2Q",
  refreshToken:
    "eyJ0eXAiOiJBQ1NfSldUIiwiYWxnIjoiSFM1MTIifQ.eyJzdWIiOiJraW5nLWJhYnkiLCJkZXZpY2VJZCI6IjYyNWJmYjkyLWQ3YTYtNDFmNS1iYWJhLWQ5MTU5MDU1N2QwMCIsImlhdCI6MTczNTcyNzU4NywiZXhwIjoxNzM2MzMyMzg3fQ.29GkLVYcIY__vq1kMv1wUqOzuJRE2Y8GAc47aG1IZJZTRkTZ11hD4aYzsns-nAY5RIJ4ECryX4JbISUMmgGg_g",
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
        setAccessToken: (newToken: string) => {
          set({ accessToken: newToken });
        },
        setRefreshToken: (newToken: string) => {
          set({ refreshToken: newToken });
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
