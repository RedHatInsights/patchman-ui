import React from 'react';
import { Spinner } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import type { SystemsViewProps } from '../../SystemsView';
import { createApiCall } from '../../Utilities/api/api';
import { fromSystemsViewParams, prepareEntitiesParams } from '../../Utilities/Helpers';

const filters: AdvisorySystemsViewProps['filters'] = () => [];

/** Mirrors `@redhat-cloud-services/patch-client` `ListAdvisorySystemsReturnType`. */
interface ListAdvisorySystemsReturnType {
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

// SystemsView requires all items have id prop
type AdvisorySystem = NonNullable<ListAdvisorySystemsReturnType['data']>[number] & {
  id: string;
};
type AdvisorySystemsViewProps = SystemsViewProps<AdvisorySystem>;

interface AdvisorySystemsProps {
  advisoryName: string;
}

const AdvisorySystems = ({ advisoryName }: AdvisorySystemsProps) => {
  const fetchAdvisorySystems: AdvisorySystemsViewProps['fetchData'] = async (params) => {
    const response = (await createApiCall(
      `/advisories/${advisoryName}/systems`,
      'v3',
      'get',
      fromSystemsViewParams(params),
    )) as ListAdvisorySystemsReturnType;

    return {
      // drop systems w/o id
      results: (response.data ?? []).filter(
        (item): item is AdvisorySystem => typeof item.id === 'string' && item.id.length > 0,
      ),
      total: response.meta?.total_items ?? 0,
    };
  };

  return (
    <AsyncComponent<AdvisorySystemsViewProps>
      scope='inventory'
      module='./SystemsView'
      fallback={<Spinner size='lg' />}
      queryKeyPrefix={advisoryName}
      fetchData={fetchAdvisorySystems}
      columns={(catalog) => [
        catalog.name({
          getValue(item) {
            return {
              displayName: item.attributes?.display_name,
            };
          },
        }),
      ]}
      filters={filters}
    />
  );
};

export default AdvisorySystems;
