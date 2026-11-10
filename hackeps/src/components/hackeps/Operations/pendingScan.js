// Session-only storage keeps an uncertain scan recoverable across reloads.
const key = (userId, eventId) => `scanner-pending:${userId}:${eventId}`;
export function savePendingScan(userId, eventId, payload, form) {
  sessionStorage.setItem(
    key(userId, eventId),
    JSON.stringify({ payload, form }),
  );
}
export function readPendingScan(userId, eventId) {
  try {
    const value = JSON.parse(sessionStorage.getItem(key(userId, eventId)));
    return value?.payload?.operation_id && value?.payload?.kind && value?.form
      ? value
      : null;
  } catch {
    return null;
  }
}
export function clearPendingScan(userId, eventId) {
  sessionStorage.removeItem(key(userId, eventId));
}
