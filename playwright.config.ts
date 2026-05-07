import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright/',
  fullyParallel: false,
  forbidOnly: false,
  retries: process.env.CI ? 1 : 0,
  workers: 4,
  reporter: process.env.CI
    ? [
        ['html', { outputFolder: 'playwright-report' }],
        [
          'playwright-ctrf-json-reporter',
          { outputDir: 'playwright-ctrf', outputFile: 'playwright-ctrf.json' },
        ],
        ['@currents/playwright'],
      ]
    : 'list',
  globalTimeout: (process.env.INTEGRATION ? 35 : 20) * 60 * 1000, // 35m || 20m
  timeout: (process.env.INTEGRATION ? 8 : 4) * 60 * 1000, // 8m || 4m
  expect: { timeout: 30_000 }, // 30s
  use: {
    actionTimeout: 30_000, // 30s
    navigationTimeout: 30_000, // 30s
    launchOptions: {
      args: ['--use-fake-device-for-media-stream'],
    },
    ...(process.env.ADMIN_TOKEN
      ? {
          extraHTTPHeaders: {
            Authorization: process.env.ADMIN_TOKEN,
          },
        }
      : {}),
    baseURL: process.env.BASE_URL,
    ignoreHTTPSErrors: true,
    ...(process.env.PROXY
      ? {
          proxy: {
            server: process.env.PROXY,
          },
        }
      : {}),
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/, use: { trace: 'off' } },
    ...(process.env.INTEGRATION
      ? [
          {
            name: 'Integration',
            use: {
              ...devices['Desktop Chrome'],
              storageState: '.auth/ADMIN_TOKEN.json',
            },
            testDir: './playwright/Integration/',
            dependencies: ['setup'],
          },
        ]
      : [
          {
            name: 'UI-default-user',
            use: {
              ...devices['Desktop Chrome'],
              storageState: '.auth/ADMIN_TOKEN.json',
            },
            testDir: './playwright/UI/',
            testIgnore: ['**/AdvisoriesTests.spec.ts'],
            dependencies: ['setup'],
          },
          {
            name: 'UI-advisory-remediation-user',
            use: {
              ...devices['Desktop Chrome'],
              storageState: '.auth/ADVISORY_REMEDIATION_TOKEN.json',
              extraHTTPHeaders: process.env.ADVISORY_REMEDIATION_TOKEN
                ? { Authorization: process.env.ADVISORY_REMEDIATION_TOKEN }
                : {},
            },
            testDir: './playwright/UI/',
            testMatch: ['**/AdvisoriesTests.spec.ts'],
            // Run after all default-user UI tests to prevent auth state conflicts
            dependencies: ['setup', 'UI-default-user'],
          },
        ]),
  ],
});
