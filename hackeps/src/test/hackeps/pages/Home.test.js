import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "src/pages/hackeps/Home";
import { MemoryRouter } from "react-router-dom";

jest.mock("src/services/EventService", () => ({
  getHackeps: jest.fn().mockResolvedValue({
    id: 1,
    start_date: "2026-11-28T13:00:26.478000",
    end_date: "2026-11-29T19:12:26.478000",
  }),
  getEventIsHackerRegistered: jest.fn().mockResolvedValue(false),
}));

describe("Home - Render", () => {
  test(`renders without crashing + header and footer.`, async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    // Verifica que tengamos el footer y el header
    expect(await screen.findByTestId("footerHackeps")).toBeInTheDocument();
    expect(await screen.findByTestId("headerHackeps")).toBeInTheDocument();
  });
});
