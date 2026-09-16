import { waitFor } from "@testing-library/react";
import { loadProfile } from "src/modules/loadProfile";
import { getUserById } from "src/services/UserService";
import { getHackerById, getHackerGroups } from "src/services/HackerService";
import {
  getHackeps,
  getEventIsHackerRegistered,
  getEventIsHackerAccepted,
  getEventHasHackerConfirmed,
} from "src/services/EventService";
import { getHackerGroupById } from "src/services/HackerGroupService";
jest.mock("src/services/UserService");
jest.mock("src/services/HackerService");
jest.mock("src/services/EventService");
jest.mock("src/services/HackerGroupService");
beforeEach(() => {
  jest.resetAllMocks();
  getUserById.mockResolvedValue({ id: 42, type: "hacker" });
  getHackerById.mockResolvedValue({ id: 42, code: "ticket" });
  getHackerGroups.mockResolvedValue([{ id: 3, event_id: 10 }]);
  getEventIsHackerRegistered.mockResolvedValue(true);
  getEventIsHackerAccepted.mockResolvedValue(false);
  getHackerGroupById.mockResolvedValue({ id: 3, name: "Team" });
});
test("waits for a slow event before selecting the matching team", async () => {
  let finishEvent;
  getHackeps.mockImplementation(
    () =>
      new Promise((resolve) => {
        finishEvent = resolve;
      }),
  );
  const pending = loadProfile("42");
  await waitFor(() => expect(getHackeps).toHaveBeenCalled());
  expect(getHackerGroupById).not.toHaveBeenCalled();
  finishEvent({ id: 10, is_open: true });
  const result = await pending;
  expect(result.team.name).toBe("Team");
  expect(result.event).toMatchObject({
    event_id: 10,
    registered: true,
    accepted: false,
    confirmed: false,
  });
  expect(getEventIsHackerRegistered).toHaveBeenCalledWith(10, "42");
  expect(getEventHasHackerConfirmed).not.toHaveBeenCalled();
});
test("does not turn an API error into accepted status", async () => {
  getHackeps.mockResolvedValue({ id: 10 });
  getEventIsHackerAccepted.mockResolvedValue({ errCode: 500 });
  await expect(loadProfile("42")).rejects.toThrow(
    "Invalid registration status",
  );
});
test("handles non-hacker accounts without hacker API calls", async () => {
  getUserById.mockResolvedValue({ id: 42, type: "organizer" });
  expect((await loadProfile("42")).isHacker).toBe(false);
  expect(getHackerById).not.toHaveBeenCalled();
});
