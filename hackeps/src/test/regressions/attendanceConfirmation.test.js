import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConfirmAssistance from "src/components/hackeps/ConfirmAssistance/ConfirmAssistance";
import { cancelAssistance, confirmAssistance } from "src/services/EventService";
jest.mock("src/services/EventService", () => ({
  confirmAssistance: jest.fn(),
  cancelAssistance: jest.fn(),
}));
beforeEach(() => jest.clearAllMocks());
const show = (confirm) =>
  render(
    <MemoryRouter>
      <ConfirmAssistance confirm={confirm} token="signed-token" />
    </MemoryRouter>,
  );
test.each(["false", false, "invalid", undefined])(
  "never confirms a negative or invalid choice: %s",
  (choice) => {
    show(choice);
    expect(confirmAssistance).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: "Confirmar assistència" }),
    ).not.toBeInTheDocument();
  },
);
test("requires a click and ignores repeated clicks while pending", async () => {
  let finish;
  confirmAssistance.mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  show("true");
  expect(confirmAssistance).not.toHaveBeenCalled();
  const button = screen.getByRole("button", { name: "Confirmar assistència" });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(confirmAssistance).toHaveBeenCalledTimes(1);
  finish({ success: true });
  await waitFor(() =>
    expect(screen.getByText("Assistencia confirmada")).toBeInTheDocument(),
  );
});

test("cancels only after an explicit click and prevents duplicate submissions", async () => {
  let finish;
  cancelAssistance.mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  show("false");
  expect(cancelAssistance).not.toHaveBeenCalled();
  const button = screen.getByRole("button", {
    name: "Alliberar la meva plaça",
  });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(cancelAssistance).toHaveBeenCalledTimes(1);
  expect(cancelAssistance).toHaveBeenCalledWith("signed-token");
  expect(confirmAssistance).not.toHaveBeenCalled();
  finish({ success: true });
  expect(await screen.findByText("Plaça cancel·lada")).toBeInTheDocument();
});

test("allows retry after a cancellation failure without showing success", async () => {
  cancelAssistance
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({ success: true });
  show("false");
  fireEvent.click(
    screen.getByRole("button", { name: "Alliberar la meva plaça" }),
  );
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(screen.queryByText("Plaça cancel·lada")).not.toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Alliberar la meva plaça" }),
  );
  expect(await screen.findByText("Plaça cancel·lada")).toBeInTheDocument();
});

test("missing token offers no cancellation action", () => {
  render(
    <MemoryRouter>
      <ConfirmAssistance confirm="false" />
    </MemoryRouter>,
  );
  expect(
    screen.queryByRole("button", { name: "Alliberar la meva plaça" }),
  ).not.toBeInTheDocument();
  expect(cancelAssistance).not.toHaveBeenCalled();
});
