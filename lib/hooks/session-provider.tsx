"use client";
import { useState, useEffect, useCallback } from "react";
import { getCookie, setCookie, removeCookie } from "typescript-cookie";
import { SessionState } from "../types/session-store-interface";
import { SessionActions } from "../types/session-actions-interface";
import { TokenBody } from "../types/token-body";
import { jwtDecode } from "jwt-decode";
import { CookieAttributes } from "../types/cookie-attributes";

// Cookie options configuration
const COOKIE_PREFIX = "hangout|";
const DEFAULT_COOKIE_OPTIONS: CookieAttributes = {
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};

export default function useSessionProvider(): [SessionState, SessionActions] {
  const [sessionState, setSessionState] = useState<SessionState>({
    accessToken: undefined,
    refreshToken: undefined,
    userId: undefined,
    isTrustedSesion: undefined,
  });

  // Load initial cookie values
  useEffect(() => {
    const accessToken = getCookie(`${COOKIE_PREFIX}accessToken`);
    const refreshToken = getCookie(`${COOKIE_PREFIX}refreshToken`);
    const userIdStr = getCookie(`${COOKIE_PREFIX}userId`);
    const isTrustedStr = getCookie(`${COOKIE_PREFIX}isTrustedSesion`);

    setSessionState({
      accessToken: accessToken || undefined,
      refreshToken: refreshToken || undefined,
      userId: userIdStr ? parseInt(userIdStr, 10) : undefined,
      isTrustedSesion: isTrustedStr ? isTrustedStr === "true" : undefined,
    });
  }, []);

  // Utility function to update both state and cookie
  const updateCookie = useCallback(
    <T extends keyof SessionState>(key: T, value: SessionState[T]) => {
      // Update React state
      setSessionState((prev) => ({ ...prev, [key]: value }));

      // Handle cookie removal
      if (value === undefined) {
        removeCookie(`${COOKIE_PREFIX}${key}`);
        return;
      }

      // Prepare cookie options
      const cookieOptions = { ...DEFAULT_COOKIE_OPTIONS };

      // Extract expiry for token values
      if (
        typeof value === "string" &&
        key.toString().toLowerCase().includes("token")
      ) {
        const tokenExpiry = ExtractExpiryFromToken(value);
        if (tokenExpiry) {
          cookieOptions.expires = tokenExpiry;
        }
      }

      // Set cookie with the appropriate options
      setCookie(`${COOKIE_PREFIX}${key}`, String(value), cookieOptions);
    },
    []
  );

  // Session actions
  const sessionActions: SessionActions = {
    setAccessToken: useCallback(
      (newToken: string | undefined) => {
        updateCookie("accessToken", newToken);
      },
      [updateCookie]
    ),

    setRefreshToken: useCallback(
      (newToken: string | undefined) => {
        updateCookie("refreshToken", newToken);
      },
      [updateCookie]
    ),

    setUserId: useCallback(
      (newUserId: number | undefined) => {
        updateCookie("userId", newUserId);
      },
      [updateCookie]
    ),

    setTrustedSession: useCallback(
      (isTrusted: boolean | undefined) => {
        updateCookie("isTrustedSesion", isTrusted);
      },
      [updateCookie]
    ),

    isAuthenticated: useCallback((): boolean => {
      return Boolean(sessionState.accessToken);
    }, [sessionState.accessToken]),

    clearAccessToken: useCallback(() => {
      updateCookie("accessToken", undefined);
    }, [updateCookie]),

    reset: useCallback(() => {
      // Remove all session cookies
      removeCookie(`${COOKIE_PREFIX}accessToken`);
      removeCookie(`${COOKIE_PREFIX}refreshToken`);
      removeCookie(`${COOKIE_PREFIX}userId`);
      removeCookie(`${COOKIE_PREFIX}isTrustedSesion`);

      // Reset state
      setSessionState({
        accessToken: undefined,
        refreshToken: undefined,
        userId: undefined,
        isTrustedSesion: undefined,
      });
    }, []),
  };

  return [sessionState, sessionActions];
}

export const ExtractExpiryFromToken = (newToken: string): Date => {
  const decodedToken: TokenBody = jwtDecode<TokenBody>(newToken);
  // ** required to multiply by 1000 to convert from Unix time to Js Date format
  return new Date(decodedToken.exp * 1000);
};
