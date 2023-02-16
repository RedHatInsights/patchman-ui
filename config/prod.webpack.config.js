/* global require, module, __dirname */
const { resolve } = require("path");
const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const config = require("@redhat-cloud-services/frontend-components-config");
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, "../"),
});

plugins.push(
    require("@redhat-cloud-services/frontend-components-config/federated-modules")(
        {
            root: resolve(__dirname, "../"),
            exposes: {
                "./RootApp": resolve(__dirname, "../src/AppEntry"),
                "./SystemDetail": resolve(__dirname, "../src/index.js"),
            },
        }
    )
);

module.exports = function (env) {
    if (env && env.analyze === "true") {
        plugins.push(new BundleAnalyzerPlugin());
    }

    webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /\/node_modules\//,
                    name: 'vendor',
                    chunks: 'all'
                },
                main: {
                    test: /\/src\//,
                    name: 'main',
                    chunks: 'all'
                }
            }
        }
    };

    // webpackConfig.resolve.alias = {
    //     ...webpackConfig.resolve.alias,
    //     // '@patternfly/react-icons': false,
    //     // '@patternfly/react-table': false,
    //     '@data-driven-forms/react-form-renderer': false,
    //     '@redhat-cloud-services/frontend-components': false,
    //     '@data-driven-forms/pf4-component-mapper': false,
    //     '@redhat-cloud-services/frontend-components-notifications': false,
    //     '@redhat-cloud-services/frontend-components-remediations': false,
    //     '@redhat-cloud-services/frontend-components-utilities': false
    // };

    const asd = {
        ...webpackConfig,
        plugins
    };

    return {
        ...asd
    };
};
