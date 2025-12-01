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
  timeout: (process.env.INTEGRATION ? 6 : 4) * 60 * 1000, // 6m || 4m
  expect: { timeout: 30_000 }, // 30s
  use: {
    actionTimeout: 30_000, // 30s
    navigationTimeout: 30_000, // 30s
    launchOptions: {
      args: ['--use-fake-device-for-media-stream'],
    },
    ...(process.env.TOKEN
      ? {
          extraHTTPHeaders: {
            Authorization: process.env.TOKEN,
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
    { name: 'setup', testMatch: /.*\.setup\.ts/, use: { trace: 'off' } },
    {
      name: 'UI',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/admin_user.json',
      },
      testDir: './playwright/UI/',
      dependencies: ['setup'],
    },
  ],
});
