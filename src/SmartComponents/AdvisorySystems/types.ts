/** Mirrors `@redhat-cloud-services/patch-client` `ListAdvisorySystemsReturnType`. */
export interface ListAdvisorySystemsReturnType {
  data?: Array<{
    id?: string;
    type?: string;
    attributes?: {
      baseline_id?: number;
      baseline_name?: string;
      built_pkgcache?: boolean;
      created?: string;
      culled_timestamp?: string;
      display_name?: string;
      groups?: Array<{ id?: string; name?: string }>;
      last_upload?: string;
      os?: string;
      rhsm?: string;
      satellite_managed?: boolean;
      stale?: boolean;
      stale_timestamp?: string;
      stale_warning_timestamp?: string;
      status?: string;
      tags?: Array<{ key?: string; namespace?: string; value?: string }>;
      template_name?: string;
      template_uuid?: string;
    };
  }>;
  meta?: {
    total_items?: number;
  };
}

/** SystemsView requires every item to have an id. */
export type AdvisorySystem = NonNullable<ListAdvisorySystemsReturnType['data']>[number] & {
  id: string;
};
