# Playwright POC

> A proof of concept showcasing the implementation of [Playwright](https://playwright.dev/) as a test framework to test the checkout flow for the ["Test Automation - Big Cartel E-commerce Test store"](https://testautomation.bigcartel.com/).

---
### Table of contents


- [Overview](https://github.com/badj/playwright-poc/README.md#overview)
- [Project information](https://github.com/badj/playwright-poc/README.md#project-information)
- [Pre requisites](https://github.com/badj/playwright-poc/README.md#pre-requisites)
- [Setup](https://github.com/badj/playwright-poc/README.md#setup)
- [Run tests and generate the test run report to view test results](https://github.com/badj/playwright-poc/README.md#run-tests-and-generate-the-test-run-report-to-view-the-test-results)
  - [Test run with Playwright HTML report generation](https://github.com/badj/playwright-poc/README.md#test-run-with-playwright-html-report-generation)
  - [Test run with Monocart report generation](https://github.com/badj/playwright-poc/README.md#test-run-with-monocart-report-generation)
  - [Test run with Allure report generation](https://github.com/badj/playwright-poc/README.md#test-run-with-allure-report-generation)
- [Gotchas](https://github.com/badj/playwright-poc/README.md#gotchas)

---


### Overview

This repository demonstrates: 
 - Playwright Testing Framework to run tests locally. 
 - Test run reporting generated with:
   - [Built-in/Default Playwright HTML reporter](https://playwright.dev/docs/test-reporters)
   - [Monocart reporter](https://github.com/cenfun/monocart-reporter)
   - [Allure reporter](https://allurereport.org/)
 - CI/CD Integration for [GitHub workflow support](https://github.com/badj/playwright-poc/actions) executing tests in [Docker](https://www.docker.com/) with GitHub Actions triggered on push/pull requests to main and for daily scheduled runs:
   - [![Playwright Tests in Docker](https://github.com/badj/playwright-poc/actions/workflows/main.yml/badge.svg)](https://github.com/badj/playwright-poc/actions/workflows/main.yml)
   - [![Playwright Tests with Allure Report](https://github.com/badj/playwright-poc/actions/workflows/allure-report.yml/badge.svg)](https://github.com/badj/playwright-poc/actions/workflows/allure-report.yml) 
    
   >   - The passing workflow for **"Playwright Tests with Allure Report"**  is a false positive *(failing issues listed below)*, the workflow has been disabled in GitHub Actions until the issue can be resolved!
   >   - Current Issues: 
   >     - Workflow runs without error in the workspace, generates the artefact, but it doesn't load the report data objects when the index.html is viewed in the downloaded artefact due to a `blocked by CORS policy` issue. 
   >     - Using the allure command line tool to open and serve the report from the downloaded artefact root is failing as well, and will be investigated at a later stage.
   >   - TODO:
   >     - Will be updated at some stage to use GitHub Pages instead to resolve the issue.

---
### Project information

> This project repo contains a functional journey test to verify multiple areas of the e-commerce checkout flow

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

---
### Pre-requisites

1. [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
2. [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) (Included with Node.js)


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
- A hyperlink to the webserver will be printed to the terminal that link through to the generated report - sample output:

  ```
  Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.
  ```

#### Test run with Monocart report generation

1. Execute the test
   ```bash
   npx playwright test
   ```
2. Generate and view the HTML report when test execution completes - The Report open automatically and generated in [monocart-report/index.html](monocart-report/index.html)
   ```bash
   npx monocart show-report monocart-report/index.html
   ```
- A hyperlink to the webserver will be printed to the terminal that link through to the generated report - sample output:

  ```
  serve dirs [ 'monocart-report', './' ]
  7/8/2025, 10:26:33 PM server listening on http://localhost:8090/index.html
  ```   

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
- A hyperlink to the webserver will be printed to the terminal that link through to the generated report - sample output:

  ```
  Server started at <http://127.0.0.1:56217>. Press <Ctrl+C> to exit
  ```

---

### Gotcha's:

**1. Installing Playwright using `npm i -D @playwright/test` failing due to an unsupported Node.js version**

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

**Additional steps if steps above steps do not resolvce it:**

6. Clear npm Cache and Reinstall Dependencies → The error may be caused by a corrupted npm cache or incomplete dependency installation
> This ensures a clean slate for dependency installation, avoiding issues from cached or corrupted files.
```bash
  npm cache clean --force
```
7. Remove the node_modules directory and package-lock.json → Navigate to the project directory
> Change to the playwright-poc project directory (example for macOS)*:
```bash
  cd /Users/badj/Documents/Git/playwright-poc
```
8. Remove the node_modules directory and package-lock.json file:
```bash
  rm -rf node_modules package-lock.json
```
9. Reinstall dependencies:
```bash
  npm install
```

---
