export type SessionState = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  trustedSesion: boolean | undefined;
  hydrated: boolean;
};
