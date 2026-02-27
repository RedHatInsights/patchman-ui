/**
 * System helpers for Playwright E2E tests.
 *
 * This module provides utilities for:
 *
 * System Creation:
 * 1. Extracting a base archive
 * 2. Customizing it with unique identifiers (machine ID, subscription manager ID, hostname)
 * 3. Compressing it into a new archive
 * 4. Uploading it to the Insights ingress API
 * 5. Waiting for it to appear in Inventory and Patch services
 *
 * System State Checking:
 * - Checking if a system exists in Patch service
 * - Polling for system template attachment status
 *
 * Cleanup:
 * - Removing local archive files and folders created during tests
 * - Deleting systems from the Inventory service
 *
 * All created archives are stored in `../data/tmp/` and should be cleaned up after tests.
 */

import { APIRequestContext, Page } from '@playwright/test';
import { spawnSync } from 'child_process';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { poll, sleep } from './general';

/**
 * Available system types for test systems.
 *
 * - `base`: RHEL 9.6 system with patch data (advisories, packages)
 * - `clean`: RHEL 9.4 system without patch data
 * - `version-locked`: RHEL 9.6 system locked to minor release version
 * - `satellite-managed`: RHEL 8.3 system managed by Satellite
 */
export type SystemType = 'base' | 'clean' | 'version-locked' | 'satellite-managed'; // | 'rhel10' etc.

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
  ['version-locked', ['rhel96_version_locked.tar.gz', false]],
  ['satellite-managed', ['rhel83_satellite_managed.tar.gz', false]],
]);

/**
 * UI display name for the Operating system filter per system type.
 */
const SYSTEM_TYPE_OS_DISPLAY_NAME: Record<SystemType, string> = {
  base: 'RHEL 9.6',
  clean: 'RHEL 9.4',
  'version-locked': 'RHEL 9.6',
  'satellite-managed': 'RHEL 8.3',
};

/** OS display name for the default (base) system type. Use in filtered table assertions. */
export const osBaseName = SYSTEM_TYPE_OS_DISPLAY_NAME.base;

/**
 * Result of creating a test system.
 */
export type SystemResult = {
  /** The hostname/display name of the created system */
  name: string;
  /** The inventory ID (UUID) of the created system */
  id: string;
  /** The token of the user that created the system */
  token: string;
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
 * Workspace group name for filter tests. Set WORKSPACE_GROUP in .env to match a group created in
 * the Inventory UI (insights/inventory/workspaces). Only used when creating a system with
 * options.workspaceGroup: true (writes group= into data/etc/insights-client/insights-client.conf).
 */
export const getWorkspaceGroup = () => process.env.WORKSPACE_GROUP;

/**
 * Sets or updates the group line in insights-client.conf so the upload payload assigns the host to that workspace.
 * Path in archive: data/etc/insights-client/insights-client.conf (same as on-host /etc/insights-client/insights-client.conf).
 */
const setInsightsClientConfGroup = (baseDir: string, groupName: string) => {
  const insightsClientDir = path.join(baseDir, 'data/etc/insights-client');
  const confPath = path.join(insightsClientDir, 'insights-client.conf');
  if (!fs.existsSync(insightsClientDir)) {
    fs.mkdirSync(insightsClientDir, { recursive: true });
  }

  const groupLine = `group=${groupName}`;
  let lines: string[];

  if (fs.existsSync(confPath)) {
    const content = fs.readFileSync(confPath, 'utf-8');
    const confLines = content.split(/\r?\n/);
    const groupRegex = /^\s*group\s*=/;
    const replaced = confLines.some((line, i) => {
      if (groupRegex.test(line)) {
        confLines[i] = groupLine;
        return true;
      }
      return false;
    });
    if (!replaced) {
      confLines.push(groupLine);
    }
    lines = confLines;
  } else {
    lines = [groupLine];
  }

  fs.writeFileSync(confPath, lines.join('\n') + '\n');
};

/** Meta_data spec for tags; ingestion uses this to find and process data/tags.json. */
const TAGS_SPEC_JSON = JSON.stringify({
  name: 'insights.specs.Specs.tags',
  exec_time: 1.38e-5,
  errors: [],
  results: {
    type: 'insights.core.spec_factory.DatasourceProvider',
    object: { relative_path: 'tags.json', save_as: null },
  },
  ser_time: 9.96e-5,
});

/**
 * Writes tags to data/tags.json for predefined/custom tags.
 * Also adds meta_data/insights.specs.Specs.tags.json so ingestion processes the tags.
 * Format: [{"key": "...", "value": "...", "namespace": "insights-client"}]
 */
const setInsightsClientTags = (
  baseDir: string,
  extraTags: Record<string, string>,
  groupName?: string,
) => {
  const tagsArray: { key: string; value: string; namespace: string }[] = [];
  if (groupName) {
    tagsArray.push({ key: 'group', value: groupName, namespace: 'insights-client' });
  }
  for (const [key, value] of Object.entries(extraTags)) {
    tagsArray.push({ key, value, namespace: 'insights-client' });
  }
  if (tagsArray.length === 0) {
    return;
  }
  const dataDir = path.join(baseDir, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(path.join(dataDir, 'tags.json'), JSON.stringify(tagsArray));

  const metaDataDir = path.join(baseDir, 'meta_data');
  if (!fs.existsSync(metaDataDir)) {
    fs.mkdirSync(metaDataDir, { recursive: true });
  }
  fs.writeFileSync(path.join(metaDataDir, 'insights.specs.Specs.tags.json'), TAGS_SPEC_JSON);
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

/** Options when creating a test system. */
export type CreateSystemOptions = {
  /** Predefined/custom tags for data/tags.json (e.g. { network_performance: 'latency' }). */
  tags?: Record<string, string>;
  /**
   * When true, set group=WORKSPACE_GROUP in insights-client.conf and add group to tags.json so the
   * host is assigned to that workspace. Requires WORKSPACE_GROUP in .env.
   */
  workspaceGroup?: boolean;
};

/**
 * Prepares a test archive by extracting a base archive, customizing it, and recompressing it.
 *
 * This function:
 * 1. Creates a unique working directory in `../data/tmp/`
 * 2. Extracts the base archive for the specified system type
 * 3. Updates the machine ID, subscription manager ID, and hostname
 * 4. Optionally sets workspace (insights-client.conf + tags.json) and/or tags (data/tags.json)
 * 5. Compresses the modified archive back into a tar.gz file
 *
 * @param systemName - The name for the test system (used for hostname and archive filename)
 * @param type - The type of system to create
 * @param options - Optional tags and/or workspaceGroup (insights-client.conf group=)
 * @throws Error if the base archive doesn't exist or any preparation step fails
 */
const prepareTestArchive = (
  systemName: string,
  type: SystemType,
  options?: CreateSystemOptions,
) => {
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

  let groupName: string | undefined;
  if (options?.workspaceGroup) {
    groupName = getWorkspaceGroup();
    if (!groupName) {
      throw new Error(
        'WORKSPACE_GROUP env is required when options.workspaceGroup is true. Add it to your .env (e.g. WORKSPACE_GROUP=TestSpace).',
      );
    }
    setInsightsClientConfGroup(baseDir, groupName);
  }
  if (options?.tags && Object.keys(options.tags).length > 0) {
    setInsightsClientTags(baseDir, options.tags, groupName);
  } else if (groupName) {
    // Original behavior: always write tags.yaml when group is set (even without custom tags)
    setInsightsClientTags(baseDir, {}, groupName);
  }

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
      return result?.results?.length <= 0;
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
      return result?.data?.length <= 0;
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

      return installablePackages + advisories < 1;
    } catch {
      return false;
    }
  };

  await poll(detailCall, detailCondition, 1_000);
};

/**
 * Associates a host with an Inventory group (workspace) via the Inventory API.
 * The group must already exist in Inventory (e.g. created in the UI at insights/inventory/workspaces).
 *
 * @param request - Playwright APIRequestContext with authorization
 * @param hostId - Inventory host UUID
 * @param groupName - Name of the group (e.g. TestSpace)
 * @throws Error if the group is not found or the association request fails
 */
const associateHostWithGroup = async (
  request: APIRequestContext,
  hostId: string,
  groupName: string,
) => {
  const groupsResponse = await request.get('/api/inventory/v1/groups', {
    params: { name: groupName },
  });
  if (!groupsResponse.ok()) {
    throw new Error(`Failed to fetch Inventory group "${groupName}": ${groupsResponse.status()}`);
  }
  const groupsBody = await groupsResponse.json();
  const results = groupsBody?.results ?? [];
  if (results.length === 0) {
    throw new Error(
      `Inventory group "${groupName}" not found. Create it in the UI (insights/inventory/workspaces) and set WORKSPACE_GROUP in .env.`,
    );
  }
  const groupId = results[0].id;

  const associateResponse = await request.post(`/api/inventory/v1/groups/${groupId}/hosts`, {
    data: [hostId],
  });
  if (!associateResponse.ok()) {
    throw new Error(
      `Failed to add host ${hostId} to group "${groupName}": ${associateResponse.status()}`,
    );
  }
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
 * @param request - Playwright APIRequestContext with authorization
 * @param systemName - The name for the test system (used for hostname and archive filename)
 * @param systemType - The type of system to create
 * @param token - The token of the user to create the system for
 * @returns The created system's name and inventory ID
 * @throws Error if any step fails (preparation, upload, or processing)
 *
 * @example
 * ```typescript
 * const system = await createSystem(context, 'test-system-abc123', 'base', process.env.ADMIN_TOKEN);
 * console.log(system.name); // 'test-system-abc123'
 * console.log(system.id); // 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
 * ```
 */
export const createSystem = async (
  request: APIRequestContext,
  systemName: string,
  systemType: SystemType,
  token: string,
  options?: CreateSystemOptions,
): Promise<SystemResult> => {
  prepareTestArchive(systemName, systemType, options);
  await uploadArchive(request, path.join(__dirname, `../data/tmp/${systemName}.tar.gz`));
  const id = await waitForSystemInInventory(request, systemName);
  await waitForSystemInPatch(request, systemName, systemType, id);

  if (options?.workspaceGroup) {
    const groupName = getWorkspaceGroup();
    if (groupName) {
      await associateHostWithGroup(request, id, groupName);
    }
  }

  return {
    name: systemName,
    id,
    token,
  };
};

/**
 * Diagnostic helper to check if a system exists in Patch and log its details.
 * @param page - Playwright Page object
 * @param hostname - The display name of the system to check
 * @param expectInPatch - Whether we expect the system to be in Patch (true) or not (false)
 * @returns Promise<boolean> - true if system state matches expectation, false otherwise
 */
export const isInPatch = async (
  page: Page,
  hostname: string,
  expectInPatch: boolean = true,
): Promise<boolean> => {
  try {
    const response = await page.request.get(
      `/api/patch/v3/systems?search=${encodeURIComponent(hostname)}&limit=100`,
    );

    if (response.status() !== 200) {
      console.log(`⚠️  API request failed with status ${response.status()}`);
      return false;
    }

    const body = await response.json();
    const system = body.data?.find(
      (sys: { attributes: { display_name: string } }) => sys.attributes.display_name === hostname,
    );

    if (system) {
      // System found
      if (expectInPatch) {
        console.log('✅ System found in Patch:', {
          display_name: system.attributes.display_name,
          id: system.id,
          template_uuid: system.attributes.template_uuid,
          template_name: system.attributes.template_name,
          last_upload: system.attributes.last_upload,
        });
      } else {
        console.log('ℹ️  System still in Patch (expected to be removed):', {
          display_name: system.attributes.display_name,
          id: system.id,
          template_uuid: system.attributes.template_uuid,
          template_name: system.attributes.template_name,
          last_upload: system.attributes.last_upload,
        });
        console.log('   Will poll for removal.');
      }
      return true;
    } else {
      // System not found
      if (expectInPatch) {
        console.log('⚠️  System not found in Patch yet. Will poll.');
        console.log(`   Total systems in response: ${body.data?.length || 0}`);
      } else {
        console.log('✅ System already removed from Patch');
      }
      return false;
    }
  } catch (error) {
    console.log('⚠️  Error checking system in Patch:', error);
    return false;
  }
};

/**
 * Polls the API to check if a system with the given host name is attached to a template.
 *
 * @param page - Playwright Page object
 * @param hostname - The display name of the system to check
 * @param expectedAttachment - Whether to expect the system to be attached (true) or not attached (false) (default: true)
 * @param delayMs - Delay between polling attempts in milliseconds (default: 10000ms / 10s)
 * @param maxAttempts - Number of times to poll (default: 10)
 * @returns Promise<boolean> - true if a system is in the expected state, false otherwise
 */
export const pollForSystemTemplateAttachment = async (
  page: Page,
  hostname: string,
  expectedAttachment: boolean = true,
  delayMs: number = 10_000,
  maxAttempts: number = 10,
): Promise<boolean> => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    let shouldRetry = false;

    try {
      // Query the systems API with the search filter for the host name
      const response = await page.request.get(
        `/api/patch/v3/systems?search=${encodeURIComponent(hostname)}&limit=100`,
      );

      if (response.status() !== 200) {
        console.log(
          `API request failed with status ${response.status()}, attempt ${attempts}/${maxAttempts}`,
        );
        shouldRetry = true;
      } else {
        const body = await response.json();

        if (!body.data || !Array.isArray(body.data)) {
          console.log(`Invalid response format, attempt ${attempts}/${maxAttempts}`);
          shouldRetry = true;
        } else {
          // Find the system with a matching host name
          const system = body.data.find(
            (sys: { attributes: { display_name: string } }) =>
              sys.attributes.display_name === hostname,
          );

          if (!system) {
            // System isn't found in Patch
            if (!expectedAttachment) {
              // The system is expected to not be attached, and so if it's not in Patch,
              // that's a success (the system was removed)
              console.log(`System '${hostname}' not found in Patch (as expected - system removed)`);
              return true;
            } else {
              // If we expect the system to be attached, but it's not found,
              // continue polling as it might be slow to appear
              console.log(
                `System '${hostname}' not found in Patch, attempt ${attempts}/${maxAttempts}`,
              );
              shouldRetry = true;
            }
          } else {
            // Check if a system has a template_uuid assigned
            const hasTemplate = !!system.attributes?.template_uuid;

            // If the system is in the expected state, return early
            if (hasTemplate === expectedAttachment) {
              const message = hasTemplate
                ? `System '${hostname}' is attached to template: ${system.attributes.template_name} (as expected)`
                : `System '${hostname}' is not attached to any template (as expected)`;
              console.log(message);
              return true;
            } else {
              const message = hasTemplate
                ? `System '${hostname}' is attached to template but expected not to be, attempt ${attempts}/${maxAttempts}`
                : `System '${hostname}' is not attached to template but expected to be, attempt ${attempts}/${maxAttempts}`;
              console.log(message);
              shouldRetry = true;
            }
          }
        }
      }
    } catch (error) {
      console.log(
        `Error checking system template attachment: ${error}, attempt ${attempts}/${maxAttempts}`,
      );
      shouldRetry = true;
    }

    // Check if we should retry with delay
    if (shouldRetry && attempts < maxAttempts) {
      await sleep(delayMs);
    }
  }

  return false;
};

/**
 * Cleans up local archive files and folders created for a test system.
 *
 * This function removes:
 * - The working directory in `../data/tmp/{systemName}/` (created during archive preparation)
 * - The compressed archive file `../data/tmp/{systemName}.tar.gz`
 *
 * If either path doesn't exist or deletion fails, the error is silently ignored.
 *
 * @param systemName - The name of the system whose archive should be cleaned up
 *
 * @example
 * ```typescript
 * cleanupArchive('test-system-abc123');
 * // Removes: ../data/tmp/test-system-abc123/ and ../data/tmp/test-system-abc123.tar.gz
 * ```
 */
export const cleanupArchive = (systemName: string) => {
  try {
    const folderPath = path.join(__dirname, '../data/tmp/', systemName);
    const archivePath = path.join(__dirname, '../data/tmp/', `${systemName}.tar.gz`);

    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true });
    }

    if (fs.existsSync(archivePath)) {
      fs.rmSync(archivePath);
    }
  } catch {
    return;
  }
};

/**
 * Removes a system from the Inventory service.
 *
 * This function deletes a system from the Inventory API by:
 * 1. First checking if the system exists (GET request)
 * 2. If the system exists (status 200), sends a DELETE request to remove it
 *
 * If the system doesn't exist or the deletion fails, the error is silently ignored.
 *
 * @param request - Playwright APIRequestContext with proper authorization
 * @param systemId - The inventory ID (UUID) of the system to delete
 *
 * @example
 * ```typescript
 * await cleanupSystem(context, 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
 * // Removes the system from Inventory if it exists
 * ```
 */
export const cleanupSystem = async (request: APIRequestContext, systemId: string) => {
  try {
    const hostUrl = `/api/inventory/v1/hosts/${systemId}`;

    const getHostResponse = await request.get(hostUrl);
    if (getHostResponse.status() !== 200) {
      return;
    }

    await request.delete(hostUrl);
  } catch {
    return;
  }
};
