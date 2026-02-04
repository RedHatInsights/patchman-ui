import {
  test,
  expect,
  navigateToSystems,
  getRowByName,
  getRowCellByHeader,
  waitForTableLoad,
  closePopupsIfExist,
  randomName,
  navigateToTemplates,
} from 'test-utils';
import { cleanupRemediationPlan, cleanupTemplates } from 'test-utils/helpers/cleaners';
import { createTemplate } from 'test-utils/helpers/templates';

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

  test('Create a new remediation plan', async ({ page, request, systems, cleanup }) => {
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

    let remediationPlanId: string;

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
      remediationPlanId = (page.url().split('/').pop() ?? '').split('#')[0];
    });

    await test.step('Set up cleanup', async () => {
      cleanup.add(() => cleanupRemediationPlan(request, remediationPlanId));
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
      await expect(page.getByRole('row')).toHaveCount(2);

      await page.getByRole('tab', { name: 'SystemsTab' }).click();
      await expect(page.getByRole('tab', { name: 'SystemsTab' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await waitForTableLoad(page);
      await expect(await getRowByName(page, system.name)).toBeVisible();
      await expect(page.getByRole('row')).toHaveCount(2);

      await page.getByRole('tab', { name: 'ExecutionHistoryTab' }).click();
      await expect(page.getByRole('tab', { name: 'ExecutionHistoryTab' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await waitForTableLoad(page);
      await expect(page.getByText('No execution history')).toBeVisible();
    });
  });

  test('Version-locked systems display a tooltip and cannot be assigned to a template', async ({
    page,
    request,
    systems,
    cleanup,
  }) => {
    const system = await systems.add('version-locked-system-test', 'version-locked');
    const version = '9.6';
    let templateUUID: string;
    const templatePrefix = 'template-version-locked-system-test';
    const templateName = `${templatePrefix}-${randomName()}`;

    await navigateToSystems(page);
    await closePopupsIfExist(page);
    const row = await getRowByName(page, system.name);

    await test.step('Set up cleanup', async () => {
      await cleanup.runAndAdd(() => cleanupTemplates(request, templatePrefix));
    });

    await test.step('Tooltip is displayed showing the system is version-locked', async () => {
      const OScell = await getRowCellByHeader(page, row, 'OS');
      await OScell.hover();
      await expect(
        page.getByText(`Your RHEL version is locked at version ${version}`),
      ).toBeVisible();
    });

    await test.step('Create a template via API', async () => {
      templateUUID = await createTemplate(
        request,
        templateName,
        'VersionLockedSystemTestDescription',
      );
      expect(templateUUID).toBeDefined();
    });

    await test.step('Navigate to details of created template', async () => {
      await navigateToTemplates(page);
      const templateRow = await getRowByName(page, templateName);
      await templateRow.getByRole('button', { name: templateName }).click();
      expect(page.url()).toContain(templateUUID);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(templateName);
    });

    await test.step('Verify template cannot be assigned to the version-locked system', async () => {
      await page.getByRole('button', { name: 'Assign to systems' }).click();
      const modal = page.getByRole('dialog', { name: 'Assign template to systems' });
      await expect(modal).toBeVisible();
      const systemRow = await getRowByName(modal, system.name);
      await expect(systemRow.getByRole('checkbox')).toBeDisabled();
      // using an OUIA attribute selector here, other tests depend on the default data-testid attribute
      // so we can't change the testIdAttribute globally
      await systemRow.locator('[data-ouia-component-id="system-list-warning-icon"]').hover();
      await expect(page.getByText('Cannot associate system with a template')).toBeVisible();
      await expect(page.getByText(`RHEL is locked at version ${version}`)).toBeVisible();
    });
  });
});
