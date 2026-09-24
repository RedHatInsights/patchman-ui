import React from 'react';
import { Spinner } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

interface AdvisorySystemsProps {
  advisoryName: string;
}

const fetchData = async () => ({ results: [], total: 0 });
const columns = () => [];
const filters = () => [];

const AdvisorySystems = ({ advisoryName }: AdvisorySystemsProps) => (
  <AsyncComponent
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
