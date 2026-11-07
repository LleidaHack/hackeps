import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NicknameRequest from "src/components/hackeps/Profile/NicknameRequest";
import { operationRequest } from "src/components/hackeps/Operations/api";
jest.mock("src/components/hackeps/Operations/api", () => ({
  operationRequest: jest.fn(),
}));
test("keeps the approved name while a request is pending", async () => {
  operationRequest.mockResolvedValueOnce({
    nickname: "Original",
    requests: [],
  });
  render(<NicknameRequest />);
  await screen.findByText("Original");
  fireEvent.change(screen.getByLabelText("Nou nom"), {
    target: { value: "Tractor" },
  });
  operationRequest.mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce({
    nickname: "Original",
    requests: [{ id: 1, proposed: "Tractor", status: "pending" }],
  });
  fireEvent.click(screen.getByRole("button", { name: "Sol·licita el canvi" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Pendent d’aprovació"),
  );
  expect(screen.getByText("Original")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Sol·licita el canvi" }),
  ).toBeDisabled();
  expect(operationRequest).toHaveBeenCalledWith("/nicknames/me", "POST", {
    nickname: "Tractor",
  });
});
