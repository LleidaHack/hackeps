// Calendar-accurate months/days/hours until `target`, or null once it has passed.
// Months are counted by stepping real calendar months from `now`, so 19 Sep to
// 28 Nov is "2 months 9 days", not the 70 / 30 approximation.
export function timeUntil(target, now = new Date()) {
  const end = new Date(target).getTime();
  let cursor = new Date(now).getTime();
  if (!Number.isFinite(end) || !Number.isFinite(cursor) || end <= cursor)
    return null;

  let months = 0;
  for (;;) {
    const next = addMonth(cursor);
    if (next > end) break;
    cursor = next;
    months += 1;
  }
  const remaining = end - cursor;
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  return { months, days, hours };
}

// One calendar month later, clamped to the last day of the shorter month
// (31 Jan -> 28 Feb, not 3 Mar).
function addMonth(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  date.setDate(Math.min(day, lastDay));
  return date.getTime();
}
