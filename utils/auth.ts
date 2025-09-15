import Cookies from "js-cookie";
const TokenKey: string = "gw_token";
const isLoggedIn: string = "isAuthorized";

export function getToken(): string | undefined {
  return Cookies.get(TokenKey);
}
export function setToken(token: string): string | undefined {
  Cookies.set(isLoggedIn, "true", { domain: "thebookbrief.com" });
  return Cookies.set(TokenKey, token);
}
export function clearAllCookie() {
  Cookies.set(isLoggedIn, "false", { domain: "thebookbrief.com" });
  Cookies.remove(TokenKey);
}
