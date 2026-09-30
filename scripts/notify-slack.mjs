const webhook = process.env.SLACK_WEBHOOK_URL;

if (!webhook) {
  console.log('Slack notification skipped: webhook not configured.');
  process.exit(0);
}

const status = process.env.RUN_STATUS || 'unknown';

const icons = {
  success: '✅',
  failure: '❌',
  cancelled: '⚪',
};

const icon = icons[status] || 'ℹ️';

const runUrl =
  `${process.env.GITHUB_SERVER_URL}/` +
  `${process.env.GITHUB_REPOSITORY}/actions/runs/` +
  `${process.env.GITHUB_RUN_ID}`;

const text = [
  `${icon} *${process.env.GITHUB_WORKFLOW}: ${status.toUpperCase()}*`,
  `Repository: ${process.env.GITHUB_REPOSITORY}`,
  `Branch: ${process.env.GITHUB_REF_NAME}`,
  `Trigger: ${process.env.GITHUB_EVENT_NAME}`,
  `Run: #${process.env.GITHUB_RUN_NUMBER}`,
  `<${runUrl}|View results, logs, and artifacts>`,
].join('\n');

try {
  const response = await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  console.log('Slack notification sent.');
} catch {
  // Avoid printing an error that might contain the webhook URL.
  console.error('Slack notification failed. Check webhook configuration.');
  process.exitCode = 1;
}