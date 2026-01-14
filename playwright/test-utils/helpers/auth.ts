import { expect, type Page } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * Logs in to a Red Hat account using username and password.
 * @param page - Playwright page instance
 * @param username - Red Hat account username
 * @param password - Red Hat account password
 * @throws Error if username or password is missing
 */
export const logInWithUsernameAndPassword = async (
  page: Page,
  username?: string,
  password?: string,
) => {
  if (!username || !password) {
    throw new Error('Username or password not found');
  }

  await page.goto('/insights/patch/systems');

  await expect(async () =>
    expect(page.getByText('Log in to your Red Hat account')).toBeVisible(),
  ).toPass();

  const login = page.getByRole('textbox');
  await login.fill(username);
  await login.press('Enter');
  const passwordField = page.getByRole('textbox', { name: 'Password' });
  await passwordField.fill(password);
  await passwordField.press('Enter');

  await expect(async () => {
    expect(page.url()).toContain(`${process.env.BASE_URL}/insights/patch/systems`);

    const cookies = await page.context().cookies();
    const found = cookies.find((cookie) => cookie.name === 'cs_jwt');
    expect(found).not.toBe(undefined);
  }).toPass({
    intervals: [1_000],
    timeout: 30_000,
  });
};

/**
 * Logs out the current user.
 * @param page - Playwright page instance
 */
export const logout = async (page: Page) => {
  await page
    .getByRole('button')
    .filter({ has: page.getByRole('img', { name: 'User Avatar' }) })
    .click();
  await expect(async () => page.getByRole('menuitem', { name: 'Log out' }).isVisible()).toPass();
  await page.getByRole('menuitem', { name: 'Log out' }).click();

  await expect(async () => {
    expect(page.url()).not.toBe('/insights/patch/systems');
  }).toPass();

  await expect(async () =>
    expect(page.getByText('Log in to your Red Hat account')).toBeVisible(),
  ).toPass();
};

/**
 * Saves browser storage state and extracts JWT token.
 * @param page - Playwright page instance
 * @param fileName - Name for the storage state file
 * @returns JWT bearer token or undefined
 */
export const storeStorageStateAndToken = async (page: Page, fileName: string) => {
  const { cookies } = await page
    .context()
    .storageState({ path: path.join(__dirname, '../../../.auth', fileName) });
  const token = cookies.find((cookie) => cookie.name === 'cs_jwt')?.value;
  process.env.TOKEN = `Bearer ${token}`;
  return token;
};

/**
 * Retrieves JWT token from a stored authentication file.
 * @param name - Name of the auth file (without .json extension)
 * @returns JWT bearer token or empty string if not found
 */
export const getUserAuthToken = (name: string) => {
  const userPath = path.join(__dirname, `../../../.auth/${name}.json`);
  const fileContent = readFileSync(userPath, { encoding: 'utf8' });

  const regex = /"name":\s*"cs_jwt",\s*"value":\s*"(.*?)"/;

  const match = fileContent.match(regex);
  if (match && match[1]) {
    return `Bearer ${match[1]}`;
  }

  return '';
};

/**
 * Validates required environment variables are set.
 * @throws Error listing missing required environment variables
 */
export const throwIfMissingEnvVariables = () => {
  const MandatoryEnvVariables = ['BASE_URL', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];

  const missing: string[] = [];
  MandatoryEnvVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  if (missing.length > 0) {
    throw new Error('Missing env variables:' + missing.join(','));
  }
};

/**
 * Ensures that Preview mode is not turned on, disables it if it is.
 * @param page - Playwright page instance
 */
export const ensureNotInPreview = async (page: Page) => {
  const toggle = page.locator('div').filter({ hasText: 'Preview mode' }).getByRole('switch');
  if ((await toggle.isVisible()) && (await toggle.isChecked())) {
    await toggle.click();
  }
};
