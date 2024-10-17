const path = require("path");
const { dependencies, insights } = require("./package.json");

const moduleName = insights.appname.replace(/-(\w)/g, (_, match) =>
    match.toUpperCase()
);
const srcDir = path.resolve(__dirname, "./src");

module.exports = {
    appName: moduleName,
    appUrl: "/insights/patch",
    useProxy: true,
    ...(process.env.HOT
        ? { hotReload: process.env.HOT === "true" }
        : { hotReload: true }),
    ...(process.env.port ? { port: parseInt(process.env.port) } : {}),
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
            {
                "@unleash/proxy-client-react": {
                    version: dependencies["@unleash/proxy-client-react"],
                    singleton: true,
                },
            },
        ],
    },
    /**
     * Add additional webpack plugins
     */
    resolve: {
        modules: [srcDir, path.resolve(__dirname, "./node_modules")],
    },
    routes: {
        ...(process.env.BACKEND_PORT && {
            "/api/content-sources/": {
                // This can be used to run against a local version of the associated backend
                // Simplift add to the package.json scripts: "local": "BACKEND_PORT=8000 npm start",
                // Your environment is then only to auth against.
                host: `http://localhost:${process.env.BACKEND_PORT}`,
            },
        }),
    },
};
