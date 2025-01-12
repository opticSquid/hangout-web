export type SessionAcions = {
  setAccessToken: (newToken: string | undefined) => void;
  setRefreshToken: (newToken: string | undefined) => void;
  setTrustedSession: (isTrusted: boolean | undefined) => void;
  checkIfAuthenticated: () => boolean;
  reset: () => void;
  setHydrated: () => void;
};
