import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConfirmAssistance from "src/components/hackeps/ConfirmAssistance/ConfirmAssistance";
import { confirmAssistance } from "src/services/EventService";
jest.mock("src/services/EventService", () => ({
  confirmAssistance: jest.fn(),
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
