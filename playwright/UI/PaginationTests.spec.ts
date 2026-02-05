import {
  test,
  expect,
  navigateToSystems,
  closePopupsIfExist,
  waitForTableLoad,
  navigateToAdvisories,
} from 'test-utils';

test.describe('Pagination', () => {
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

  test('Verify pagination on advisories page', async ({ page, systems }) => {
    const toolbarPaginationToggle = page.locator('#options-menu-top-toggle');
    let advisoriesCount: string | undefined;
    const targetRows = page.getByRole('row').filter({ has: page.getByText('RH') });
    const topPreviousButton = page
      .locator('#options-menu-top-pagination')
      .getByRole('button', { name: 'Go to previous page' });
    const topNextButton = page
      .locator('#options-menu-top-pagination')
      .getByRole('button', { name: 'Go to next page' });
    const bottomNextButton = page
      .locator('#pagination-options-menu-bottom-bottom-pagination')
      .getByRole('button', { name: 'Go to next page' });
    const bottomPreviousButton = page
      .locator('#pagination-options-menu-bottom-bottom-pagination')
      .getByRole('button', { name: 'Go to previous page' });
    const bottomLastPageButton = page.getByRole('button', { name: 'Go to last page' });
    const bottomFirstPageButton = page.getByRole('button', { name: 'Go to first page' });
    const currentPageNumber = page.getByRole('spinbutton', { name: 'Current page' });
    const pageCountLocator = page.locator('.pf-v6-c-pagination__nav-page-select > span').last();
    let pageCount: string;

    await test.step('Populate the advisories table', async () => {
      await systems.add('system-remediation-plan-test', 'base');

      await navigateToAdvisories(page);
      await closePopupsIfExist(page);
      await waitForTableLoad(page);

      advisoriesCount = (await toolbarPaginationToggle.textContent())?.trimEnd().split(' ').pop();
      await expect(toolbarPaginationToggle).toHaveText(`1 - 20 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(20);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
    });

    await test.step('Set pagination to 10 using top paginator', async () => {
      await toolbarPaginationToggle.click();
      await page.getByRole('menuitem', { name: '10 per page' }).click();

      await expect(toolbarPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      pageCount = (await pageCountLocator.textContent())?.split(' ').pop() ?? '';
    });

    await test.step('Top paginator: click go to next page button', async () => {
      await topNextButton.click();

      await expect(toolbarPaginationToggle).toHaveText(`11 - 20 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeEnabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeEnabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeEnabled();
      await expect(currentPageNumber).toHaveValue('2');
    });

    await test.step('Top paginator: click go to previous page button', async () => {
      await topPreviousButton.click();

      await expect(toolbarPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
    });

    await test.step('Bottom paginator: click go to next page button', async () => {
      await bottomNextButton.click();

      await expect(toolbarPaginationToggle).toHaveText(`11 - 20 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeEnabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeEnabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeEnabled();
      await expect(currentPageNumber).toHaveValue('2');
    });

    await test.step('Bottom paginator: click go to previous page button', async () => {
      await bottomPreviousButton.click();

      await expect(toolbarPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
    });

    await test.step('Bottom paginator: click go to last page button', async () => {
      await bottomLastPageButton.click();

      await expect(toolbarPaginationToggle).toContainText(
        ` - ${advisoriesCount} of ${advisoriesCount}`,
      );
      expect(await targetRows.count()).toBeLessThanOrEqual(10);
      await expect(topNextButton).toBeDisabled();
      await expect(topPreviousButton).toBeEnabled();
      await expect(bottomNextButton).toBeDisabled();
      await expect(bottomPreviousButton).toBeEnabled();
      await expect(bottomLastPageButton).toBeDisabled();
      await expect(bottomFirstPageButton).toBeEnabled();
      await expect(currentPageNumber).toHaveValue(pageCount);
    });

    await test.step('Bottom paginator: click go to first page button', async () => {
      await bottomFirstPageButton.click();

      await expect(toolbarPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
    });
  });
});
