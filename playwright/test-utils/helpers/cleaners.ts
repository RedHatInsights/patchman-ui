import { test, APIRequestContext } from '@playwright/test';
import { poll } from 'test-utils';

/**
 * Asynchronously cleans up templates with specified name prefixes.
 *
 * This function performs the following tasks:
 * - Fetches all existing templates from the API.
 * - Identifies templates whose names start with any of the provided prefixes.
 * - Deletes the identified templates by their unique identifiers (UUIDs).
 * - Waits for the deletion tasks to complete before finishing execution.
 *
 * If no templates match the specified prefixes, no deletion is performed.
 * The function handles scenarios where templates may already be deleted, ignoring 404 errors.
 *
 * @param {APIRequestContext} request - The API request context used for making HTTP requests.
 * @param {...string} prefixes - One or more prefixes to match against template names.
 * @returns {Promise<void>} A promise that resolves once the cleanup process completes.
 * @throws {Error} If an unexpected error occurs during template deletion.
 */
export const cleanupTemplates = async (
  request: APIRequestContext,
  ...prefixes: string[]
): Promise<void> =>
  await test.step(
    `Cleanup templates: ${prefixes.join(', ')}`,
    async () => {
      let templates = [];
      let tasks = [];

      // Fetch all templates
      try {
        templates = await request
          .get('/api/content-sources/v1.0/templates/', { params: { limit: 1000 } })
          .then((response) => response.json())
          .then((response) => response.data);
      } catch (error) {
        console.error(`Failed to fetch templates for cleanup with an error: ${error}`);
        return;
      }

      if (templates.length === 0) {
        return; // Return if there are no templates to cleanup
      }

      // Find templates with matching prefixes and return their uuids
      const uuids = templates
        .filter((template: any) => prefixes.some((prefix) => template.name.startsWith(prefix)))
        .map((template: any) => template.uuid);

      if (uuids.length === 0) {
        return; // Return if no matching templates were found
      }

      // Start deletion of matching templates
      for (const uuid of uuids) {
        try {
          await request.delete(`/api/content-sources/v1.0/templates/${uuid}`);
        } catch (error) {
          const status = (error as any)?.response?.status || (error as any)?.status;
          if (status === 404) {
            console.info(`Template with UUID ${uuid} not found or already deleted (404)`);
          } else {
            // Only ignore 404 errors (template not found, already deleted), re-throw others as they are unexpected
            throw error;
          }
        }
      }

      const getTasks = async () =>
        await request
          .get('/api/content-sources/v1.0/tasks/', {
            params: { type: 'delete-templates', limit: uuids.length },
          })
          .then((response) => response.json());

      const hasPendingTasks = (result: any) =>
        // Look for failed tasks too, to ensure tests won't keep hanging on the polling loop
        result.data?.filter((task: any) => task.status === 'completed' || task.status === 'failed')
          .length !== uuids.length;

      try {
        tasks = await poll(getTasks, hasPendingTasks, 100).then((response) => response.data);
      } catch (error) {
        console.error(`Failed to poll tasks for cleanup: ${error}`);
        return;
      }

      if (!tasks?.length) {
        console.warn('Template cleanup: no tasks returned');
        return;
      }

      const allTasksCompleted = tasks.every((task: any) => task.status === 'completed');

      if (allTasksCompleted) {
        console.info(`Template(s) ${uuids.join(', ')} deleted successfully`);
      } else {
        const failedTasks = tasks.filter((task: any) => task.status === 'failed');
        console.warn(`Template cleanup: ${failedTasks.length} task(s) failed`);
      }
    },
    { box: true },
  );
