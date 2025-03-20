export type SessionState = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  userId: number | undefined;
  isTrustedSesion: boolean | undefined;
};
