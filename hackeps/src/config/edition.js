export const HACKEPS_YEAR = Number(process.env.REACT_APP_HACKEPS_YEAR || 2026);

// Fixed edition dates (Lleida time). The waiting page counts down to these
// without depending on the API; the full site still reads the event record.
export const HACKEPS_START = new Date("2026-11-28T00:00:00+01:00");
export const HACKEPS_END = new Date("2026-11-29T23:59:59+01:00");
