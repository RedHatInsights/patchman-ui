const path = require('path');
const { dependencies, insights } = require('./package.json');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

module.exports = {
    appName: insights.appname,
    appUrl: '/insights/patch',
    useProxy: process.env.PROXY === 'true',
    devtool: 'hidden-source-map',
    plugins: [
        // Put the Sentry Webpack plugin after all other plugins
        ...(process.env.ENABLE_SENTRY
            ? [
                sentryWebpackPlugin({
                    ...(process.env.SENTRY_AUTH_TOKEN && {
                        authToken: process.env.SENTRY_AUTH_TOKEN
                    }),
                    org: 'red-hat-it',
                    project: 'patchman-rhel',
                    moduleMetadata: ({ release }) => ({
                        dsn: `https://7308344e3a96d7a5c31a2d3899328f10@o490301.ingest.us.sentry.io/4508683262951424`,
                        org: 'red-hat-it',
                        project: 'patchman-rhel',
                        release
                    })
                })
            ]
            : [])
    ],
    moduleFederation: {
        moduleName: insights.appname,
        exposes: {
            './RootApp': path.resolve(__dirname, './src/AppEntry'),
            './SystemDetail': path.resolve(__dirname, './src/index.js')
        },
        shared: [
            {
                'react-router-dom': {
                    singleton: true,
                    import: false,
                    version: dependencies['react-router-dom'],
                    requiredVersion: '>=6.0.0 <7.0.0'
                }
            }
        ]
    },
    frontendCRDPath: 'deploy/frontend.yml'
};
