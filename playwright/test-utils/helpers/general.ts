import { Page } from '@playwright/test';

/**
 * Delays execution for specified milliseconds.
 *
 * @param ms - Milliseconds to sleep
 */
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Repeatedly calls fn until the condition returns false.
 * Commonly used for polling system states until they reach the expected value.
 *
 * @param fn - Function to execute repeatedly
 * @param condition - Condition to check a result against; polling continues while true
 * @param interval - Milliseconds to wait between calls
 * @returns The result of fn when condition returns false
 */
export const poll = async (
  fn: () => Promise<any>,
  condition: (result: any) => boolean,
  interval: number,
) => {
  let result = await fn();
  while (condition(result)) {
    result = await fn();
    await sleep(interval);
  }
  return result;
};

/**
 * Retries callback up to a specified number of times on failure.
 *
 * @param callback - Function to retry
 * @param tries - Number of retry attempts (default: 3)
 * @param delay - Optional delay in milliseconds between retries
 */
export const retry = async (callback: () => Promise<unknown>, tries = 3, delay?: number) => {
  let rc = tries;
  while (rc >= 0) {
    if (delay) {
      await sleep(delay);
    }

    rc -= 1;
    if (rc === 0) {
      return await callback();
    } else {
      try {
        await callback();
      } catch {
        continue;
      }
      break;
    }
  }
};

/**
 * Generates a random 6-character alphanumeric string for unique naming.
 *
 * @returns A random string like "a3k9f2"
 */
export const randomName = () => (Math.random() + 1).toString(36).substring(2, 8);

export const closePopupsIfExist = async (page: Page) => {
  const locatorsToCheck = [
    page.locator(`button[id^="pendo-close-guide-"]`), // This closes the pendo guide pop-up
    page.locator(`button[id="truste-consent-button"]`), // This closes the trusted consent pop-up
  ];

  for (const locator of locatorsToCheck) {
    await page.addLocatorHandler(locator, async () => {
      try {
        await page.getByRole('dialog').waitFor({ state: 'hidden', timeout: 1000 });
        await locator.first().click({ timeout: 10_000, noWaitAfter: true }); // There can be multiple toast pop-ups
      } catch {
        return;
      }
    });
  }
};

/**
 * Aborts requests to analytics (Red Hat Metrics) and cookie consent (TrustArc) services to prevent
 * UI interference and reduce console error noise.
 */
export const disableTrackingAndConsent = async (page: Page) => {
  await page.route('https://consent.trustarc.com/**', (route) => route.abort());
  await page.route('https://smetrics.redhat.com/**', (route) => route.abort());
};
