import { Page } from '@playwright/test';

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
