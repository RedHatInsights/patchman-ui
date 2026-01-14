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
import { getTotalCountFromPagination } from 'test-utils/helpers/pagination';

async function exportCsvJson(
  page: Page,
): Promise<{ csvData: Record<string, string>[]; jsonData: Record<string, string>[] }> {
  await page.getByRole('button', { name: 'Export', exact: true }).click();

  // Export to CSV
  const [downloadCsv] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('menuitem', { name: 'Export to CSV' }).click(),
  ]);
  const pathCsv = await downloadCsv.path();
  const csv = fs.readFileSync(pathCsv!, 'utf-8');
  expect(csv).toBeTruthy();

  // Re-open the export menu for JSON
  await page.getByRole('button', { name: 'Export', exact: true }).click();

  // Export to JSON
  const [downloadJson] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('menuitem', { name: 'Export to JSON' }).click(),
  ]);
  const pathJson = await downloadJson.path();
  const json = fs.readFileSync(pathJson!, 'utf-8');
  expect(json).toBeTruthy();

  const csvResult = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (csvResult.errors.length > 0) {
    const errorMessages = csvResult.errors.map((e) => `Row ${e.row}: ${e.message}`).join('; ');
    throw new Error(`CSV parsing failed: ${errorMessages}`);
  }

  let jsonData: Record<string, string>[];
  try {
    jsonData = JSON.parse(json);
  } catch (e) {
    throw new Error(`JSON parsing failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  return { csvData: csvResult.data, jsonData };
}

test.describe('Verify exporting feature', () => {
  test('Verify exporting on Advisory page', async ({ page, systems }) => {
    await systems.add('export-advisory-test', 'base');
    await closePopupsIfExist(page);
    await navigateToAdvisories(page);
    const page_count = await getTotalCountFromPagination(page);
    // target all repos and then select the first one
    const advisories = page.locator('tbody[role="rowgroup"]');
    const firstAdvisory = advisories.first();
    await expect(firstAdvisory).toBeVisible();
    const [nameCell, synopsisCell, typeCell] = await Promise.all([
      getRowCellByHeader(page, firstAdvisory, 'Name'),
      getRowCellByHeader(page, firstAdvisory, 'Synopsis'),
      getRowCellByHeader(page, firstAdvisory, 'Type'),
    ]);

    const [nameText, synopsisText, typeText] = await Promise.all([
      nameCell.textContent(),
      synopsisCell.textContent(),
      typeCell.textContent(),
    ]);

    const { csvData, jsonData } = await exportCsvJson(page);

    expect(csvData.length).toBe(page_count);

    const matchingCsvRow = csvData.find((row) => row.id === nameText);
    expect(matchingCsvRow).toBeDefined();

    // Compare UI values with CSV values
    // UI shows truncated text like "tzdata bu(...)" - extract prefix before "(..."
    const synopsisPrefix = synopsisText!.replace(/\(\.\.\.?\)$/, '').trim();

    // CSV synopsis should contain the UI prefix (since UI truncates long text)
    expect(matchingCsvRow!.synopsis.toLowerCase()).toContain(synopsisPrefix.toLowerCase());
    // CSV uses "advisory_type_name" field for type
    expect(matchingCsvRow!.advisory_type_name.toLowerCase()).toBe(typeText!.toLowerCase());

    expect(jsonData.length).toBe(page_count);

    // Find matching row in JSON and validate
    const matchingJsonRow = jsonData.find((row) => row.id === nameText);
    expect(matchingJsonRow).toBeDefined();

    expect(matchingJsonRow!.synopsis.toLowerCase()).toContain(synopsisPrefix.toLowerCase());
    expect(matchingJsonRow!.advisory_type_name.toLowerCase()).toBe(typeText!.toLowerCase());
  });

  test('Verify exporting on Systems page', async ({ page, systems }) => {
    const system = await systems.add('export-systems-test', 'base');
    await closePopupsIfExist(page);
    await navigateToSystems(page);

    // Filter by our created system to ensure we're testing the right one
    await page.getByPlaceholder(/^Filter by name.*$/).fill(system.name);
    await waitForTableLoad(page);

    const row = page.locator('tbody[role="rowgroup"]').first();
    await expect(row).toBeVisible();

    const [osCell, installedPackagesCell] = await Promise.all([
      getRowCellByHeader(page, row, 'OS'),
      getRowCellByHeader(page, row, 'Installed packages'),
    ]);

    const [osText, installedPackagesText] = await Promise.all([
      osCell.textContent(),
      installedPackagesCell.textContent(),
    ]);

    const { csvData, jsonData } = await exportCsvJson(page);

    // After filtering, we should have exactly 1 system
    expect(csvData.length).toBe(1);

    // Verify our created system is in the exported data
    const matchingCsvRow = csvData.find((row) => row.display_name === system.name);
    expect(matchingCsvRow).toBeDefined();

    expect(matchingCsvRow!.os).toBe(osText);
    expect(matchingCsvRow!.packages_installed).toBe(installedPackagesText);

    expect(jsonData.length).toBe(1);

    // Find matching row in JSON and validate
    const matchingJsonRow = jsonData.find((row) => row.display_name === system.name);
    expect(matchingJsonRow).toBeDefined();

    // Compare UI data with JSON data
    expect(matchingJsonRow!.os).toBe(osText);
    expect(String(matchingJsonRow!.packages_installed)).toBe(installedPackagesText);
  });

  test('Verify exporting on Package page', async ({ page, systems }) => {
    await systems.add('export-packages-test', 'base');
    await closePopupsIfExist(page);
    await navigateToPackages(page);

    const page_count = await getTotalCountFromPagination(page);
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

    const { csvData, jsonData } = await exportCsvJson(page);

    // Verify row count matches UI count
    expect(csvData.length).toBe(page_count);

    const matchingCsvRow = csvData.find((row) => row.name === nameText);
    expect(matchingCsvRow).toBeDefined();

    // Compare UI values with CSV values
    // UI may show truncated summary - extract prefix before "(..."
    const summaryPrefix = summaryText!.replace(/\(\.\.\.?\)$/, '').trim();

    // CSV summary should contain the UI prefix (since UI may truncate long text)
    expect(matchingCsvRow!.summary.toLowerCase()).toContain(summaryPrefix.toLowerCase());
    expect(matchingCsvRow!.systems_installed).toBe(installedSystemsText);

    expect(jsonData.length).toBe(page_count);

    // Find matching row in JSON and validate
    const matchingJsonRow = jsonData.find((row) => row.name === nameText);
    expect(matchingJsonRow).toBeDefined();

    // Compare UI data with JSON data
    expect(matchingJsonRow!.summary.toLowerCase()).toContain(summaryPrefix.toLowerCase());
    expect(String(matchingJsonRow!.systems_installed)).toBe(installedSystemsText);
  });
});
