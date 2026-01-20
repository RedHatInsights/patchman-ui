import {
  test,
  expect,
  navigateToAdvisories,
  navigateToPackages,
  navigateToSystems,
  closePopupsIfExist,
  openConditionalFilter,
  verifyFilterTypeExists,
  applyFilterSubtype,
  resetFilters,
} from 'test-utils';

/**
 * Filter tests for Patch pages: Advisories, Packages, and Systems.
 */

test.describe('Patch Filters', () => {
  test('Filter types on Advisory page', async ({ page, request, systems }) => {
    const system = await systems.add('filter-advisory-test', 'base');

    // Fetch an advisory ID from the created system
    const advisoriesResponse = await request
      .get(`/api/patch/v3/systems/${system.id}/advisories?limit=1`)
      .then((r) => r.json());
    const advisoryId = advisoriesResponse?.data?.[0]?.id ?? 'RHSA';

    await navigateToAdvisories(page);
    await closePopupsIfExist(page);
    await openConditionalFilter(page);

    await test.step('Verify "Advisory" filter with search subtype', async () => {
      await verifyFilterTypeExists(page, 'Advisory');
      await applyFilterSubtype(page, 'Advisory', { name: advisoryId, inputType: 'search' });

      // Assert the advisory appears in the filtered results
      await expect(page.getByRole('row').filter({ hasText: advisoryId })).toBeVisible();

      await resetFilters(page);
    });

    await test.step('Verify "Type" filter with all subtypes', async () => {
      await verifyFilterTypeExists(page, 'Type');

      // Test each type filter and verify all results match
      for (const typeValue of ['Security', 'Bugfix', 'Enhancement', 'Other']) {
        await applyFilterSubtype(page, 'Type', { name: typeValue, inputType: 'checkbox' });

        // Get all cells in the Type column using data-label attribute
        const typeCells = page.locator('td[data-label="Type"]');
        const cellCount = await typeCells.count();

        if (cellCount > 0) {
          // Verify ALL Type column cells contain the filtered value
          for (let i = 0; i < cellCount; i++) {
            await expect(typeCells.nth(i)).toHaveText(typeValue);
          }
        }

        await resetFilters(page);
      }
    });

    await test.step('Verify "Severity" filter with all subtypes', async () => {
      await verifyFilterTypeExists(page, 'Severity');

      // Test each severity filter and verify all results match
      for (const severityValue of ['None', 'Low', 'Moderate', 'Important', 'Critical']) {
        await applyFilterSubtype(page, 'Severity', { name: severityValue, inputType: 'checkbox' });

        // Get all cells in the Severity column using data-label attribute
        const severityCells = page.locator('td[data-label="Severity"]');
        const cellCount = await severityCells.count();

        if (cellCount > 0) {
          // Verify ALL Severity column cells contain the filtered value
          for (let i = 0; i < cellCount; i++) {
            await expect(severityCells.nth(i)).toHaveText(severityValue);
          }
        }

        await resetFilters(page);
      }
    });

    await test.step('Verify "Publish date" filter with all subtypes', async () => {
      await verifyFilterTypeExists(page, 'Publish date');

      // Test each publish date option - dates can't be verified directly in cells
      for (const dateValue of [
        'Last 7 days',
        'Last 30 days',
        'Last 90 days',
        'Last year',
        'More than 1 year ago',
      ]) {
        await applyFilterSubtype(page, 'Publish date', { name: dateValue, inputType: 'option' });

        // Verify table responds to filter (dates shown in cells won't match filter name)
        await expect(page.getByRole('grid', { name: 'Patch table view' })).toBeVisible();

        await resetFilters(page);
      }
    });

    await test.step('Verify "Reboot" filter with all subtypes', async () => {
      await verifyFilterTypeExists(page, 'Reboot');

      // Test each reboot filter and verify all results match
      for (const rebootValue of ['Required', 'Not required']) {
        await applyFilterSubtype(page, 'Reboot', { name: rebootValue, inputType: 'checkbox' });

        // Get all cells in the Reboot column using data-label attribute
        const rebootCells = page.locator('td[data-label="Reboot"]');
        const cellCount = await rebootCells.count();

        if (cellCount > 0) {
          // Verify ALL Reboot column cells contain the filtered value
          for (let i = 0; i < cellCount; i++) {
            await expect(rebootCells.nth(i)).toHaveText(rebootValue);
          }
        }

        await resetFilters(page);
      }
    });
  });

  test('Filter types on Packages page', async ({ page, systems }) => {
    await systems.add('filter-packages-test', 'base');

    await navigateToPackages(page);
    await closePopupsIfExist(page);
    await openConditionalFilter(page);

    await test.step('Verify "Package" filter exists', async () => {
      await verifyFilterTypeExists(page, 'Package');
    });

    await test.step('Verify "Patch status" filter exists', async () => {
      await verifyFilterTypeExists(page, 'Patch status');
    });

    await expect(page.getByRole('button', { name: 'Conditional filter toggle' })).toBeVisible();
  });

  test('Filter types on Systems page', async ({ page, systems }) => {
    await systems.add('filter-systems-test', 'base');

    await navigateToSystems(page);
    await closePopupsIfExist(page);
    await openConditionalFilter(page);

    await test.step('Verify "Operating system" filter exists', async () => {
      await verifyFilterTypeExists(page, 'Operating system');
    });

    await test.step('Verify "Workspace" filter exists', async () => {
      await verifyFilterTypeExists(page, 'Workspace');
    });

    await test.step('Verify "Tag" filter exists', async () => {
      await verifyFilterTypeExists(page, 'Tag');
    });

    await test.step('Verify "System" filter exists', async () => {
      await verifyFilterTypeExists(page, 'System');
    });

    await test.step('Verify "Status" filter exists', async () => {
      await verifyFilterTypeExists(page, 'Status');
    });

    await test.step('Verify "Patch status" filter exists', async () => {
      await verifyFilterTypeExists(page, 'Patch status');
    });

    await expect(page.getByRole('button', { name: 'Conditional filter toggle' })).toBeVisible();
  });
});
