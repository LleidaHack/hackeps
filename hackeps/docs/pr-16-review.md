# PR #16 review — 20 September 2026

Reviewed `13c0d0bd6f504de5ed341677c57464a3e71eac8c` against `fix-ui`.
The findings below are addressed by the follow-up commit, without merging the PR.

## Findings addressed

1. **P1 — SEO advertised the retired public domain.** `public/index.html:25-35`
   pointed Open Graph/Twitter URLs to `www.lleidahack.dev`; `public/sitemap.xml`
   and `public/robots.txt` directed crawlers there too. Canonical metadata was
   still missing despite the audit marking the metadata issue resolved. Public
   footers, the test banner and the event URL in the terms also used the old
   domain. These now use `https://hackeps.dev`. Live links use
   `https://live.hackeps.dev`, as confirmed by the owner. The unimplemented old
   Devpost shortcut was removed rather than replaced with another broken route.

2. **P2 — The sitemap described only the waiting build, even for full builds.**
   The new three-URL static sitemap omitted public full-site routes, and preview
   builds had no indexing distinction. The build now generates canonical and
   Open Graph metadata for each available public page, its sitemap, and noindex
   metadata for account pages and previews. Client-side navigation updates the
   metadata too. HTML metadata is generated, not the page body.

3. **P2 — pnpm build could not resolve the declared ESLint config.** After a
   frozen install, the checkout under the normal workspace failed with
   `Failed to load config "react-app" to extend from`. The initial build under
   `/tmp` succeeded, so that result alone was insufficient evidence. Declaring
   `eslint` and `eslint-config-react-app` directly fixes resolution without
   disabling lint or changing their already-locked versions. Both builds then
   passed in the workspace directory.

## Verification

- Original PR: 34 test suites / 93 tests passed.
- Follow-up: 36 test suites / 101 tests passed, including generated HTML,
  sitemap, waiting/full modes and both Vercel/custom preview noindex cases.
- Full production build and waiting preview build compile with ESLint enabled.
- Browser checks on locally served production assets with the PR's CSP:
  FAQ renders, canonical/OG URL identify the FAQ, and legacy `/hackeps/faq`
  preserves the query while redirecting to `/faq`. Waiting build renders its
  heading and redirects unavailable routes home.
- Generated HTML checked before JavaScript: distinct canonical URLs for home,
  terms and privacy; eight public full-site sitemap entries; three for waiting
  production (regression test), no entries for preview.
- No legacy public website URLs remain in `src/` or `public/`. Contact email
  addresses and the existing backend origin/CSP are intentionally separate.
- Browser checks did not authenticate, register users or send emails. The local
  static test server does not implement Vercel Analytics, so its analytics
  script request fails locally; this is not evidence of a production regression.
  Live API availability and authenticated flows were not certified by this review.

## Deployment follow-up

- On 20 September, `live.hackeps.dev` failed browser navigation with
  `ERR_NAME_NOT_RESOLVED`; configure DNS, TLS and the live hosting project.
- Keep `lleidahack.dev` and `www.lleidahack.dev` connected to the hosting project
  for permanent redirects. Repository redirects cannot change DNS. Equivalent
  host/path redirects are included for the optional nginx deployment.
- Build custom previews with `REACT_APP_INDEXING=0`. Vercel Preview environments
  are detected automatically; the `preview.hackeps.dev` host also receives
  `X-Robots-Tag: noindex` from Vercel.
- The existing CSP still permits the current backend under `*.lleidahack.dev`.
  A backend-origin migration requires updating CSP and backend CORS separately.
- Query-string verification/reset tokens and server-side logout revocation are
  still backend-contract limitations already disclosed in the original PR;
  this review does not claim they are resolved.
