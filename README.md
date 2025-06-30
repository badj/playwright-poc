# Playwright POC

## E-commerce checkout journey tests showcasing the use and implementation of [Playwright](https://playwright.dev/) as a Test Framework

---

> This repo contains Playwright tests for an e-commerce store checkout journey with assertions on the ["Test Automation - Big Cartel E-commerce Test store"](https://testautomation.bigcartel.com/) to showcase the Playwright Test Framework running locally or with [Docker](https://www.docker.com/) via [GitHub Actions](https://github.com/features/actions).

---

[![Playwright Tests in Docker](https://github.com/badj/Playwright-poc/actions/workflows/main.yml/badge.svg)](https://github.com/badj/Playwright-poc/actions/workflows/main.yml)

---

### Project information

> #### This project contains two Playwright functional journey tests for multiple specs to verify:
> - Searching for the item in the store
> - Viewing the product from the results returned in the search
> - Choosing colour option from a dropdown selection
> - Choosing age option from a dropdown selection
> - Increasing the quantity of items
> - Proceeding to the cart
> - Asserting and verifying items added to cart in the checkout cart for:
>    - *correct items*
>    - *options selected*
>    - *quantities*
>    - *cart item prices*
>    - *cart totals*

---

> #### CI/CD showcasing:
> - [GitHub workflow support](https://github.com/badj/Playwright-poc/actions) to the run the Playwright tests in a [Docker container](https://www.docker.com/) using [Github actions triggered on push/pull request to main and daily scheduled runs](.github/workflows/main.yml)

---

### Pre-requisites

1. [NodeJS installed](https://nodejs.org/en/download/)
2. [npm installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

---

### Install Playwright:

1. Initialize a Node.js project: 
```npm init -y```
2. Install Playwright: 
```npm i -D @playwright/test```
3. Install browsers: 
```npx playwright install```

---

### Run the Test and view the report:

1. Execute the test with: ```npx playwright test```
2. View the HTML report when test execution completed: ```npx playwright show-report```
3. Execute the test with the UI: ```npx playwright test --ui```

---
