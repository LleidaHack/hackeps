import { useEffect, useState } from "react";
import { getHackeps } from "src/services/EventService";
import { HACKEPS_YEAR } from "src/config/edition";

export function formatEditionDates(event) {
  if (!event?.start_date || !event?.end_date) return "Dates pendents de confirmar";
  const options = { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" };
  return new Intl.DateTimeFormat("ca", options).formatRange(new Date(event.start_date), new Date(event.end_date));
}

export function useEdition() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    Promise.resolve(getHackeps()).then(value => { if (active) setEvent(value?.id ? value : null); })
      .catch(() => { if (active) setEvent(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { event, loading, year: HACKEPS_YEAR, dates: formatEditionDates(event) };
}
