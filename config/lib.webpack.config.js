/* global require, module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});
const path = require('path');

const customPlugins = plugins.slice();
const HtmlWebpackPlugin = customPlugins[5]; //htmlwebpackplugin workaround
HtmlWebpackPlugin.options.chunksSortMode = 'none';

const libEntry = path.resolve(__dirname, '../src/index.js');
const publicPath = path.resolve(__dirname, '../dist');

const componentsConfig = {
    mode: 'production',
    devtool: 'none',
    entry: {
        index: libEntry
    },
    output: {
        filename: 'index.js',
        libraryTarget: 'umd',
        publicPath,
        path: publicPath,
        library: 'lib'
    },
    optimization: {
        minimize: true
    },
    externals: [/^@patternfly\/.*/, /^@redhat-cloud-services\/frontend-components.*/, {
        '@redhat-cloud-services/frontend-components-utilities': {
            commonjs: '@redhat-cloud-services/frontend-components-utilities',
            commonjs2: '@redhat-cloud-services/frontend-components-utilities',
            amd: '@redhat-cloud-services/frontend-components-utilities',
            root: 'FECUtilities'
        },
        'prop-types': 'prop-types',
        react: 'react',
        'react-redux': 'react-redux',
        'react-dom': 'react-dom',
        'react-router-dom': 'react-router-dom',
        classnames: 'classnames',
        moment: 'moment'
    }]
};
const newConfig = { ...webpackConfig, ...componentsConfig };
newConfig.resolve = { ...newConfig.resolve, alias: {
    react: path.resolve('./node_modules/react')
} };
delete newConfig.devServer;
delete newConfig.serve;
module.exports = {
    ...newConfig,
    plugins: customPlugins
};
