import React from "react";
import { render, screen, within } from "@testing-library/react";
import Team from "src/components/hackeps/Team/Team";

jest.mock("src/components/hackeps/ProfilePic/ProfilePic", () => () => null);

const team = {id: 10, name: "Test team", leader_id: 1, members: [{id: "1", name: "Leader"}, {id: 2, name: "Member"}]};

beforeEach(() => {
  jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => key === "userID" ? "1" : null);
});

test("leader can manage another member but cannot kick or promote themselves", () => {
  render(<Team team={team} is_user={true} />);
  const ownCard = screen.getByText("Leader").closest(".smallCard");
  expect(within(ownCard).queryByText("Expulsar")).not.toBeInTheDocument();
  expect(within(ownCard).queryByText("Fer líder")).not.toBeInTheDocument();
  expect(screen.getAllByText("Expulsar")).toHaveLength(1);
  expect(screen.getAllByText("Fer líder")).toHaveLength(1);
});

test("public team view does not expose management actions", () => {
  render(<Team team={team} is_user={false} />);
  expect(screen.queryByText("Expulsar")).not.toBeInTheDocument();
  expect(screen.queryByText("Fer líder")).not.toBeInTheDocument();
});
