import React from 'react';
import { Spinner } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import type { SystemsViewProps } from '../../SystemsView';
import { createApiCall } from '../../Utilities/api/api';
import { fromSystemsViewParams } from '../../Utilities/Helpers';
import columns from './columns';
import type { AdvisorySystem, ListAdvisorySystemsReturnType } from './types';

type AdvisorySystemsViewProps = SystemsViewProps<AdvisorySystem>;

const filters: AdvisorySystemsViewProps['filters'] = () => [];

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
      columns={columns}
      filters={filters}
    />
  );
};

export default AdvisorySystems;
