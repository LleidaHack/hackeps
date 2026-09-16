import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Sponsors from "src/components/hackeps/Home/Sponsors";
import { getCompanyByTier } from "src/services/CompanyService";
jest.mock("src/services/CompanyService");

beforeEach(() => {
  jest.clearAllMocks();
});

test("loads sponsors on a first visit without a cached event", async () => {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: { getItem: () => null },
  });
  getCompanyByTier
    .mockResolvedValueOnce([{ id: 1, name: "Test Sponsor", image: "test.png" }])
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([]);
  render(<Sponsors />);
  expect(
    await screen.findByRole("button", { name: "Test Sponsor" }),
  ).toBeInTheDocument();
  expect(getCompanyByTier).toHaveBeenCalledTimes(3);
});
test("empty artwork does not introduce unnamed controls", async () => {
  getCompanyByTier.mockResolvedValue([]);
  render(<Sponsors />);
  await waitFor(() => expect(getCompanyByTier).toHaveBeenCalledTimes(3));
  expect(screen.queryAllByRole("button")).toHaveLength(0);
  expect(screen.getByText("Patrocinadors or")).toBeInTheDocument();
});
test("API error objects do not become sponsor cards", async () => {
  getCompanyByTier.mockResolvedValue({ errCode: 500 });
  render(<Sponsors />);
  await waitFor(() => expect(getCompanyByTier).toHaveBeenCalledTimes(3));
  expect(screen.queryAllByRole("button")).toHaveLength(0);
});
