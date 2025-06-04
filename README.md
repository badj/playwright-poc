# E-commerce checkout journey tests showcasing the use and implementation of [__Playwright__](https://playwright.dev/) as a __Test Framework__

> This repo contains Playwright tests for an e-commerce store checkout journey with assertions on the [__"Test Automation - Big Cartel E-commerce Test store"__](https://testautomation.bigcartel.com/) to showcase the Playwright Test Framework running locally or with Docker via GitHub Actions.

## Project information

### This project contains two Playwright functional journey tests for multiple specs to verify:

- Searching for the item in the store
- Viewing the product from the results returned in the search
- Choosing __colour__ option from a dropdown selection
- Choosing __age__ option from a dropdown selection
- __Increasing the quantity__ of items
- Proceeding to the __cart__
- Asserting and verifying items added to cart in the checkout cart for:
    - *correct items*
    - *options selected*
    - *quantities*
    - *cart item prices*
    - *cart totals*

### With specific Cypress configs and test code showcasing for:

- __[GitHub workflow support](https://github.com/badj/Playwright-poc/actions)__ with __[actions triggering on push/pull request to main and daily scheduled runs](.github/workflows/main.yml)__


## Pre-requisites

