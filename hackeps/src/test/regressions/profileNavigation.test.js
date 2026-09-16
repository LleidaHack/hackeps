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

test("separates personal sections without reloading shared profile data", async () => {
  useLocation.mockImplementation(jest.requireActual("react-router-dom").useLocation);
  jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => key === "userID" ? "1" : null);
  loadProfile.mockResolvedValue({user: {id: "1", name: "Test Hacker"}, isHacker: true, team: null, event: {registered: true}, qrCode: null});
  render(<MemoryRouter initialEntries={["/perfil"]}><Profile /></MemoryRouter>);
  await screen.findByText("Test Hacker");
  expect(screen.queryByText("Profile editor")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", {name: "Esdeveniments"}));
  expect(screen.getByText("Event registration")).toBeInTheDocument();
  expect(screen.queryByText("Team management")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", {name: "El meu equip"}));
  expect(screen.getByText("Team management")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", {name: "El meu perfil"}));
  expect(screen.getByText("Profile editor")).toBeInTheDocument();
  expect(screen.queryByText("Event registration")).not.toBeInTheDocument();
  expect(loadProfile).toHaveBeenCalledTimes(1);
});
