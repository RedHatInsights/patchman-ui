import { poll } from './general';
import { APIRequestContext } from '@playwright/test';

/**
 * Waits for a template to appear in the Patch API.
 *
 * Templates are created in Content Sources but need to sync to Patch before
 * they can be assigned to systems. This function polls the Patch API
 * `/api/patch/v3/templates` endpoint until the template is available.
 *
 * Uses a 10-second polling interval.
 *
 * @param request - Playwright APIRequestContext for making HTTP requests
 * @param templateName - The name of the template to search for
 * @throws Error if polling times out
 */
export const waitForTemplateInPatch = async (
  request: APIRequestContext,
  templateName: string,
) => {
  const templatesUrl = `/api/patch/v3/templates`;

  const getTemplate = async () => {
    const response = await request.get(templatesUrl, {
      params: {
        search: templateName,
        limit: 1,
      },
    });
    return response.json();
  };

  const templateNotYetAvailable = (result: any) => {
    try {
      return result?.data?.length <= 0;
    } catch {
      return true; // Retry on error
    }
  };

  await poll(getTemplate, templateNotYetAvailable, 10_000);
};
