# Playwright POC

> A proof of concept to showcase the implementation of [Playwright](https://playwright.dev/) as a test framework with multiple test reporters *([Monocart](https://github.com/cenfun/monocart-reporter), [Allure](https://allurereport.org/) and [Playwright AI Reporter](https://github.com/deepakkamboj/playwright-ai-reporter))* that test the checkout flow and [Apache JMeter](https://jmeter.apache.org/) load test integration to measure performance for the ["Test Automation - Big Cartel E-commerce Test store"](https://testautomation.bigcartel.com/).

---
### Table of contents


- [Overview](#overview)
- [Project information](#project-information)
- [Pre requisites](#pre-requisites)
- [Setup](#setup)
- [Run tests and generate the test run report to view test results](#run-tests-and-generate-the-test-run-report-to-view-the-test-results)
  - [Test run with Playwright HTML report generation](#test-run-with-playwright-html-report-generation)
  - [Test run with Monocart report generation](#test-run-with-monocart-report-generation)
  - [Test run with Allure report generation](#test-run-with-allure-report-generation)
  - [Test run with Playwright AI Reporter - Test Health Report generation](#test-run-with-playwright-ai-reporter---test-health-report-generation)
  - [Published test reports on GitHub Pages](#published-test-reports-on-github-pages)
  - [JMeter Load Test Integration to measure performance](#jmeter-load-test-integration-to-measure-performance) 
- [Gotcha's](#gotchas)
  - [1 - Installing Playwright failing due to an unsupported Node.js version](#1-installing-playwright-failed-due-to-an-unsupported-nodejs-version)
- [TODO / Current Issues](#to-do--current-issues)

---


### Overview

This repository demonstrates: 
 - The Playwright Testing Framework to run tests locally. 
 - Test run reporting generated with:
   - [Built-in/Default Playwright HTML reporter](https://playwright.dev/docs/test-reporters)
   - [Monocart reporter](https://github.com/cenfun/monocart-reporter)
   - [Allure reporter](https://allurereport.org/)
   - [Playwright AI Reporter](https://github.com/deepakkamboj/playwright-ai-reporter) - Test Health Report with flaky test detection, run trends and optional AI-powered failure analysis *(Anthropic Claude)*
 - CI/CD Integration for [GitHub workflow support](https://github.com/badj/playwright-poc/actions) executing tests in [Docker](https://www.docker.com/) with GitHub Actions triggered on push/pull requests to main and for daily scheduled runs:
   - [![Playwright Tests in Docker](https://github.com/badj/playwright-poc/actions/workflows/main.yml/badge.svg)](https://github.com/badj/playwright-poc/actions/workflows/main.yml)
   - [![Playwright Tests with Allure Report](https://github.com/badj/playwright-poc/actions/workflows/allure-report.yml/badge.svg)](https://github.com/badj/playwright-poc/actions/workflows/allure-report.yml)
   >   - The passing workflow for **"Playwright Tests with Allure Report"** is currently a false positive *(failing issues listed below)*, the workflow has been disabled in GitHub Actions until the issue can be resolved!
   >   - Current Issues: 
   >     - Workflow runs without error in the workspace, generates the artefact, but it doesn't load the report data objects when the index.html is viewed in the downloaded artefact due to a `blocked by CORS policy` issue. 
   >     - Using the allure command line tool to open and serve the report from the downloaded artefact root is failing as well and will be investigated at a later stage.
   >     - ✅ **Resolved with GitHub Pages:** the Allure report is now generated with Allure 3 in the **"Playwright Tests in Docker"** workflow and published to [https://badj.github.io/playwright-poc/allure/](https://badj.github.io/playwright-poc/allure/), where it loads without the CORS issue. The disabled workflow is kept for reference.
   - 🔗 **Latest test reports published on GitHub Pages:** [https://badj.github.io/playwright-poc/](https://badj.github.io/playwright-poc/)
   - [![JMeter Performance Tests in Docker](https://github.com/badj/playwright-poc/actions/workflows/jmeter-load-test.yml/badge.svg)](https://github.com/badj/playwright-poc/actions/workflows/jmeter-load-test.yml)

[_⇡ Return to the Table of Contents_](#table-of-contents)

---
### Project information

> This project repo contains a functional journey test verifying multiple areas of the e-commerce checkout flow

- Search for an item in the store.
- View a product from the search results.
- Select colour and age options from the dropdowns.
- Increase item quantity.
- Proceed to the cart.
- Verify cart details, including:
    - Correct items.
    - Selected options.
    - Quantities.
    - Item prices and cart totals.

[_⇡ Return to the Table of Contents_](#table-of-contents)

---
### Pre-requisites

1. [Node.js](https://nodejs.org/en/download/) (LTS version recommended - **v22 or higher** is required by the Playwright AI Reporter)
2. [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) (Included with Node.js)

[_⇡ Return to the Table of Contents_](#table-of-contents)

---
### Setup

1. Clone or Download
    - Clone this repository: `git clone https://github.com/badj/playwright-poc.git`
    - Alternatively, download the ZIP file and extract it.
2. Navigate to Project Directory:
   ```bash
   cd playwright-poc
   ```
3. Initialise a Node.js project
   ```bash
   npm init -y
   ```
4. Install Playwright
   ```bash
   npm i -D @playwright/test
   ```
5. Install browsers
   ```bash
   npx playwright install
   ``` 

[_⇡ Return to the Table of Contents_](#table-of-contents)

---
### Run tests and generate the test run report to view the test results

#### Test run with Playwright HTML report generation

1. Execute the test
   ```bash
   npx playwright test
   ```
2. OR Execute the test with the UI
   ```bash
   npx playwright test --ui
   ``` 
3. View the HTML report when test execution completes - Command will print to the terminal
   ```bash
   npx playwright show-report
   ```
- A hyperlink to the web server will be printed to the terminal that links through to the generated report - sample output:

  ```
  Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.
  ```

[_⇡ Return to the Table of Contents_](#table-of-contents)

#### Test run with Monocart report generation

1. Execute the test
   ```bash
   npx playwright test
   ```
2. Generate and view the HTML report when test execution completes - The Report opens automatically and is generated in [monocart-report/index.html](monocart-report/index.html)
   ```bash
   npx monocart show-report monocart-report/index.html
   ```
- A hyperlink to the web server will be printed to the terminal that links through to the generated report - sample output:

  ```
  serve dirs [ 'monocart-report', './' ]
  7/8/2025, 10:26:33 PM server listening on http://localhost:8090/index.html
  ```   

[_⇡ Return to the Table of Contents_](#table-of-contents)

#### Test run with Allure report generation

1. Execute the test
   ```bash
   npx playwright test
   ```
2. Generate and view the HTML report when test execution completes - Report will be generated in [allure-report/index.html](allure-report/index.html)
   ```bash
   allure generate allure-results -o allure-report --clean 
   ```
3. OR Generate the report and open it automatically on the web server - Report will be generated in [allure-report/index.html](allure-report/index.html)
   ```bash
   allure generate allure-results -o allure-report --clean && allure open allure-report && echo "file://$(pwd)/allure-report/index.html" 
   ```   
- A hyperlink to the web server will be printed to the terminal that links through to the generated report - sample output:

  ```
  Server started at <http://127.0.0.1:56217>. Press <Ctrl+C> to exit
  ```
4. OR Generate and open the report with **Allure 3** *(installed as a project dev dependency - no Java or Allure CLI install required)* - this is what CI uses to publish the [Allure report on GitHub Pages](https://badj.github.io/playwright-poc/allure/)
   ```bash
   npx allure generate allure-results -o allure-report --open
   ```
- ⚠️ The `allure-results` directory is not cleared between local runs, so the report includes all previous runs and can grow very large - clear it for a report of the latest run only:
   ```bash
   rm -rf allure-results && npx playwright test
   ```
[_⇡ Return to the Table of Contents_](#table-of-contents)

#### Test run with Playwright AI Reporter - Test Health Report generation

> [Playwright AI Reporter](https://github.com/deepakkamboj/playwright-ai-reporter) generates a single self-contained HTML **Test Health Report** *(no web server needed)* and can optionally use AI to analyse test failures and suggest fixes.

- **What the report contains:**
  - Run brief with pass/fail/retry/skip outcome tiles and an investigation worklist.
  - **Flaky test detection** - each test that did not pass first time is labelled *Flaky*, *New failure* or *Known failure*, based on retries and the run history.
  - Failure categories *(e.g. "Element not ready", "Assertion timing")*, shared error signatures, embedded screenshots and trace links.
  - Run trend, slowest tests and worker activity.
  - **AI fixes** *(optional)* - root cause analysis and a suggested corrected test file for each failing test.
- **Configuration** is in [playwright.config.ts](playwright.config.ts) - AI analysis is **off** unless the `AI_PROVIDER` environment variable is set.
- A short summary is also printed to the terminal at the end of every run *(slowest tests, failures with their category and stack trace)*.

1. Execute the test
   ```bash
   npx playwright test
   ```
2. Open the report when test execution completes - Report is generated in [test-results/test-health-report.html](test-results/test-health-report.html)
   ```bash
   open test-results/test-health-report.html
   ```
- The report location is printed to the terminal - sample output:

  ```
  ✓ Generated standalone report: /[path to your repo]/playwright-poc/test-results/test-health-report.html
  ```
- Run history *(last 30 runs, used for flaky detection and the trend)* is kept in `ai-reporter-results/history.json` *(git ignored)*, because Playwright empties `test-results/` before every run.

**Optional - run with AI failure analysis (Anthropic Claude):**

> ⚠️ When AI analysis is enabled, the source code and error of each failing test are sent to Anthropic. AI analysis only runs when a test fails - a passing run makes no AI calls and costs nothing.

1. Create an API key in the [Claude Console](https://platform.claude.com) *(Settings → API Keys → Create Key → "Default workspace")* - the API needs credits, and some Claude plans include monthly API credits.
2. Create a `.env` file in the repo root *(git ignored - never commit it)*:
   ```bash
   ANTHROPIC_API_KEY=[your API key]
   ANTHROPIC_MODEL=claude-sonnet-5-5
   ```
3. Execute the tests with the AI provider enabled
   ```bash
   AI_PROVIDER=anthropic npx playwright test
   ```
4. The AI analysis is shown in the **AI fixes** tab of the report and saved to `test-results/fixes/` - always review AI suggested fixes before applying them.

- ⚠️ **Reporter patch:** the reporter *(v0.1.3)* always sends a `temperature` parameter, which current Claude models reject with `400: temperature is deprecated for this model`. The [scripts/patch-ai-reporter.js](scripts/patch-ai-reporter.js) `postinstall` script patches this automatically on every `npm install` / `npm ci` - remove it once the issue is fixed in the reporter.

**CI/CD - GitHub Actions ([main.yml](.github/workflows/main.yml)):**

- 🔗 **View the latest reports online:** [https://badj.github.io/playwright-poc/](https://badj.github.io/playwright-poc/) - see [Published test reports on GitHub Pages](#published-test-reports-on-github-pages).
- Every run uploads the report as the **`test-health-report`** artifact *(alongside the `monocart-report` and `playwright-report` artifacts)* - download it from the workflow run page in GitHub Actions and open `test-health-report.html`.
- A test summary is written to the workflow run's **job summary** page.
- The run history is cached between runs, so flaky detection and the trend build up across the daily scheduled runs.
- AI analysis in CI runs only when the `ANTHROPIC_API_KEY` repository secret is set, and never on pull requests. To enable it:
  ```bash
  gh secret set ANTHROPIC_API_KEY --repo badj/playwright-poc
  ```
- If the secret is not set or the API credits run out, the report is still generated without the AI analysis, and the test run result is not affected.

[_⇡ Return to the Table of Contents_](#table-of-contents)

#### Published test reports on GitHub Pages

> 🔗 **[https://badj.github.io/playwright-poc/](https://badj.github.io/playwright-poc/)** - the reports from the latest CI run on `main`, viewable in the browser without downloading artifacts.

- The landing page shows the latest run number *(linked to the GitHub Actions run)*, pass/fail status, trigger and commit, with links to:
  - [Test Health Report](https://badj.github.io/playwright-poc/health/) *(Playwright AI Reporter)*
  - [Playwright HTML Report](https://badj.github.io/playwright-poc/playwright/)
  - [Monocart Report](https://badj.github.io/playwright-poc/monocart/)
  - [Allure Report](https://badj.github.io/playwright-poc/allure/) *(generated with [Allure 3](https://allurereport.org/docs/v3/) - npm based, no Java required)*
- Published by the `deploy-reports` job in [main.yml](.github/workflows/main.yml) after every daily scheduled run, push to `main` and manual run - **pull request runs are never published**.
- The reports are published even when tests fail, so failures can be investigated from the link.
- Each run replaces the previous one - only the latest run is published. Reports from older runs are available as artifacts on each workflow run *(kept for 2 days)*.
- The site is built by [scripts/build-report-site.js](scripts/build-report-site.js) - to preview it locally after a test run:
  ```bash
  node scripts/build-report-site.js && open site/index.html
  ```
- ⚠️ This is a public repository, so the published reports are public too.

[_⇡ Return to the Table of Contents_](#table-of-contents)

#### JMeter load test integration to measure performance

- [A JMeter load tests integration workflow has been integrated to measure site performance](.github/workflows/jmeter-load-test.yml)
- The Jmeter load tests are located in the [performance-tests](performance-tests) directory in [performance-tests/load-test.jmx](performance-tests/load-test.jmx):
> ⚠️ Thread Group configurations were set to low values to reduce the impact of the load test on the e-commerce store where Cloudflare could potentially throttle the requests!
  - **Thread Group configurations for the tests:**
    - Thread Group number of threads: 3
    - Thread Group ramp time: 10 seconds
    - Thread Group same user on next iteration: true
    - Thread Group on sample error: continue
    - Loop Controller loops: 1
    - Loop Controller continue forever: false
    - ⚠️ Keep thread group configurations set to the original low values to reduce the impact of the load test on the e-commerce store to prevent Cloudflare new request throttling!
- **The workflow:** 
  - Runs daily at 10:30 am NZT (UTC+12). 
  - "on push and pull_request" to branches "main" disabled (⚠️ Caused Cloudflare security check issues that made the Playwright tests fail - keep disabled!)
  - Installs JMeter. 
  - Executes the JMeter load tests against the ["Test Automation - Big Cartel E-commerce Test store"](https://testautomation.bigcartel.com/) Landing page, Products page and Cart page.
  - Jmeter tests Generate a dashboard (HTML report) and .jtl results. 
  - Uploads artifacts for review (view in GitHub Actions UI). 
  - Prints a summary for quick analysis (e.g., avg response time, error rate).
- ⚠️ **Run the JMeter tests locally:**
  - [Download and install Java 8+ installed (JMeter requires it) from Oracle Downloads](https://www.oracle.com/java/technologies/downloads/)
  - [Download and install Apache JMeter (latest version) from JMeter Apache](https://jmeter.apache.org/download_jmeter.cgi)
  - Unzip it and run bin/jmeter.bat (Windows) or bin/jmeter (macOS/Linux). 
  - Open the JMeter GUI and load the test plan from [performance-tests/load-test.jmx](performance-tests/load-test.jmx). 
  - ⚠️ Keep thread group configurations set to the original low values to reduce the impact of the load test on the e-commerce store to prevent Cloudflare new request throttling!

[_⇡ Return to the Table of Contents_](#table-of-contents)

---

### Gotcha's

#### 1. Installing Playwright failed due to an unsupported Node.js version

> Installing Playwright using `npm i -D @playwright/test` failing due to an unsupported Node.js version.
> Your current Node.js version is older than the recommended LTS version.
> Playwright requires a more recent version of Node.js. As of Playwright v1.54.1, the minimum supported Node.js version is typically Node.js 16 or higher.

**To resolve the issue:**

1. Update Node.js using nvm (Node Version Manager) - Install Node.js 18 (LTS) or a newer version like 20
```bash
  nvm install 18
```
2. Switch to the new version
```bash
  nvm use 18
```
3. Set it as the default version
```bash
  nvm alias default 18
```
4. Verify the Node.js version - Ensure it’s at least v16 or higher.
```bash
  node -v
```
5. Verify npm version:
```bash
  npm -v
```

**Additional steps if the steps above do not resolve it:**

6. Clear npm Cache and Reinstall Dependencies → The error may be caused by a corrupted npm cache or incomplete dependency installation
> This ensures a clean slate for dependency installation, avoiding issues from cached or corrupted files.
```bash
  npm cache clean --force
```
7. Remove the node_modules directory and package-lock.json → Navigate to the project directory
> Change to the playwright-poc project directory (example for macOS)*:
```bash
  cd [path to your repo]/playwright-poc
```
8. Remove the node_modules directory and package-lock.json file:
```bash
  rm -rf node_modules package-lock.json
```
9. Reinstall dependencies:
```bash
  npm install
```

[_⇡ Return to the Table of Contents_](#table-of-contents)

---

### TO DO / Current Issues

#### 1. Tests falling: 

1. 🚧 ["Add to cart" AJAX/XHR blocked by Cloudflare - FIREFOX](https://github.com/badj/playwright-poc/issues/4)
2. 🚧 [Playwright tests for checkout and cart pages loading/triggering Cloudflare security checks - FIREFOX](https://github.com/badj/playwright-poc/issues/6)

[_⇡ Return to the Table of Contents_](#table-of-contents)

---
