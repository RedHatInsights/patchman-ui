/* global require, module, __dirname */
const { resolve } = require('path');
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
        },
        shared: [
            {
                '@patternfly/react-core': { singleton: true, import: false, requiredVersion: '^4.267.6' },
                '@patternfly/react-icons': { singleton: true, import: false, requiredVersion: '^4.93.3' },
                '@patternfly/react-table': { singleton: true, import: false, requiredVersion: '^4.112.6' }
            }
        ]
    })
);

module.exports = function (env) {
    if (env && env.analyze === 'true') {
        plugins.push(new BundleAnalyzerPlugin());
    }

    return {
        ...webpackConfig,
        plugins
    };
};
