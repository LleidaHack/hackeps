import { isValidPhoneNumber, normalizePhoneNumber } from "./phoneValidation";

test.each(["600123456", "+34600123456", "+447700900123", "+358401234567", "+12025550123", "+1234567", "+123456789012345", " +44 7700 900123 "])("accepts %s", (value) => {
  expect(isValidPhoneNumber(value)).toBe(true);
});

test.each(["", "12345678", "1234567890", "+0123456789", "+123456", "+1234567890123456", "/34600123456", "++447700900123", "+44abc900123", "+44-7700900123", "600123456\nextra", "６００１２３４５６"])("rejects %s", (value) => {
  expect(isValidPhoneNumber(value)).toBe(false);
});

test("normalizes spacing while preserving the country prefix", () => {
  expect(normalizePhoneNumber(" +44 7700 900123 ")).toBe("+447700900123");
});
