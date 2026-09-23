import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "src/pages/hackeps/Home";
import MainRoutes from "src/MainRoutes";

jest.mock("src/services/EventService", () => ({
  getHackeps: jest.fn().mockResolvedValue(undefined),
  getEventSponsors: jest.fn().mockResolvedValue([]),
  getEventIsHackerRegistered: jest.fn().mockResolvedValue(false),
}));

// setupTests mocks useLocation for every suite; these tests need the real one.
beforeEach(() => {
  const { useLocation: real } = jest.requireActual("react-router-dom");
  useLocation.mockImplementation(real);
});

test("the home page holds the dates and FAQ sections", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
  for (const id of ["registrat", "dates", "horari", "activitats", "faq", "sponsors"]) {
    expect(document.getElementById(id)).toBeInTheDocument();
  }
  expect(screen.getByRole("heading", { name: "FAQs" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Què és la HackEPS?" })).toBeInTheDocument();
});

test("the header is just the logo, the MLH badge, contact and login", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
  const header = within(screen.getByTestId("headerHackeps"));
  expect(header.getAllByRole("link").map((link) => link.getAttribute("aria-label") || link.textContent)).toEqual([
    "HackEPS, inici",
    "Major League Hacking",
    "Contacte",
    "Login",
  ]);
});

test("the header turns translucent once the page scrolls", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
  const nav = screen.getByRole("navigation", { name: "Principal" });
  expect(nav).toHaveAttribute("data-scrolled", "false");
  act(() => {
    window.scrollY = 300;
    fireEvent.scroll(window);
  });
  expect(nav).toHaveAttribute("data-scrolled", "true");
  act(() => {
    window.scrollY = 0;
    fireEvent.scroll(window);
  });
  expect(nav).toHaveAttribute("data-scrolled", "false");
});

function CurrentLocation() {
  const { pathname, hash } = useLocation();
  return <output data-testid="location">{pathname + hash}</output>;
}

test.each([
  ["/faq", "/#faq"],
  ["/dates", "/#dates"],
])("the old %s page sends visitors to its section", async (from, to) => {
  render(
    <MemoryRouter initialEntries={[from]}>
      <MainRoutes />
      <Routes>
        <Route path="*" element={<CurrentLocation />} />
      </Routes>
    </MemoryRouter>,
  );
  expect((await screen.findByTestId("location")).textContent).toBe(to);
});

test("contact keeps its own page", async () => {
  render(
    <MemoryRouter initialEntries={["/contacte"]}>
      <MainRoutes />
    </MemoryRouter>,
  );
  expect(await screen.findByRole("heading", { name: "Contacte" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
});
