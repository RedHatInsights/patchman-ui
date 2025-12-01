import { test, expect, navigateToSystems, closePopupsIfExist, waitForTableLoad } from 'test-utils';

test.describe('System pagination', () => {
  test('Verify pagination on systems page', async ({ page, systems }) => {
    let prefix: string;
    const toolbarPaginationButton = page
      .getByTestId('inventory-table-top-toolbar')
      .getByRole('button', { name: 'Items per page' });

    await test.step('Populate the systems table', async () => {
      const { prefix: systemPrefix } = await systems.addMany(12, 'system-pagination', 'clean');
      prefix = systemPrefix;

      await navigateToSystems(page);
      await closePopupsIfExist(page);

      const targetRows = page
        .getByRole('row')
        .filter({ has: page.getByText(prefix) })
        .first();
      await expect(targetRows).toBeVisible();
    });

    await test.step('Filter and sort the table', async () => {
      await page.getByPlaceholder(/^Filter by name.*$/).fill(prefix);
      await waitForTableLoad(page);
      await page.getByRole('columnheader', { name: 'Name' }).click();
      const targetRows = page.getByRole('row').filter({ has: page.getByText(prefix) });
      await expect(targetRows).toHaveCount(12);
    });

    await test.step('Set pagination to 10 using top paginator', async () => {
      await expect(toolbarPaginationButton).toHaveText('1 - 12 of 12');
      await toolbarPaginationButton.click();
      await page.getByRole('menuitem', { name: '10 per page' }).click();
    });

    await test.step('Assert there are only ten repos displayed', async () => {
      await expect(toolbarPaginationButton).toHaveText('1 - 10 of 12');
      await expect(page.getByText(`${prefix}-10`)).toBeVisible();
      await expect(page.getByText(`${prefix}-11`)).toBeHidden();
      const targetRows = page.getByRole('row').filter({ has: page.getByText(prefix) });
      await expect(targetRows).toHaveCount(10);
    });

    await test.step('Move to second page and assert only two repos are displayed', async () => {
      await page.getByLabel('Go to next page').first().click();
      await expect(toolbarPaginationButton).toHaveText('11 - 12 of 12');
      await expect(page.getByText(`${prefix}-11`)).toBeVisible();
      await expect(page.getByText(`${prefix}-12`)).toBeVisible();
      await expect(page.getByText(`${prefix}-10`)).toBeHidden();
      const targetRows = page.getByRole('row').filter({ has: page.getByText(prefix) });
      await expect(targetRows).toHaveCount(2);
    });

    await test.step('Move back to first page and assert only two repos are displayed', async () => {
      await page.getByLabel('Go to previous page').first().click();
      await expect(toolbarPaginationButton).toHaveText('1 - 10 of 12');
      await expect(page.getByText(`${prefix}-10`)).toBeVisible();
      await expect(page.getByText(`${prefix}-11`)).toBeHidden();
      const targetRows = page.getByRole('row').filter({ has: page.getByText(prefix) });
      await expect(targetRows).toHaveCount(10);
    });
  });
});
