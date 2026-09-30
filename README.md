# Scheduled Cypress + TypeScript starter

A self-contained demo suite with GitHub Actions smoke and regression workflows. No Cypress Cloud account or recording key is needed. This archive has not been published to a GitHub repository; schedules become active after you push it to your default branch and enable Actions.

## 1. Run it on your Mac

Install Node.js 24 LTS and Git, unzip this project, and open Terminal in the project folder:

```bash
npm ci
npm run typecheck
npm run test:local
```

`test:local` starts the demo, waits for it, runs all five tests, then stops the server. For only the two smoke tests:

```bash
npm run test:local:smoke
```

For interactive development, run `npm run demo` in one Terminal and `npm run cy:open` in another. The default headless local browser is Electron. To run Chrome, start the demo separately and run `npm run test:regression -- --browser chrome`.

## 2. Put it in GitHub

Create an empty repository named `cypress-scheduled-tests`. Do not initialize the remote with a README. In this project folder:

```bash
git init -b main
git add .
git commit -m "Add scheduled Cypress TypeScript starter"
git remote add origin https://github.com/YOUR_USERNAME/cypress-scheduled-tests.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. Authenticate through your usual Git credential manager or GitHub CLI; do not put tokens in source files.

The smoke workflow runs on the first push. Open **Actions**, choose **Cypress Regression**, select **Run workflow**, and use Chrome for the first manual check. Check the job logs and downloadable artifacts. GitHub must allow Actions in this repository.

## 3. Default schedules

| Suite | Triggers | Pacific time |
| --- | --- | --- |
| Smoke (2 tests) | Push and PR to main, manual, weekdays | 7:17 AM |
| Regression (all 5 tests) | Manual, daily | 3:37 AM |

Both workflows use `timezone: America/Los_Angeles`, keeping the local time consistent through daylight-saving changes. Edit `cron` in `.github/workflows/` to change the schedule. Scheduled workflows use the default branch and may be delayed or dropped under load. Public repository schedules can be disabled after 60 days without activity; re-enable them from Actions. These are test schedules, not a guaranteed uptime alerting service.

## 4. Notifications and results

- Enable GitHub Actions email notifications in your GitHub account's notification settings. Choose notifications for failed workflows if that option is shown. Scheduled notifications go to the user who last changed the cron schedule. Confirm delivery with a controlled failing test before relying on notifications.
- JUnit XML reports are uploaded after runs and retained for seven days.
- Screenshots of failing tests and videos are uploaded only when the job fails, retained for three days. Early setup failures may produce no browser artifacts.
- One CI retry is enabled. A test passing on retry can leave the job green; inspect logs for retry attempts.
- Optional Slack: configure an incoming webhook for your desired channel and add its URL as the repository Actions secret `SLACK_WEBHOOK_URL`. The script posts the run link on failed push, scheduled, or manual jobs. PR runs skip Slack. No webhook is included, and no notification has been sent during project creation.

## 5. Adapt it to your application

The supplied tests validate the bundled Task Board demo. Changing only the URL will not make them valid for another app. Replace the demo tests with your application's navigation, selectors, API routes, and assertions first.

For an already-hosted staging app, set the repository Actions variable `BASE_URL` under **Settings > Secrets and variables > Actions > Variables**. The workflow then skips the demo server. The app must be reachable from GitHub's hosted runner. For a repository-hosted app, replace `npm run demo` with its build/start command and keep an appropriate readiness URL.

Locally on macOS/Linux:

```bash
CYPRESS_BASE_URL=https://your-staging-app.example npm run test:regression
```

`.env.example` is documentation, not an automatically loaded environment file. For authentication, add test credentials as GitHub Actions secrets, map them into the test step's `env`, and implement your app's login flow. Keep credentials out of committed fixtures and logs. Example mappings:

```yaml
env:
  CYPRESS_TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
  CYPRESS_TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

Read credentials in your tests using the environment API supported by your installed Cypress version. The starter does not invent an application login flow.

Use `data-cy` selectors where you control the app. Keep tests independent, create unique test records, and clean up app data when adapting to a persistent environment. The demo stores tasks only in memory and resets on each visit.

## 6. Keep costs at zero

Standard GitHub-hosted runners are free for public repositories. Private repositories use your account's included minutes and storage; check the current allowance and set your Actions budget to block paid usage if you require a strict $0 limit. Other workflows share that allowance. Artifact storage can also incur charges; short retention helps. This starter uses one Linux job per run with a 20-minute timeout and no browser matrix. Enable additional browsers manually before expanding scheduled coverage.

## Validation and troubleshooting

See `VALIDATION.md` for checks performed in the creation environment. The first successful GitHub run is required to validate the complete hosted workflow.

- `npm ci` requires Node 22+; Node 24 is configured here.
- If Cypress binary installation fails, check network/proxy access to Cypress downloads, then run `npx cypress install` and `npx cypress verify`.
- Missing scheduled runs: confirm workflows are on the default branch, Actions is enabled, and the workflow isn't disabled.
- After dependency changes, run `npm install` and commit both `package.json` and `package-lock.json`.

Official references: [Cypress GitHub Actions](https://docs.cypress.io/app/continuous-integration/github-actions), [GitHub schedule events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule), [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
