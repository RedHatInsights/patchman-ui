/* global require, module, __dirname */
const { resolve } = require('path');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')({
        root: resolve(__dirname, '../'),
        exposes: {
            './RootApp': resolve(__dirname, '../src/AppEntry'),
            './SystemDetail': resolve(__dirname, '../src/index.js')
        }
    })
);

module.exports = function (env) {
    if (env && env.analyze === 'true') {
        plugins.push(new BundleAnalyzerPlugin());
    }

    return {
        ...webpackConfig,
        devtool: 'hidden-source-map',
        plugins: plugins.map((plugin, index) => {
            //Overrides SourceMapDevToolPlugin, instead we want to use 'hidden-source-map'
            if (index === 0 && process.env.BRANCH === 'prod-beta') {
                //uploads asset artifacts with sourcemaps onto sentry
                return (sentryWebpackPlugin({
                    org: 'red-hat-it',
                    project: 'cpin-001-insights',
                    authToken: process.env.SENTRY_AUTH_KEY
                }));
            } else {
                return plugin;
            }
        })
    };
};
