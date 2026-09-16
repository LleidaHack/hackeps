import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfile from "src/components/hackeps/Profile/EditProfile";
import { updateHacker } from "src/services/HackerService";

jest.mock("src/services/HackerService", () => ({updateHacker: jest.fn()}));

test("shows editable values immediately and saves cleared links without overwriting the avatar", async () => {
  updateHacker.mockResolvedValue({success: true});
  const onSaved = jest.fn();
  render(<EditProfile hackerObj={{id: 1, linkedin: "https://linkedin.com/in/test", github: "", shirt_size: "M", image: ""}} onSaved={onSaved} />);
  expect(screen.queryByText("Tancar")).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("LinkedIn"), {target: {value: ""}});
  fireEvent.click(screen.getByRole("button", {name: "Desa els canvis"}));
  await waitFor(() => expect(onSaved).toHaveBeenCalled());
  expect(updateHacker).toHaveBeenCalledWith({id: 1, linkedin: "", github: "", shirt_size: "M"});
  expect(screen.getByRole("status")).toHaveTextContent("Els canvis s’han desat correctament.");
});
