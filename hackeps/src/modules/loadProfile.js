import { getUserById } from "src/services/UserService";
import { getHackerById, getHackerGroups } from "src/services/HackerService";
import {
  getHackeps,
  getEventIsHackerRegistered,
  getEventIsHackerAccepted,
  getEventHasHackerConfirmed,
  getEventTicket,
} from "src/services/EventService";
import { getHackerGroupById } from "src/services/HackerGroupService";

function requireData(value) {
  if (value == null || value.errCode != null)
    throw new Error("Profile data unavailable");
  return value;
}

export async function loadProfile(userId) {
  if (!userId) throw new Error("Missing profile ID");
  const account = requireData(await getUserById(userId));
  if (account.type !== "hacker")
    return {
      user: account,
      isHacker: false,
      event: null,
      team: null,
      qrCode: null,
      ticket: null,
    };
  const [user, currentEvent, groups] = await Promise.all([
    getHackerById(userId),
    getHackeps(),
    getHackerGroups(userId),
  ]);
  [user, currentEvent, groups].forEach(requireData);
  if (currentEvent.id == null || !Array.isArray(groups))
    throw new Error("Invalid profile data");
  const [registered, accepted] = await Promise.all([
    getEventIsHackerRegistered(currentEvent.id, userId),
    getEventIsHackerAccepted(currentEvent.id, userId),
  ]);
  if (typeof registered !== "boolean" || typeof accepted !== "boolean")
    throw new Error("Invalid registration status");
  const confirmed = accepted
    ? await getEventHasHackerConfirmed(currentEvent.id, userId)
    : false;
  if (typeof confirmed !== "boolean")
    throw new Error("Invalid confirmation status");
  // the ticket exists once the hacker is accepted and confirmed; an older
  // backend without the endpoint just leaves the check-in state unknown
  const ticket =
    accepted && confirmed ? await getEventTicket(currentEvent.id, userId) : null;
  const ticketState =
    ticket && ticket.errCode == null && ticket.has_ticket
      ? {
          code: ticket.code,
          eventName: ticket.event_name,
          checkedIn: Boolean(ticket.checked_in),
          voucherCode: ticket.voucher_code || null,
        }
      : null;
  const membership = groups.find(
    (group) => String(group.event_id) === String(currentEvent.id),
  );
  const team = membership
    ? requireData(await getHackerGroupById(membership.id))
    : null;
  return {
    user,
    team,
    isHacker: true,
    qrCode: ticketState?.code || user.code,
    ticket: ticketState,
    event: {
      start_date: currentEvent.start_date,
      end_date: currentEvent.end_date,
      is_open: currentEvent.is_open,
      event_id: currentEvent.id,
      registered,
      accepted,
      confirmed,
    },
  };
}
