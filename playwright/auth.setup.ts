import { expect, test } from '@playwright/test';
import {
  logInWithUsernameAndPassword,
  storeStorageStateAndToken,
  ensureNotInPreview,
  logout,
} from 'test-utils/helpers/auth';
import { existsSync, mkdirSync } from 'fs';
import { disableTrackingAndConsent } from 'test-utils';

const authDir = '.auth';
if (!existsSync(authDir)) {
  mkdirSync(authDir);
}

const ADMIN_KEY = 'admin';
const ADVISORY_REMEDIATION_KEY = 'advisory_remediation';

type UserConfig = {
  key: string;
  tokenEnvVar: string;
  credentialEnvVars: [string, string]; // [usernameEnvVar, passwordEnvVar]
  requiredFlags: {
    integration?: boolean;
  };
};

const ALL_USERS: UserConfig[] = [
  {
    key: ADMIN_KEY,
    tokenEnvVar: 'ADMIN_TOKEN',
    credentialEnvVars: ['ADMIN_USERNAME', 'ADMIN_PASSWORD'],
    requiredFlags: {},
  },
  {
    key: ADVISORY_REMEDIATION_KEY,
    tokenEnvVar: 'ADVISORY_REMEDIATION_TOKEN',
    credentialEnvVars: ['ADVISORY_REMEDIATION_USERNAME', 'ADVISORY_REMEDIATION_PASSWORD'],
    requiredFlags: {},
  },
];

/**
 * Builds the list of users to authenticate based on environment flags.
 * If AUTH_USERS is set, uses that list instead. Admin is always last.
 */
const buildActiveUsers = (): UserConfig[] => {
  if (process.env.AUTH_USERS) {
    const requestedKeys = process.env.AUTH_USERS.split(',').map((k) => k.trim());
    const users = ALL_USERS.filter((u) => requestedKeys.includes(u.key));

    if (requestedKeys.length !== users.length) {
      const missingUsers = requestedKeys.filter((k) => !users.find((u) => u.key === k));

      console.log(`\u001b[48;5;160mUser(s): "${missingUsers.join(', ')}" not found!\x1b[0m`);
      console.log(
        `\u001b[48;5;27mAvailable ones are:\x1b[0m ${ALL_USERS.map((u) => u.key).join(', ')}`,
      );

      throw new Error(`Couldn't find user(s): ${missingUsers.join(', ')}`);
    }

    const adminIndex = users.findIndex((u) => u.key === ADMIN_KEY);
    if (adminIndex !== -1 && adminIndex !== users.length - 1) {
      const [admin] = users.splice(adminIndex, 1);
      users.push(admin);
    }
    return users;
  }

  const users = ALL_USERS.filter((user) => {
    const { integration } = user.requiredFlags;

    if (!integration) {
      return false;
    }

    if (integration && !process.env.INTEGRATION) {
      return false;
    }

    return true;
  });

  if (!process.env.INTEGRATION) {
    users.push(ALL_USERS.find((u) => u.key === ADVISORY_REMEDIATION_KEY)!);
  }
  users.push(ALL_USERS.find((u) => u.key === ADMIN_KEY)!);

  return users;
};

/**
 * Returns the list of required environment variables based on selected users.
 * Includes base vars, user credentials, and integration-specific vars.
 */
const getRequiredEnvVars = (users: UserConfig[]): string[] => {
  const baseVars = ['BASE_URL'];
  const userCredentials = users.flatMap((u) => u.credentialEnvVars);

  const integrationVars = process.env.INTEGRATION
    ? [
        'RH_CLIENT_PROXY',
        'ORG_ID_1',
        'ACTIVATION_KEY_1',
        ...(process.env.BASE_URL?.includes('foo') ? [] : ['PROXY']),
      ]
    : [];

  return [...new Set([...baseVars, ...userCredentials, ...integrationVars])];
};

const activeUsers = buildActiveUsers();

/**
 * Validates that all required environment variables are set.
 * Throws an error at module load time if any are missing.
 */
const validateEnvVars = () => {
  const wrongProxySettings = process.env.BASE_URL?.includes('foo') && !!process.env.PROXY;
  if (wrongProxySettings) {
    throw new Error(
      '\u001b[48;5;160mYou are trying to test against a locally running frontend while having PROXY set, please unset it.\x1b[0m',
    );
  }
  const required = getRequiredEnvVars(activeUsers);
  const missing = required.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error('\u001b[48;5;160mMissing env variables:\x1b[0m ' + missing.join(', '), {});
  }
};

validateEnvVars();

test.describe('Setup Authentication States', () => {
  test.describe.configure({ retries: 2 });

  for (const user of activeUsers) {
    test(`Authenticate ${user.key} user and save state`, async ({ page }) => {
      test.setTimeout(60_000);

      await disableTrackingAndConsent(page);
      await logInWithUsernameAndPassword(
        page,
        process.env[user.credentialEnvVars[0]],
        process.env[user.credentialEnvVars[1]],
      );
      await ensureNotInPreview(page);
      await storeStorageStateAndToken(page, user.tokenEnvVar);
      expect(process.env[user.tokenEnvVar]).toBeDefined();

      // Logout unless it's the admin (last user)
      if (user.key !== ADMIN_KEY) {
        await logout(page);
      }
    });
  }
});
