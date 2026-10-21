/*********************************************************************************************************************
 * Builds the GitHub Pages site (site/) from the test run reports - used by .github/workflows/publish-reports.yml.
 *   site/index.html      → landing page with run details and links to each report
 *   site/health/         → Playwright AI Reporter - Test Health Report
 *   site/playwright/     → Playwright HTML report
 *   site/monocart/       → Monocart report
 *   site/allure/         → Allure report (Allure 3)
 *   site/jmeter/         → JMeter performance test dashboard
 * Reports are read from the paths below (where the test runs, or the publish workflow's artifact downloads, put them).
 * Run details come from the PW_* (Playwright Tests) and JM_* (JMeter) environment variables; reports that are missing are listed as unavailable.
 *********************************************************************************************************************/
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const site = path.join(root, 'site');

const groups = [
    {
        title: 'Functional tests',
        workflow: 'Playwright Tests',
        env: 'PW',
        reports: [
            { dir: 'health', title: 'Test Health Report', detail: 'Playwright AI Reporter - flaky detection, failure categories, trend and AI fixes', from: 'test-results/test-health-report.html', file: true },
            { dir: 'playwright', title: 'Playwright HTML Report', detail: 'Built-in Playwright report with steps, screenshots, videos and traces', from: 'playwright-report' },
            { dir: 'monocart', title: 'Monocart Report', detail: 'Monocart reporter - test results and run metrics', from: 'monocart-report' },
            { dir: 'allure', title: 'Allure Report', detail: 'Allure 3 report - test results, steps, attachments and environment', from: 'allure-report' },
        ],
    },
    {
        title: 'Performance tests',
        workflow: 'JMeter Performance Tests',
        env: 'JM',
        reports: [
            { dir: 'jmeter', title: 'JMeter Dashboard', detail: 'Apache JMeter load test dashboard - response times, throughput and errors', from: 'jmeter-results/dashboard' },
        ],
    },
];

fs.rmSync(site, { recursive: true, force: true });
fs.mkdirSync(site, { recursive: true });

for (const report of groups.flatMap((g) => g.reports)) {
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
const statusLabels = { success: 'Passed', failure: 'Failed', cancelled: 'Cancelled' };

function runDetails(group) {
    const v = (name) => process.env[`${group.env}_${name}`] || '';
    if (!v('RUN_NUMBER')) return `<p class="meta">${escape(group.workflow)} · no published run found</p>`;
    const status = v('STATUS').toLowerCase();
    const commit = v('SHA').slice(0, 7);
    const date = v('DATE') ? v('DATE').replace('T', ' ').slice(0, 16) + ' UTC' : '';
    return `<p class="meta">
      ${escape(group.workflow)} run <a href="${escape(v('RUN_URL') || '#')}">#${escape(v('RUN_NUMBER'))}</a>
      · <span class="status ${escape(status)}">${statusLabels[status] || 'Unknown'}</span>
      · ${escape(v('EVENT'))}${commit ? ` · commit <code>${escape(commit)}</code>` : ''}${date ? ` · ${escape(date)}` : ''}
    </p>`;
}

const sections = groups.map((group) => {
    const cards = group.reports.map((r) => r.available
        ? `<a class="card" href="${r.dir}/"><h3>${escape(r.title)}</h3><p>${escape(r.detail)}</p></a>`
        : `<div class="card unavailable"><h3>${escape(r.title)}</h3><p>Not available for this run</p></div>`).join('\n      ');
    return `<section>
    <h2>${escape(group.title)}</h2>
    ${runDetails(group)}
    <div class="cards">
      ${cards}
    </div>
  </section>`;
}).join('\n  ');

const published = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

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
    h2 { font-size: 1.2rem; margin: 32px 0 2px; }
    .meta { color: var(--muted); margin: 0 0 12px; }
    .meta a { color: var(--accent); }
    .status { font-weight: 600; }
    .status.success { color: var(--pass); }
    .status.failure { color: var(--fail); }
    .cards { display: grid; gap: 12px; }
    .card { display: block; background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; color: inherit; text-decoration: none; }
    a.card:hover { border-color: var(--accent); }
    .card h3 { font-size: 1.05rem; margin: 0 0 4px; color: var(--accent); }
    .card p { margin: 0; color: var(--muted); }
    .unavailable h3 { color: var(--muted); }
  </style>
</head>
<body>
  <main>
    <h1>Playwright POC Test Reports</h1>
    <p class="meta">Latest reports from the main branch · published ${published}</p>
  ${sections}
  </main>
</body>
</html>
`;

fs.writeFileSync(path.join(site, 'index.html'), html);
const built = groups.flatMap((g) => g.reports).filter((r) => r.available).map((r) => r.dir);
console.log(`[build-report-site] site/ built - ${built.join(', ') || 'no reports found'}`);
