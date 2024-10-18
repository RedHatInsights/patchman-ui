module.exports = {
    coverageDirectory: "./codecov-jest/",
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.js", "!src/**/stories/*"],
    setupFiles: ["<rootDir>/config/setupTests.js"],
    roots: ["<rootDir>/src/"],
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
    },
    testPathIgnorePatterns: [
        "src/SmartComponents/SystemDetail/InventoryDetail.test.js",
        "src/SmartComponents/PatchSet/PatchSet.test.js",
    ],
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!(@patternfly/react-core/|@patternfly/react-icons/|@redhat-cloud-services|@openshift|lodash-es|@patternfly/react-table|@patternfly/react-tokens|p-all)).*$",
    ],
};
