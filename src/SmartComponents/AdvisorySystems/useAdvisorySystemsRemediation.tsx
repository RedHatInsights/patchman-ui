import React, { useEffect, useMemo, useState } from 'react';
import { preloadModule } from '@scalprum/core';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';
import messages from '../../Messages';
import type { SystemsViewProps } from '../../SystemsView';
import { remediationIdentifiers } from '../../Utilities/constants';
import { remediationProvider } from '../../Utilities/Helpers';
import { intl } from '../../Utilities/IntlProvider';
import RemediationWizard from '../Remediation/RemediationWizard';
import { useActivateRemediationModal } from '../Systems/SystemsListAssets';
import type { AdvisoryFilterParams, AdvisorySystem } from './types';

type AdvisorySystemsViewProps = SystemsViewProps<AdvisorySystem, AdvisoryFilterParams>;

const useAdvisorySystemsRemediation = (advisoryName: string) => {
  const addNotification = useAddNotification();

  // prevents startup delay by preLoading the wizard
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

  const remediationWizard =
    isRemediationOpen && remediationIssues ? (
      <RemediationWizard data={remediationIssues} setRemediationOpen={setRemediationOpen} />
    ) : null;

  return { remediationWizard, bulkActions, rowActions };
};

export default useAdvisorySystemsRemediation;
