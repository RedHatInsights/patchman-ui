/* global require, module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true
});
const customPlugins = plugins.slice();
const HtmlWebpackPlugin = customPlugins[5]; //htmlwebpackplugin workaround
HtmlWebpackPlugin.options.chunksSortMode = 'none';

webpackConfig.serve.hot = true;

module.exports = {
    ...webpackConfig,
    plugins: customPlugins
};
