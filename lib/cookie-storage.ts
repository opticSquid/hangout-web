import { jwtDecode } from "jwt-decode";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";
import { StateStorage } from "zustand/middleware";
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
const key = "hangout-session|";
const CookiesStorage: StateStorage = {
  getItem: (name: string) => {
    return getCookie(key + name) ?? null;
  },
  setItem: (name: string, value: string) => {
    // sets the name of the cookie as <store-name>|<data-name>
    name = key + name;
    /**
     * this loops detects any object key which has 'Token' in its name
     * Treats it as a JWT, tries to extract the expiry time and sets it as the cookie's expiry time
     * And if the key does not contain 'Token' as substring it just saves the data to cookie normally
     */
    if (name.includes("Token") && value != undefined) {
      setCookie(name, value, {
        expires: extractExpiryFromToken(value),
        sameSite: "strict",
      });
    } else {
      setCookie(name, value, { sameSite: "strict" });
    }
  },
  removeItem: (name: string) => {
    removeCookie(key + name);
  },
};

export default CookiesStorage;
