import { fetchPlus } from "src/modules/fetchModule";
import { clearSession } from "src/modules/session";
import {
  confirmResetPassword,
  refreshToken,
} from "src/services/AuthenticationService";

const credentials = {
  access_token: "access",
  refresh_token: "refresh",
  user_id: 42,
};
const response = (body, status = 200) => ({
  ok: status < 400,
  status,
  text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
});
let storage;
beforeEach(() => {
  storage = {};
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => storage[key] ?? null,
      setItem: (key, value) => {
        storage[key] = String(value);
      },
      removeItem: (key) => {
        delete storage[key];
      },
    },
  });
  process.env.REACT_APP_DOMAIN = "https://api.example.test/";
  global.fetch = jest.fn();
});
afterEach(() => {
  jest.restoreAllMocks();
});

test.each([undefined, "", "undefined", "javascript:alert(1)"])(
  "rejects invalid API configuration: %s",
  async (domain) => {
    if (domain === undefined) delete process.env.REACT_APP_DOMAIN;
    else process.env.REACT_APP_DOMAIN = domain;
    expect((await fetchPlus({ Url: "/event/get_hackeps" })).errCode).toBe(-2);
    expect(fetch).not.toHaveBeenCalled();
  },
);

test.each([
  ["<html>Not JSON</html>", 200, -2],
  ["<html>Bad gateway</html>", 502, 502],
  [{ detail: "Denied" }, 403, 403],
])(
  "normalizes error responses without overwriting credentials",
  async (body, status, code) => {
    storage.userToken = "existing";
    fetch.mockResolvedValue(response(body, status));
    const result = await fetchPlus({ Url: "/auth/login", saveLoginInfo: true });
    expect(result.errCode).toBe(code);
    expect(storage).toEqual({ userToken: "existing" });
  },
);

test("normalizes network exceptions", async () => {
  fetch.mockRejectedValue(new TypeError("Failed to fetch"));
  expect(await fetchPlus({ Url: "/auth/contact" })).toEqual({
    errCode: -1,
    errMssg: expect.any(String),
  });
});

test.each([
  {},
  { access_token: "access" },
  { ...credentials, refresh_token: "undefined" },
])("rejects malformed successful login data", async (data) => {
  fetch.mockResolvedValue(response(data));
  expect(
    (await fetchPlus({ Url: "/auth/login", saveLoginInfo: true })).errCode,
  ).toBe(-2);
  expect(storage).toEqual({});
});

test("saves a validated session", async () => {
  fetch.mockResolvedValue(response(credentials));
  await fetchPlus({ Url: "/auth/login", saveLoginInfo: true });
  expect(storage).toEqual({
    userToken: "access",
    refreshToken: "refresh",
    userID: "42",
  });
  expect(fetch.mock.calls[0][0]).toBe("https://api.example.test/v1/auth/login");
});

test("preserves valid boolean API responses", async () => {
  fetch.mockResolvedValue(response(false));
  expect(await fetchPlus({ Url: "/event/1/is_registered/42" })).toBe(false);
});

test("never refreshes an anonymous session", async () => {
  await refreshToken();
  expect(fetch).not.toHaveBeenCalled();
});

test("deduplicates refresh requests and cannot restore a logged-out session", async () => {
  storage.refreshToken = "old-refresh";
  let finish;
  fetch.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const first = refreshToken();
  const second = refreshToken();
  expect(fetch).toHaveBeenCalledTimes(1);
  clearSession();
  finish(response(credentials));
  expect((await first).errCode).toBe(401);
  await second;
  expect(storage).toEqual({});
});

test("clears rejected refresh credentials while preserving unrelated settings", async () => {
  storage.refreshToken = "expired";
  storage.userToken = "expired-access";
  storage.theme = "dark";
  fetch.mockResolvedValue(response({ detail: "Expired" }, 401));
  await refreshToken();
  expect(storage).toEqual({ theme: "dark" });
});

test("sends reset credentials in JSON, never in the URL", async () => {
  fetch.mockResolvedValue(response({ success: true }));
  await confirmResetPassword("secret-reset-token", "ExamplePassword42");
  const [url, args] = fetch.mock.calls[0];
  expect(url).toBe("https://api.example.test/v1/auth/confirm-reset-password");
  expect(JSON.parse(args.body)).toEqual({
    token: "secret-reset-token",
    password: "ExamplePassword42",
  });
});
