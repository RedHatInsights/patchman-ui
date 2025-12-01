/**
 * System creation helpers for Playwright E2E tests.
 *
 * This module provides utilities for creating test systems by:
 * 1. Extracting a base archive
 * 2. Customizing it with unique identifiers (machine ID, subscription manager ID, hostname)
 * 3. Compressing it into a new archive
 * 4. Uploading it to the Insights ingress API
 * 5. Waiting for it to appear in Inventory and Patch services
 *
 * All created archives are stored in `../data/tmp/` and should be cleaned up after tests.
 */

import { APIRequestContext } from '@playwright/test';
import { spawnSync } from 'child_process';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { poll } from './poll';

/**
 * Available system types for test systems.
 *
 * - `base`: RHEL 9.6 system with patch data (advisories, packages)
 * - `clean`: RHEL 9.4 system without patch data
 */
export type SystemType = 'base' | 'clean'; // | 'rhel10' || 'satellite-managed' etc.

/**
 * Maps system types to their base archives and whether patch data is expected.
 *
 * Format: [archiveFileName, expectPatchData]
 * - archiveFileName: The tar.gz file in `../data/` to use as the base
 * - expectPatchData: Whether to wait for patch information (advisories, packages) after upload
 */
const SystemTypeArchiveMap = new Map<SystemType, [string, boolean]>([
  ['base', ['rhel96_base.tar.gz', true]],
  ['clean', ['rhel94_clean.tar.gz', false]],
]);

/**
 * Result of creating a test system.
 */
export type SystemResult = {
  /** The hostname/display name of the created system */
  name: string;
  /** The inventory ID (UUID) of the created system */
  id: string;
};

/**
 * Extracts a tar.gz archive to a working directory.
 *
 * @param workingDir - The directory to extract the archive into
 * @param archivePath - Path to the tar.gz archive file
 * @returns The path to the extracted directory (expects exactly one directory in the archive)
 * @throws Error if extraction fails or if there isn't exactly one directory in the archive
 */
const extractArchive = (workingDir: string, archivePath: string) => {
  const extractResult = spawnSync('tar', ['-xzf', archivePath, '-C', workingDir], {
    encoding: 'utf-8',
  });
  if (extractResult.error) {
    throw new Error(`Failed to extract base archive: ${extractResult.error.message}`);
  }

  const extractedDirs = fs
    .readdirSync(workingDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());
  if (extractedDirs.length !== 1) {
    throw new Error(`Unexpected extracted contents in ${workingDir}`);
  }

  return path.join(workingDir, extractedDirs[0].name);
};

/**
 * Updates the Insights client machine ID with a new UUID.
 *
 * This ensures each test system has a unique machine ID so it's treated as
 * a separate system in the Insights platform.
 *
 * @param baseDir - The base directory of the extracted archive
 * @throws Error if the machine-id file doesn't exist
 */
const updateMachineId = (baseDir: string) => {
  const machineIdPath = path.join(baseDir, 'data/etc/insights-client/machine-id');
  if (!fs.existsSync(machineIdPath)) {
    throw new Error(`File not found: ${machineIdPath}`);
  }
  fs.writeFileSync(machineIdPath, `${randomUUID()}\n`);
};

/**
 * Updates the subscription manager identity with a new UUID.
 *
 * This ensures each test system has a unique subscription manager identity,
 * which is required for proper system registration in the Insights platform.
 *
 * @param baseDir - The base directory of the extracted archive
 * @throws Error if the subscription-manager_identity file doesn't exist
 */
const updateSubscriptionManagerIdentity = (baseDir: string) => {
  const subMgrPath = path.join(baseDir, 'data/insights_commands/subscription-manager_identity');
  if (!fs.existsSync(subMgrPath)) {
    throw new Error(`File not found: ${subMgrPath}`);
  }
  const subMgrLines = fs.readFileSync(subMgrPath, 'utf-8').split('\n');
  const newSubMgrId = randomUUID();
  const updatedSubMgr = subMgrLines.map((line) =>
    line.startsWith('system identity:') ? `system identity: ${newSubMgrId}` : line,
  );
  fs.writeFileSync(subMgrPath, updatedSubMgr.join('\n'));
};

/**
 * Updates the system hostname to match the test system name.
 *
 * @param baseDir - The base directory of the extracted archive
 * @param systemName - The new hostname to set
 * @throws Error if the hostname file doesn't exist
 */
const updateHostname = (baseDir: string, systemName: string) => {
  const hostnamePath = path.join(baseDir, 'data/insights_commands/hostname_-f');
  if (!fs.existsSync(hostnamePath)) {
    throw new Error(`File not found: ${hostnamePath}`);
  }
  fs.writeFileSync(hostnamePath, `${systemName}\n`);
};

/**
 * Compresses the modified archive into a new tar.gz file.
 *
 * The compressed archive is saved in `../data/tmp/` with the name `{systemName}.tar.gz`.
 *
 * @param workingDir - The working directory containing the extracted/modified archive
 * @param systemName - The name to use for the compressed archive file
 * @throws Error if compression fails
 */
const compressArchive = (workingDir: string, systemName: string) => {
  const archiveName = `${systemName}.tar.gz`;
  const tarFilePath = path.join(__dirname, '../data/tmp/', archiveName);
  const extractedDirs = fs
    .readdirSync(workingDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  const tarResult = spawnSync(
    'tar',
    ['-czf', tarFilePath, '-C', workingDir, extractedDirs[0].name],
    { encoding: 'utf-8' },
  );
  if (tarResult.error) {
    throw new Error(`Failed to create tar.gz: ${tarResult.error.message}`);
  }
};

/**
 * Prepares a test archive by extracting a base archive, customizing it, and recompressing it.
 *
 * This function:
 * 1. Creates a unique working directory in `../data/tmp/`
 * 2. Extracts the base archive for the specified system type
 * 3. Updates the machine ID, subscription manager ID, and hostname
 * 4. Compresses the modified archive back into a tar.gz file
 *
 * @param systemName - The name for the test system (used for hostname and archive filename)
 * @param type - The type of system to create
 * @throws Error if the base archive doesn't exist or any preparation step fails
 */
const prepareTestArchive = (systemName: string, type: SystemType) => {
  const archive = SystemTypeArchiveMap.get(type)?.[0] ?? '';
  const archivePath = path.join(__dirname, '../data/', archive);
  if (!fs.existsSync(archivePath)) {
    throw new Error(`Archive not found for system type '${type}' at '${archivePath}'`);
  }

  // Create unique working folder
  if (!fs.existsSync(path.join(__dirname, '../data/tmp/'))) {
    fs.mkdirSync(path.join(__dirname, '../data/tmp/'));
  }
  const workingDir = path.join(__dirname, '../data/tmp/', systemName);
  fs.mkdirSync(workingDir);

  const baseDir = extractArchive(workingDir, archivePath);
  updateMachineId(baseDir);
  updateSubscriptionManagerIdentity(baseDir);
  updateHostname(baseDir, systemName);
  compressArchive(workingDir, systemName);
};

/**
 * Uploads a system archive to the Insights ingress API.
 *
 * @param request - Playwright APIRequestContext for making HTTP requests
 * @param archivePath - Path to the tar.gz archive file to upload
 * @throws Error if the upload fails (status code is not 201 or 202)
 */
const uploadArchive = async (request: APIRequestContext, archivePath: string) => {
  const uploadUrl = `/api/ingress/v1/upload`;
  const file = fs.readFileSync(archivePath);
  const fileName = path.basename(archivePath);
  const response = await request.post(uploadUrl, {
    multipart: {
      file: {
        name: fileName,
        mimeType: 'application/vnd.redhat.advisor.collection+tgz',
        buffer: file,
      },
    },
  });
  if (![201, 202].includes(response.status())) {
    throw new Error(`Failed to upload system archive, response status code: ${response.status()}`);
  }
};

/**
 * Waits for a system to appear in the Inventory service after upload.
 *
 * Polls the Inventory API until the system with the given hostname is found.
 * Uses a 1-second polling interval.
 *
 * @param request - Playwright APIRequestContext for making HTTP requests
 * @param systemName - The hostname to search for
 * @returns The inventory ID (UUID) of the system
 * @throws Error if polling times out or the system is never found
 */
const waitForSystemInInventory = async (request: APIRequestContext, systemName: string) => {
  const hostsUrl = `/api/inventory/v1/hosts`;
  const call = async () => {
    const response = await request.get(hostsUrl, {
      params: {
        hostname_or_id: systemName,
      },
    });
    return response.json();
  };
  const condition = (result: any) => {
    try {
      if (result?.results?.length > 0) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  await poll(call, condition, 1_000);

  const response = await call();
  return response?.results[0]?.id as string;
};

/**
 * Waits for a system to appear in the Patch service and optionally waits for patch data.
 *
 * This function:
 * 1. Polls the Patch API until the system appears
 * 2. If the system type expects patch data, polls the system detail endpoint until
 *    patch information (advisories and packages) is available
 *
 * Uses a 1-second polling interval for both steps.
 *
 * @param request - Playwright APIRequestContext for making HTTP requests
 * @param systemName - The hostname to search for
 * @param systemType - The type of system (determines if we wait for patch data)
 * @param id - The inventory ID of the system
 * @throws Error if polling times out
 */
const waitForSystemInPatch = async (
  request: APIRequestContext,
  systemName: string,
  systemType: SystemType,
  id: string,
) => {
  const systemsUrl = `/api/patch/v3/systems`;
  const systemsCall = async () => {
    const response = await request.get(systemsUrl, {
      params: {
        search: systemName,
        limit: 1,
      },
    });
    return response.json();
  };
  const systemsCondition = (result: any) => {
    try {
      if (result?.data?.length > 0) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  await poll(systemsCall, systemsCondition, 1_000);

  const expectPatchInfo = SystemTypeArchiveMap.get(systemType)?.[1] ?? false;
  if (!expectPatchInfo) {
    return;
  }

  const detailCall = async () => {
    const response = await request.get(`${systemsUrl}/${id}`, {});
    return response.json();
  };
  const detailCondition = (result: any) => {
    try {
      const installablePackages = result?.data?.attributes?.packages_installable ?? 0;
      const advisories =
        (result?.data?.attributes?.rhsa_count ?? 0) +
        (result?.data?.attributes?.rhba_count ?? 0) +
        (result?.data?.attributes?.rhea_count ?? 0) +
        (result?.data?.attributes?.other_count ?? 0);

      if (installablePackages + advisories >= 1) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  await poll(detailCall, detailCondition, 1_000);
};

/**
 * Creates a test system by preparing an archive, uploading it, and waiting for it to be processed.
 *
 * This is the main entry point for creating test systems. It performs the following steps:
 * 1. Prepares a test archive from a base archive with unique identifiers
 * 2. Uploads the archive to the Insights ingress API
 * 3. Waits for the system to appear in Inventory
 * 4. Waits for the system to appear in Patch (and optionally waits for patch data)
 *
 * The created archive file is stored in `../data/tmp/{systemName}.tar.gz` and should be
 * cleaned up after the test using `cleanupArchive()`.
 *
 * @param request - Playwright APIRequestContext with ADMIN_TOKEN authorization
 * @param systemName - The name for the test system (used for hostname and archive filename)
 * @param systemType - The type of system to create
 * @returns The created system's name and inventory ID
 * @throws Error if any step fails (preparation, upload, or processing)
 *
 * @example
 * ```typescript
 * const system = await createSystem(context, 'test-system-abc123', 'base');
 * console.log(system.name); // 'test-system-abc123'
 * console.log(system.id);   // 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
 * ```
 */
export const createSystem = async (
  request: APIRequestContext,
  systemName: string,
  systemType: SystemType,
): Promise<SystemResult> => {
  prepareTestArchive(systemName, systemType);
  await uploadArchive(request, path.join(__dirname, `../data/tmp/${systemName}.tar.gz`));
  const id = await waitForSystemInInventory(request, systemName);
  await waitForSystemInPatch(request, systemName, systemType, id);

  return {
    name: systemName,
    id,
  };
};
