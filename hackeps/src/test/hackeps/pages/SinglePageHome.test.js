import React from "react";
import { render, screen, within } from "@testing-library/react";
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

test("the home page holds every section the old pages had", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
  for (const id of ["registrat", "dates", "horari", "activitats", "faq", "sponsors", "contacte"]) {
    expect(document.getElementById(id)).toBeInTheDocument();
  }
  expect(screen.getByRole("heading", { name: "FAQs" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Què és la HackEPS?" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
});

test("the header is just the logo, the MLH badge and the login", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
  const header = within(screen.getByTestId("headerHackeps"));
  expect(header.getAllByRole("link").map((link) => link.getAttribute("aria-label") || link.textContent)).toEqual([
    "HackEPS, inici",
    "Major League Hacking",
    "Login",
  ]);
});

function CurrentLocation() {
  const { pathname, hash } = useLocation();
  return <output data-testid="location">{pathname + hash}</output>;
}

test.each([
  ["/faq", "/#faq"],
  ["/dates", "/#dates"],
  ["/contacte", "/#contacte"],
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
