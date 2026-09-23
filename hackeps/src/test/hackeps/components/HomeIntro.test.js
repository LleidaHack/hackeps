import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import Home from "src/pages/hackeps/Home";
import SeuVellaScene from "src/components/hackeps/Home/SeuVellaScene";

jest.mock("src/services/EventService", () => ({
  getHackeps: jest.fn().mockResolvedValue(undefined),
  getEventSponsors: jest.fn().mockResolvedValue([]),
  getEventIsHackerRegistered: jest.fn().mockResolvedValue(false),
}));

const originalFlag = process.env.REACT_APP_HERO_ANIMATED;

function mockMatchMedia(matches) {
  window.matchMedia = jest.fn((query) => ({
    matches: matches(query),
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
}

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

beforeEach(() => {
  useLocation.mockReturnValue({ pathname: "/", hash: "" });
  mockMatchMedia(() => false);
  localStorage.clear();
  process.env.REACT_APP_HERO_ANIMATED = "1";
});

afterEach(() => {
  delete window.matchMedia;
  process.env.REACT_APP_HERO_ANIMATED = originalFlag;
});

test("the intro plays over the real page and records when it played", async () => {
  renderHome();
  expect(await screen.findByTestId("home-intro")).toBeInTheDocument();
  expect(screen.getByTestId("headerHackeps")).toBeInTheDocument();
  expect(Number(localStorage.getItem("lastAnimation"))).toBeGreaterThan(0);
});

test("skipping leaves the page elements exactly as they are without the intro", async () => {
  renderHome();
  fireEvent.click(await screen.findByRole("button", { name: "Salta la intro" }));
  expect(screen.queryByTestId("home-intro")).not.toBeInTheDocument();
  for (const element of document.querySelectorAll("[data-intro]")) {
    expect(element.style.transform).toBe("");
    expect(element.style.opacity).toBe("");
  }
  expect(document.querySelector("[data-intro-extra]")).toBeNull();
  expect(document.body.style.overflow).toBe("");
});

test("Escape also skips the intro", async () => {
  renderHome();
  await screen.findByTestId("home-intro");
  fireEvent.keyDown(window, { key: "Escape" });
  expect(screen.queryByTestId("home-intro")).not.toBeInTheDocument();
});

test("the intro is skipped for reduced motion and recent visits", () => {
  mockMatchMedia((query) => query.includes("reduced-motion"));
  const { unmount } = renderHome();
  expect(screen.queryByTestId("home-intro")).not.toBeInTheDocument();
  unmount();

  mockMatchMedia(() => false);
  localStorage.setItem("lastAnimation", String(Date.now() - 60 * 1000));
  renderHome();
  expect(screen.queryByTestId("home-intro")).not.toBeInTheDocument();
});

test("?intro replays the intro even right after a visit", async () => {
  localStorage.setItem("lastAnimation", String(Date.now()));
  window.history.pushState({}, "", "/?intro");
  renderHome();
  expect(await screen.findByTestId("home-intro")).toBeInTheDocument();
  window.history.pushState({}, "", "/");
});

test("clicking the logo makes the dragon open its mouth and breathe fire", async () => {
  process.env.REACT_APP_HERO_ANIMATED = "0";
  renderHome();
  // jsdom has no 2D canvas; seeing the flame ask for one is enough.
  const getContext = jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockImplementation(() => null);
  const logo = screen.getByRole("button", { name: /fes que el drac escupi foc/ });
  expect(logo.querySelectorAll("img")).toHaveLength(1);
  fireEvent.click(logo);
  await waitFor(() => expect(getContext).toHaveBeenCalledWith("2d"));
  // Mouth, jaw and fangs are fetched on the first click.
  expect(logo.querySelectorAll("img")).toHaveLength(4);
  getContext.mockRestore();
});

test("five clicks on a tree set off the fireworks show", async () => {
  render(<SeuVellaScene />);
  const [tree] = screen.getAllByTestId("seu-vella-tree");
  for (let i = 0; i < 4; i++) fireEvent.click(tree);
  expect(screen.queryByTestId("fireworks-show")).not.toBeInTheDocument();
  fireEvent.click(tree);
  expect(await screen.findByTestId("fireworks-show")).toBeInTheDocument();
});
