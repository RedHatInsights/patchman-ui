[![Build Status](https://img.shields.io/github/actions/workflow/status/RedhatInsights/patchman-ui/test.yml?branch=master)](https://github.com/RedHatInsights/patchman-ui/actions/workflows/test.yml)
[![GitHub release](https://img.shields.io/github/v/release/RedHatInsights/patchman-ui.svg)](https://github.com/RedHatInsights/patchman-ui/releases/latest)
[![codecov](https://codecov.io/gh/RedHatInsights/patchman-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/patchman-ui)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Patchman UI

Patch is one of the applications for console.redhat.com. It allows users to display and manage available patches for
their registered systems. This repository contains source code for the frontend part of the application which uses the
REST API available from [Patchman Engine](https://github.com/RedHatInsights/patchman-engine).

## First time setup

1. Make sure you have [`Node.js`](https://nodejs.org/en/) version >= 18 installed.
2. Run [script to patch your
   `/etc/hosts`](https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh)
3. Make sure you are using [Red Hat proxy](https://hdn.corp.redhat.com/proxy.pac) if working against the stage
   environment.

## Running locally

1. Make sure you are connected to the Red Hat VPN
2. Install dependencies with `npm install`
3. Run development server with `npm run start` and select desired environment (`stage-preview` is recommended)
4. Local version of the app will be available at URL printed out to the
   console (https://stage.foo.redhat.com:1337/preview/insights/patch/ if you selected `stage-preview`)

## Testing

[Playwright](https://playwright.dev/) and [Jest](https://jestjs.io/) are used as our testing frameworks.

### Unit tests: Jest

- `npm run lint` - run the linter.
- `npm run test` - run all Jest tests.
- `npm run coverage` - generate coverage information from Jest tests after running them.

### E2E (UI & Integration) tests: Playwright

The E2E tests are located in the [playwright/](playwright/) directory and are identified by the `*.spec.ts` file
extension.
All the helpers live in the [test-utils](playwright/test-utils/) directory.

#### First time setup

1. Copy the [example env file](playwright_example.env) content and create a file named `.env` in the root directory of
   the project. Paste the example file content into it. For local development fill in the following variables:
    * `BASE_URL` - `https://stage.foo.redhat.com:1337` is required, which is already set in the example config
    * `ADMIN_USER` - your consoledot stage username
    * `ADMIN_PASSWORD` - your consoledot stage password


2. Make sure Playwright is installed as a dev dependency:
   ```bash
   npm clean-install
   ```

3. Download the Playwright browsers with:
   ```bash
   npx playwright install
   ```

#### Running UI tests

1. Start the local development stage server by running: `npm run start:stage`

2. Now you have two options of how to run the tests:
    * Using the terminal
        * `npx playwright test` will run the playwright test suite.
        * `npx playwright test --headed` will run the suite in a vnc-like browser so you can watch its interactions.

    * Using VSCode (or VSCode forks, like Cursor) +
      the [Playwright Test module for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) –
      other editors have similar plugins for ease of use.

#### Running Integration tests

Running integration tests requires two distinct steps: first, pointing Playwright to stage; and second, enabling the
Podman API wrapper for managing containers that are provisioned by our Playwright tests. Follow these setup steps:

1. Set `PROXY` and `BASE_URL`. See `playwright_example.env` for reference
2. Set the `INTEGRATION` flag to true
3. Set the `DOCKER_SOCKET` option in your `.env` file as follows:
   ```bash
   DOCKER_SOCKET="/tmp/podman.sock"
   ```
4. Start the API service for Podman by running:
    ```bash
    podman system service -t 0 unix:///tmp/podman.sock
    ```
5. Run the tests with `npx playwright test`

If you're using Docker instead of Podman, you'll need to use `DOCKER_SOCKET="/var/run/docker.sock"`. You can also skip
step 4 and run the tests directly with `npx playwright test`.

## Deploying

The app uses containerized builds which are configured in [
`app-interface`](https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/services/insights/patchman/deploy-clowder.yml).

| Environment        | Available at                             | Deployed version                               |
|:-------------------|:-----------------------------------------|:-----------------------------------------------|
| stage preview      | https://console.stage.redhat.com/preview | master branch                                  |
| stage stable       | https://console.stage.redhat.com         | master branch                                  |
| production preview | https://console.redhat.com/preview       | up to the commit configured in `app-interface` |
| production stable  | https://console.redhat.com               | up to the commit configured in `app-interface` |

## Design System

This project uses [Patternfly React](https://github.com/patternfly/patternfly-react).

## Insights Components

This app imports components
from [Insights Front-end Components library](https://github.com/RedHatInsights/frontend-components). ESI tags are used
to import [Insights Chrome](https://github.com/RedHatInsights/insights-chrome) which takes care of the header, sidebar,
and footer.
