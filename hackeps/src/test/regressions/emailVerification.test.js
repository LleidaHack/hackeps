import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginUnverified from "src/components/hackeps/LoginUnverified/LoginUnverified";
import Verify from "src/pages/hackeps/Verify";
import { login, me, resendVerification, verify } from "src/services/AuthenticationService";

const mockNavigate = jest.fn();
jest.mock("src/services/AuthenticationService");
jest.mock("src/components/hackeps/Layout/DarkPage", () => ({ children }) => <div>{children}</div>);
jest.mock("react-router-dom", () => ({ ...jest.requireActual("react-router-dom"), useNavigate: () => mockNavigate }));
const credentials = { email: "test@example.test", password: "OnlyInMemory42" };
beforeEach(() => { jest.clearAllMocks(); jest.useFakeTimers(); localStorage.clear(); });
afterEach(() => { jest.useRealTimers(); });
const mount = () => render(<MemoryRouter><LoginUnverified email={credentials.email} credentials={credentials} /></MemoryRouter>);

test("verification notification signs in only with valid backend credentials", async () => {
  login.mockResolvedValueOnce({ errCode: 401 }).mockResolvedValueOnce({ access_token: "access", refresh_token: "refresh", user_id: 42 });
  mount();
  await act(async () => { window.dispatchEvent(new StorageEvent("storage", { key: "hackeps-email-verified" })); });
  expect(mockNavigate).not.toHaveBeenCalled();
  await act(async () => { jest.advanceTimersByTime(120000); });
  expect(mockNavigate).toHaveBeenCalledWith("/perfil", { replace: true });
  expect(login).toHaveBeenCalledWith(credentials);
  expect(JSON.stringify(localStorage)).not.toContain(credentials.password);
});

test("resending waits for cooldown and reports failures without claiming success", async () => {
  resendVerification.mockResolvedValue({ errCode: 500 });
  mount();
  expect(screen.getByRole("button", { name: /Reenvia/ })).toBeDisabled();
  await act(async () => { jest.advanceTimersByTime(30000); });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: /Reenvia/ })); });
  expect(resendVerification).toHaveBeenCalledWith(credentials.email);
  expect(screen.getByText(/No hem pogut reenviar/)).toBeInTheDocument();
});

test("unmount stops automatic login checks", async () => {
  const { unmount } = mount();
  unmount();
  await act(async () => { jest.advanceTimersByTime(240000); window.dispatchEvent(new StorageEvent("storage", { key: "hackeps-email-verified" })); });
  expect(login).not.toHaveBeenCalled();
});

test("invalid verification links show a recoverable error", async () => {
  verify.mockResolvedValue({ errCode: 400 });
  await act(async () => { render(<MemoryRouter initialEntries={["/validate-email?token=expired-test"]}><Verify /></MemoryRouter>); });
  expect(screen.getByText("No hem pogut verificar el correu")).toBeInTheDocument();
  expect(localStorage.getItem("hackeps-email-verified")).toBeNull();
});

test("successful verification notifies the waiting tab", async () => {
  verify.mockResolvedValue({ success: true, access_token: "verified-access", refresh_token: "verified-refresh", user_id: 42 });
  await act(async () => { render(<MemoryRouter initialEntries={["/validate-email?token=valid-test"]}><Verify /></MemoryRouter>); });
  expect(mockNavigate).toHaveBeenCalledWith("/perfil", { replace: true });
  expect(localStorage.getItem("hackeps-email-verified")).not.toBeNull();
});

test("waiting tab reuses the verified session without rotating its tokens", async () => {
  localStorage.setItem("userToken", "verified-session");
  me.mockResolvedValue({ email: credentials.email });
  mount();
  await act(async () => { window.dispatchEvent(new StorageEvent("storage", { key: "hackeps-email-verified" })); });
  expect(login).not.toHaveBeenCalled();
  expect(mockNavigate).toHaveBeenCalledWith("/perfil", { replace: true });
});

test("verification without session credentials offers manual sign-in", async () => {
  verify.mockResolvedValue({ success: true });
  await act(async () => { render(<MemoryRouter initialEntries={["/validate-email?token=no-session-test"]}><Verify /></MemoryRouter>); });
  expect(mockNavigate).not.toHaveBeenCalled();
  expect(screen.getByRole("link", { name: "Inicia sessió" })).toBeInTheDocument();
});
