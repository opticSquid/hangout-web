"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { getCookie, setCookie, removeCookie } from "typescript-cookie";
import { SessionState } from "../types/session-state";
import { SessionActions } from "../types/session-actions-interface";
import { TokenBody } from "../types/token-body";
import { jwtDecode } from "jwt-decode";
import { CookieAttributes } from "../types/cookie-attributes";

const COOKIE_PREFIX = "hangout|";
const DEFAULT_COOKIE_OPTIONS: CookieAttributes = {
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  expires: 60,
};

interface SessionContextProps {
  sessionState: SessionState;
  sessionActions: SessionActions;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionState, setSessionState] = useState<SessionState>({
    accessToken: undefined,
    refreshToken: undefined,
    userId: undefined,
    isTrustedSession: undefined,
  });

  useEffect(() => {
    const accessToken = getCookie(`${COOKIE_PREFIX}accessToken`);
    const refreshToken = getCookie(`${COOKIE_PREFIX}refreshToken`);
    const userIdStr = getCookie(`${COOKIE_PREFIX}userId`);
    const isTrustedStr = getCookie(`${COOKIE_PREFIX}isTrustedSession`);

    setSessionState({
      accessToken: accessToken || undefined,
      refreshToken: refreshToken || undefined,
      userId: userIdStr ? parseInt(userIdStr, 10) : undefined,
      isTrustedSession: isTrustedStr ? isTrustedStr === "true" : undefined,
    });
  }, []);

  const updateCookie = useCallback(
    <T extends keyof SessionState>(key: T, value: SessionState[T]) => {
      setSessionState((prev) => ({ ...prev, [key]: value }));
      if (value === undefined) {
        removeCookie(`${COOKIE_PREFIX}${key}`);
        return;
      }

      const cookieOptions = { ...DEFAULT_COOKIE_OPTIONS };
      if (
        typeof value === "string" &&
        key.toString().toLowerCase().includes("token")
      ) {
        const tokenExpiry = ExtractExpiryFromToken(value);
        if (tokenExpiry) {
          cookieOptions.expires = tokenExpiry;
        }
      }
      setCookie(`${COOKIE_PREFIX}${key}`, String(value), cookieOptions);
    },
    []
  );

  const sessionActions: SessionActions = {
    setAccessToken: useCallback(
      (newToken) => {
        console.log("calling set access token", newToken);
        updateCookie("accessToken", newToken);
      },
      [updateCookie]
    ),

    setRefreshToken: useCallback(
      (newToken) => {
        updateCookie("refreshToken", newToken);
      },
      [updateCookie]
    ),

    setUserId: useCallback(
      (newUserId) => {
        updateCookie("userId", newUserId);
      },
      [updateCookie]
    ),

    setTrustedSession: useCallback(
      (isTrusted) => {
        updateCookie("isTrustedSession", isTrusted);
      },
      [updateCookie]
    ),

    isAuthenticated: useCallback(() => {
      return Boolean(sessionState.accessToken);
    }, [sessionState.accessToken]),

    clearAccessToken: useCallback(() => {
      updateCookie("accessToken", undefined);
    }, [updateCookie]),

    reset: useCallback(() => {
      removeCookie(`${COOKIE_PREFIX}accessToken`);
      removeCookie(`${COOKIE_PREFIX}refreshToken`);
      removeCookie(`${COOKIE_PREFIX}userId`);
      removeCookie(`${COOKIE_PREFIX}isTrustedSession`);
      setSessionState({
        accessToken: undefined,
        refreshToken: undefined,
        userId: undefined,
        isTrustedSession: undefined,
      });
    }, []),
  };

  return (
    <SessionContext.Provider value={{ sessionState, sessionActions }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext(): [SessionState, SessionActions] {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return [context.sessionState, context.sessionActions];
}

export const ExtractExpiryFromToken = (newToken: string): Date => {
  const decodedToken: TokenBody = jwtDecode<TokenBody>(newToken);
  return new Date(decodedToken.exp * 1000);
};
