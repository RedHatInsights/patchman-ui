/**
 * RHSM (Red Hat Subscription Manager) client helpers for Playwright E2E tests.
 *
 * In the real world, each RHEL machine has its own RHSM client software installed
 * (subscription-manager, rhc). The machine itself IS the client - it registers
 * independently with Red Hat services. This module simulates that using Docker containers.
 *
 * This module provides:
 * - RHSMClient class for managing the full lifecycle of a containerized RHEL system
 * - Registration via RHC (appears in Insights) or subscription-manager (RHSM only)
 * - Utility functions for service readiness checks and command execution
 */

import { URL } from 'url';
import { test, expect } from 'test-utils';
import { ExecReturn, killContainer, runCommand, startNewContainer } from './containers';
import { sleep } from './general';

/**
 * Supported Operating System versions.
 */
export type OSVersion = 'rhel9' | 'rhel8' | 'rhel9dev';

/**
 * Docker images for each supported RHEL version.
 */
const RemoteImages = {
  rhel9: 'quay.io/swadeley/ubi9_rhc_prod:latest',
  rhel8: 'quay.io/swadeley/ubi8_rhc_prod:latest',
  rhel9dev: 'quay.io/swadeley/ubi9_rhc_dev_prod:latest',
};

const stageConfigureCommand = (): string[] => {
  const command = [
    'subscription-manager',
    'config',
    '--server.hostname=subscription.rhsm.stage.redhat.com',
    '--server.port=443',
    '--server.prefix=/subscription',
    '--server.insecure=0',
    '--rhsm.baseurl=https://stagecdn.redhat.com',
  ];
  if (process.env.RH_CLIENT_PROXY !== undefined) {
    const url = new URL(process.env.RH_CLIENT_PROXY);
    command.push('--server.proxy_hostname=' + url.hostname);
    command.push('--server.proxy_port=' + url.port);
  }
  return command;
};

/**
 * Represents a single containerized RHEL machine.
 */
export class RHSMClient {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Starts the container with the specified RHEL version and waits for services to be ready.
   * @param version - RHEL version to boot (rhel8, rhel9)
   */
  async Boot(version: OSVersion) {
    await startNewContainer(this.name, RemoteImages[version]);

    // Wait for systemd and dbus to be ready
    await this.waitForServicesReady();
  }

  /**
   * Waits for systemd services (especially dbus) to be ready.
   * @returns
   */
  private async waitForServicesReady() {
    // Wait for systemd to be ready
    let attempts = 0;
    const maxAttempts = 30; // 30-second max wait

    while (attempts < maxAttempts) {
      try {
        // Check if dbus socket exists
        const dbusCheck = await runCommand(
          this.name,
          ['test', '-S', '/var/run/dbus/system_bus_socket'],
          1000,
        );
        if (dbusCheck?.exitCode === 0) {
          console.log(`Services ready for container ${this.name}`);
          return;
        }

        // If the dbus socket doesn't exist, try to start the dbus service
        if (attempts === 5) {
          console.log(`Attempting to start dbus service for container ${this.name}`);
          await runCommand(this.name, ['systemctl', 'start', 'dbus'], 5000);
        }
      } catch {
        console.log(
          `Waiting for services in container ${this.name}, attempt ${attempts + 1}/${maxAttempts}`,
        );
      }

      await sleep(1000);
      attempts++;
    }

    console.warn(
      `Services may not be fully ready for container ${this.name} after ${maxAttempts} seconds`,
    );
  }

  /**
   * Configures subscription-manager inside the container for stage environment.
   */
  async ConfigureSubManForStage() {
    return runCommand(this.name, stageConfigureCommand());
  }

  /**
   * Configures insights-client inside the container for stage environment.
   */
  async ConfigureRHCForStage() {
    const command = [
      'sh',
      '-c',
      `echo "proxy=${process.env.RH_CLIENT_PROXY}" >> /etc/insights-client/insights-client.conf`,
    ];
    return runCommand(this.name, command);
  }

  /**
   * Registers the container using RHC. After registration, this system appears in Insights.
   * @param activationKey - Activation key (defaults to $ACTIVATION_KEY_1)
   * @param orgId - Organization ID (defaults to $ORG_ID_1)
   * @param template - Optional content template name
   */
  async RegisterRHC(activationKey?: string, orgId?: string, template?: string) {
    if (!process.env.PROD) {
      await this.ConfigureSubManForStage();
      await this.ConfigureRHCForStage();
    }
    if (activationKey === undefined) {
      activationKey = process.env.ACTIVATION_KEY_1 || 'COULD_NOT_FIND_KEY';
    }
    if (orgId === undefined) {
      orgId = process.env.ORG_ID_1 || 'COULD_NOT_FIND_ORG_ID';
    }
    const connect = ['rhc', 'connect', '-a', activationKey, '-o', orgId];
    if (template !== undefined) {
      connect.push('--content-template');
      connect.push(`${template}`);
    }
    const result = await runCommand(this.name, connect, 75000);

    if (result && result.exitCode !== 0) {
      console.log('RHC registration failed with exit code:', result.exitCode);
      if (
        result.stdout &&
        !result.stdout.includes('--activationkey') &&
        !result.stdout.includes('--password') &&
        !result.stdout.includes('-a') &&
        !result.stdout.includes('-p')
      ) {
        console.log('STDOUT:', result.stdout);
      }
      if (
        result.stderr &&
        !result.stderr.includes('--activationkey') &&
        !result.stderr.includes('--password') &&
        !result.stderr.includes('-a') &&
        !result.stderr.includes('-p')
      ) {
        console.log('STDERR:', result.stderr);
      }
    }

    return result;
  }

  /**
   * Registers the container using subscription-manager only (won't appear in Insights).
   * @param activationKey - Activation key (defaults to $ACTIVATION_KEY_1)
   * @param orgId - Organization ID (defaults to $ORG_ID_1)
   */
  async RegisterSubMan(activationKey?: string, orgId?: string) {
    if (!process.env.PROD) {
      await this.ConfigureSubManForStage();
    }

    if (activationKey === undefined) {
      activationKey = process.env.ACTIVATION_KEY_1 || 'COULD_NOT_FIND_KEY';
    }
    if (orgId === undefined) {
      orgId = process.env.ORG_ID_1 || 'COULD_NOT_FIND_ORG_ID';
    }

    return runCommand(
      this.name,
      [
        'subscription-manager',
        'register',
        '--activationkey',
        activationKey,
        '--org=' + orgId,
        '--name',
        this.name,
      ],
      75000,
    );
  }

  /**
   * Executes an arbitrary command inside the container.
   * @param command - Command to run as an array of strings
   * @param timeout - Timeout in ms (defaults to 500ms)
   */
  async Exec(command: string[], timeout?: number): Promise<ExecReturn | void> {
    return runCommand(this.name, command, timeout);
  }

  /**
   * Gets the hostname from inside the container (used as a display name in Insights).
   * @returns The container's hostname
   */
  async GetHostname(): Promise<string> {
    const result = await this.Exec(['hostname'], 5000);
    if (result?.exitCode !== 0) {
      throw new Error(`Failed to get hostname: ${result?.stderr}`);
    }
    return result?.stdout?.trim() || '';
  }

  /**
   * Unregisters the system from RHSM/Insights.
   * @param withRhc - If true, uses `rhc disconnect`; otherwise uses `subscription-manager disconnect`
   */
  async Unregister(withRhc: boolean) {
    if (withRhc) {
      console.log('Logging status of rhcd.service before attempting to disconnect');
      const stream = await runCommand(this.name, ['systemctl', 'status', 'rhcd.service']);
      if (stream) {
        console.log(stream.stdout);
        console.log(stream.stderr);
        console.log(stream.exitCode);
      }
      return runCommand(this.name, ['rhc', 'disconnect']);
    } else {
      return runCommand(this.name, ['subscription-manager', 'disconnect']);
    }
  }

  /**
   * Unregisters (optionally) and destroys the container.
   * @param unregisterMethod - 'rhc' (RHC disconnect), 'sm' (subscription-manager), or 'none' (just kill container)
   */
  async Destroy(unregisterMethod: 'rhc' | 'sm' | 'none' = 'none') {
    if (unregisterMethod !== 'none') {
      const cmd = await this.Unregister(unregisterMethod === 'rhc');

      if (!cmd) {
        return killContainer(this.name);
      }

      // Check if a system is already unregistered
      const alreadyUnregistered =
        cmd.exitCode !== 0 &&
        (cmd.stderr?.includes('already unregistered') ||
          cmd.stdout?.includes('already unregistered'));

      if (alreadyUnregistered) {
        console.log('Continuing with container cleanup (system is already unregistered)');
      } else if (cmd.exitCode !== 0) {
        // Unregister failed for a different reason, log details
        console.log('Unregister command completed with exit code:', cmd.exitCode);
        if (
          cmd.stdout &&
          !cmd.stdout.includes('--activationkey') &&
          !cmd.stdout.includes('--password') &&
          !cmd.stdout.includes('-a') &&
          !cmd.stdout.includes('-p')
        ) {
          console.log('STDOUT:', cmd.stdout);
        }
        if (
          cmd.stderr &&
          !cmd.stderr.includes('--activationkey') &&
          !cmd.stderr.includes('--password') &&
          !cmd.stderr.includes('-a') &&
          !cmd.stderr.includes('-p')
        ) {
          console.log('STDERR:', cmd.stderr);
        }
        console.log('Continuing with container cleanup despite unregister failure');
      }
    }
    return killContainer(this.name);
  }
}

/**
 * Waits for the rhcd service to become active inside the container after RHC registration.
 * @param client - RHSMClient instance (container) to check
 * @param maxAttempts - Maximum polling attempts (default: 30)
 * @param delayMs - Delay between attempts in ms (default: 1000)
 * @throws Error if rhcd doesn't become active within the timeout
 */
export async function waitForRhcdActive(
  client: RHSMClient,
  maxAttempts: number = 30,
  delayMs: number = 1000,
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await client.Exec(['systemctl', 'is-active', 'rhcd.service'], 5000);

      if (result && result.exitCode === 0 && result.stdout?.trim() === 'active') {
        console.log(`rhcd service is active (attempt ${attempt}/${maxAttempts})`);
        return;
      }

      console.log(
        `Waiting for rhcd service to be active, attempt ${attempt}/${maxAttempts} (status: ${result?.stdout?.trim() || 'unknown'})`,
      );
    } catch (error) {
      console.log(`Error checking rhcd status on attempt ${attempt}/${maxAttempts}:`, error);
    }

    if (attempt < maxAttempts) {
      await sleep(delayMs);
    }
  }

  throw new Error(
    `rhcd service did not become active after ${maxAttempts} attempts (${(maxAttempts * delayMs) / 1000}s)`,
  );
}

/**
 * Refreshes subscription-manager inside the container with retry logic to handle intermittent failures.
 * @param client - RHSMClient instance (container) to refresh
 * @param maxAttempts - Maximum retry attempts (default: 3)
 * @throws Error if refresh fails after all attempts
 */
export async function refreshSubscriptionManager(
  client: RHSMClient,
  maxAttempts: number = 3,
): Promise<void> {
  let subManRefresh;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      subManRefresh = await client.Exec(['subscription-manager', 'refresh']);
      if (!subManRefresh) {
        console.log(`subscription-manager refresh attempt ${attempt}: No response from command`);
        continue;
      }
      if (subManRefresh.exitCode === 0) {
        return; // Success, exit early
      }
      if (subManRefresh.stderr || subManRefresh.stdout) {
        console.log(`subscription-manager refresh attempt ${attempt} failed:`);
        // Only log output if it doesn't contain sensitive information
        if (
          subManRefresh.stdout &&
          !subManRefresh.stdout.includes('--activationkey') &&
          !subManRefresh.stdout.includes('--password') &&
          !subManRefresh.stdout.includes('-a') &&
          !subManRefresh.stdout.includes('-p')
        ) {
          console.log('STDOUT:', subManRefresh.stdout);
        }
        if (
          subManRefresh.stderr &&
          !subManRefresh.stderr.includes('--activationkey') &&
          !subManRefresh.stderr.includes('--password') &&
          !subManRefresh.stderr.includes('-a') &&
          !subManRefresh.stderr.includes('-p')
        ) {
          console.log('STDERR:', subManRefresh.stderr);
        }
      }
    } catch (error) {
      console.log(`subscription-manager refresh attempt ${attempt} error:`, error);
      if (attempt === maxAttempts) {
        throw error;
      }
    }
  }

  // If we get here, all attempts failed but didn't throw
  throw new Error(
    `subscription-manager refresh failed after ${maxAttempts} attempts. Exit code: ${subManRefresh?.exitCode}`,
  );
}

/**
 * Runs a command inside the container as a Playwright test step with logging.
 * In case that return code is not as expected, log stdout, stderr, and fail the step.
 *
 * @param stepName - Name for the Playwright test step
 * @param cmd - Command to execute as an array of strings
 * @param client - RHSMClient instance (container) to run the command in
 * @param timeout - Optional timeout in ms
 * @param expectedRC - Expected return code (default: 0)
 */
export const runCmd = async (
  stepName: string,
  cmd: string[],
  client: RHSMClient,
  timeout?: number,
  expectedRC: number = 0,
): Promise<ExecReturn | void> =>
  await test.step(stepName, async () => {
    const res = await client.Exec(cmd, timeout);

    if (!res) {
      console.error(`❌ ${stepName} failed with unknown error`);
      expect(false, `${stepName} failed`).toBeTruthy();
    } else if (res.exitCode !== expectedRC) {
      console.error(`❌ ${stepName} failed with exit code ${res.exitCode}`);
      console.error(res.stdout);
      console.error(res.stderr);

      expect(res.exitCode, `${stepName} failed`).toBe(expectedRC);
    } else {
      console.log(`✅ ${stepName} succeeded`);
      expect(res.exitCode, `${stepName} succeeded`).toBe(expectedRC);
    }

    return res;
  });
