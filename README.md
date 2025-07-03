# Playwright POC

> A proof of concept showcasing the implementation of [Playwright](https://playwright.dev/) as a test framework to test the checkout flow for the ["Test Automation - Big Cartel E-commerce Test store"](https://testautomation.bigcartel.com/).

---
### Overview

> This repository demonstrates:

- Playwright Testing Framework to run tests locally.
- Test run reporting generated with:
  - [Built-in/Default Playwright HTML reporter](https://playwright.dev/docs/test-reporters)
  - [Allure reporter](https://allurereport.org/)
- CI/CD Integration / [GitHub workflow support](https://github.com/badj/playwright-poc/actions) executing tests in [Docker](https://www.docker.com/) with GitHub Actions triggered on push/pull requests to main and for daily scheduled runs:
  - [![Playwright Tests in Docker](https://github.com/badj/playwright-poc/actions/workflows/main.yml/badge.svg)](https://github.com/badj/playwright-poc/actions/workflows/main.yml)
  - [![Playwright Tests with Allure Report](https://github.com/badj/playwright-poc/actions/workflows/allure-report.yml/badge.svg)](https://github.com/badj/playwright-poc/actions/workflows/allure-report.yml)
     
  > Note: 
  > - The passing "Playwright Tests with Allure Report" workflow badge above is a false positive!
  > - Workflow has been manually disabled in the GitHub Actions until the issue can be resolved!
  > - Workflow runs without error in the workspace, generates the artefact, but it doesn't load the report data objects when the index.html is viewed in the downloaded artefact due to a "blocked by CORS policy" issue. 
  > - Using the allure command line tool to open and serve the report from the downloaded artefact root is failing as well, and will be investigated at a later stage. 
  > - WIP/Will update it at some stage to use GitHub Pages instead, as it's the best practice/works.

---
### Project information

> This project contains a Playwright functional journey test to verify multiple areas of the e-commerce checkout flow

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

1. [NodeJS installed](https://nodejs.org/en/download/)
2. [npm installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

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
### Run the Test locally and view the HTML report - Generated with the default Playwright HTML reporter:

1. Execute the test with
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

---
### Run the Test locally and view the Allure report - Generated with the Allure reporter:

1. Execute the test with
   ```bash
   npx playwright test
   ```
2. OR Execute the test with the UI
   ```bash
   npx playwright test --ui
   ``` 
3. Generate and view the HTML report when test execution completes - Report will be generated in [allure-report/index.html](allure-report/index.html)
   ```bash
   allure generate allure-results -o allure-report --clean 
   ```
4. Generate the report and open it automatically on the web server - Report will be generated in [allure-report/index.html](allure-report/index.html)
   ```bash
   allure generate allure-results -o allure-report --clean && allure open allure-report && echo "file://$(pwd)/allure-report/index.html" 
   ```   
- A hyperlink to the webserver will be printed to the terminal that link through to the generated report - sample output:

  ```
  Server started at <http://127.0.0.1:56217>. Press <Ctrl+C> to exit
  ```

---
