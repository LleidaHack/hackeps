# HackEPS frontend

React (Create React App) site for HackEPS, LleidaHack's hackathon. The app
lives in this `hackeps/` directory; the repository root only holds the GitHub
workflows.

## Local development

```sh
cp .env.sample .env        # then set REACT_APP_DOMAIN to your API origin
pnpm install --frozen-lockfile
pnpm start                 # http://localhost:3000
```

Restart `pnpm start` after changing `.env`; every `REACT_APP_*` value is inlined
at build time and is therefore public in the bundle. Never put a secret there.

| Variable | Purpose |
|---|---|
| `REACT_APP_DOMAIN` | API origin, without `/v1` or `/docs`. |
| `REACT_APP_HACKEPS_YEAR` | Edition to load. See `docs/editions.md`. |
| `REACT_APP_LAUNCH_PENDING` | `1` publishes only the waiting page (`/`, `/terms`, `/privacy`; anything else redirects to `/`). `0` publishes the full site. |
| `REACT_APP_DEBUG` | `"true"` logs API responses (never credentials) to the console. |
| `REACT_APP_MAIN` | `0` shows the "test site" banner on the full site. |
| `REACT_APP_HERO_ANIMATED` | `1` plays the intro animation on the home page. |

## Scripts

- `pnpm start` — development server.
- `pnpm test` — Jest suite (`CI=true pnpm test` runs it once, without watch mode).
- `pnpm build` — production build in `build/`.
- `pnpm format` — Prettier over the whole project.

## Deployment

Production is deployed by **Vercel** from this directory. `vercel.json` sets
the security headers (Content-Security-Policy, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) and the
long-lived cache for hashed assets.

The CSP `connect-src` allows the app origin and `https://*.lleidahack.dev`.
If the API is served from another origin, add it there or every request
fails once deployed.

`Dockerfile` and `nginx.conf` are an optional self-hosted alternative that
mirrors the same headers:

```sh
docker build --build-arg REACT_APP_DOMAIN=https://api.example.com \
             --build-arg REACT_APP_LAUNCH_PENDING=0 -t hackeps .
docker run -p 8080:80 hackeps
```

## Continuous integration

`.github/workflows/ci.yml` (repository root) runs the test suite and builds
both the waiting page and the full site on every pull request and on pushes to
`main`. A Prettier check runs as an informational job until the pre-existing
unformatted files are formatted in a one-off commit.
