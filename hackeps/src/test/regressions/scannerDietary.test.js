import { BrowserQRCodeReader } from "@zxing/browser";
import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Scanner from "src/components/hackeps/Operations/Scanner";
import { operationRequest } from "src/components/hackeps/Operations/api";
import { getHackeps } from "src/services/EventService";
import { dietaryWarning } from "src/components/hackeps/Operations/dietary";
jest.mock("src/components/hackeps/Operations/api");
jest.mock("src/services/EventService");
let mockRead;
const mockStop = jest.fn();
jest.mock("@zxing/browser", () => ({
  BrowserQRCodeReader: jest.fn().mockImplementation(() => ({
    decodeFromConstraints: jest.fn((constraints, video, callback) => {
      mockRead = callback;
      return Promise.resolve({ stop: mockStop });
    }),
  })),
}));
jest.mock("src/components/hackeps/Layout/DarkPage", () => ({ children }) => (
  <div>{children}</div>
));
beforeEach(() => {
  jest.clearAllMocks();
  BrowserQRCodeReader.mockImplementation(() => ({
    decodeFromConstraints: jest.fn((constraints, video, callback) => {
      mockRead = callback;
      return Promise.resolve({ stop: mockStop });
    }),
  }));
  Object.defineProperty(window, "crypto", {
    configurable: true,
    value: { randomUUID: () => "operation-test" },
  });
  getHackeps.mockResolvedValue({ id: 5 });
  operationRequest.mockImplementation((path) =>
    Promise.resolve(
      path.endsWith("/scanner")
        ? { access_role: "admin", meals: [{ id: 1, name: "Dinner" }] }
        : { participant: "Alex", food_restrictions: "Lactosa" },
    ),
  );
});
test("meal scan blocks further registration until the dietary alert is acknowledged", async () => {
  render(
    <MemoryRouter>
      <Scanner />
    </MemoryRouter>,
  );
  fireEvent.change(await screen.findByLabelText("Operació"), {
    target: { value: "meal" },
  });
  fireEvent.change(screen.getByLabelText("Àpat"), { target: { value: "1" } });
  fireEvent.change(screen.getByLabelText("QR de l’acreditació física"), {
    target: { value: "V1234" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Registrar codi manual" }),
  );
  expect(
    await screen.findByRole("alert", { name: "Restriccions alimentàries" }),
  ).toHaveTextContent("Lactosa");
  expect(screen.getByRole("alert")).toHaveTextContent("Alex");
  expect(
    screen.getByRole("button", { name: "Registrar codi manual" }),
  ).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Entès · continuar" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Registrar codi manual" }),
  ).toBeEnabled();
});
test("only explicit negative answers suppress dietary warnings", () => {
  expect(dietaryWarning("No.")).toBe("");
  expect(dietaryWarning(null)).toBe("");
  expect(dietaryWarning("No puc prendre gluten")).toBe("No puc prendre gluten");
});

test("camera scans automatically, stays active and ignores a stationary QR", async () => {
  operationRequest.mockImplementation((path) =>
    Promise.resolve(
      path.endsWith("/scanner")
        ? { access_role: "lleidahacker", meals: [{ id: 1, name: "Dinner" }] }
        : { participant: "Alex" },
    ),
  );
  const { unmount } = render(
    <MemoryRouter>
      <Scanner />
    </MemoryRouter>,
  );
  fireEvent.change(await screen.findByLabelText("Operació"), {
    target: { value: "meal" },
  });
  fireEvent.change(screen.getByLabelText("Àpat"), { target: { value: "1" } });
  await waitFor(() => expect(mockRead).toBeDefined());
  await act(async () => {
    mockRead({ getText: () => "V1234" });
  });
  await screen.findByText("Registrat: Alex");
  await act(async () => {
    mockRead({ getText: () => "V1234" });
  });
  expect(
    operationRequest.mock.calls.filter(([path]) => path.endsWith("/scan")),
  ).toHaveLength(1);
  await act(async () => {
    mockRead({ getText: () => "V5678" });
  });
  expect(
    operationRequest.mock.calls.filter(([path]) => path.endsWith("/scan")),
  ).toHaveLength(2);
  expect(mockStop).not.toHaveBeenCalled();
  expect(screen.queryByText("El meu perfil")).not.toBeInTheDocument();
  unmount();
  expect(mockStop).toHaveBeenCalledTimes(1);
});

test("badge assignment reads a ticket then a badge before submitting", async () => {
  render(
    <MemoryRouter>
      <Scanner />
    </MemoryRouter>,
  );
  await screen.findByLabelText("Operació");
  await act(async () => {
    mockRead({ getText: () => "TICKET1" });
  });
  expect(
    operationRequest.mock.calls.filter(([, method]) => method === "PUT"),
  ).toHaveLength(0);
  expect(
    screen.getByText("2 · Passa l’acreditació física"),
  ).toBeInTheDocument();
  await act(async () => {
    mockRead({ getText: () => "VBADGE1" });
  });
  expect(operationRequest).toHaveBeenCalledWith(
    "/event/5/vouchers/VBADGE1/assign/TICKET1",
    "PUT",
  );
});

test("an ambiguous error pauses scanning and retries the original operation ID", async () => {
  let attempts = 0;
  operationRequest.mockImplementation((path) => {
    if (path.endsWith("/scanner"))
      return Promise.resolve({
        access_role: "lleidahacker",
        meals: [{ id: 1, name: "Dinner" }],
      });
    attempts++;
    return attempts === 1
      ? Promise.reject({ code: 502, message: "Network failed" })
      : Promise.resolve({ participant: "Alex" });
  });
  render(
    <MemoryRouter>
      <Scanner />
    </MemoryRouter>,
  );
  fireEvent.change(await screen.findByLabelText("Operació"), {
    target: { value: "meal" },
  });
  fireEvent.change(screen.getByLabelText("Àpat"), { target: { value: "1" } });
  await act(async () => {
    mockRead({ getText: () => "V1234" });
  });
  await screen.findByText("Network failed");
  await act(async () => {
    mockRead({ getText: () => "V5678" });
  });
  expect(attempts).toBe(1);
  fireEvent.click(
    screen.getByRole("button", { name: "Reintentar la mateixa operació" }),
  );
  await screen.findByText("Registrat: Alex");
  const calls = operationRequest.mock.calls.filter(([path]) =>
    path.endsWith("/scan"),
  );
  expect(calls[1][2]).toEqual(calls[0][2]);
});
