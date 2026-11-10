import {
  savePendingScan,
  readPendingScan,
  clearPendingScan,
} from "src/components/hackeps/Operations/pendingScan";
import { clearSession } from "src/modules/session";

test("retains the exact operation across reloads and isolates users and events", () => {
  const payload = {
    operation_id: "original-id",
    kind: "meal",
    code: "BADGE",
    round: 2,
  };
  const form = { kind: "meal", code: "BADGE", target: "1" };
  savePendingScan("1", 5, payload, form);
  expect(readPendingScan("1", 5)).toEqual({ payload, form });
  expect(readPendingScan("2", 5)).toBeNull();
  expect(readPendingScan("1", 6)).toBeNull();
  clearPendingScan("1", 5);
  expect(readPendingScan("1", 5)).toBeNull();
  savePendingScan("1", 5, payload, form);
  clearSession();
  expect(readPendingScan("1", 5)).toBeNull();
});
