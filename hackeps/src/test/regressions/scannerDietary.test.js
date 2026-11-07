import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Scanner from "src/components/hackeps/Operations/Scanner";
import { operationRequest } from "src/components/hackeps/Operations/api";
import { getHackeps } from "src/services/EventService";
import { dietaryWarning } from "src/components/hackeps/Operations/dietary";
jest.mock("src/components/hackeps/Operations/api");
jest.mock("src/services/EventService");
jest.mock("@zxing/browser", () => ({ BrowserQRCodeReader: jest.fn() }));
jest.mock("src/components/hackeps/Layout/DarkPage", () => ({ children }) => <div>{children}</div>);
beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(window, "crypto", { configurable: true, value: { randomUUID: () => "operation-test" } });
  getHackeps.mockResolvedValue({ id: 5 });
  operationRequest.mockImplementation((path) => Promise.resolve(path.endsWith("/scanner") ? { access_role: "admin", meals: [{ id: 1, name: "Dinner" }] } : { participant: "Alex", food_restrictions: "Lactosa" }));
});
test("meal scan blocks further registration until the dietary alert is acknowledged", async () => {
  render(<MemoryRouter><Scanner /></MemoryRouter>);
  fireEvent.change(await screen.findByLabelText("Operació"), { target: { value: "meal" } });
  fireEvent.change(screen.getByLabelText("Àpat"), { target: { value: "1" } });
  fireEvent.change(screen.getByLabelText("QR de l’acreditació física"), { target: { value: "V1234" } });
  fireEvent.click(screen.getByRole("button", { name: "Registrar" }));
  expect(await screen.findByRole("alert", { name: "Restriccions alimentàries" })).toHaveTextContent("Lactosa");
  expect(screen.getByRole("alert")).toHaveTextContent("Alex");
  expect(screen.getByRole("button", { name: "Registrar" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Entès · continuar" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Registrar" })).toBeEnabled();
});
test("only explicit negative answers suppress dietary warnings", () => {
  expect(dietaryWarning("No.")).toBe("");
  expect(dietaryWarning(null)).toBe("");
  expect(dietaryWarning("No puc prendre gluten")).toBe("No puc prendre gluten");
});
