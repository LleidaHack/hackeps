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
The local frontend now uses `REACT_APP_DOMAIN=http://localhost:8000` in its
ignored `.env` file. Copy `.env.sample` to `.env` for a new local checkout and
restart the frontend after changing environment variables. The API origin must
not include `/docs` or `/v1`.

Browser verification against the running local API:
- Sponsor tier requests return HTTP 200 without CORS errors.
- The event endpoint returns HTTP 404 because the local database has no event
  for the current year or earlier. The page shows its Catalan error message.
- Login with an intentionally nonexistent test account stays on the login page
  and displays the Catalan invalid-credentials message after the API rejects it.
- Authenticated profile, registration and successful password recovery remain
  unverified against the live API; they need suitable local fixtures. No accounts
  or events were seeded and no emails were sent.

The development server was started at `http://127.0.0.1:3016` using:

```sh
BROWSER=none HOST=127.0.0.1 PORT=3016 REACT_APP_LAUNCH_PENDING=0 pnpm start
```

Pending program content, dates, gallery photos and sponsors were not invented.
Hosting headers, staging noindex and social metadata require a separate deployment
configuration pass. Cookie-based authentication and server-side logout revocation
require backend work; the existing backend has no logout route. This change only
clears this app's local session and prevents a pending refresh from restoring it.
Public source maps alone were not treated as a critical vulnerability. The claimed
orange-on-white contrast issue does not apply to the dark signup page.

## Second pass (19 September 2026)

Closes the remaining items from `docs/AUDITORIA.md` (the September audit against
production), leaving only the ones that need backend or hosting decisions.

- Launch-pending routing: unknown paths redirect to `/` instead of rendering an
  empty page (`src/App.js`). On the full site, legacy `/hackeps/...` links are
  redirected to the same route without the prefix (`src/MainRoutes.js`).
  `public/sitemap.xml` lists only the routes that exist today.
- Hosting headers: `vercel.json` adds a Content-Security-Policy, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`;
  `nginx.conf` mirrors them for the Docker image. Font Awesome is now appended
  from `src/index.js` (full site only), which removes the inline `onload`
  handler the CSP would otherwise have to allow.
- Social metadata: absolute `og:url`/`og:image` (`public/og-image.png`,
  1200×630), `og:type`, `og:locale`, Twitter card; `manifest.json` and the PWA
  icons now describe HackEPS instead of the Create React App template.
- Waiting page: `<h1>HackEPS 2026</h1>` with the dates, calendar-accurate
  countdown (`src/modules/countdown.js`) against fixed edition dates in
  `src/config/edition.js`, a terminal message during and after the event
  instead of `0 mesos 0 dies 0 hores`, one tick per minute, singular labels,
  accessible name on the X link, `rel="noreferrer"` on every `target="_blank"`,
  and the castle no longer clipped by the text panel on large screens.
- `Button` defaults to `type="button"`, so a button inside a form only submits
  when it says `type="submit"`.
- Header image check no longer uses an always-true condition; Hero2 uses the
  2026 logo; decorative images carry `alt=""`; stray `console.log` removed.
- Dead code: 31 never-imported modules, 9 stylesheets and 4 images they alone
  referenced were deleted (all recoverable from git history).
- `.env.sample` matches the code (`REACT_APP_DEBUG` is compared to `"true"`,
  `REACT_APP_LAUNCH_PENDING` documented, unused `REACT_APP_API_KEY` removed).
- CI: `.github/workflows/ci.yml` at the repository root (GitHub ignores
  workflows under `hackeps/.github`) runs tests and both builds on pull
  requests; the three unreachable workflows were removed. `Dockerfile` builds
  the checked-out sources with pnpm and promotes every `REACT_APP_*` build
  argument to the environment.

Verified locally: 34 suites / 93 tests pass; both builds compile; the
waiting-page build redirects `/hackeps`, `/hackeps/faq` and `/login` to `/`
and renders the heading and countdown; the full-site build redirects
`/hackeps/faq` to `/faq` and loads Font Awesome with its integrity hash.

### Still open

- `resetPassword`, `resendVerification` and `verify` send the e-mail address or
  token as query parameters. Moving them to the JSON body needs the matching
  backend change first (`confirmResetPassword` already made that move).
- Server-side session revocation on logout needs a backend logout route.
- The Chrome "preloaded but not used" warning for the Space Mono files is
  cosmetic: each file is requested once and reports `status: loaded`.
- Cookie-based (`HttpOnly`) session storage is a backend/frontend contract
  change and is out of scope here.
