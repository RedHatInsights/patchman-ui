import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import creatorFilter from '../../PresentationalComponents/Filters/CreatorFilter';
import TableView from '../../PresentationalComponents/TableView/TableView';
import {
  fetchPatchSetsAction,
  changePatchSetsParams,
  selectPatchSetRow,
  clearPatchSetsAction,
} from '../../store/Actions/Actions';
import { createPatchSetRows } from '../../Utilities/DataMappers';
import { createSortBy, decodeQueryparams, encodeURLParams } from '../../Utilities/Helpers';
import {
  useDeepCompareEffect,
  usePerPageSelect,
  useSetPage,
  useSortColumn,
  usePatchSetState,
  useOnSelect,
  ID_API_ENDPOINTS,
} from '../../Utilities/hooks';
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

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [firstMount, setFirstMount] = React.useState(true);

  const patchSets = useSelector(({ PatchSetsStore }) => PatchSetsStore.rows);

  const queryParams = useSelector(({ PatchSetsStore }) => PatchSetsStore.queryParams);
  const selectedRows = useSelector(({ PatchSetsStore }) => PatchSetsStore.selectedRows);
  const metadata = useSelector(({ PatchSetsStore }) => PatchSetsStore.metadata);
  const status = useSelector(({ PatchSetsStore }) => PatchSetsStore.status);

  const rows = useMemo(
    () => createPatchSetRows(patchSets, selectedRows, queryParams),
    [patchSets, selectedRows],
  );

  function apply(params) {
    dispatch(changePatchSetsParams(params));
  }

  const refreshTable = () => {
    dispatch(fetchPatchSetsAction({ ...queryParams, page: 1, offset: 0 }));
  };

  useEffect(
    () => () => {
      dispatch(clearPatchSetsAction());
    },
    [],
  );

  const { patchSetState, setPatchSetState, openPatchSetEditModal } = usePatchSetState(selectedRows);

  useEffect(() => {
    if (patchSetState.shouldRefresh === true) {
      refreshTable();
    }
  }, [patchSetState.shouldRefresh]);

  useDeepCompareEffect(() => {
    if (firstMount) {
      apply(decodeQueryparams('?' + searchParams.toString()));
      setFirstMount(false);
    } else {
      setSearchParams(encodeURLParams(queryParams));
      dispatch(fetchPatchSetsAction(queryParams));
    }
  }, [queryParams, firstMount]);

  const onSelect = useOnSelect(rows, selectedRows, {
    endpoint: ID_API_ENDPOINTS.templates,
    queryParams,
    selectionDispatcher: selectPatchSetRow,
    totalItems: metadata.total_items,
  });

  const onSort = useSortColumn(patchSetColumns, apply, 0);
  const sortBy = React.useMemo(
    () => createSortBy(patchSetColumns, metadata.sort, 0),
    [metadata.sort],
  );

  const onSetPage = useSetPage(metadata.limit, apply);
  const onPerPageSelect = usePerPageSelect(apply);

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

  // TODO: refactor search filter to be able to wrap this into useMemo
  const filterConfig = {
    items: [
      searchFilter(
        apply,
        queryParams.search,
        intl.formatMessage(messages.labelsFiltersSearchTemplateTitle),
        intl.formatMessage(messages.labelsFiltersSearchTemplatePlaceholder),
      ),
      creatorFilter(apply, queryParams.filter, metadata.creators),
    ],
  };

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
            onSetPage={onSetPage}
            onPerPageSelect={onPerPageSelect}
            onSort={onSort}
            selectedRows={IS_SELECTION_ENABLED ? selectedRows : undefined}
            onSelect={IS_SELECTION_ENABLED ? onSelect : undefined}
            sortBy={sortBy}
            apply={apply}
            tableOUIA='patch-set-table'
            paginationOUIA='patch-set-pagination'
            store={{ rows, metadata, status, queryParams }}
            actionsConfig={patchSets?.length > 0 ? actionsConfig : []}
            filterConfig={filterConfig}
            searchChipLabel={intl.formatMessage(messages.labelsFiltersSearchTemplateTitle)}
            ToolbarButton={CreatePatchSetButton}
            actionsToggle={!hasAccess ? CustomActionsToggle : null}
          />
        )}
      </Main>
    </React.Fragment>
  );
};

export default PatchSet;
