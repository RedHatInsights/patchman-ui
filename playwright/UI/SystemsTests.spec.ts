import { test, expect, navigateToSystems, getRowByName, getRowCellByHeader } from 'test-utils';

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
});
