import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { createPatchSetRows } from '../../Utilities/DataMappers';
import { createSortBy } from '../../Utilities/Helpers';
import { usePatchSetState } from '../../Utilities/hooks';
import { intl } from '../../Utilities/IntlProvider';
import {
  patchSetColumns,
  CreatePatchSetButton as createPatchSetButton,
  CustomActionsToggle,
} from './PatchSetAssets';
import PatchSetWizard from '../PatchSetWizard/PatchSetWizard';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Icon, Popover } from '@patternfly/react-core';
import { NoPatchSetList } from '../../PresentationalComponents/Snippets/EmptyStates';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const PatchSet = () => {
  const IS_SELECTION_ENABLED = false;
  const chrome = useChrome();
  useEffect(() => {
    chrome.updateDocumentTitle(`Templates - Patch | RHEL`, true);
  }, [chrome]);

  const patchSets = useSelector(({ PatchSetsStore }) => PatchSetsStore.rows);

  const queryParams = useSelector(({ PatchSetsStore }) => PatchSetsStore.queryParams);
  const selectedRows = useSelector(({ PatchSetsStore }) => PatchSetsStore.selectedRows);
  const metadata = useSelector(({ PatchSetsStore }) => PatchSetsStore.metadata);
  const status = useSelector(({ PatchSetsStore }) => PatchSetsStore.status);

  const rows = useMemo(
    () => createPatchSetRows(patchSets, selectedRows, queryParams),
    [patchSets, selectedRows],
  );

  const { patchSetState, setPatchSetState, openPatchSetEditModal } = usePatchSetState(selectedRows);

  const sortBy = React.useMemo(
    () => createSortBy(patchSetColumns, metadata.sort, 0),
    [metadata.sort],
  );

  const { hasAccess } = usePermissionsWithContext(['patch:*:*', 'patch:template:write']);
  const CreatePatchSetButton = createPatchSetButton(setPatchSetState, hasAccess);
  const actionsConfig = [
    {
      title: intl.formatMessage(messages.labelsButtonEditTemplate),
      onClick: (_event, _rowId, rowData) => {
        openPatchSetEditModal(rowData?.id);
      },
    },
  ];

  return (
    <React.Fragment>
      <Header
        headerOUIA='advisories'
        title={
          <span>
            {intl.formatMessage(messages.titlesTemplate)}
            <Popover
              id='template-header-title-popover'
              aria-describedby='template-header-title-popover'
              aria-labelledby='template-header-title-popover'
              hasAutoWidth
              maxWidth='320px'
              position='right'
              enableFlip
              headerContent={intl.formatMessage(messages.templatePopoverHeader)}
              bodyContent={intl.formatMessage(messages.templatePopoverBody)}
            >
              <Icon>
                <OutlinedQuestionCircleIcon
                  className='pf-v6-u-ml-sm'
                  color='var(--pf-t--global--icon--color--subtle)'
                  style={{ verticalAlign: '0', fontSize: 16, cursor: 'pointer' }}
                />
              </Icon>
            </Popover>
          </span>
        }
      />
      {patchSetState.isPatchSetWizardOpen && (
        <PatchSetWizard setBaselineState={setPatchSetState} patchSetID={patchSetState.patchSetID} />
      )}
      <Main>
        {rows.length === 0 && !status.isLoading ? (
          <NoPatchSetList Button={CreatePatchSetButton} />
        ) : (
          <TableView
            columns={patchSetColumns}
            compact
            selectedRows={IS_SELECTION_ENABLED ? selectedRows : undefined}
            sortBy={sortBy}
            tableOUIA='patch-set-table'
            paginationOUIA='patch-set-pagination'
            store={{ rows, metadata, status, queryParams }}
            actionsConfig={patchSets?.length > 0 ? actionsConfig : []}
            searchChipLabel={intl.formatMessage()}
            ToolbarButton={CreatePatchSetButton}
            actionsToggle={!hasAccess ? CustomActionsToggle : null}
          />
        )}
      </Main>
    </React.Fragment>
  );
};

export default PatchSet;
