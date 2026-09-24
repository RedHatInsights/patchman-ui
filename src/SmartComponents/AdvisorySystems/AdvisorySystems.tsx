import React from 'react';
import { Spinner } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import type { SystemsViewItem, SystemsViewProps } from '../../SystemsView';

type AdvisorySystem = SystemsViewItem;
type AdvisorySystemsViewProps = SystemsViewProps<AdvisorySystem>;

const fetchData: AdvisorySystemsViewProps['fetchData'] = async () => ({ results: [], total: 0 });
const columns: AdvisorySystemsViewProps['columns'] = () => [];
const filters: AdvisorySystemsViewProps['filters'] = () => [];

interface AdvisorySystemsProps {
  advisoryName: string;
}

const AdvisorySystems = ({ advisoryName }: AdvisorySystemsProps) => (
  <AsyncComponent<AdvisorySystemsViewProps>
    scope='inventory'
    module='./SystemsView'
    fallback={<Spinner size='lg' />}
    queryKeyPrefix={advisoryName}
    fetchData={fetchData}
    columns={columns}
    filters={filters}
  />
);

export default AdvisorySystems;
