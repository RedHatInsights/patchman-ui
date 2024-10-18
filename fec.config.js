const path = require("path");
const { dependencies, insights } = require("./package.json");

const moduleName = insights.appname.replace(/-(\w)/g, (_, match) =>
    match.toUpperCase()
);

const srcDir = path.resolve(__dirname, "./src");

module.exports = {
    appName: moduleName,
    appUrl: "/insights/patch",
    useProxy: process.env.PROXY === "true",
    moduleFederation: {
        moduleName,
        exposes: {
            "./RootApp": path.resolve(__dirname, "./src/AppEntry"),
            "./SystemDetail": path.resolve(__dirname, "./src/index.js"),
        },
        shared: [
            {
                "react-router-dom": {
                    singleton: true,
                    import: false,
                    version: dependencies["react-router-dom"],
                    requiredVersion: ">=6.0.0 <7.0.0",
                },
            },
        ],
    },
};
