import { StateStorage } from "zustand/middleware";
import { getCookie, setCookie, removeCookie } from "typescript-cookie";
import { jwtDecode } from "jwt-decode";
import { StorageObjectModel } from "./types/storage-object-model-interface";
import { SessionState } from "./types/session-store-interface";
type TokenBody = {
  deviceId: string;
  sub: string;
  iat: number;
  exp: number;
};
const extractExpiryFromToken = (newToken: string): Date => {
  const decodedToken: TokenBody = jwtDecode<TokenBody>(newToken);
  // ** required to multiply by 1000 to convert from Unix time to Js Date format
  return new Date(decodedToken.exp * 1000);
};
const cookiesStorage: StateStorage = {
  getItem: (name: string) => {
    return getCookie("hangout-session|" + name) ?? null;
  },
  setItem: (name: string, value: string) => {
    const body: StorageObjectModel = JSON.parse(value);
    // sets the name of the cookie as <store-name>|<data-name>
    name += "|";
    /**
     * this loops detects any object key which has 'Token' in its name
     * Treats it as a JWT, tries to extract the expiry time and sets it as the cookie's expiry time
     * And if the key does not contain 'Token' as substring it just saves the data to cookie normally
     */
    for (const k in body.state) {
      const v = body.state[k as keyof SessionState];
      if (k.includes("Token") && v != undefined) {
        setCookie(name + k, v, {
          expires: extractExpiryFromToken(v as string),
          sameSite: "strict",
        });
      } else {
        setCookie(name + k, v, { sameSite: "strict" });
      }
    }
    setCookie(name + "version", body.version, { sameSite: "strict" });
  },
  removeItem: (name: string) => {
    removeCookie("hangout-session|" + name);
  },
};

export default cookiesStorage;
