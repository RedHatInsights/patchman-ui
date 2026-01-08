/**
 * Navigation helpers for Playwright E2E tests.
 *
 * Each function attempts to use the navigation menu first, then falls back to direct URL navigation.
 */

import { disableTrackingAndConsent, expect, waitForTableLoad } from 'test-utils';
import { Page } from 'playwright/test';

/**
 * Navigates to the Advisories page via menu or direct URL.
 *
 * @param page - Playwright Page object
 */
export const navigateToAdvisories = async (page: Page) => {
  try {
    await disableTrackingAndConsent(page);
    await page
      .getByRole('navigation', { name: 'Insights Global Navigation', exact: true })
      .getByRole('region', { name: 'Content', exact: true })
      .getByRole('link', { name: 'Advisories', exact: true })
      .click({ timeout: 2_500, noWaitAfter: true });
  } catch {
    await page.goto('/insights/patch/advisories');
  }
  await expect(page.getByRole('heading', { name: 'Advisories', exact: true })).toBeVisible();
  await waitForTableLoad(page);
};

/**
 * Navigates to the Packages page via menu or direct URL.
 *
 * @param page - Playwright Page object
 */
export const navigateToPackages = async (page: Page) => {
  try {
    await disableTrackingAndConsent(page);
    await page
      .getByRole('navigation', { name: 'Insights Global Navigation', exact: true })
      .getByRole('region', { name: 'Content', exact: true })
      .getByRole('link', { name: 'Packages', exact: true })
      .click({ timeout: 2_500, noWaitAfter: true });
  } catch {
    await page.goto('/insights/patch/packages');
  }
  await expect(page.getByRole('heading', { name: 'Packages' })).toBeVisible();
  await waitForTableLoad(page);
};

/**
 * Navigates to the Systems page via menu or direct URL.
 *
 * @param page - Playwright Page object
 */
export const navigateToSystems = async (page: Page) => {
  try {
    await disableTrackingAndConsent(page);
    await page
      .getByRole('navigation', { name: 'Insights Global Navigation', exact: true })
      .getByRole('region', { name: 'Content', exact: true })
      .getByRole('link', { name: 'Systems', exact: true })
      .click({ timeout: 2_500, noWaitAfter: true });
  } catch {
    await page.goto('/insights/patch/systems');
  }
  await expect(page.getByRole('heading', { name: 'Systems' })).toBeVisible();
  await expect(page.getByRole('columnheader').first()).toBeVisible();
  await waitForTableLoad(page);
};

/**
 * Navigates to the Templates page via menu or direct URL.
 * @param page
 */
export const navigateToTemplates = async (page: Page) => {
  try {
    await disableTrackingAndConsent(page);
    await page
      .getByRole('navigation', {
        name: 'Insights Global Navigation',
        exact: true,
      })
      .getByRole('region', { name: 'Content', exact: true })
      .getByRole('link', { name: 'Templates', exact: true })
      .click({ timeout: 2_500, noWaitAfter: true });
  } catch {
    await page.goto('/insights/content/templates');
  }
  await expect(page.getByRole('heading', { name: 'Templates' })).toBeVisible();
  const subheading = page.getByText('View all content templates within your organization.');
  await expect(subheading).toBeVisible(); // Wait for either list page or zero state
};
