import { test as base } from '@playwright/test';

type WithCleanup = {
  cleanup: Cleanup;
};

/**
 * Fixture for managing test cleanup operations.
 */
export interface Cleanup {
  /**
   * Registers a cleanup function to run after the test.
   * @param cleanupFn - Function to execute during cleanup
   * @returns Symbol key to identify this cleanup function
   */
  add: (cleanupFn: () => Promise<unknown>) => symbol;
  /**
   * Executes cleanup function immediately and registers it for post-test cleanup.
   * @param cleanupFn - Function to execute now and during cleanup
   * @returns Symbol key to identify this cleanup function
   */
  runAndAdd: (cleanupFn: () => Promise<unknown>) => Promise<symbol>;
  /**
   * Removes a registered cleanup function.
   * @param key - Symbol key of the cleanup function to remove
   */
  remove: (key: symbol) => void;
}

/**
 * Playwright test fixture with cleanup support.
 * Automatically runs registered cleanup functions after each test.
 */
export const cleanupTest = base.extend<WithCleanup>({
  // Add `request` to claim it as a dependency for the `cleanup` fixture
  // Playwright will not close the request context until the teardown block has finished executing
  // eslint-disable-next-line unused-imports/no-unused-vars
  cleanup: async ({ request }, use) => {
    const cleanupFns: Map<symbol, () => Promise<unknown>> = new Map();

    await use({
      add: (cleanupFn) => {
        const key = Symbol();
        cleanupFns.set(key, cleanupFn);
        return key;
      },
      runAndAdd: async (cleanupFn) => {
        await cleanupFn();

        const key = Symbol();
        cleanupFns.set(key, cleanupFn);
        return key;
      },
      remove: (key) => {
        cleanupFns.delete(key);
      },
    });

    await cleanupTest.step(
      'Post-test cleanup',
      async () => {
        await Promise.all(Array.from(cleanupFns).map(([, fn]) => fn()));
      },
      { box: true },
    );
  },
});
