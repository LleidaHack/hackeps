import { isAtLeastAge } from "src/modules/ageValidation";

test("requires the birthday, not just the birth month", () => {
  expect(isAtLeastAge("2012-09-30", 14, new Date(2026, 8, 1))).toBe(false);
  expect(isAtLeastAge("2012-09-30", 14, new Date(2026, 8, 29))).toBe(false);
  expect(isAtLeastAge("2012-09-30", 14, new Date(2026, 8, 30))).toBe(true);
  expect(isAtLeastAge("2012-09-30", 14, new Date(2026, 9, 1))).toBe(true);
});
test.each(["", "invalid", "2026-02-30", "2030-01-01"])(
  "rejects invalid or future birth dates: %s",
  (value) => {
    expect(isAtLeastAge(value, 14, new Date(2026, 8, 16))).toBe(false);
  },
);
