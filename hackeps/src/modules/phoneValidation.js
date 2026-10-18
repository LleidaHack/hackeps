export const normalizePhoneNumber = (value) => value.replace(/\s+/g, "");

export const isValidPhoneNumber = (value) =>
  /^(?:[0-9]{9}|\+[1-9][0-9]{6,14})$/.test(normalizePhoneNumber(value));
