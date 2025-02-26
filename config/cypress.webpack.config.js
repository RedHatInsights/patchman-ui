/* global require, module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});

webpackConfig.module.rules.push({
    resolve: {
        alias: {
            '@redhat-cloud-services/frontend-components/useChrome': resolve(
                __dirname,
                './overrideChrome.js'
            ),
            '../useChrome': resolve(
                __dirname,
                './overrideChrome.js'
            )
        }
    }
});

module.exports = {
    ...webpackConfig,
    plugins,
    module: {
        ...webpackConfig.module,
        rules: [
            ...webpackConfig.module.rules,
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /(node_modules|bower_components)/i,
                use: ['babel-loader']
            }
        ]
    }
};
