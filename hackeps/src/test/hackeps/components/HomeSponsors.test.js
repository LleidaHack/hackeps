import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Sponsors from "src/components/hackeps/Home/Sponsors";
import { getHackeps, getEventSponsors } from "src/services/EventService";
jest.mock("src/services/EventService");

beforeEach(() => {
  jest.clearAllMocks();
  getHackeps.mockResolvedValue({ id: 26 });
});

test("loads sponsors on a first visit without a cached event", async () => {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: { getItem: () => null },
  });
  getEventSponsors.mockResolvedValue([{ id: 1, name: "Test Sponsor", image: "test.webp", tier: 2 }]);
  render(<Sponsors />);
  expect(
    await screen.findByRole("button", { name: "Test Sponsor" }),
  ).toBeInTheDocument();
  expect(getEventSponsors).toHaveBeenCalledWith(26);
});
test("empty artwork does not introduce unnamed controls", async () => {
  getEventSponsors.mockResolvedValue([]);
  render(<Sponsors />);
  await waitFor(() => expect(getEventSponsors).toHaveBeenCalledWith(26));
  expect(screen.queryAllByRole("button")).toHaveLength(0);
  // The section title always renders; empty tiers are not rendered at all.
  expect(screen.getByText("SPONSORS")).toBeInTheDocument();
  expect(screen.queryByText("Supreme")).not.toBeInTheDocument();
});

test("sponsors are grouped under their tier heading", async () => {
  getEventSponsors.mockResolvedValue([
    { id: 1, name: "Top Sponsor", image: "a.webp", tier: 0 },
    { id: 2, name: "Small Sponsor", image: "b.webp", tier: 4 },
  ]);
  render(<Sponsors />);
  expect(
    await screen.findByRole("button", { name: "Top Sponsor" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Supreme")).toBeInTheDocument();
  expect(screen.getByText("Col·laboradors")).toBeInTheDocument();
  expect(screen.queryByText("Challenger")).not.toBeInTheDocument();
});
test("API error objects do not become sponsor cards", async () => {
  getEventSponsors.mockResolvedValue({ errCode: 500 });
  render(<Sponsors />);
  await waitFor(() => expect(getEventSponsors).toHaveBeenCalledWith(26));
  expect(screen.queryAllByRole("button")).toHaveLength(0);
});

test("does not fetch sponsors when the configured edition is missing", async () => {
  getHackeps.mockResolvedValue({ errCode: 404 });
  render(<Sponsors />);
  await waitFor(() => expect(getHackeps).toHaveBeenCalled());
  expect(getEventSponsors).not.toHaveBeenCalled();
});
