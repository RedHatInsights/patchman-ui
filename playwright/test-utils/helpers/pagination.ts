import { Page } from '@playwright/test';

export async function getTotalCountFromPagination(page: Page): Promise<number> {
  const paginationText = await page.locator('.pf-v6-c-pagination__page-menu').first().textContent();
  const match = paginationText?.match(/of\s*(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  throw new Error(`Could not extract total count from pagination: ${paginationText}`);
}

export const commonNonInventoryPaginationLocators = (page: Page) => {
  const currentPageNumber = page.getByRole('spinbutton', { name: 'Current page' });
  const pageCountLocator = page.locator('.pf-v6-c-pagination__nav-page-select > span').last();
  const toolbarTopPaginationToggle = page.locator('#options-menu-top-toggle');
  const toolbarBottomPaginationToggle = page.locator(
    '#pagination-options-menu-bottom-bottom-toggle',
  );
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
  return {
    currentPageNumber,
    pageCountLocator,
    toolbarTopPaginationToggle,
    toolbarBottomPaginationToggle,
    topPreviousButton,
    topNextButton,
    bottomNextButton,
    bottomPreviousButton,
    bottomLastPageButton,
    bottomFirstPageButton,
  };
};
