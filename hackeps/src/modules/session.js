export const isToken = (value) =>
  typeof value === "string" &&
  value.trim() !== "" &&
  value !== "undefined" &&
  value !== "null";

export const hasSessionCredentials = (data) =>
  isToken(data?.access_token) &&
  isToken(data?.refresh_token) &&
  data?.user_id != null &&
  isToken(String(data.user_id));

export function clearSession() {
  Object.keys(sessionStorage)
    .filter((key) => key.startsWith("scanner-pending:"))
    .forEach((key) => sessionStorage.removeItem(key));
  ["userToken", "refreshToken", "userID", "registeredOnEvent"].forEach((key) =>
    localStorage.removeItem(key),
  );
}
