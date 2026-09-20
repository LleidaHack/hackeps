// Legacy timestamps without an offset were stored as UTC by the backend.
export function memberSince(value, now = Date.now()) {
  const text = String(value);
  const timestamp = Date.parse(
    /^\d{4}-\d{2}-\d{2}$/.test(text)
      ? `${text}T00:00:00Z`
      : /(?:Z|[+-]\d{2}:?\d{2})$/i.test(text)
        ? text
        : `${text}Z`,
  );
  if (!Number.isFinite(timestamp)) return "";
  const days = Math.max(0, Math.floor((now - timestamp) / 86400000));
  if (!days) return "Membre des d’avui";
  if (days === 1) return "Membre des de fa 1 dia";
  if (days < 30) return `Membre des de fa ${days} dies`;
  const months = Math.floor(days / 30);
  if (days < 365)
    return `Membre des de fa ${months} ${months === 1 ? "mes" : "mesos"}`;
  const years = Math.floor(days / 365);
  return `Membre des de fa ${years} ${years === 1 ? "any" : "anys"}`;
}
