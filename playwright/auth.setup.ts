import { expect, test } from '@playwright/test';
import {
  throwIfMissingEnvVariables,
  logInWithUsernameAndPassword,
  storeStorageStateAndToken,
  ensureNotInPreview,
} from 'test-utils/helpers/auth';

import { existsSync, mkdirSync } from 'fs';
const authDir = '.auth';
if (!existsSync(authDir)) {
  mkdirSync(authDir);
}

test.describe('Setup Authentication States', () => {
  test.describe.configure({ retries: 3 });

  test('Ensure needed ENV variables exist', async () => {
    expect(() => throwIfMissingEnvVariables()).not.toThrow();
  });

  test('Authenticate Advisory Remediation User and Save State', async ({ page }) => {
    test.setTimeout(60_000);

    // Login advisory remediation user
    await logInWithUsernameAndPassword(
      page,
      process.env.ADVISORY_REMEDIATION_USERNAME,
      process.env.ADVISORY_REMEDIATION_PASSWORD,
    );
    await ensureNotInPreview(page);

    // Save state for advisory remediation user
    // This also sets process.env.TOKEN, which is picked up by main config.
    const token = await storeStorageStateAndToken(page, 'advisory_remediation_user.json');
    expect(token).toBeDefined();

    process.env.ADVISORY_REMEDIATION_TOKEN = `Bearer ${token}`;
  });

  test('Authenticate Default (Admin) User and Save State', async ({ page }) => {
    test.setTimeout(60_000);

    // Login default admin user
    await logInWithUsernameAndPassword(
      page,
      process.env.ADMIN_USERNAME,
      process.env.ADMIN_PASSWORD,
    );
    await ensureNotInPreview(page);

    // Save state for default admin user
    // This also sets process.env.TOKEN, which is picked up by main config.
    const token = await storeStorageStateAndToken(page, 'admin_user.json');
    expect(token).toBeDefined();

    process.env.ADMIN_TOKEN = `Bearer ${token}`;
  });
});
