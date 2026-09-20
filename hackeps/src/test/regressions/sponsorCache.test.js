import { fetchPlus } from "src/modules/fetchModule";
import { getEventSponsors, updateEventSponsor } from "src/services/EventService";
jest.mock("src/modules/fetchModule", () => ({ fetchPlus: jest.fn() }));

beforeEach(() => {
  jest.useFakeTimers();
  fetchPlus.mockReset();
});
afterEach(() => jest.useRealTimers());

test("shares concurrent logo requests and reuses the result for a minute", async () => {
  let resolve;
  fetchPlus.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  const first = getEventSponsors(101);
  const second = getEventSponsors("101");
  expect(fetchPlus).toHaveBeenCalledTimes(1);
  resolve([{ id: 1, image: "data:image/webp;base64,test" }]);
  expect(await second).toEqual(await first);
  await getEventSponsors(101);
  expect(fetchPlus).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(60001);
  fetchPlus.mockResolvedValue([]);
  await getEventSponsors(101);
  expect(fetchPlus).toHaveBeenCalledTimes(2);
});

test("does not cache errors or mix different events", async () => {
  fetchPlus.mockResolvedValueOnce({ errCode: 503 }).mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: 2 }]);
  await getEventSponsors(102);
  expect(await getEventSponsors(102)).toEqual([]);
  expect(await getEventSponsors(103)).toEqual([{ id: 2 }]);
  expect(fetchPlus).toHaveBeenCalledTimes(3);
});

test("invalidates cached logos after updating a sponsorship", async () => {
  fetchPlus.mockResolvedValue([]);
  await getEventSponsors(104);
  await updateEventSponsor(104, 1, 2);
  await getEventSponsors(104);
  expect(fetchPlus).toHaveBeenCalledTimes(3);
});
