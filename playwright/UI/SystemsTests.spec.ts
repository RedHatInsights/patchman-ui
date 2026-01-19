import {
  test,
  expect,
  navigateToSystems,
  getRowByName,
  getRowCellByHeader,
  waitForTableLoad,
  closePopupsIfExist,
} from 'test-utils';

test.describe('Systems Tests', () => {
  test('Verify the shown system data matches the archive', async ({ page, request, systems }) => {
    const system = await systems.add('system-detail-test', 'base');

    const attributes = (
      await request.get(`/api/patch/v3/systems/${system.id}`).then((r) => r.json())
    )?.data?.attributes;
    expect(attributes).toBeDefined();
    const advisories = [
      attributes.installable_rhsa_count ?? 0,
      attributes.installable_rhba_count ?? 0,
      attributes.installable_rhea_count ?? 0,
      attributes.installable_other_count ?? 0,
    ];

    await navigateToSystems(page);
    await closePopupsIfExist(page);
    const row = await getRowByName(page, system.name);

    await test.step('Check systems list page data', async () => {
      const advisoriesCell = await getRowCellByHeader(page, row, 'Installable advisories');
      await expect(advisoriesCell).toHaveText(advisories.filter((n) => n !== 0).join(''));

      const packagesCell = await getRowCellByHeader(page, row, 'Installed packages');
      await expect(packagesCell).toHaveText(`${attributes.packages_installed}`);
    });

    await test.step('Check system detail page data', async () => {
      await row.getByRole('link', { name: system.name }).click();
      await expect(
        page.getByRole('tabpanel', { name: 'Advisories' }).locator('#options-menu-top-toggle'),
      ).toContainText(`${advisories.reduce((a, b) => a + b, 0)}`);

      await page.getByRole('tab', { name: 'Packages' }).click();
      await expect(
        page.getByRole('tabpanel', { name: 'Packages' }).locator('#options-menu-top-toggle'),
      ).toContainText(`${attributes.packages_installable}`);
    });
  });

  test('Create a new remediation plan', async ({ page, systems }) => {
    const system = await systems.add('system-remediation-plan-test', 'base');

    await navigateToSystems(page);
    await closePopupsIfExist(page);
    const row = await getRowByName(page, system.name);

    await row.getByRole('link', { name: system.name }).click();
    const planButton = page.getByRole('button', { name: 'Plan remediation' });
    await expect(planButton).toBeDisabled();

    await test.step('Select an advisory and check that the button is enabled', async () => {
      const checkbox = page.getByRole('checkbox', { name: 'Select row 0' });
      await checkbox.check();
      await expect(checkbox).toBeChecked();

      await expect(planButton).toBeEnabled();
    });

    await test.step('Click the button and create a plan', async () => {
      await planButton.click();
      await expect(page.getByText('Plan a remediation')).toBeVisible();

      await page.getByRole('combobox', { name: 'Type to filter' }).fill(system.name);
      await page.locator('#select-typeahead-create').click();
      await page.getByRole('button', { name: 'Create plan' }).click();
      await expect(page.locator('h1').getByText(system.name)).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Details' })).toBeVisible({
        timeout: 180_000,
      });
    });

    await test.step('Check actions, systems, and execution history tabs', async () => {
      await page.getByRole('tab', { name: 'PlannedRemediationsTab' }).click();
      await expect(page.getByRole('tab', { name: 'PlannedRemediationsTab' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await expect(page.getByRole('tab', { name: 'ActionsTab' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await waitForTableLoad(page);
      await expect(page.locator('section > table > tbody > tr')).toHaveCount(1);

      await page.getByRole('tab', { name: 'SystemsTab' }).click();
      await expect(page.getByRole('tab', { name: 'SystemsTab' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await waitForTableLoad(page);
      await expect(await getRowByName(page, system.name)).toBeVisible();
      await expect(page.locator('section > table > tbody > tr')).toHaveCount(1);

      await page.getByRole('tab', { name: 'ExecutionHistoryTab' }).click();
      await expect(page.getByRole('tab', { name: 'ExecutionHistoryTab' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await waitForTableLoad(page);
      await expect(page.getByText('No execution history')).toBeVisible();
    });

    await test.step('Delete remediation plan', async () => {
      page.locator('div:nth-child(3) > .pf-v6-c-menu-toggle').first().click();
      page.getByRole('menuitem', { name: 'Delete' }).click();
      await expect(page.getByText('Delete remediation plan?')).toBeVisible();
      page.getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByRole('heading', { name: 'Success alert: Deleted' })).toBeVisible();
    });
  });
});
