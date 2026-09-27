import React from "react";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainTitle from "src/components/hackeps/Home/MainTitle";
import { getHackeps } from "src/services/EventService";

jest.mock("src/services/EventService", () => ({ getHackeps: jest.fn() }));

test.each([true, false])("registration waits for the edition before showing open=%s", async (is_open) => {
  let resolve;
  getHackeps.mockReturnValue(new Promise(done => { resolve = done; }));
  render(<MemoryRouter><MainTitle /></MemoryRouter>);
  expect(screen.getByRole("button", { name: "Carregant inscripcions…" })).toBeDisabled();
  expect(screen.queryByText("Inscripcions tancades")).not.toBeInTheDocument();
  await act(async () => resolve({ id: 26, is_open, start_date: "2099-11-28", end_date: "2099-11-29" }));
  const button = screen.getByRole("button", { name: is_open ? "Apunta't!" : "Inscripcions tancades" });
  expect(button.disabled).toBe(!is_open);
  expect(button).toHaveAttribute("aria-busy", "false");
});

test("an unavailable edition is not reported as closed", async () => {
  getHackeps.mockRejectedValue(new Error("offline"));
  render(<MemoryRouter><MainTitle /></MemoryRouter>);
  expect(await screen.findByRole("button", { name: "Inscripcions no disponibles" })).toBeDisabled();
  expect(screen.queryByText("Inscripcions tancades")).not.toBeInTheDocument();
});
