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
  waitForTableLoad,
  getPublishDateCutoff,
  parsePublishDateCell,
  osBaseName,
  getWorkspaceGroup,
  selectFilterType,
} from 'test-utils';

/** One day in ms; used for date-only display tolerance. */
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Filter tests for Patch pages: Advisories, Packages, and Systems.
 */

test.describe('Patch Filters', () => {
  test('Filter types on Advisory page', async ({ page, request, systems }) => {
    const system = await systems.add('filter-advisory-test', 'base', undefined, {
      tags: { network_performance: 'latency' },
    });

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

      // Assert exactly one data row exists (header + 1 row) and that it contains the advisory ID
      const rows = page.getByRole('row');
      await expect(rows).toHaveCount(2);
      await expect(rows.filter({ hasText: advisoryId })).toHaveCount(1);

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

      for (const dateValue of [
        'Last 7 days',
        'Last 30 days',
        'Last 90 days',
        'Last year',
        'More than 1 year ago',
      ]) {
        await applyFilterSubtype(page, 'Publish date', { name: dateValue, inputType: 'option' });

        await expect(page.getByRole('grid', { name: 'Patch table view' })).toBeVisible();

        const { minDate, maxDate } = getPublishDateCutoff(dateValue);
        const publishDateCells = page.locator('td[data-label="Publish date"]');
        const cellCount = await publishDateCells.count();

        if (cellCount > 0) {
          for (let i = 0; i < cellCount; i++) {
            const text = await publishDateCells.nth(i).textContent();
            const cellDate = parsePublishDateCell(text ?? '');
            if (cellDate) {
              if (minDate !== undefined) {
                // Cell shows date only (no time); allow 1-day tolerance for timezone/display
                const cutoffMs = minDate.getTime() - DAY_MS;
                expect(
                  cellDate.getTime(),
                  `Publish date "${text}" should not be older than ${dateValue}`,
                ).toBeGreaterThanOrEqual(cutoffMs);
              } else if (maxDate !== undefined) {
                // "More than 1 year ago" means date must be before the cutoff
                expect(
                  cellDate.getTime(),
                  `Publish date "${text}" should be older than 1 year`,
                ).toBeLessThanOrEqual(maxDate.getTime());
              }
            }
          }
        }

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
    await waitForTableLoad(page);

    // Use a package name from the table so the filter is guaranteed to match a visible row
    const firstPackageCell = page.locator('td[data-label="Name"]').first();
    await firstPackageCell.waitFor({ state: 'visible' });
    const packageName = (await firstPackageCell.textContent())?.trim();
    expect(packageName, 'Packages table should have at least one row').toBeDefined();

    await openConditionalFilter(page);

    await test.step('Verify "Package" filter exists', async () => {
      await verifyFilterTypeExists(page, 'Package');
    });

    await test.step('Verify "Package" filter with search displays expected package', async () => {
      await applyFilterSubtype(page, 'Package', { name: packageName!, inputType: 'search' });

      const rows = page.getByRole('row');
      await expect(rows).toHaveCount(2);
      await expect(rows.filter({ hasText: packageName })).toHaveCount(1);

      await resetFilters(page);
    });

    await test.step('Verify "Patch status" filter with all subtypes', async () => {
      await verifyFilterTypeExists(page, 'Patch status');

      // "Systems up to date": Packages default is "Systems with patches available". Uncheck it
      // first, then check "Systems up to date" so only eq:0 is sent (API drops filter if both are sent).
      await resetFilters(page);
      await openConditionalFilter(page);
      await applyFilterSubtype(
        page,
        'Patch status',
        { name: 'Systems with patches available', inputType: 'checkbox' },
        { verifyChip: false },
      );
      await openConditionalFilter(page);
      await applyFilterSubtype(page, 'Patch status', {
        name: 'Systems up to date',
        inputType: 'checkbox',
      });

      let applicableCells = page.locator('td[data-label="Applicable systems"]');
      let cellCount = await applicableCells.count();
      if (cellCount > 0) {
        for (let i = 0; i < cellCount; i++) {
          await expect(applicableCells.nth(i)).toHaveText('0');
        }
      }

      // "Systems with patches available": reset restores default (gt:0); no need to click again.
      await resetFilters(page);

      applicableCells = page.locator('td[data-label="Applicable systems"]');
      cellCount = await applicableCells.count();
      if (cellCount > 0) {
        for (let i = 0; i < cellCount; i++) {
          const text = (await applicableCells.nth(i).textContent())?.trim() ?? '';
          const num = parseInt(text, 10);
          expect(
            Number.isNaN(num) ? 0 : num,
            'Applicable systems should be > 0 for "Systems with patches available"',
          ).toBeGreaterThan(0);
        }
      }
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
      await verifyFilterTypeExists(page, 'System', true);
    });

    await test.step('Verify "Status" filter exists', async () => {
      await verifyFilterTypeExists(page, 'Status', true);
    });

    await test.step('Verify "Patch status" filter exists', async () => {
      await verifyFilterTypeExists(page, 'Patch status');
    });

    await expect(page.getByRole('button', { name: 'Conditional filter toggle' })).toBeVisible();
  });
});

/**
 * Verify filter contents (OS, Workspace, Tags, System, Patch status).
 * Note: Workspace and Tag options come from the Inventory service (not Patch).
 * If the Workspace or Tag dropdown is empty, the Inventory API returned no groups/tags
 * for the account (e.g. on stage, or no host groups/tags created in Inventory).
 */
test('Verify filter contents', async ({ page, systems }) => {
  await systems.add('filter-contents-test', 'base', undefined, {
    tags: { network_performance: 'latency' },
  });
  await navigateToSystems(page);
  await closePopupsIfExist(page);
  await openConditionalFilter(page);
  await resetFilters(page);

  await test.step('Verify "Operating system" filter contents', async () => {
    await openConditionalFilter(page);
    await applyFilterSubtype(page, 'Operating system', {
      name: osBaseName,
      inputType: 'checkbox',
    });
    await expect(page.locator('td[data-label="OS"]').first()).toContainText('RHEL');
    await resetFilters(page);
  });

  await test.step('Verify "Workspace" filter contents', async () => {
    await openConditionalFilter(page);
    await selectFilterType(page, 'Workspace');
    await page.getByRole('button', { name: 'Menu toggle' }).click();
    // Workspace options come from Inventory. Set it in insights/inventory/workspaces and in .env file.
    // Otherwise only "Ungrouped Hosts" is available.
    const workspaceGroup = getWorkspaceGroup();
    const groupOption = page
      .getByRole('menuitem')
      .filter({ hasText: workspaceGroup })
      .or(page.getByRole('option', { name: workspaceGroup }));
    let useUngrouped = true;
    try {
      await expect(groupOption.first()).toBeVisible({ timeout: 3000 });
      useUngrouped = false;
    } catch {
      // Group option not in Inventory; use Ungrouped Hosts
    }
    if (useUngrouped) {
      await page
        .getByRole('menuitem')
        .filter({ hasText: 'Ungrouped Hosts' })
        .or(page.getByRole('option', { name: 'Ungrouped Hosts' }))
        .first()
        .click();
      await waitForTableLoad(page);
      await expect(
        page.getByRole('grid', { name: 'Patch table view' }).locator('tbody [role="row"]').first(),
      ).toBeVisible();
    } else {
      await groupOption.first().click();
      await waitForTableLoad(page);
      await expect(page.locator('td').filter({ hasText: workspaceGroup }).first()).toBeVisible();
    }
    await resetFilters(page);
  });

  await test.step('Verify "Tag" filter contents', async () => {
    await openConditionalFilter(page);
    await applyFilterSubtype(page, 'Tag', {
      name: 'network_performance: latency',
      inputType: 'checkbox',
    });
    const grid = page.getByRole('grid', { name: 'Patch table view' });
    await expect(grid.locator('tbody [role="row"]').first()).toBeVisible();
    await expect(page.locator('td[data-label="Name"]').first()).toContainText(
      'filter-contents-test',
    );
    await resetFilters(page);
  });

  await test.step('Verify "System" filter contents', async () => {
    await openConditionalFilter(page);
    // System filter shows "Filter by name" input, not a checkbox menu
    await applyFilterSubtype(page, 'System', {
      name: 'filter-contents-test',
      inputType: 'search',
    });
    await expect(page.locator('td[data-label="Name"]').first()).toContainText(
      'filter-contents-test',
    );
    await resetFilters(page);
  });

  await test.step('Verify "Patch status" filter contents', async () => {
    await openConditionalFilter(page);
    await applyFilterSubtype(page, 'Patch status', {
      name: 'Systems with patches available',
      inputType: 'checkbox',
    });
    await expect(page.locator('td[data-label="Name"]').first()).toContainText(
      'filter-systems-test',
    );
    await resetFilters(page);
  });
});
