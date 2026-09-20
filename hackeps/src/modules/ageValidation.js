// Account age is distinct from event admission requirements.
export function isAtLeastAge(value, minimumAge, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const [year, month, day] = value.split("-").map(Number);
  const birthdate = new Date(year, month - 1, day);
  if (
    birthdate.getFullYear() !== year ||
    birthdate.getMonth() !== month - 1 ||
    birthdate.getDate() !== day
  )
    return false;
  let age = today.getFullYear() - year;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  )
    age -= 1;
  return age >= minimumAge;
}
