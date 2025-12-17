import {
  test,
  expect,
  getRowByName,
  navigateToSystems,
  randomName,
  closePopupsIfExist,
  isInPatch,
} from 'test-utils';

import {
  refreshSubscriptionManager,
  RHSMClient,
  waitForRhcdActive,
} from 'test-utils/helpers/rhsmClient';

test.describe('System Registration and Display', () => {
  test('verify registered system appears in API and UI', async ({ page, cleanup }) => {
    const client = new RHSMClient(`RHSMClientTest-${randomName()}`);
    let hostname: string;

    await test.step('Set up cleanup for RHSM client', async () => {
      cleanup.add(() => client.Destroy('rhc'));
    });

    await test.step('Boot and register RHEL 9 container', async () => {
      await client.Boot('rhel9');
      const registration = await client.RegisterRHC();
      expect(registration?.exitCode, 'registration should be successful').toBe(0);
      await waitForRhcdActive(client);
      await refreshSubscriptionManager(client);
    });

    await test.step('Get system hostname', async () => {
      hostname = await client.GetHostname();
      console.log('System hostname:', hostname);
    });

    await test.step('Verify the system exists in Patch API', async () => {
      await expect
        .poll(async () => await isInPatch(page, hostname, true), {
          message: 'System did not appear in Patch in time',
          timeout: 600_000,
          intervals: [10_000],
        })
        .toBe(true);
    });

    await test.step('Verify the system displays in the Systems table', async () => {
      await navigateToSystems(page);
      await closePopupsIfExist(page);
      await expect(await getRowByName(page, hostname)).toBeVisible();
    });
  });
});
