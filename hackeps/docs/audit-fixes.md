# Audit fixes on fix-ui

These changes address the confirmed functional findings in AUDIT_REPORT_FULL.md.
Code, comments and commit messages are English; user-facing feedback is Catalan.

## Implemented

- API requests fail predictably when the API URL is missing, the network is
  unavailable, or a server returns HTML. Errors use a consistent `errCode` /
  `errMssg` shape; caught exceptions are never returned as successful data.
- Authentication stores credentials only after a valid successful response.
  Login requires an explicit credential response instead of checking a stale
  localStorage value. Debug output excludes credentials and request bodies.
- Anonymous visitors do not refresh tokens. Concurrent refreshes share a request;
  an old refresh cannot resurrect a cleared session. Rejected refresh credentials
  are removed without deleting unrelated application settings.
- Protected routes redirect declaratively and preserve the requested destination.
- Contact, mentor applications and password recovery require `success: true`.
  Recovery uses neutral success feedback that does not expose account existence.
- Password-reset credentials are sent in a JSON body, matching the local backend
  on `refactor-backend`. Deploy this contract together with the backend change.
- Profile data loads using a resolved user ID. Team selection waits for both
  event and membership responses. Error objects cannot imply accepted status;
  stale responses are ignored after navigation or unmount.
- Sponsor loading no longer depends on a cached event. Empty artwork remains in
  place, but is not rendered as an unnamed button. Loaded sponsors have accessible
  names. Sponsor details do not retain a module-level image array.
- Signup displays the correct first/last-name errors, evaluates the birthday
  including its day, and applies the submitting state consistently. The existing
  minimum account age remains 14; event admission policy has not been changed.
- CV uploads display the selected filename and tolerate cancelling the picker.
- The mobile 404 action fits its container, and its text is Catalan. The Devpost
  link uses an absolute HTTPS URL.
- Countdown effects keep a stable interval and use the correct target and plural
  labels. The live-page logo carousel tolerates an unavailable company API.

## Local verification

- Full Jest suite: 25 suites, 62 tests passed, including API errors, malformed
  responses, credential validation, refresh/logout races, recovery feedback,
  protected routes, delayed event responses, age boundaries and countdowns.
- Production build with the full site enabled passes with existing project lint
  and toolchain warnings.
- Browser checks on localhost: the 404 action stays within a 320 px viewport;
  login and recovery show errors without reporting success when no backend is
  configured; an anonymous profile visit redirects to login.
- No real accounts, emails or applications were created during testing.

## Intentionally deferred

Per the project owner's instruction, no API endpoint is configured for preview
and no preview/Vercel deployment was inspected or changed in this implementation.
For a future local integration run, set REACT_APP_DOMAIN to the intended local
backend URL and restart the frontend. End-to-end behavior against a running
backend is not yet verified.

Pending program content, dates, gallery photos and sponsors were not invented.
Hosting headers, staging noindex and social metadata require a separate deployment
configuration pass. Cookie-based authentication and server-side logout revocation
require backend work; the existing backend has no logout route. This change only
clears this app's local session and prevents a pending refresh from restoring it.
Public source maps alone were not treated as a critical vulnerability. The claimed
orange-on-white contrast issue does not apply to the dark signup page.
