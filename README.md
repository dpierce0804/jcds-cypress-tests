# JCDS Cypress website tests

Scheduled production website checks for https://jaxencreekdroneservices.com.

```bash
npm ci
npm run typecheck
npm run test:smoke
npm run test:regression
```

`npm run cy:open` opens interactive Cypress. No local web server is needed.

Smoke checks six critical pages. Full regression runs 29 tests covering navigation,
mobile pet-search navigation, service anchors, pricing, FAQ behavior, contact links,
and pet-request form structure. No forms are submitted.

Workflows run smoke weekdays at 7:15 AM and regression daily at 3:30 AM Pacific,
with manual browser selection. Smoke also runs on pushes and pull requests to main.
A repository variable `BASE_URL` can override the target; leave it unset for JCDS.

JUnit reports are retained seven days; failure media three days. Optional Slack
uses the `SLACK_WEBHOOK_URL` Actions secret. Enable GitHub's Actions email
notifications in account settings if desired.

See [INSTALL-JCDS.md](INSTALL-JCDS.md) for the migration steps, three observed
website defects that currently cause regression failures, and validation limits.
