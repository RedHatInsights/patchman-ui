/* global require, module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const insightsProxy = {
    https: true,
    port: process.env.FRONTEND_PORT ? process.env.FRONTEND_PORT : '8002',
    ...(process.env.BETA && { deployment: 'beta/apps' })
};

const webpackProxy = {
    deployment: process.env.BETA ? 'beta/apps' : 'apps',
    appUrl: process.env.BETA ? ['/beta/insights/patch'] : ['/insights/patch'],
    env: `stage-${process.env.BETA ? 'beta' : 'stable'}`,
    useProxy: true,
    proxyVerbose: true,
    useCloud: false, // until console pre-prod env is ready
    // localChrome: '~/insights/insights-chrome/build/', // for local chrome builds
    routes: {
        //   '/beta/config': { host: 'http://localhost:8003' }, // for local CSC config
    }
};

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    useFileHash: false,
    ...(process.env.PROXY ? webpackProxy : insightsProxy)
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
                'react-router-dom': { singleton: true, requiredVersion: '*' }
            }
        ]
    })
);

module.exports = {
    ...webpackConfig,
    plugins
};
