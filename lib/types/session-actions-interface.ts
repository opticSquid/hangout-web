export type SessionActions = {
  setAccessToken: (newToken: string | undefined) => void;
  setRefreshToken: (newToken: string | undefined) => void;
  setUserId: (newUserId: number | undefined) => void;
  setTrustedSession: (isTrusted: boolean | undefined) => void;
  isAuthenticated: () => boolean;
  clearAccessToken: () => void;
  reset: () => void;
};
