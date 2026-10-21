/*********************************************************************************************************************
 * Builds the GitHub Pages site (site/) from the test run reports - used by .github/workflows/main.yml.
 *   site/index.html      → landing page with run details and links to each report
 *   site/health/         → Playwright AI Reporter - Test Health Report
 *   site/playwright/     → Playwright HTML report
 *   site/monocart/       → Monocart report
 * Run details come from the RUN_* environment variables set by the workflow; reports that were not generated are listed as unavailable.
 *********************************************************************************************************************/
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const site = path.join(root, 'site');

const reports = [
    { dir: 'health', title: 'Test Health Report', detail: 'Playwright AI Reporter - flaky detection, failure categories, trend and AI fixes', from: 'test-results/test-health-report.html', file: true },
    { dir: 'playwright', title: 'Playwright HTML Report', detail: 'Built-in Playwright report with steps, screenshots, videos and traces', from: 'playwright-report' },
    { dir: 'monocart', title: 'Monocart Report', detail: 'Monocart reporter - test results and run metrics', from: 'monocart-report' },
];

fs.rmSync(site, { recursive: true, force: true });
fs.mkdirSync(site, { recursive: true });

for (const report of reports) {
    const source = path.join(root, report.from);
    const target = path.join(site, report.dir);
    report.available = fs.existsSync(source);
    if (!report.available) continue;
    if (report.file) {
        fs.mkdirSync(target, { recursive: true });
        fs.copyFileSync(source, path.join(target, 'index.html'));
    } else {
        fs.cpSync(source, target, { recursive: true });
    }
}

const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const env = process.env;
const status = (env.RUN_STATUS || 'unknown').toLowerCase();
const statusLabel = { success: 'Passed', failure: 'Failed', cancelled: 'Cancelled' }[status] || 'Unknown';
const commit = (env.COMMIT_SHA || '').slice(0, 7);
const generated = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

const cards = reports.map((r) => r.available
    ? `<a class="card" href="${r.dir}/"><h2>${escape(r.title)}</h2><p>${escape(r.detail)}</p></a>`
    : `<div class="card unavailable"><h2>${escape(r.title)}</h2><p>Not generated in this run</p></div>`).join('\n      ');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Playwright POC Test Reports</title>
  <style>
    :root { --bg: #f6f7f9; --card: #fff; --text: #1d2330; --muted: #5d6675; --border: #dde1e7; --accent: #2b6cb0; --pass: #1f7a3f; --fail: #b42318; }
    @media (prefers-color-scheme: dark) { :root { --bg: #14171c; --card: #1d2128; --text: #e6e9ee; --muted: #9aa3b1; --border: #2e343e; --accent: #7cb3ec; --pass: #5fc983; --fail: #f97066; } }
    body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
    main { max-width: 760px; margin: 0 auto; padding: 32px 16px; }
    h1 { font-size: 1.6rem; margin: 0 0 4px; }
    .meta { color: var(--muted); margin: 0 0 24px; }
    .meta a { color: var(--accent); }
    .status { font-weight: 600; }
    .status.success { color: var(--pass); }
    .status.failure { color: var(--fail); }
    .cards { display: grid; gap: 12px; }
    .card { display: block; background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; color: inherit; text-decoration: none; }
    a.card:hover { border-color: var(--accent); }
    .card h2 { font-size: 1.1rem; margin: 0 0 4px; color: var(--accent); }
    .card p { margin: 0; color: var(--muted); }
    .unavailable h2 { color: var(--muted); }
  </style>
</head>
<body>
  <main>
    <h1>Playwright POC Test Reports</h1>
    <p class="meta">
      Latest run <a href="${escape(env.RUN_URL || '#')}">#${escape(env.RUN_NUMBER || '?')}</a>
      · <span class="status ${escape(status)}">${statusLabel}</span>
      · ${escape(env.EVENT_NAME || 'local')}${commit ? ` · commit <code>${escape(commit)}</code>` : ''}
      · ${generated}
    </p>
    <div class="cards">
      ${cards}
    </div>
  </main>
</body>
</html>
`;

fs.writeFileSync(path.join(site, 'index.html'), html);
console.log(`[build-report-site] site/ built - ${reports.filter((r) => r.available).map((r) => r.dir).join(', ') || 'no reports found'}`);
