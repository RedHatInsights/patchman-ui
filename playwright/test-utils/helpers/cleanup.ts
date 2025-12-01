/**
 * Cleanup utilities for test systems and archives.
 *
 * This module provides functions to clean up test artifacts created during Playwright tests,
 * including local archive files/folders and systems registered in the Inventory service.
 */

import { APIRequestContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';

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
