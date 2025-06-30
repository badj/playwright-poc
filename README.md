# Playwright POC

> A proof of concept showcasing the implementation of [Playwright](https://playwright.dev/) as a test framework testing the checkout flow for the ["Test Automation - Big Cartel E-commerce Test store"](https://testautomation.bigcartel.com/).

---

[![Playwright Tests in Docker](https://github.com/badj/Playwright-poc/actions/workflows/main.yml/badge.svg)](https://github.com/badj/Playwright-poc/actions/workflows/main.yml)

---
### Overview

This repository demonstrates:

- Playwright Testing Framework.
- **Local Execution**: Run tests locally with multiple browser options.
- **CI/CD Integration**: Executes tests in a [Docker container](https://www.docker.com/) via [GitHub Actions](https://github.com/badj/Playwright-poc/actions), triggered on push/pull requests to the main branch and daily scheduled runs.

---
### Project information

#### This project contains two Playwright functional journey tests for multiple specs to verify:
- Search for an item in the store.
- View a product from search results.
- Select color and age options from dropdowns.
- Increase item quantity.
- Proceed to the cart.
- Verify cart details, including:
    - Correct items.
    - Selected options.
    - Quantities.
    - Item prices and cart totals.

---
### CI/CD showcasing:
> - [GitHub workflow support](https://github.com/badj/Playwright-poc/actions) to the run the Playwright tests in a [Docker container](https://www.docker.com/) using [Github actions triggered on push/pull request to main and daily scheduled runs](.github/workflows/main.yml)

---
### Pre-requisites

1. [NodeJS installed](https://nodejs.org/en/download/)
2. [npm installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

---
### Setup

1. Clone or Download
    - Clone this repository: `git clone https://github.com/badj/Playwright-poc.git`
    - Alternatively, download the ZIP file and extract it.
2. Navigate to Project Directory:
   ```bash
   cd Playwright-poc
   ```
3. Initialize a Node.js project
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
### Run the Test and view the report:

1. Execute the test with
   ```bash
   npx playwright test
   ``` 
2. View the HTML report when test execution completed
   ```bash
   npx playwright show-report
   ``` 
3. Execute the test with the UI
   ```bash
   npx playwright test --ui
   ``` 

---
