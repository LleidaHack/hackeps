const { getHackeps } = jest.requireActual("src/services/EventService");
import { fetchPlus } from "src/modules/fetchModule";
jest.mock("src/modules/fetchModule", () => ({ fetchPlus: jest.fn() }));

beforeEach(() => { jest.useFakeTimers(); jest.setSystemTime(Date.now() + 120000); fetchPlus.mockReset(); });
afterEach(() => jest.useRealTimers());

test("rejects a previous edition instead of using it for registration", async () => {
  fetchPlus.mockResolvedValue({ id: 25, start_date: "2025-11-22", end_date: "2025-11-23" });
  expect(await getHackeps()).toEqual(expect.objectContaining({ errCode: 404 }));
  expect(fetchPlus).toHaveBeenCalledWith({ Url: "/event/get_hackeps/2026" });
});

test("shares the current edition request and retries missing configuration", async () => {
  fetchPlus.mockResolvedValueOnce({ errCode: 404 });
  await getHackeps();
  const event = { id: 26, start_date: "2026-11-28", end_date: "2026-11-29" };
  fetchPlus.mockResolvedValueOnce(event);
  const results = await Promise.all([getHackeps(), getHackeps()]);
  expect(results).toEqual([event, event]);
  expect(fetchPlus).toHaveBeenCalledTimes(2);
});
