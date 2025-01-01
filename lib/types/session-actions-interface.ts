export type SessionAcions = {
  setAccessToken: (newToken: string) => void;
  setRefreshToken: (newToken: string) => void;
  checkIfAuthenticated: () => boolean;
  reset: () => void;
  setHydrated: () => void;
};
