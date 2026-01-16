import {
  test,
  expect,
  getRowByName,
  navigateToSystems,
  randomName,
  closePopupsIfExist,
  isInPatch,
  poll,
} from 'test-utils';
import { cleanupTemplates } from 'test-utils/helpers/cleaners';

import { refreshSubscriptionManager, RHSMClient } from 'test-utils/helpers/rhsmClient';
import { pollForSystemTemplateAttachment } from 'test-utils/helpers/systems';

test.describe('System Registration and Template Assignment', () => {
  test('verify template assignment displays correctly in Patch Systems UI', async ({
    page,
    request,
    cleanup,
  }) => {
    const templatePrefix = 'TemplateAssignmentTest';
    const templateName = `${templatePrefix}-${randomName()}`;
    const containerName = `RHSMClientTest-${randomName()}`;

    let templateUUID: string;
    let systemUUID: string;

    const client = new RHSMClient(containerName);
    let hostname: string;

    await test.step('Set up cleanup', async () => {
      await cleanup.runAndAdd(() => cleanupTemplates(request, templatePrefix));
      cleanup.add(() => client.Destroy('rhc'));
    });

    await test.step('Boot and register system', async () => {
      await client.Boot('rhel9');

      const registration = await client.RegisterRHC();
      if (registration?.exitCode !== 0) {
        throw new Error(`System registration failed with exit code: ${registration?.exitCode}`);
      }

      hostname = await client.GetHostname();
      console.log('System hostname:', hostname);
    });

    await test.step('Wait for system to appear in Patch API', async () => {
      await expect
        .poll(async () => await isInPatch(page, hostname, true), {
          message: 'System did not appear in Patch in time',
          timeout: 600_000,
          intervals: [10_000],
        })
        .toBe(true);
    });

    await test.step('Verify system shows "No template" in Systems table', async () => {
      await navigateToSystems(page);
      await closePopupsIfExist(page);

      const row = await getRowByName(page, hostname);
      await expect(row.getByText('No template')).toBeVisible();
    });

    await test.step('Create template via API', async () => {
      try {
        templateUUID = await request
          .post('/api/content-sources/v1.0/templates/', {
            data: {
              name: templateName,
              description: 'CanAssignTemplateToSystemTestDescription',
              arch: 'x86_64',
              version: '9',
              repository_uuids: [
                '00b214de-e01d-4191-ad48-59bcc859e691', // AppStream repo
                '5d2861ad-0d74-4116-98b4-254880126654', // BaseOS repo
              ],
              use_latest: true,
            },
          })
          .then((response) => response.json())
          .then((response) => response?.uuid);
        expect(templateUUID, 'Template UUID should be returned').toBeDefined();
      } catch (error) {
        throw new Error(`Failed to create template '${templateName}': ${error}`);
      }

      // Wait for template to sync from Content Sources to Patch API
      await expect
        .poll(
          async () => {
            try {
              const response = await request.get('/api/patch/v3/templates', {
                params: { search: templateName, limit: 1 },
              });
              const result = await response.json();
              return result?.data?.length > 0;
            } catch (error) {
              console.log(`Network error while polling for template '${templateName}':`, error);
              return false;
            }
          },
          {
            message: `Template '${templateName}' did not appear in Patch API`,
            timeout: 60_000,
            intervals: [10_000],
          },
        )
        .toBe(true);
    });

    await test.step('Assign template to system via API', async () => {
      // Get system UUID from Patch API
      try {
        systemUUID = await request
          .get('/api/patch/v3/systems', { params: { search: hostname, limit: 1 } })
          .then((response) => response.json())
          .then((response) => response.data?.[0]?.id);
        expect(systemUUID, `System '${hostname}' should exist in Patch`).toBeDefined();
      } catch (error) {
        throw new Error(`Failed to fetch system '${hostname}' from Patch: ${error}`);
      }

      // Assign the template to the system
      // We poll here because the backend may return a 400 status while the system is in a transitional state
      const assignTemplate = async () => {
        try {
          return await request.patch(`/api/patch/v3/templates/${templateUUID}/systems`, {
            data: { systems: [systemUUID] },
          });
        } catch {
          return { status: () => 0 }; // Treat network errors as a retryable status (0) to continue polling
        }
      };
      const shouldRetryAssignment = (response: any) => response.status() !== 200;
      await poll(assignTemplate, shouldRetryAssignment, 1000);

      await refreshSubscriptionManager(client);
    });

    await test.step('Verify template assignment in API', async () => {
      const isAttached = await pollForSystemTemplateAttachment(page, hostname, true, 5_000, 6);
      expect(
        isAttached,
        `Template '${templateName}' should be attached to system '${hostname}'`,
      ).toBe(true);
    });

    await test.step('Verify template is displayed in Systems table', async () => {
      // The UI does not automatically refresh when data changes via API
      // Reload to clear stale data from our earlier visit
      // See: https://issues.redhat.com/browse/RHINENG-23269
      await page.reload();

      const row = await getRowByName(page, hostname);
      await expect(row.getByText(templateName)).toBeVisible();
    });

    await test.step('Verify template link on system details page', async () => {
      const row = await getRowByName(page, hostname);
      await row.getByRole('link', { name: hostname }).click();
      await expect(page.getByRole('link', { name: templateName })).toBeVisible();
    });

    await test.step('Verify system uses internal repository URLs', async () => {
      await expect
        .poll(
          async () => {
            try {
              await refreshSubscriptionManager(client);
              const result = await client.Exec(
                ['grep', '-c', 'cert.console', '/etc/yum.repos.d/redhat.repo'],
                10_000,
              );
              return Number(result?.stdout?.trim()) || 0;
            } catch {
              return -1; // Return -1 on crash so it keeps retrying
            }
          },
          {
            message: 'Internal URLs should match expected count of 2',
            timeout: 60_000,
            intervals: [5_000], // Retry every 5 seconds
          },
        )
        .toBe(2);
    });
  });
});
