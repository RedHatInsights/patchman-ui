module.exports = {
  coverageDirectory: 'coverage-jest',
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,ts,tsx}', '!src/**/stories/*'],
  setupFiles: ['<rootDir>/config/setupTests.js'],
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['src/SmartComponents/SystemDetail/InventoryDetail.test.js'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(@patternfly/react-core/|@patternfly/react-icons/|@redhat-cloud-services|@openshift|lodash-es|@patternfly/react-table|@patternfly/react-tokens|p-all)).*$',
  ],
};
