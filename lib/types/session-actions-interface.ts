export type SessionAcions = {
  setAccessToken: (newToken: string | undefined) => void;
  setRefreshToken: (newToken: string | undefined) => void;
  setUserId: (newUserId: number | undefined) => void;
  setTrustedSession: (isTrusted: boolean | undefined) => void;
  isAuthenticated: () => boolean;
  reset: () => void;
};
