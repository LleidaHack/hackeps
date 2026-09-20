import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import Profile from "src/components/hackeps/Profile/Profile";
import { loadProfile } from "src/modules/loadProfile";

jest.mock("src/modules/loadProfile", () => ({ loadProfile: jest.fn() }));
jest.mock("src/components/hackeps/Profile/EditProfile", () => () => <div>Profile editor</div>);
jest.mock("src/components/hackeps/LinkAccounts/LinkAccounts", () => () => <div>Social accounts</div>);
jest.mock("src/components/hackeps/ProfilePic/ProfilePic", () => () => null);
jest.mock("src/components/hackeps/Team/Team", () => () => <div>Team management</div>);
jest.mock("src/components/hackeps/Join/Join", () => () => <div>Event registration</div>);
jest.mock("qrcode.react", () => ({ QRCodeCanvas: ({ value }) => <canvas data-testid="qr" data-value={value} /> }));

const profile = (event, ticket = null) => ({
  user: { id: "1", name: "Test Hacker" }, isHacker: true, team: null, qrCode: "TICKETCODE", event, ticket,
});

beforeEach(() => {
  useLocation.mockImplementation(jest.requireActual("react-router-dom").useLocation);
  jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => key === "userID" ? "1" : null);
});

test("hides the ticket until the hacker is accepted and confirmed", async () => {
  loadProfile.mockResolvedValue(profile({ registered: true, accepted: true, confirmed: false }));
  render(<MemoryRouter initialEntries={["/perfil"]}><Profile /></MemoryRouter>);
  await screen.findByText("Test Hacker");
  expect(screen.queryByRole("button", { name: /tiquet/i })).not.toBeInTheDocument();
});

test("shows the ticket QR with the check-in state", async () => {
  loadProfile.mockResolvedValue(profile(
    { registered: true, accepted: true, confirmed: true },
    { code: "TICKETCODE", eventName: "HackEPS 2026", checkedIn: true, voucherCode: "VABCDEFGH" },
  ));
  render(<MemoryRouter initialEntries={["/perfil"]}><Profile /></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button", { name: /Check-in fet/ }));
  expect(await screen.findByText("HackEPS 2026")).toBeInTheDocument();
  expect(screen.getByTestId("qr")).toHaveAttribute("data-value", "TICKETCODE");
  expect(screen.getByText("Acreditació VABCDEFGH")).toBeInTheDocument();
});
