import * as fs from 'fs';
import { Page } from '@playwright/test';
import Papa from 'papaparse';
import {
  test,
  expect,
  closePopupsIfExist,
  waitForTableLoad,
  navigateToAdvisories,
  getRowCellByHeader,
  navigateToSystems,
  navigateToPackages,
} from 'test-utils';

async function getTotalCountFromPagination(page: Page): Promise<number> {
  const paginationText = await page.locator('.pf-v6-c-pagination__page-menu').first().textContent();
  const match = paginationText?.match(/of\s*(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  throw new Error(`Could not extract total count from pagination: ${paginationText}`);
}

async function exportCsvJson(page: Page): Promise<{ csv: string; json: string }> {
  await page.getByRole('button', { name: 'Export' }).click();

  // Export to CSV
  const [downloadCsv] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('menuitem', { name: 'Export to CSV' }).click(),
  ]);
  const pathCsv = await downloadCsv.path();
  const csv = fs.readFileSync(pathCsv!, 'utf-8');
  expect(csv).toBeTruthy();

  // Re-open the export menu for JSON
  await page.getByRole('button', { name: 'Export' }).click();

  // Export to JSON
  const [downloadJson] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('menuitem', { name: 'Export to JSON' }).click(),
  ]);
  const pathJson = await downloadJson.path();
  const json = fs.readFileSync(pathJson!, 'utf-8');
  expect(json).toBeTruthy();

  return { csv, json };
}

test.describe('Verify exporting feature', () => {
  test('Verify exporting via CSV and JSON on patch', async ({ page }) => {
    await closePopupsIfExist(page);

    await test.step('Verify exporting on Advisory page', async () => {
      await navigateToAdvisories(page);
      await waitForTableLoad(page);
      const uiTotalCount = await getTotalCountFromPagination(page);
      // target all repos and then select the first one
      const repos = page.locator('tbody[role="rowgroup"]');
      const firstRepo = repos.first();
      await expect(firstRepo).toBeVisible();
      const [nameCell, synopsisCell, typeCell] = await Promise.all([
        getRowCellByHeader(page, firstRepo, 'Name'),
        getRowCellByHeader(page, firstRepo, 'Synopsis'),
        getRowCellByHeader(page, firstRepo, 'Type'),
      ]);

      const [nameText, synopsisText, typeText] = await Promise.all([
        nameCell.textContent(),
        synopsisCell.textContent(),
        typeCell.textContent(),
      ]);

      const { csv, json } = await exportCsvJson(page);

      // Parse CSV and find matching row by id (which matches UI name)
      const csvResult = Papa.parse<Record<string, string>>(csv, {
        header: true,
        skipEmptyLines: true,
      });
      expect(csvResult.data.length).toBeGreaterThan(0);

      expect(csvResult.data.length).toBe(uiTotalCount);

      const matchingCsvRow = csvResult.data.find(
        (row: Record<string, string>) => row.id === nameText,
      );
      expect(matchingCsvRow).toBeDefined();

      // Compare UI values with CSV values
      // UI shows truncated text like "tzdata bu(...)" - extract prefix before "(..."
      const synopsisPrefix = synopsisText!.replace(/\(\.\.\.?\)$/, '').trim();

      // CSV synopsis should contain the UI prefix (since UI truncates long text)
      expect(matchingCsvRow!.synopsis.toLowerCase()).toContain(synopsisPrefix.toLowerCase());
      // CSV uses "advisory_type_name" field for type
      expect(matchingCsvRow!.advisory_type_name.toLowerCase()).toBe(typeText!.toLowerCase());

      const jsonData = JSON.parse(json);
      expect(jsonData.length).toBeGreaterThan(0);

      expect(jsonData.length).toBe(uiTotalCount);

      // Find matching row in JSON and validate
      const matchingJsonRow = jsonData.find((row: { id: string }) => row.id === nameText);
      expect(matchingJsonRow).toBeDefined();

      expect(matchingJsonRow.synopsis.toLowerCase()).toContain(synopsisPrefix.toLowerCase());
      expect(matchingJsonRow.advisory_type_name.toLowerCase()).toBe(typeText!.toLowerCase());
    });

    await test.step('Verify exporting on Systems page', async () => {
      await navigateToSystems(page);
      await waitForTableLoad(page);
      const uiTotalCount = await getTotalCountFromPagination(page);
      const rows = page.locator('tbody[role="rowgroup"]');
      const firstRow = rows.first();
      await expect(firstRow).toBeVisible();

      const [nameCell, osCell, installedPackagesCell] = await Promise.all([
        getRowCellByHeader(page, firstRow, 'Name'),
        getRowCellByHeader(page, firstRow, 'OS'),
        getRowCellByHeader(page, firstRow, 'Installed packages'),
      ]);

      const [nameText, osText, installedPackagesText] = await Promise.all([
        nameCell.textContent(),
        osCell.textContent(),
        installedPackagesCell.textContent(),
      ]);

      const { csv, json } = await exportCsvJson(page);

      // Parse CSV and find matching row by display_name
      const csvResult = Papa.parse<Record<string, string>>(csv, {
        header: true,
        skipEmptyLines: true,
      });
      expect(csvResult.data.length).toBeGreaterThan(0);

      expect(csvResult.data.length).toBe(uiTotalCount);

      const matchingCsvRow = csvResult.data.find(
        (row: Record<string, string>) => row.display_name === nameText,
      );
      expect(matchingCsvRow).toBeDefined();

      expect(matchingCsvRow!.os).toBe(osText);
      expect(matchingCsvRow!.packages_installed).toBe(installedPackagesText);

      const jsonData = JSON.parse(json);
      expect(jsonData.length).toBeGreaterThan(0);
      expect(jsonData.length).toBe(uiTotalCount);

      // Find matching row in JSON and validate
      const matchingJsonRow = jsonData.find(
        (row: { display_name: string }) => row.display_name === nameText,
      );
      expect(matchingJsonRow).toBeDefined();

      // Compare UI data with JSON data
      expect(matchingJsonRow.os).toBe(osText);
      expect(String(matchingJsonRow.packages_installed)).toBe(installedPackagesText);
    });

    await test.step('Verify exporting on Package page', async () => {
      await navigateToPackages(page);
      await waitForTableLoad(page);

      const uiTotalCount = await getTotalCountFromPagination(page);
      const rows = page.locator('tbody[role="rowgroup"]');
      const firstRow = rows.first();
      await expect(firstRow).toBeVisible();

      const [nameCell, installedSystemsCell, summaryCell] = await Promise.all([
        getRowCellByHeader(page, firstRow, 'Name'),
        getRowCellByHeader(page, firstRow, 'Installed systems'),
        getRowCellByHeader(page, firstRow, 'Summary'),
      ]);

      const [nameText, installedSystemsText, summaryText] = await Promise.all([
        nameCell.textContent(),
        installedSystemsCell.textContent(),
        summaryCell.textContent(),
      ]);

      const { csv, json } = await exportCsvJson(page);

      // Parse CSV and find matching row by name
      const csvResult = Papa.parse<Record<string, string>>(csv, {
        header: true,
        skipEmptyLines: true,
      });
      expect(csvResult.data.length).toBeGreaterThan(0);

      // Verify row count matches UI count
      expect(csvResult.data.length).toBe(uiTotalCount);

      const matchingCsvRow = csvResult.data.find(
        (row: Record<string, string>) => row.name === nameText,
      );
      expect(matchingCsvRow).toBeDefined();

      // Compare UI values with CSV values
      // UI may show truncated summary - extract prefix before "(..."
      const summaryPrefix = summaryText!.replace(/\(\.\.\.?\)$/, '').trim();

      // CSV summary should contain the UI prefix (since UI may truncate long text)
      expect(matchingCsvRow!.summary.toLowerCase()).toContain(summaryPrefix.toLowerCase());
      expect(matchingCsvRow!.systems_installed).toBe(installedSystemsText);

      const jsonData = JSON.parse(json);
      expect(jsonData.length).toBeGreaterThan(0);

      expect(jsonData.length).toBe(uiTotalCount);

      // Find matching row in JSON and validate
      const matchingJsonRow = jsonData.find((row: { name: string }) => row.name === nameText);
      expect(matchingJsonRow).toBeDefined();

      // Compare UI data with JSON data
      expect(matchingJsonRow.summary.toLowerCase()).toContain(summaryPrefix.toLowerCase());
      expect(String(matchingJsonRow.systems_installed)).toBe(installedSystemsText);
    });
  });
});
