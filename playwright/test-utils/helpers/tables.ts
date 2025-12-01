import { expect, sleep } from 'test-utils';
import { Locator, Page } from '@playwright/test';

/**
 * Waits for the skeleton table loading state to disappear
 *
 * @param locator - Page or Locator containing the table
 */
export const waitForTableLoad = async (locator: Locator | Page) => {
  await sleep(500);
  await expect(locator.getByRole('progressbar', { name: 'Contents' })).toBeHidden();
  await expect(locator.locator('.pf-v6-c-table__td > .pf-v6-c-skeleton').first()).toBeHidden();
};

/**
 * Filters a table by name using the "Filter by name" input field.
 * Waits for the first matching row to become visible after filtering.
 *
 * @param locator - Page or Locator containing the table and filter input
 * @param name - Name to filter by
 */
export const filterByName = async (locator: Locator | Page, name: string) => {
  await locator.getByPlaceholder(/^Filter by name.*$/).fill(name);
  await waitForTableLoad(locator);
  // We are expecting the first item in the table to contain the name
  // Ensure that your filter is unique to your subject!
  await expect(locator.getByRole('row').filter({ hasText: name })).toBeVisible();
};

/**
 * Clears all active filters by clicking the "Clear filters" or "Reset filters" button.
 * Silently returns if no clear/reset button is found.
 *
 * @param locator - Page or Locator containing the filter controls
 */
export const clearFilters = async (locator: Locator | Page) => {
  try {
    await locator.getByRole('button', { name: /(Clear|Reset) filters/ }).waitFor({ timeout: 5000 });
  } catch {
    return;
  }

  await locator.getByRole('button', { name: /(Clear|Reset) filters/ }).click();
};

/**
 * Returns a locator for a table row matching the given name.
 * Intelligently handles filtering: only filters if the row is not already visible.
 *
 * @param locator - Page or Locator containing the table
 * @param name - Text content to match in the row
 * @param forceFilter - If true, always applies the name filter even if row is visible (default: false)
 * @returns Locator for the matching table row
 */
export const getRowByName = async (
  locator: Locator | Page,
  name: string,
  forceFilter: boolean = false,
): Promise<Locator> => {
  // First check if the row is visible, if so don't filter, and just return the target
  const target = locator.getByRole('row').filter({ hasText: name });
  if (await target.isVisible()) {
    return target;
  }

  await clearFilters(locator);
  if (!forceFilter && (await target.isVisible())) {
    return target;
  }

  // Now run the filter
  await filterByName(locator, name);
  return target;
};

/**
 * Extracts a specific cell from a table row by matching the column header name.
 * Dynamically finds the column index by searching table headers.
 *
 * @param page - Playwright Page object (used to verify header visibility)
 * @param row - Locator for the table row containing the target cell
 * @param name - Column header name to match (partial match supported)
 * @returns Locator for the gridcell at the matching column index
 * @throws Error if the header name is not found in the table
 */
export const getRowCellByHeader = async (page: Page, row: Locator, name: string) => {
  await expect(page.getByRole('columnheader', { name })).toBeVisible();
  const table = row.locator('xpath=ancestor::*[@role="grid" or @role="table"][1]');
  const headers = table.locator('th');
  const headerCount = await headers.count();

  let index = -1;
  for (let i = 0; i < headerCount; i++) {
    let headerContent = (await headers.nth(i).textContent()) || '';
    headerContent = headerContent.trim();

    if (headerContent.includes(name)) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    throw new Error(`Header "${name}" not found in the table/grid.`);
  }

  return row.getByRole('gridcell').nth(index);
};
