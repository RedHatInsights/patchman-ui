import { sleep } from './poll';

/**
 * Retries callback up to specified number of times on failure.
 *
 * @param callback - Function to retry
 * @param tries - Number of retry attempts (default: 3)
 * @param delay - Optional delay in milliseconds between retries
 */
export const retry = async (callback: () => Promise<unknown>, tries = 3, delay?: number) => {
  let rc = tries;
  while (rc >= 0) {
    if (delay) {
      await sleep(delay);
    }

    rc -= 1;
    if (rc === 0) {
      return await callback();
    } else {
      try {
        await callback();
      } catch {
        continue;
      }
      break;
    }
  }
};
