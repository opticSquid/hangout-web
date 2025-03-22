export interface CookieAttributes {
  path?: string;
  domain?: string;
  expires?: number | Date;
  sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None";
  secure?: boolean;
}
