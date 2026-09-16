# HackEPS editions

Set `REACT_APP_HACKEPS_YEAR=2026` before building the frontend. The default is 2026.
Changing this build variable selects an edition; it does not create an event.

The site resolves `GET /v1/event/get_hackeps/{year}` and shares the request for one
minute across consumers. It rejects records from a different year. A missing
edition disables registration and shows unavailable dates; it never falls back
to an older event. Restart the frontend development server after changing `.env`.

An organizer must create or update the matching HackEPS event in the backend:

- `start_date`, `end_date`, `location`, `max_participants`, `max_group_size`, `is_open`.
- `schedule`: ordered objects with `title`, `description`, optional ISO `starts_at`.
- `activities`: ordered strings. Existing artwork placeholders remain when empty.

Use timezone offsets in timestamps (for example `+01:00` in November in Lleida).
The local 2026 record uses November 28–29 and 250 places; its existing clock times
were preserved and should be confirmed by the organizers.

## Sponsors

The home page and sponsor detail pages only show companies linked to the selected
event, using `GET /v1/event/{event_id}/sponsors`. Empty slots keep the LleidaHack
placeholder; no unrelated company is substituted.

Organizer-authenticated endpoints:

1. `PUT /v1/event/{event_id}/sponsors/{company_id}` links a company, copying its
   existing default tier once.
2. `PATCH /v1/event/{event_id}/sponsors/{company_id}` accepts
   `{"tier": 2, "display_order": 0}`. This changes that edition only.
3. `DELETE /v1/event/{event_id}/sponsors/{company_id}` unlinks it.

Existing tier values are preserved: 2 = gold, 1 = silver, 3 = bronze,
0 = collaborator. Lower `display_order` values appear first.

Apply backend migration `20260916_sponsors` with `uv run alembic upgrade head`
before deploying the updated backend. It snapshots existing company tiers onto
the event links and adds empty programme fields without removing existing data.
Local `install/local.py` applies migrations automatically on startup.

The visual assets for the tenth edition remain frontend assets; switching the
year does not redesign the website or change its anniversary artwork.
