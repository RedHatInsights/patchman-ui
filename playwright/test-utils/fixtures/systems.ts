/**
 * Playwright test fixture for creating and managing test systems.
 *
 * This fixture provides utilities for creating systems by uploading archives to the
 * Insights ingress API and waiting for them to be processed. All created systems
 * are automatically cleaned up after the test completes.
 *
 * @example
 * ```typescript
 * systemsTest('test with a system', async ({ systems }) => {
 *   const system = await systems.add('my-test', 'base');
 *   // Use system.id and system.name in your test
 * });
 * ```
 */

import { test as base } from '@playwright/test';
import {
  cleanupArchive,
  cleanupSystem,
  createSystem,
  randomName,
  SystemResult,
  SystemType,
} from 'test-utils';

/**
 * Type extension for Playwright test context that includes the systems fixture.
 */
type WithSystems = {
  systems: Systems;
};

/**
 * Interface for the systems fixture that provides methods to create and manage test systems.
 */
export interface Systems {
  /**
   * Creates a single test system by uploading an archive and waiting for it to be processed.
   *
   * @param prefix - Prefix for the system name (will be combined with a random suffix)
   * @param type - Type of system to create (defaults to 'base')
   * @returns Promise resolving to the created system's ID and name
   *
   * @example
   * ```typescript
   * const system = await systems.add('my-test', 'base');
   * console.log(system.id, system.name);
   * ```
   */
  add: (prefix: string, type?: SystemType) => Promise<SystemResult>;

  /**
   * Creates multiple test systems in parallel.
   *
   * @param count - Number of systems to create
   * @param prefix - Prefix for system names (will be combined with a random suffix and index)
   * @param type - Type of systems to create (defaults to 'base')
   * @returns Promise resolving to a randomized prefix and an array of created systems
   *
   * @example
   * ```typescript
   * const result = await systems.addMany(5, 'bulk-test', 'base');
   * // Creates 5 systems with names like: bulk-test-xyz123-1, bulk-test-xyz123-2, etc.
   * ```
   */
  addMany: (
    count: number,
    prefix: string,
    type?: SystemType,
  ) => Promise<{ prefix: string; systems: SystemResult[] }>;
}

/**
 * Extended Playwright test with the systems fixture.
 *
 * This fixture provides an API request context with ADMIN_TOKEN authorization for creating
 * and managing test systems. It automatically cleans up all created systems and archives
 * after the test completes.
 *
 * **Features:**
 * - Provides `add()` and `addMany()` methods for creating systems
 * - Automatically cleans up all created systems and archives after the test
 *
 * **Requirements:**
 * - `ADMIN_TOKEN` environment variable must be set
 */
export const systemsTest = base.extend<WithSystems>({
  systems: async ({ playwright }, use, ti) => {
    if (!process.env.ADMIN_TOKEN) {
      throw new Error("Creating systems requires ADMIN_TOKEN, which isn't set.");
    }
    const allSystems: SystemResult[] = [];

    const context = await playwright.request.newContext({
      baseURL: ti.project.use.baseURL,
      proxy: ti.project.use.proxy,
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: {
        Authorization: process.env.ADMIN_TOKEN!,
      },
      timeout: 45_000,
    });

    await use({
      add: async (prefix: string, type: SystemType = 'base') =>
        await systemsTest.step(
          `Adding system`,
          async (): Promise<SystemResult> => {
            const response = await createSystem(context, `${prefix}-${randomName()}`, type);
            allSystems.push(response);
            return response;
          },
          { box: true },
        ),
      addMany: async (count: number, prefix: string, type: SystemType = 'base') =>
        await systemsTest.step(
          'Adding many systems',
          async (): Promise<{ prefix: string; systems: SystemResult[] }> => {
            const createdSystems: SystemResult[] = [];
            const createFunctions: Promise<SystemResult>[] = [];

            const randomizedPrefix = `${prefix}-${randomName()}`;
            for (let i = 1; i <= count; i++) {
              createFunctions.push(
                createSystem(
                  context,
                  `${randomizedPrefix}-${i.toString().padStart(count.toString().length, '0')}`,
                  type,
                ),
              );
            }

            createdSystems.push(...(await Promise.all(createFunctions)));
            allSystems.push(...createdSystems);
            return {
              prefix: randomizedPrefix,
              systems: createdSystems,
            };
          },
          { box: true },
        ),
    });

    await systemsTest.step('Post-test systems cleanup', async () => {
      allSystems.forEach((sr) => {
        cleanupArchive(sr.name);
      });
      await Promise.allSettled(allSystems.map((sr) => cleanupSystem(context, sr.id)));
    });
  },
});
