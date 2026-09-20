import { clearSession, hasSessionCredentials, isToken } from "./session";

function encodeCredentials(value) {
  return btoa(
    encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    ),
  );
}

const failure = (errCode, errMssg) => ({ errCode, errMssg });

export async function fetchPlus({
  Url,
  Method = "GET",
  Body,
  Query,
  hasUserauth = false,
  saveLoginInfo = false,
  refresh_token = false,
  loginAuth,
  apiVersion = 1,
  token,
  forceDebug = false,
}) {
  const domain = (process.env.REACT_APP_DOMAIN || "")
    .trim()
    .replace(/\/+$/, "");
  try {
    const parsed = new URL(domain);
    if (
      !["https:", "http:"].includes(parsed.protocol) ||
      parsed.username ||
      parsed.password ||
      parsed.search ||
      parsed.hash
    ) {
      return failure(-2, "Invalid API configuration");
    }
  } catch {
    return failure(-2, "Missing or invalid API configuration");
  }

  const sessionToken = hasUserauth
    ? localStorage.getItem("userToken")
    : refresh_token
      ? localStorage.getItem("refreshToken")
      : token;
  if (
    !loginAuth &&
    (hasUserauth || refresh_token || token != null) &&
    !isToken(sessionToken)
  ) {
    return failure(401, "Authentication required");
  }
  const headers = { "Content-Type": "application/json" };
  if (loginAuth)
    headers.Authorization =
      "Basic " + encodeCredentials(`${loginAuth.email}:${loginAuth.password}`);
  else if (sessionToken) headers.Authorization = "Bearer " + sessionToken;
  const query = Query ? "?" + new URLSearchParams(Query).toString() : "";
  const args = { method: Method, headers };
  if (Body !== undefined) args.body = JSON.stringify(Body);

  try {
    const response = await fetch(
      `${domain}/v${apiVersion}${Url}${query}`,
      args,
    );
    if (process.env.REACT_APP_DEBUG === "true" || forceDebug) {
      console.log("API response:", Method, Url, response.status);
    }
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        return failure(
          response.ok ? -2 : response.status,
          "Invalid API response",
        );
      }
    }
    if (!response.ok) {
      if (
        refresh_token &&
        [401, 403].includes(response.status) &&
        localStorage.getItem("refreshToken") === sessionToken
      )
        clearSession();
      return failure(
        response.status,
        typeof data?.message === "string"
          ? data.message
          : typeof data?.detail === "string"
            ? data.detail
            : "Request failed",
      );
    }
    if (saveLoginInfo) {
      if (!hasSessionCredentials(data))
        return failure(-2, "Invalid authentication response");
      // A response from an old session must not restore a logged-out session.
      if (
        refresh_token &&
        localStorage.getItem("refreshToken") !== sessionToken
      )
        return failure(401, "Session changed");
      localStorage.setItem("userToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      localStorage.setItem("userID", String(data.user_id));
    }
    return data;
  } catch {
    return failure(-1, "Network error or request failed");
  }
}
