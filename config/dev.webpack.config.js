/* global require, module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const proxyConfiguration = {
    rootFolder: resolve(__dirname, '../'),
    useProxy: process.env.PROXY === 'true',
    appUrl: process.env.BETA ? ['/beta/insights/patch', '/preview/insights/patch'] : ['/insights/patch'],
    deployment: process.env.BETA ? 'beta/apps' : 'apps',
    env: process.env.BETA ? 'prod-beta' : 'prod-stable',
    proxyVerbose: true,
    debug: true
};

const { config: webpackConfig, plugins } = config(proxyConfiguration);

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')({
        root: resolve(__dirname, '../'),
        exposes: {
            './RootApp': resolve(__dirname, '../src/AppEntry'),
            './SystemDetail': resolve(__dirname, '../src/index.js')
        },
        shared: [
            {
                'react-router-dom': { singleton: true, requiredVersion: '*' }
            }
        ]
    })
);

module.exports = {
    ...webpackConfig,
    plugins
};
