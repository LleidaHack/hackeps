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
  expect(screen.getByText("Patrocinadors or")).toBeInTheDocument();
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
