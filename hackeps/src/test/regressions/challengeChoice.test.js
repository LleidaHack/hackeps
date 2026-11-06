import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ChallengeChoice from "src/components/hackeps/Team/ChallengeChoice";
import { fetchPlus } from "src/modules/fetchModule";

jest.mock("src/modules/fetchModule", () => ({ fetchPlus: jest.fn() }));
const team = { id: 4, event_id: 2 };
const state = { published: true, open: true, choice: null, version: 0, challenges: [{ id: "one", title: "Challenge One" }, { id: "two", title: "Challenge Two" }] };
beforeEach(() => fetchPlus.mockReset());

test.each([
  { published: false, open: false },
  { published: true, open: false },
  { published: false, open: true },
])("does not render the choice card when unavailable: %j", async (flags) => {
  fetchPlus.mockResolvedValue({ ...state, ...flags });
  let view;
  await act(async () => { view = render(<ChallengeChoice team={team} />); });
  expect(view.container).toBeEmptyDOMElement();
});

test("polling reveals opened choices and hides them again when closed", async () => {
  jest.useFakeTimers();
  fetchPlus.mockResolvedValueOnce({ ...state, open: false })
    .mockResolvedValueOnce(state)
    .mockResolvedValueOnce({ ...state, open: false });
  const view = render(<ChallengeChoice team={team} />);
  try {
    await act(async () => {});
    expect(view.container).toBeEmptyDOMElement();
    await act(async () => { jest.advanceTimersByTime(10000); });
    expect(screen.getByRole("combobox")).toBeEnabled();
    await act(async () => { jest.advanceTimersByTime(10000); });
    expect(view.container).toBeEmptyDOMElement();
  } finally {
    view.unmount();
    jest.useRealTimers();
  }
});

test("saving uses the shared team version and displays confirmation", async () => {
  fetchPlus.mockResolvedValueOnce(state).mockResolvedValueOnce({ ...state, choice: "one", version: 1 });
  render(<ChallengeChoice team={team} />);
  fireEvent.change(await screen.findByRole("combobox"), { target: { value: "one" } });
  fireEvent.click(screen.getByRole("button", { name: "Desar elecció de l’equip" }));
  expect(await screen.findByText("Elecció de l’equip desada.")).toBeInTheDocument();
  expect(fetchPlus).toHaveBeenLastCalledWith(expect.objectContaining({ Url: "/operations/2/teams/4/challenge-vote", Method: "PUT", Body: { challenge: "one", version: 0 } }));
});

test("stale submission reloads the other member choice without silently overwriting it", async () => {
  fetchPlus.mockResolvedValueOnce(state).mockResolvedValueOnce({ errCode: 409 }).mockResolvedValueOnce({ ...state, choice: "two", version: 1 });
  render(<ChallengeChoice team={team} />);
  fireEvent.change(await screen.findByRole("combobox"), { target: { value: "one" } });
  fireEvent.click(screen.getByRole("button", { name: "Desar elecció de l’equip" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("L’elecció ha canviat");
  await waitFor(() => expect(screen.getByRole("combobox")).toHaveValue("two"));
  expect(fetchPlus.mock.calls.filter(([args]) => args.Method === "PUT")).toHaveLength(1);
});
