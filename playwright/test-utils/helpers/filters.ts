/**
 * Filter interaction helpers for Playwright tests.
 *
 * This module provides utilities for:
 * - Opening and interacting with conditional filter dropdowns
 * - Applying different types of filters (checkbox, option, search)
 * - Verifying filter types and subtypes exist
 * - Verifying filter chips appear
 * - Resetting filters
 * - Publish date filter helpers (cutoff calculation, cell parsing)
 */

import { Page } from '@playwright/test';

/** Returns { minDate } for "Last X" filters or { maxDate } for "More than 1 year ago". */
export function getPublishDateCutoff(filterLabel: string): {
  minDate?: Date;
  maxDate?: Date;
} {
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  if (filterLabel === 'More than 1 year ago') {
    const max = new Date(now.getTime() - 365 * dayMs);
    return { maxDate: max };
  }
  const days =
    filterLabel === 'Last 7 days'
      ? 7
      : filterLabel === 'Last 30 days'
        ? 30
        : filterLabel === 'Last 90 days'
          ? 90
          : 365;
  const min = new Date(now.getTime() - days * dayMs);
  return { minDate: min };
}

/** Parse date from table cell (format "DD Mon YYYY" from processDate). */
export function parsePublishDateCell(text: string): Date | null {
  const trimmed = text.trim();
  if (trimmed === 'N/A' || !trimmed) {
    return null;
  }
  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? null : d;
}
import { expect, waitForTableLoad } from 'test-utils';

type FilterInputType = 'checkbox' | 'option' | 'search';

export interface FilterConfig {
  name: string; // Button/dropdown name (e.g., 'Type', 'Severity')
  type: FilterInputType; // How to interact with the filter
  value: string; // Value to select/enter
}

/**
 * Filter subtype configuration for verifying and applying filter subtypes.
 */
export interface FilterSubtype {
  name: string; // Display name of the subtype (e.g., 'Security', 'Bugfix')
  inputType: FilterInputType; // How to interact with this subtype
}

/**
 * Opens the conditional filter dropdown.
 *
 * @param page - Playwright Page object
 */
export const openConditionalFilter = async (page: Page) => {
  await page.getByRole('button', { name: 'Conditional filter toggle' }).click();
};

/**
 * Verifies that a filter type exists in the filter dropdown.
 * Opens the conditional filter dropdown if it's not already open.
 *
 * @param page - Playwright Page object
 * @param filterType - Name of the filter type (e.g., 'Type', 'Severity', 'Advisory')
 * @param exact - If true, match the filter type name exactly (e.g. "System" not "Operating system")
 */
export const verifyFilterTypeExists = async (page: Page, filterType: string, exact?: boolean) => {
  const menuitem = page.getByRole('menuitem', { name: filterType, exact: exact ?? false });

  // Open the conditional filter dropdown if the menuitem isn't visible
  if (!(await menuitem.isVisible())) {
    await openConditionalFilter(page);
  }

  await expect(menuitem).toBeVisible();
};

/**
 * Selects a filter type from the conditional filter dropdown.
 * Opens the dropdown if it's not already open, then clicks the filter type.
 *
 * @param page - Playwright Page object
 * @param filterType - Name of the filter type to select
 */
export const selectFilterType = async (page: Page, filterType: string) => {
  const menuitem = page.getByRole('menuitem', { name: filterType });

  // Open the conditional filter dropdown if the menuitem isn't visible
  if (!(await menuitem.isVisible())) {
    await openConditionalFilter(page);
  }

  await menuitem.click();
};

/**
 * Verify a filter chip is visible.
 *
 * @param page - Playwright Page object
 * @param text - Text to find in the filter chip
 */
export const expectFilterChip = async (page: Page, text: string) => {
  await expect(page.locator('.pf-v6-c-label__content').filter({ hasText: text })).toBeVisible();
};

/**
 * Verify a filter chip is hidden/removed.
 *
 * @param page - Playwright Page object
 * @param text - Text that should not be in any filter chip
 */
export const expectFilterChipHidden = async (page: Page, text: string) => {
  await expect(page.locator('.pf-v6-c-label__content').filter({ hasText: text })).toBeHidden();
};

/**
 * Applies a filter with its subtype value and optionally verifies the filter chip.
 * Handles different input types: search, checkbox, and option/select.
 *
 * @param page - Playwright Page object
 * @param filterType - Name of the filter type (e.g., 'Type', 'Severity')
 * @param subtype - Subtype configuration with name and input type
 * @param options - Optional settings
 * @param options.verifyChip - Whether to verify the filter chip appears (default: true)
 * @param options.chipText - Custom text to verify in the chip (defaults to subtype.name)
 */
export const applyFilterSubtype = async (
  page: Page,
  filterType: string,
  subtype: FilterSubtype,
  options: { verifyChip?: boolean; chipText?: string } = {},
) => {
  const { verifyChip = true, chipText = subtype.name } = options;

  // Select the filter type first
  await selectFilterType(page, filterType);

  // Apply the subtype based on its input type
  switch (subtype.inputType) {
    case 'search':
      await page.getByRole('textbox', { name: 'search-field' }).fill(subtype.name);
      break;

    case 'checkbox': {
      const dropdown = page.getByRole('button', { name: 'Options menu' });
      await dropdown.click();
      await page.getByRole('menuitem', { name: subtype.name, exact: true }).click();
      // Dropdown auto-closes after clicking menuitem, wait for table to update
      break;
    }

    case 'option': {
      const dropdown = page.getByRole('button', { name: 'Options menu' });
      await dropdown.click();
      await page.getByRole('option', { name: subtype.name }).click();
      break;
    }
  }

  await waitForTableLoad(page);

  // Verify the filter chip if requested
  if (verifyChip) {
    await expectFilterChip(page, chipText);
  }
};

/**
 * Verifies subtypes exist for a filter type.
 * Opens the filter dropdown and checks that all specified subtypes are present.
 *
 * @param page - Playwright Page object
 * @param filterType - Name of the filter type
 * @param subtypes - Array of subtype names to verify
 */
export const verifyFilterSubtypesExist = async (
  page: Page,
  filterType: string,
  subtypes: string[],
) => {
  // Select the filter type
  await selectFilterType(page, filterType);

  // Open the dropdown to see subtypes
  const dropdown = page.getByRole('button', { name: 'Options menu' });
  await dropdown.click();

  // Verify each subtype exists
  for (const subtype of subtypes) {
    await expect(
      page
        .getByRole('menuitem', { name: subtype, exact: true })
        .or(page.getByRole('option', { name: subtype, exact: true })),
    ).toBeVisible();
  }

  // Close the dropdown
  await dropdown.click();
};

/**
 * Apply a single filter to the page.
 *
 * @param page - Playwright Page object
 * @param filter - Filter configuration
 */
export const applyFilter = async (page: Page, filter: FilterConfig) => {
  if (filter.type === 'search') {
    await page.getByRole('textbox', { name: 'search-field' }).fill(filter.value);
  } else {
    const dropdown = page.getByRole('button', { name: 'Options menu' });
    await dropdown.click();

    if (filter.type === 'checkbox') {
      await page.getByRole('menuitem', { name: filter.value, exact: true }).click();
      // Dropdown auto-closes after clicking menuitem
    } else {
      await page.getByRole('option', { name: filter.value, exact: true }).click();
    }
  }
  await waitForTableLoad(page);
};

/**
 * Remove/uncheck a filter value.
 *
 * @param page - Playwright Page object
 * @param filter - Filter configuration (only works for checkbox type)
 */
export const removeFilter = async (page: Page, filter: FilterConfig) => {
  if (filter.type === 'checkbox') {
    const dropdown = page.getByRole('button', { name: 'Options menu' });
    await dropdown.click();
    await page.getByRole('menuitem', { name: filter.value, exact: true }).click();
    // Dropdown auto-closes after clicking menuitem
    await waitForTableLoad(page);
  }
};

/**
 * Reset/clear all filters.
 *
 * @param page - Playwright Page object
 */
export const resetFilters = async (page: Page) => {
  // Close any open dropdowns first
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Reset filters/i }).click();
  await waitForTableLoad(page);
};
