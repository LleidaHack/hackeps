import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sponsors from "../../../components/hackeps/Home/Sponsors";
import * as CompanyService from "../../../services/CompanyService";

// Mock the CompanyService
jest.mock("../../../services/CompanyService");

describe("Home Sponsors Component", () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "test-event"),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state initially", () => {
    // Mock API calls to never resolve
    CompanyService.getCompanyByTier.mockImplementation(
      () => new Promise(() => {}),
    );

    render(
      <MemoryRouter>
        <Sponsors />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Carregant reptes de sponsors..."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Carregant sponsors...").length).toBeGreaterThan(
      0,
    );
  });

  test("displays sponsors and challengers when data loads successfully", async () => {
    // Mock successful API responses
    const mockChallenger = [
      { id: 1, name: "Challenger Company", image: "test-image.jpg", tier: 2 },
    ];
    const mockSponsors = [
      [{ id: 2, name: "Sponsor Tier 1", image: "sponsor1.jpg", tier: 1 }],
      [{ id: 3, name: "Sponsor Tier 3", image: "sponsor3.jpg", tier: 3 }],
    ];

    CompanyService.getCompanyByTier
      .mockResolvedValueOnce(mockChallenger)
      .mockResolvedValueOnce(mockSponsors[0])
      .mockResolvedValueOnce(mockSponsors[1]);

    render(
      <MemoryRouter>
        <Sponsors />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Carregant reptes de sponsors..."),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryAllByText("Carregant sponsors...").length).toBe(0);
    });

    expect(screen.getByText("Patrocinadors or")).toBeInTheDocument();
    expect(screen.getByText("Patrocinadors plata")).toBeInTheDocument();
    expect(screen.getByText("Patrocinadors bronze")).toBeInTheDocument();
  });

  test("shows empty state when no event is in localStorage", async () => {
    // Mock localStorage to return null
    window.localStorage.getItem = jest.fn(() => null);

    render(
      <MemoryRouter>
        <Sponsors />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("No hi ha reptes disponibles actualment."),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getAllByText("No hi ha sponsors disponibles actualment.").length,
      ).toBeGreaterThan(0);
    });
  });

  test("shows empty state when API returns empty data", async () => {
    // Mock API to return empty arrays
    CompanyService.getCompanyByTier
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <Sponsors />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("No hi ha reptes disponibles actualment."),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getAllByText("No hi ha sponsors disponibles actualment.").length,
      ).toBeGreaterThan(0);
    });
  });

  test("handles API errors gracefully", async () => {
    // Mock API to reject
    CompanyService.getCompanyByTier.mockRejectedValue(new Error("API Error"));

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Sponsors />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("No hi ha reptes disponibles actualment."),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getAllByText("No hi ha sponsors disponibles actualment.").length,
      ).toBeGreaterThan(0);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching sponsors data:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
