import { mergeTests } from '@playwright/test';
import { cleanupTest } from './cleanup';
import { systemsTest } from './systems';

export const test = mergeTests(cleanupTest, systemsTest);
export { expect } from '@playwright/test';
