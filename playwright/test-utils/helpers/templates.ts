import { APIRequestContext } from '@playwright/test';

/**
 * Creates a template.
 *
 * This function creates a template with the content-sources API with the specified name and description,
 * using the BaseOS and Appstream repository UUIDs.
 *
 * @param request - Playwright APIRequestContext with proper authorization
 * @param templateName - The name of the template to create
 * @param description - The description of the template to create
 * @returns {Promise<string>} A promise that resolves to the UUID of the created template
 * @throws {Error} If an unexpected error occurs during template creation
 *
 * @example
 * ```typescript
 * await createTemplate(context, 'test-template', 'test template description');
 * // Creates a new template with the given name and description
 * ```
 */
export const createTemplate = async (
  request: APIRequestContext,
  templateName: string,
  description: string,
) => {
  const appstreamRepoUUID = '00b214de-e01d-4191-ad48-59bcc859e691';
  const baseOSRepoUUID = '5d2861ad-0d74-4116-98b4-254880126654';

  try {
    const response = await request.post('/api/content-sources/v1.0/templates/', {
      data: {
        name: templateName,
        description,
        arch: 'x86_64',
        version: '9',
        repository_uuids: [appstreamRepoUUID, baseOSRepoUUID],
        use_latest: true,
      },
    });

    if (!response.ok()) {
      throw new Error(`Error creating template. Request failed with status ${response.status()}`);
    }

    const data = await response.json();
    const uuid = data?.uuid;
    if (!uuid) {
      throw new Error('UUID not found in response.');
    }
    return uuid;
  } catch (error) {
    throw new Error(`Error creating template '${templateName}': ${error}`);
  }
};
