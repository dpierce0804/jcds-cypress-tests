const webhook = process.env.SLACK_WEBHOOK_URL;
if (!webhook) {
  console.log('Slack notification skipped: no webhook configured.');
  process.exit(0);
}
const url = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
const response = await fetch(webhook, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: `Cypress ${process.env.TEST_SUITE} failed in ${process.env.GITHUB_REPOSITORY}. View run: ${url}` }),
  signal: AbortSignal.timeout(10000),
});
if (!response.ok) throw new Error(`Slack notification failed: HTTP ${response.status}`);
