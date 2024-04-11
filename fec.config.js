const { resolve } = require('path');

module.exports = {
    appUrl: '/insights/patch',
    debug: true,
    useProxy: process.env.PROXY === 'true',
    proxyVerbose: true,
    plugins: [],
    ...(process.env.HOT ? { hotReload: process.env.HOT === 'true' } : { hotReload: true }),
    ...(process.env.port ? { port: parseInt(process.env.port) } : {}),
    moduleFederation: {
        shared: [
            {
                'react-router-dom': {
                    singleton: true,
                    import: false,
                    version: '^6.8.1',
                    requiredVersion: '>=6.0.0 <7.0.0'
                }
            }
        ],
        exposes: {
            './RootApp': resolve(__dirname, './src/AppEntry'),
            './SystemDetail': resolve(__dirname, './src/index.js')
        }
    }
};
