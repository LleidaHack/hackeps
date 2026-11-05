# HackEPS event operations

The sibling LleidaHackBackend owns operations and permissions. Start its `scripts/local-operations.sh`, then run from `hackeps/`:

```sh
BROWSER=none HOST=127.0.0.1 PORT=3001 REACT_APP_DOMAIN=http://localhost:8000 REACT_APP_ADMIN_URL=http://localhost:5175 pnpm start
```

Local accounts share `LocalDemo2026!`: `lleidahacker@example.test` opens `/organitzacio`; `participant1@example.test` opens the participant profile. Admin and superadmin also use the scanner, with management links and additional superadmin actions as permitted. Roles are distinct from account types and are enforced by the backend.

The scanner supports check-in, badge linking, one meal per round, activities, prize redemption and superadmin manual awards. Enter `DEMO001` or scan its QR; `VDEMO0001` is its demo badge. Reading a QR fills the code; the operator explicitly submits. The UI waits for server confirmation and retains the same operation UUID on network retries. Duplicates and insufficient balances are errors. Camera use requires browser permission and HTTPS or localhost; test it on real staff phones before an event.

Participant profiles show wallet history and prizes. Team leaders choose one challenge plus optional MLH. Presentation schedules are exposed when judging starts. Configure API and admin URLs explicitly in deployment; never point a deployed scanner to localhost.

Validation: production build and regression suite. Two existing mentor-form tests fail on both the unchanged base commit and this branch because the current mentor page is closed rather than displaying the old form. Actual phone-camera and mobile-push checks remain device acceptance tests.

Scanner pages reuse the existing `DarkPage` shell, including HomeHeader, HomeFooter and the edition decoration. Wallet and scanner controls use the same dark surfaces, orange accents, Space Mono type and four-pixel control corners as the participant area. Business behavior and permissions are unchanged by the visual integration.
