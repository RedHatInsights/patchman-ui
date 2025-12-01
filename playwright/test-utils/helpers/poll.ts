/**
 * Delays execution for specified milliseconds.
 *
 * @param ms - Milliseconds to sleep
 */
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Repeatedly calls fn until condition returns false.
 *
 * @param fn - Function to execute repeatedly
 * @param condition - Condition to check result against
 * @param interval - Milliseconds to wait between calls
 */
export const poll = async (
  fn: () => Promise<any>,
  condition: (result: any) => boolean,
  interval: number,
) => {
  let result = await fn();
  while (condition(result)) {
    result = await fn();
    await sleep(interval);
  }
  return result;
};
