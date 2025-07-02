# Playwright POC

> A proof of concept showcasing the implementation of [Playwright](https://playwright.dev/) as a test framework to test the checkout flow for the ["Test Automation - Big Cartel E-commerce Test store"](https://testautomation.bigcartel.com/).

---
### Overview

This repository demonstrates:

- Playwright Testing Framework to run tests locally with multiple browsers.
- CI/CD Integration / [GitHub workflow support](https://github.com/badj/playwright-poc/actions) executing tests in [Docker](https://www.docker.com/) with GitHub Actions triggered on push/pull requests to main and for daily scheduled runs:
  
  - [![Playwright Tests in Docker](https://github.com/badj/playwright-poc/actions/workflows/main.yml/badge.svg)](https://github.com/badj/playwright-poc/actions/workflows/main.yml)
  - [![Playwright Tests with Allure Report](https://github.com/badj/playwright-poc/actions/workflows/allure-report.yml/badge.svg)](https://github.com/badj/playwright-poc/actions/workflows/allure-report.yml)


---
### Project information

This project contains a Playwright functional journey test to verify multiple areas of the e-commerce checkout flow: 

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
### Run the Test and view the report:

1. Execute the test with
   ```bash
   npx playwright test
   ``` 
2. View the HTML report when test execution completes
   ```bash
   npx playwright show-report
   ``` 
3. Execute the test with the UI
   ```bash
   npx playwright test --ui
   ``` 

---
