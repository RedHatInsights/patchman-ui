import { Page } from 'playwright-core';
import {
  test,
  expect,
  navigateToSystems,
  closePopupsIfExist,
  waitForTableLoad,
  navigateToAdvisories,
} from 'test-utils';

const commonNonInventoryLocators = (page: Page) => {
  const currentPageNumber = page.getByRole('spinbutton', { name: 'Current page' });
  const pageCountLocator = page.locator('.pf-v6-c-pagination__nav-page-select > span').last();
  return {
    currentPageNumber,
    pageCountLocator,
  };
};

test.describe('Pagination', () => {
  test('Verify pagination on systems page', async ({ page, systems }) => {
    let prefix: string;
    const toolbarPaginationButton = page
      .getByTestId('inventory-table-top-toolbar')
      .getByRole('button', { name: 'Items per page' });
    const targetRows = page.getByRole('row').filter({ has: page.getByText('system-pagination') });
    const topNextButton = page
      .getByTestId('inventory-table-top-toolbar')
      .getByRole('button', { name: 'Go to next page' });
    const topPreviousButton = page
      .getByTestId('inventory-table-top-toolbar')
      .getByRole('button', { name: 'Go to previous page' });
    const bottomNextButton = page
      .getByTestId('inventory-table-bottom-toolbar')
      .getByRole('button', { name: 'Go to next page' });
    const bottomPreviousButton = page
      .getByTestId('inventory-table-bottom-toolbar')
      .getByRole('button', { name: 'Go to previous page' });
    const bottomFirstPageButton = page.getByRole('button', { name: 'Go to first page' });
    const bottomLastPageButton = page.getByRole('button', { name: 'Go to last page' });
    const { currentPageNumber, pageCountLocator } = commonNonInventoryLocators(page);

    await test.step('Populate the systems table', async () => {
      const { prefix: systemPrefix } = await systems.addMany(12, 'system-pagination', 'base');
      prefix = systemPrefix;

      await navigateToSystems(page);
      await closePopupsIfExist(page);
    });

    await test.step('Filter and sort the table', async () => {
      await page.getByPlaceholder(/^Filter by name.*$/).fill(prefix);
      await waitForTableLoad(page);
      await page.getByRole('columnheader', { name: 'Name' }).click();

      await expect(toolbarPaginationButton).toHaveText('1 - 12 of 12');
      await expect(targetRows).toHaveCount(12);
      await expect(topNextButton).toBeDisabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeDisabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeDisabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      await expect(pageCountLocator).toHaveText('of 1');
    });

    await test.step('Set pagination to 10 using top paginator', async () => {
      await toolbarPaginationButton.click();
      await page.getByRole('menuitem', { name: '10 per page' }).click();

      await expect(toolbarPaginationButton).toHaveText('1 - 10 of 12');
      await expect(page.getByText(`${prefix}-10`)).toBeVisible();
      await expect(page.getByText(`${prefix}-11`)).toBeHidden();
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      await expect(pageCountLocator).toHaveText('of 2');
    });

    await test.step('Top paginator: click go to next page button', async () => {
      await topNextButton.click();

      await expect(toolbarPaginationButton).toHaveText('11 - 12 of 12');
      await expect(page.getByText(`${prefix}-11`)).toBeVisible();
      await expect(page.getByText(`${prefix}-12`)).toBeVisible();
      await expect(page.getByText(`${prefix}-10`)).toBeHidden();
      await expect(targetRows).toHaveCount(2);
      await expect(topNextButton).toBeDisabled();
      await expect(topPreviousButton).toBeEnabled();
      await expect(bottomNextButton).toBeDisabled();
      await expect(bottomPreviousButton).toBeEnabled();
      await expect(bottomLastPageButton).toBeDisabled();
      await expect(bottomFirstPageButton).toBeEnabled();
      await expect(currentPageNumber).toHaveValue('2');
      await expect(pageCountLocator).toHaveText('of 2');
    });

    await test.step('Top paginator: click go to previous page button', async () => {
      await topPreviousButton.click();

      await expect(toolbarPaginationButton).toHaveText('1 - 10 of 12');
      await expect(page.getByText(`${prefix}-10`)).toBeVisible();
      await expect(page.getByText(`${prefix}-11`)).toBeHidden();
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      await expect(pageCountLocator).toHaveText('of 2');
    });

    await test.step('Bottom paginator: click go to next page button', async () => {
      await bottomNextButton.click();

      await expect(toolbarPaginationButton).toHaveText('11 - 12 of 12');
      await expect(page.getByText(`${prefix}-11`)).toBeVisible();
      await expect(page.getByText(`${prefix}-12`)).toBeVisible();
      await expect(page.getByText(`${prefix}-10`)).toBeHidden();
      await expect(targetRows).toHaveCount(2);
      await expect(topNextButton).toBeDisabled();
      await expect(topPreviousButton).toBeEnabled();
      await expect(bottomNextButton).toBeDisabled();
      await expect(bottomPreviousButton).toBeEnabled();
      await expect(bottomLastPageButton).toBeDisabled();
      await expect(bottomFirstPageButton).toBeEnabled();
      await expect(currentPageNumber).toHaveValue('2');
      await expect(pageCountLocator).toHaveText('of 2');
    });

    await test.step('Bottom paginator: click go to previous page button', async () => {
      await bottomPreviousButton.click();

      await expect(toolbarPaginationButton).toHaveText('1 - 10 of 12');
      await expect(page.getByText(`${prefix}-10`)).toBeVisible();
      await expect(page.getByText(`${prefix}-11`)).toBeHidden();
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      await expect(pageCountLocator).toHaveText('of 2');
    });

    await test.step('Bottom paginator: click go to last page button', async () => {
      await bottomLastPageButton.click();

      await expect(toolbarPaginationButton).toHaveText('11 - 12 of 12');
      await expect(page.getByText(`${prefix}-11`)).toBeVisible();
      await expect(page.getByText(`${prefix}-12`)).toBeVisible();
      await expect(page.getByText(`${prefix}-10`)).toBeHidden();
      await expect(targetRows).toHaveCount(2);
      await expect(topNextButton).toBeDisabled();
      await expect(topPreviousButton).toBeEnabled();
      await expect(bottomNextButton).toBeDisabled();
      await expect(bottomPreviousButton).toBeEnabled();
      await expect(bottomLastPageButton).toBeDisabled();
      await expect(bottomFirstPageButton).toBeEnabled();
      await expect(currentPageNumber).toHaveValue('2');
      await expect(pageCountLocator).toHaveText('of 2');
    });

    await test.step('Bottom paginator: click go to first page button', async () => {
      await bottomFirstPageButton.click();

      await expect(toolbarPaginationButton).toHaveText('1 - 10 of 12');
      await expect(page.getByText(`${prefix}-10`)).toBeVisible();
      await expect(page.getByText(`${prefix}-11`)).toBeHidden();
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      await expect(pageCountLocator).toHaveText('of 2');
    });

    await test.step('Bottom paginator: input page number', async () => {
      await currentPageNumber.fill('2');
      await currentPageNumber.press('Enter');

      await expect(toolbarPaginationButton).toHaveText('11 - 12 of 12');
      await expect(page.getByText(`${prefix}-11`)).toBeVisible();
      await expect(page.getByText(`${prefix}-12`)).toBeVisible();
      await expect(page.getByText(`${prefix}-10`)).toBeHidden();
      await expect(targetRows).toHaveCount(2);
      await expect(topNextButton).toBeDisabled();
      await expect(topPreviousButton).toBeEnabled();
      await expect(bottomNextButton).toBeDisabled();
      await expect(bottomPreviousButton).toBeEnabled();
      await expect(bottomLastPageButton).toBeDisabled();
      await expect(bottomFirstPageButton).toBeEnabled();
      await expect(currentPageNumber).toHaveValue('2');
      await expect(pageCountLocator).toHaveText('of 2');
    });

    await test.step('Bottom paginator: set pagination to 20', async () => {
      await toolbarPaginationButton.click();
      await page.getByRole('menuitem', { name: '20 per page' }).click();

      await expect(toolbarPaginationButton).toHaveText('1 - 12 of 12');
      await expect(targetRows).toHaveCount(12);
      await expect(topNextButton).toBeDisabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeDisabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeDisabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      await expect(pageCountLocator).toHaveText('of 1');
    });
  });

  test('Verify pagination on advisories page', async ({ page, systems }) => {
    const { currentPageNumber, pageCountLocator } = commonNonInventoryLocators(page);
    const toolbarTopPaginationToggle = page.locator('#options-menu-top-toggle');
    const toolbarBottomPaginationToggle = page.locator(
      '#pagination-options-menu-bottom-bottom-toggle',
    );
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
    let pageCount: string;
    let initialPageCount: string;

    await test.step('Populate the advisories table', async () => {
      await systems.add('system-remediation-plan-test', 'base');

      await navigateToAdvisories(page);
      await closePopupsIfExist(page);

      advisoriesCount = (await toolbarTopPaginationToggle.textContent())
        ?.trimEnd()
        .split(' ')
        .pop();
      await expect(toolbarTopPaginationToggle).toHaveText(`1 - 20 of ${advisoriesCount}`);
      await expect(toolbarBottomPaginationToggle).toHaveText(`1 - 20 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(20);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      initialPageCount = (await pageCountLocator.textContent())?.split(' ').pop() ?? '';
    });

    await test.step('Top paginator: set pagination to 10', async () => {
      await toolbarTopPaginationToggle.click();
      await page.getByRole('menuitem', { name: '10 per page' }).click();

      await expect(toolbarTopPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(toolbarBottomPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
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

      await expect(toolbarTopPaginationToggle).toHaveText(`11 - 20 of ${advisoriesCount}`);
      await expect(toolbarBottomPaginationToggle).toHaveText(`11 - 20 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeEnabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeEnabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeEnabled();
      await expect(currentPageNumber).toHaveValue('2');
      await expect(pageCountLocator).toHaveText(`of ${pageCount}`);
    });

    await test.step('Top paginator: click go to previous page button', async () => {
      await topPreviousButton.click();

      await expect(toolbarTopPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(toolbarBottomPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      await expect(pageCountLocator).toHaveText(`of ${pageCount}`);
    });

    await test.step('Bottom paginator: click go to next page button', async () => {
      await bottomNextButton.click();

      await expect(toolbarTopPaginationToggle).toHaveText(`11 - 20 of ${advisoriesCount}`);
      await expect(toolbarBottomPaginationToggle).toHaveText(`11 - 20 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeEnabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeEnabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeEnabled();
      await expect(currentPageNumber).toHaveValue('2');
      await expect(pageCountLocator).toHaveText(`of ${pageCount}`);
    });

    await test.step('Bottom paginator: click go to previous page button', async () => {
      await bottomPreviousButton.click();

      await expect(toolbarTopPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(toolbarBottomPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      await expect(pageCountLocator).toHaveText(`of ${pageCount}`);
    });

    await test.step('Bottom paginator: click go to last page button', async () => {
      await bottomLastPageButton.click();

      await expect(toolbarTopPaginationToggle).toContainText(
        ` - ${advisoriesCount} of ${advisoriesCount}`,
      );
      await expect(toolbarBottomPaginationToggle).toContainText(
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
      await expect(pageCountLocator).toHaveText(`of ${pageCount}`);
    });

    await test.step('Bottom paginator: click go to first page button', async () => {
      await bottomFirstPageButton.click();

      await expect(toolbarTopPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(toolbarBottomPaginationToggle).toHaveText(`1 - 10 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      await expect(pageCountLocator).toHaveText(`of ${pageCount}`);
    });

    await test.step('Bottom paginator: input page number', async () => {
      await currentPageNumber.fill('3');
      await currentPageNumber.press('Enter');

      await expect(toolbarTopPaginationToggle).toHaveText(`21 - 30 of ${advisoriesCount}`);
      await expect(toolbarBottomPaginationToggle).toHaveText(`21 - 30 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(10);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeEnabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeEnabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeEnabled();
      await expect(currentPageNumber).toHaveValue('3');
      await expect(pageCountLocator).toHaveText(`of ${pageCount}`);
    });

    await test.step('Bottom paginator: set pagination to 20', async () => {
      await toolbarBottomPaginationToggle.click();
      await page.getByRole('menuitem', { name: '20 per page' }).click();

      await expect(toolbarTopPaginationToggle).toHaveText(`1 - 20 of ${advisoriesCount}`);
      await expect(toolbarBottomPaginationToggle).toHaveText(`1 - 20 of ${advisoriesCount}`);
      await expect(targetRows).toHaveCount(20);
      await expect(topNextButton).toBeEnabled();
      await expect(topPreviousButton).toBeDisabled();
      await expect(bottomNextButton).toBeEnabled();
      await expect(bottomPreviousButton).toBeDisabled();
      await expect(bottomLastPageButton).toBeEnabled();
      await expect(bottomFirstPageButton).toBeDisabled();
      await expect(currentPageNumber).toHaveValue('1');
      await expect(pageCountLocator).toHaveText(`of ${initialPageCount}`);
    });
  });
});
