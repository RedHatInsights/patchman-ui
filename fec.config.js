const path = require('path');
const { dependencies, insights } = require('./package.json');

module.exports = {
    appName: insights.appname,
    appUrl: '/insights/patch',
    useProxy: process.env.PROXY === 'true',
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
    }
};
