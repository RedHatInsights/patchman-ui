import React, { useEffect, useMemo, useState } from 'react';
import { Spinner } from '@patternfly/react-core';
import { preloadModule } from '@scalprum/core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';
import messages from '../../Messages';
import type { SystemsViewProps } from '../../SystemsView';
import { createApiCall } from '../../Utilities/api/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import { fromSystemsViewParams, remediationProvider } from '../../Utilities/Helpers';
import { intl } from '../../Utilities/IntlProvider';
import RemediationWizard from '../Remediation/RemediationWizard';
import { useActivateRemediationModal } from '../Systems/SystemsListAssets';
import columns from './columns';
import filters from './filters';
import type { AdvisoryFilterParams, AdvisorySystem, ListAdvisorySystemsReturnType } from './types';

type AdvisorySystemsViewProps = SystemsViewProps<AdvisorySystem, AdvisoryFilterParams>;

interface AdvisorySystemsProps {
  advisoryName: string;
}

const AdvisorySystems = ({ advisoryName }: AdvisorySystemsProps) => {
  const addNotification = useAddNotification();

  // prevents startup delay by preLoad the wizard on table mount
  useEffect(() => {
    preloadModule('remediations', './RemediationWizard').catch(() => undefined);
  }, []);
  const [isRemediationOpen, setRemediationOpen] = useState(false);
  const [remediationIssues, setRemediationIssues] = useState<false | Record<string, unknown>>(
    false,
  );
  const activateRemediationModal = useActivateRemediationModal(
    setRemediationIssues,
    setRemediationOpen,
  );

  const rowActions = useMemo<NonNullable<AdvisorySystemsViewProps['rowActions']>>(
    () => [
      {
        id: 'apply-all-applicable-advisories',
        label: 'Apply all applicable advisories',
        isDisabled: (items) => items.some((item) => item.attributes?.status === 'Applicable'),
        onAction: (items) => {
          const [system] = items;
          if (system) {
            activateRemediationModal(system);
          }
        },
      },
    ],
    [activateRemediationModal],
  );

  const bulkActions = useMemo<NonNullable<AdvisorySystemsViewProps['bulkActions']>>(
    () => [
      {
        id: 'plan-remediation',
        label: intl.formatMessage(messages.labelsRemediate),
        isPersistent: true,
        variant: 'primary',
        isDisabled: (items) => items.length === 0,
        onAction: (items) => {
          const data = remediationProvider(
            advisoryName,
            items.map((item) => item.id),
            remediationIdentifiers.advisory,
          );

          if (!data) {
            return;
          }

          setRemediationIssues({
            ...data,
            onRemediationCreated: (result: {
              getNotification: () => Parameters<typeof addNotification>[0];
            }) => {
              addNotification(result.getNotification());
            },
          });
          setRemediationOpen(true);
        },
      },
    ],
    [addNotification, advisoryName],
  );

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
    <>
      {isRemediationOpen && remediationIssues ? (
        <RemediationWizard data={remediationIssues} setRemediationOpen={setRemediationOpen} />
      ) : null}
      <AsyncComponent<AdvisorySystemsViewProps>
        scope='inventory'
        module='./SystemsView'
        fallback={<Spinner size='lg' />}
        queryKeyPrefix={advisoryName}
        fetchData={fetchAdvisorySystems}
        columns={columns}
        filters={filters}
        bulkActions={bulkActions}
        rowActions={rowActions}
      />
    </>
  );
};

export default AdvisorySystems;
