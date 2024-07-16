[![Build Status](https://app.travis-ci.com/RedHatInsights/patchman-ui.svg?branch=master)](https://app.travis-ci.com/RedHatInsights/patchman-ui)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![GitHub release](https://img.shields.io/github/v/release/RedHatInsights/patchman-ui.svg)](https://github.com/RedHatInsights/patchman-ui/releases/latest)
[![codecov](https://codecov.io/gh/RedHatInsights/patchman-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/patchman-ui)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Patchman UI

Patch is one of the applications for console.redhat.com. It allows users to display and manage available patches for their registered systems. This repository containes source code for the frontend part of the application which uses the REST API available from [Patchman Engine](https://github.com/RedHatInsights/patchman-engine).

## First time setup
1. Make sure you have [`Node.js`](https://nodejs.org/en/) version >= 18 installed
2. Run [script to patch your `/etc/hosts`](https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh)
3. Make sure you are using [Red Hat proxy](https://hdn.corp.redhat.com/proxy.pac) if working against the stage environment.

## Running locally
1. Make sure you are connected to the Red Hat VPN
2. Install dependencies with `npm install`
3. Run development server with `npm run start:proxy` and select desired environment (`stage-preview` is recommended)
4. Local version of the app will be available at URL printed out to the console (https://stage.foo.redhat.com:1337/preview/insights/patch/ if you selected `stage-preview`)

## Testing
[Cypress](https://cypress.io/) and [Jest](https://jestjs.io/) are used as the testing frameworks
- ```npm run test``` - run all Jest tests
- ```npm run test:ct``` - open Cypress in the component testing mode.
- ```npm run lint``` - run linter
- ```npm run coverage``` - generate lect coverage information after running the tests

## Deploying
The app uses containerized builds which are configured in [`app-interface`](https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/services/insights/patchman/deploy-clowder.yml).

| Environment        | Available at                             | Deployed version
| :----------------- | :--------------------------------------- | :----------
| stage preview      | https://console.stage.redhat.com/preview | master branch
| stage stable       | https://console.stage.redhat.com         | master branch
| production preview | https://console.redhat.com/preview       | up to the commit configured in `app-interface`
| production stable  | https://console.redhat.com               | up to the commit configured in `app-interface`

## Design System
This project uses [Patternfly React](https://github.com/patternfly/patternfly-react).

## Insights Components
This app imports components from [Insights Front-end Components library](https://github.com/RedHatInsights/frontend-components). ESI tags are used to import [Insights Chrome](https://github.com/RedHatInsights/insights-chrome) which takes care of the header, sidebar, and footer.
