export type SessionAcions = {
  setAccessToken: (newToken: string) => void;
  setRefreshToken: (newToken: string) => void;
  setTrustedSession: (isTrusted: boolean) => void;
  checkIfAuthenticated: () => boolean;
  reset: () => void;
  setHydrated: () => void;
};
