[![Build Status](https://app.travis-ci.com/RedHatInsights/patchman-ui.svg?branch=master)](https://app.travis-ci.com/RedHatInsights/patchman-ui)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![GitHub release](https://img.shields.io/github/v/release/RedHatInsights/patchman-ui.svg)](https://github.com/RedHatInsights/patchman-ui/releases/latest)
[![codecov](https://codecov.io/gh/RedHatInsights/patchman-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/patchman-ui)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Patchman UI

Patch is one of the applications for console.redhat.com. It allows users to display and manage available patches for their registered systems. This repository containes source code for the frontend part of the application which uses the REST API available from [Patchman Engine](https://github.com/RedHatInsights/patchman-engine).

## Getting Started

The Patchman UI is a sub application under the Red Hat insights platform with [Insights chroming app as a wrapper](https://github.com/RedHatInsights/insights-chrome).

There are 2 technologies used for integration with backend and deployment purposes: 
1. [Insights Proxy](https://github.com/RedHatInsights/insights-proxy)
2. [Webpackproxy](https://github.com/RedHatInsights/frontend-components/tree/master/packages/config#useproxy)

Note: the difference is insights proxy has to be reinitialised everytime you want to develop, while webpack proxy is auto initialized when you  run the command ```npm run start:proxy:beta```.

There is [a comprehensive quick start guide in the Storybook Documentation](https://github.com/RedHatInsights/insights-frontend-storybook/blob/master/src/docs/welcome/quickStart/DOC.md) to setting up an Insights environment complete with:

- [Insights Frontend Starter App](https://github.com/RedHatInsights/frontend-starter-app)

- [Insights Chroming](https://github.com/RedHatInsights/insights-chrome)

- [Insights Proxy](https://github.com/RedHatInsights/insights-proxy)

Note: You will need to set up the Insights environment if you want to develop with the starter app due to the consumption of the chroming service as well as setting up your global/app navigation through the API.



## Run the app for the first time

1. ```git clone git@github.com:RedHatInsights/patchman-ui.git```
    - clone the Patch UI into your machine

2. ```npm install```

3. ```SPANDX_CONFIG="./config/spandx.config.js" bash $PROXY_PATH/scripts/run.sh```
    - If you are using insights proxy, it is time to start it. Otherwise you can skip this step

4. ```npm run start```
    - use this command if you want to develop Patch UI using insights proxy. The command starts webpack bundler and serves the files with webpack dev server
   
  ```npm run start:proxy:beta``` 
    - use this command if you wand to develop Patch UI using webpack proxy starts webpack bundler and serves the files with webpack dev server

### Testing

- `npm run verify` will run linters and tests
- Travis is used to test the build for this code.
  - You are always notified on failed builds
  - You are only notified on successful builds if the build before it failed
  - By default, both `push` events as well as `pull_request` events send notifications
  - Travis is defaulted to notify #insights-bots
  - `npm run test` will run only Jest tests
  - `npm run test:update` is used to update the test snapshots

## Deploying

- The Platform team is using Travis to deploy the application
  - The Platform team will help you set up the Travis instance if this is the route you are wanting to take

## Release process

- [there is a comprehensive guidline on the release procedure](https://docs.engineering.redhat.com/pages/viewpage.action?spaceKey=SPM&title=Patch+UI+release+workflow)  

### How it works

Any push to the following branches will trigger a build in [patchman-ui-build repository](https://github.com/RedHatInsights/patchman-ui-build) which will deploy to corresponding environment.

| Push to branch in this repo  | Updated branch in build repo  | Environment       | Available at
| :--------------------------- | :---------------------------- | :---------------- | :-----------
| master                       | stage-beta                    | stage beta        | https://console.stage.redhat.com/preview
| stage-stable                 | stage-stable                  | stage stable      | https://console.stage.redhat.com
| prod-beta                    | prod-beta                     | production beta   | https://console.redhat.com/preview
| prod-stable                  | prod-stable                   | production stable | https://console.redhat.com

## Patternfly

- This project imports Patternfly components:
  - [Patternfly React](https://github.com/patternfly/patternfly-react)

## Insights Components

Insights Platform will deliver components and static assets through [npm](https://www.npmjs.com/package/@red-hat-insights/insights-frontend-components). ESI tags are used to import the [chroming](https://github.com/RedHatInsights/insights-chrome) which takes care of the header, sidebar, and footer.

## Technologies

### Webpack

#### Webpack.config.js

This file exports an object with the configuration for webpack and webpack dev server.

```Javascript
{
    mode: https://webpack.js.org/concepts/mode/,
    devtool: https://webpack.js.org/configuration/devtool/,

    // different bundle options.
    // allows you to completely separate vendor code from app code and much more.
    // https://webpack.js.org/plugins/split-chunks-plugin/
    optimization: {
        chunks: https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks-chunks-all,
        runtimeChunk: https://webpack.js.org/plugins/split-chunks-plugin/#optimization-runtimechunk,

        // https://webpack.js.org/plugins/split-chunks-plugin/#configuring-cache-groups
        cacheGroups: {

            // bundles all vendor code needed to run the entry file
            common_initial: {
                test: // file regex: /[\\/]node_modules[\\/]/,
                name: // filename: 'common.initial',
                chunks: // chunk type initial, async, all
            }
        }
    },

    // each property of entry maps to the name of an entry file
    // https://webpack.js.org/concepts/entry-points/
    entry: {

        // example bunde names
        bundle1: 'src/entry1.js',
        bundle2: 'src/entry2.js'
    },

    // bundle output options.
    output: {
            filename: https://webpack.js.org/configuration/output/#output-filename,
            path: https://webpack.js.org/configuration/output/#output-path,
            publicPath: https://webpack.js.org/configuration/output/#output-publicpath,
            chunkFilename: https://webpack.js.org/configuration/output/#output-chunkfilename
    },
     module: {
         rules: https://webpack.js.org/configuration/module/#module-rules
     },

     // An array of webpack plugins look at webpack.plugins.js
     // https://webpack.js.org/plugins/
     plugins: [],

     // webpack dev serve options
     // https://github.com/webpack/webpack-dev-server
     devServer: {}
}
```

### React

- High-Order Component

  - a [higher-order component](https://reactjs.org/docs/higher-order-components.html) is a function that takes a component and returns a new component
    - Ex) [asyncComponent.js](https://github.com/RedHatInsights/insights-frontend-starter-app/src/Utils/asyncComponent.js)

- [Smart/Presentational Components](https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43)
  - Smart components have access to the redux state
  - Presentational components do not have access to the redux state
  - Smart Components === insights-frontend/app/js/states
  - Presentational Components === insights-frontend/app/js/components

- [State and lifecycle within class components](https://reactjs.org/docs/state-and-lifecycle.html)
  - article contains:
    - Adding Lifecycle Methods to a Class
    - Adding Local State to a Class
    - State Updates May Be Asynchronous
    - State Updates are Merged

### Redux

#### Store

A [store](https://redux.js.org/basics/store) holds the whole [state tree](https://redux.js.org/glossary) of your application.
Redux doesn't have a Dispatcher or support many stores. Instead, there is just a single store with a single root reducing function.

[Create Store](https://redux.js.org/api-reference/createstore): ```createStore(reducer, preloadedState, enhancer)```

- methods
  - [getState()](https://redux.js.org/api-reference/store#dispatch)
  - [dispatch(action)](https://redux.js.org/api-reference/store#dispatch)
  - [subscribe(listener)](https://redux.js.org/api-reference/store#subscribe)
  - [replaceReducer(nextReducer)](https://redux.js.org/api-reference/store#replaceReducer)

#### Actions

[Actions](https://redux.js.org/basics/actions) are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using [store.dispatch()](https://redux.js.org/api-reference/store#dispatch).
Redux actions should only have two properties, type and payload, as a best practice.

- Async Actions frameworks

  - [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)
    - Currently using this
      - look at [/src/api/System/getSystems.js](https://github.com/RedHatInsights/turbo-octo-couscous/tree/master/src/api/System/getSystems.js)
  - [redux-thunk](https://github.com/gaearon/redux-thunk)
    - A function that wraps an expression to delay its evaluation
    ```Javascript
    // gotSystems(Error) are action creators
    function getSystems() {
          return function (dispatch) {
            return fetchSystems().then(
              systems => dispatch(gotSystems(systems)),
              error => dispatch(gotSystemsError(error))
            );
          };
        }
    ```
  - [redux-saga](https://github.com/yelouafi/redux-saga/)
    - Uses [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
    - Could be a lot to learn initially.
  - [redux-pack](https://github.com/lelandrichardson/redux-pack)

#### Reducers

[Reducers](https://redux.js.org/basics/reducers) specify how the application's state changes in response to actions sent to the store.

Ex) [/src/api/System/getSystems.js](https://github.com/RedHatInsights/turbo-octo-couscous/tree/master/src/api/System/getSystems.js)

### React-redux

- [Provider](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store)
  - Makes the Redux store available to the connect()
- [connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
  - Connects a React component to a Redux store

### React-router-dom

When setting up the routes, the page content is wrapped with a `.page__{pageName}` class, applied to the `#root` ID that is determined by the `rootClass` in the `Routes.js` which lets you easily reference the page in the styling.

- [BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter)
  - A `<Router>` that uses the HTML5 history API (pushState, replaceState and the popstate event) to keep your UI in sync with the URL
- [Route](https://reacttraining.com/react-router/web/api/Route)
- [Switch](https://reacttraining.com/react-router/web/api/Switch)
  - Renders the first child `<Route>` or `<Redirect>` that matches the location.
- [Redirect](https://reacttraining.com/react-router/web/api/Redirect)
  - navigate to a new location
- [withRouter](https://reacttraining.com/react-router/web/api/withRouter)
  - passes updated match, location, and history props to the wrapped component whenever it renders

## Running locally
Have [insights-proxy](https://github.com/RedHatInsights/insights-proxy) installed under PROXY_PATH

```shell
SPANDX_CONFIG="./config/spandx.config.js" bash $PROXY_PATH/scripts/run.sh
```

### Running with inventory

In order to test system detail in inventory application pull [inventory UI app](https://github.com/RedHatInsights/insights-inventory-frontend), install dependencies and run it

```shell
>$ npm install
>$ npm start
```

With our spandx config, patch and inventory running you should be able to see changes in the system detail of inventory.

### Testing - jest

When you want to test your code with unit tests please use `jest` which is preconfigured in a way to colect codecoverage as well. If you want to see your coverage on server the travis config has been set in a way that it will send data to [codecov.io](https://codecov.io) the only thing you have to do is visit their website (register), enable your repository and add CODECOV_TOKEN to your travis web config (do not add it to .travis file, but trough [travis-ci.org](https://travis-ci.org/))

## Run SonarQube code analysis
~~~bash
export SONAR_HOST_URL=https://sonar-server
export SONAR_LOGIN=paste-your-generated-token
export SONAR_CERT_URL=https://secret-url-to/ca.crt # optional
podman-compose -f dev/sonar/docker-compose.yml up --build
~~~
