# Install the JCDS website tests

This is an update for your existing `jcds-cypress-tests` repository. It replaces the demo tests with live-site checks. The default URL is https://jaxencreekdroneservices.com. No GitHub BASE_URL variable is required; if you previously set one, remove it or change it to that URL.

## Install on your Mac

1. Unzip `jcds-website-update.zip`. These commands assume the extracted `jcds-website-update` folder is in Downloads. Adjust the source path if needed.
2. Open your current project and review any uncommitted changes. Commit your existing schedule edits first if they aren't committed yet.

```bash
cd /Users/dpierce/projects/cypress-scheduled-starter
git status
```

3. Remove the two original demo specifications and copy the update:

```bash
git rm cypress/e2e/smoke/home.cy.ts cypress/e2e/regression/tasks.cy.ts
cp -R "$HOME/Downloads/jcds-website-update/." .
npm ci
npm run typecheck
npm run test:smoke
npm run test:regression
```

If you already removed the demo specifications, skip the `git rm` command. The unused demo directory can remain; the updated tests and workflows never start it. `test:local` now runs the live site directly.

4. Review and push:

```bash
git diff --stat
git diff -- .github/workflows/
git add .
git commit -m "Add live JCDS website smoke and regression tests"
git push
```

The push starts smoke checks. Run Cypress Regression manually in Actions afterward. The included replacement workflow files preserve 7:15 AM weekday smoke and 3:30 AM daily regression with America/Los_Angeles timezone. If you made other workflow customizations, merge those into these files before committing.

## Coverage

- Smoke: all six critical pages return HTML and display their expected heading over HTTPS.
- Regression: desktop navigation, mobile pet-search navigation, quote CTA, six Services section anchors, current lost-pet package prices/hours/discount, FAQ expand/collapse, pet-search request routing, request-form fields/options/acknowledgments, phone/email destinations, and three customer link defects observed during inspection.
- Smoke has 6 tests. Regression runs all specifications, including smoke, for 29 total tests.
- No inquiry is submitted, no file uploaded, and no telephone/email link is clicked. Form checks inspect fields and select a package without submitting. Email receipt, CAPTCHA, backend form validation, and service fulfillment are outside this production suite.
- Prices are intentionally asserted ($300/$500/$750). Update them when your business pricing changes.
- Tests use observed page headings, Squarespace semantic markup, and label relationships. They avoid dynamic IDs. They do not suppress JavaScript exceptions.
- Videos and screenshots can contain public page content. No private customer data is entered.

## Known website defects (expected regression failures until fixed)

1. Homepage hero **EXPLORE SERVICES →** links to `/contact`. Change it to `/services`.
2. Homepage **EXPLORE THERMAL →** links to `/services#thermal-services`. The actual section ID is `thermal-imaging`; change the link to `/services#thermal-imaging`.
3. Footer **(541) 406-0359** links to Squarespace. Change the footer link to `tel:5414060359`.

These are normal failing tests that identify real defects. They are not skipped or rewritten to accept the broken links. Fix the links in Squarespace, publish those changes, and rerun regression. This update does not edit the website.

## Validation completed here

- Inspected all six live pages through the browser, including the pet-request form markup and Services section IDs.
- Opened the no-guarantee FAQ and verified its answer and expanded state.
- Confirmed all three incorrect link destinations in the live DOM.
- TypeScript compilation passed; workflow YAML and package/lock metadata checked.
- Cypress execution is not verified here because the workspace's Cypress browser executable was unavailable. Your first local run validates the full suite against the live site. Existing successful demo runs do not count as validation of these new tests.

If a test fails beyond the three listed issues, send the failing test name and error. Keep assertions intact while we determine whether the cause is a website defect, third-party script failure, or selector change.
