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
    //localChrome: '/home/muslimjon/RedHat/insights-chrome/build', // for local chrome builds
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
                '@patternfly/react-core': { singleton: true, import: false, requiredVersion: '^4.267.6' },
                '@patternfly/react-icons': { singleton: true, import: false, requiredVersion: '^4.93.3' },
                '@patternfly/react-table': { singleton: true, import: false, requiredVersion: '^4.112.6' }
            }
        ]
    })
);

module.exports = {
    ...webpackConfig,
    plugins
};
