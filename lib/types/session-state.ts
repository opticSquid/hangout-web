export type SessionState = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  userId: number | undefined;
  isTrustedSession: boolean | undefined;
};
