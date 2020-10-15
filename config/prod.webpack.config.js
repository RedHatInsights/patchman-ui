/* global require, module, __dirname */
const { resolve } = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});

const customPlugins = plugins.slice();
const HtmlWebpackPlugin = customPlugins[5]; //htmlwebpackplugin workaround
HtmlWebpackPlugin.options.chunksSortMode = 'none';
module.exports = function(env) {
    const plugins = [...customPlugins];
    if (env && env.analyze === 'true') {
        plugins.push(new BundleAnalyzerPlugin());
    }

    /**
     * stop forcing all node_modules to be part of a single chunk
     */
    webpackConfig.optimization.minimize = true;
    webpackConfig.optimization.splitChunks = {
        minSize: 30000,
        cacheGroups: {
            defaultVendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                reuseExistingChunk: true
            },
            default: {
                priority: 20,
                reuseExistingChunk: true
            }
        }
    };

    return {
        ...webpackConfig,
        plugins
    };
};