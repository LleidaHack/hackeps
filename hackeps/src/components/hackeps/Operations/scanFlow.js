export const needsTwoCodes = (kind) =>
  ["badge", "replace_badge"].includes(kind);
export const needsMentor = (kind) =>
  ["mentor_badge", "mentor_replace_badge"].includes(kind);
export function readyToScan(form, data) {
  if (!data) return false;
  if (["meal", "activity", "redeem", "judging_start"].includes(form.kind)) {
    const collection = {
      meal: "meals",
      activity: "activities",
      redeem: "prizes",
      judging_start: "rooms",
    }[form.kind];
    if (!data[collection]?.some((item) => String(item.id) === form.target))
      return false;
    if (form.kind === "meal" && data.meal_rounds?.[form.target]?.open === false)
      return false;
  }
  if (
    needsMentor(form.kind) &&
    !data.mentors?.some((item) => String(item.id) === form.target)
  )
    return false;
  if (
    form.kind === "award" &&
    (!(Number(form.amount) > 0) || form.reason.trim().length < 3)
  )
    return false;
  return true;
}

// A stationary QR must disappear before it can be accepted again. Different
// badges can pass consecutively without stopping or restarting the camera.
export function createScanGate() {
  let lastCode = "",
    lastSeen = 0;
  return {
    observe(code, now, accept = () => true) {
      if (!code) {
        if (now - lastSeen > 1200) lastCode = "";
        return false;
      }
      if (code === lastCode) {
        lastSeen = now;
        return false;
      }
      // Frames seen while a request/alert is blocking are not consumed. The
      // same badge can be accepted when the scanner becomes ready again.
      if (accept(code) === false) return false;
      lastCode = code;
      lastSeen = now;
      return true;
    },
  };
}

// Matches the backend voucher format; participant tickets use a different code space.
export const isPhysicalBadge = (code) =>
  /^V[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/.test(code.trim());
export function checkinCodeError(kind, code, step) {
  if (kind !== "badge") return "";
  if (step === "ticket" && isPhysicalBadge(code))
    return "Això és una acreditació física. Escaneja primer el QR de l’entrada del participant.";
  if (step === "badge" && !isPhysicalBadge(code))
    return "Això no és una acreditació física. Escaneja el QR de la targeta, no el de l’entrada.";
  return "";
}
