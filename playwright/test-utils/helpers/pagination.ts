import { Page } from '@playwright/test';

export async function getTotalCountFromPagination(page: Page): Promise<number> {
  const paginationText = await page.locator('.pf-v6-c-pagination__page-menu').first().textContent();
  const match = paginationText?.match(/of\s*(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  throw new Error(`Could not extract total count from pagination: ${paginationText}`);
}
