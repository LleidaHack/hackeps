const WEEKDAYS = ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"];

export default function ProfileHighlights({ event }) {
  const start = event?.start_date ? new Date(event.start_date) : null;
  const hasDate = start && !Number.isNaN(start.getTime());
  const month = hasDate ? start : new Date();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const offset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const end = event?.end_date ? new Date(event.end_date) : start;
  const dayStamp = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return (
    <div className="hacker-profile-highlights">
      <section
        className="hacker-profile-medals"
        aria-labelledby="profile-medals-title"
      >
        <h2 id="profile-medals-title">Medalles</h2>
        <svg
          viewBox="0 0 80 100"
          width="80"
          height="100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          aria-hidden="true"
        >
          <path d="M20 53v39l20-13 20 13V53" />
          <circle cx="40" cy="34" r="28" />
          <circle cx="40" cy="34" r="18" />
          <path d="m40 22 4 8 9 1-6 7 1 9-8-4-8 4 1-9-6-7 9-1Z" />
        </svg>
        <p>Les medalles encara no estan disponibles.</p>
      </section>
      <section
        className="hacker-profile-calendar"
        aria-labelledby="profile-calendar-title"
      >
        <h2 id="profile-calendar-title">
          {month.toLocaleDateString("ca", { month: "long" })}{" "}
          <small>{year}</small>
        </h2>
        <div className="profile-calendar-grid">
          {WEEKDAYS.map((day) => (
            <span className="profile-calendar-weekday" key={day}>
              {day}
            </span>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => {
            const date = new Date(year, monthIndex, i + 1);
            const active =
              hasDate &&
              dayStamp(date) >= dayStamp(start) &&
              dayStamp(date) <= dayStamp(end || start);
            return (
              <span
                key={i}
                className={
                  active ? "profile-calendar-event-day" : "profile-calendar-day"
                }
                aria-label={`${i + 1}${active ? ", HackEPS" : ""}`}
              >
                {i + 1}
              </span>
            );
          })}
        </div>
        <p>
          {hasDate
            ? "Dies de la HackEPS destacats en blanc."
            : "Dates de l’esdeveniment pendents."}
        </p>
      </section>
    </div>
  );
}
