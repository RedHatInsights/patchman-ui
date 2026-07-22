import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect, useState, useMemo, useCallback, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import publishDateFilter from '../../PresentationalComponents/Filters/PublishDateFilter';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import typeFilter from '../../PresentationalComponents/Filters/TypeFilter';
import rebootFilter from '../../PresentationalComponents/Filters/RebootFilter';
import Header from '../../PresentationalComponents/Header/Header';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { advisoriesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import {
  changeAdvisoryListParams,
  expandAdvisoryRows,
  fetchApplicableAdvisories,
  selectAdvisoryRow,
} from '../../store/Actions/Actions';
import { exportAdvisoriesCSV, exportAdvisoriesJSON } from '../../Utilities/api/api';
import { pageDefaultFilters } from '../../Utilities/constants';
import { createAdvisoriesRows } from '../../Utilities/DataMappers';
import {
  createSortBy,
  decodeQueryparams,
  encodeURLParams,
  getRowIdByIndexExpandable,
} from '../../Utilities/Helpers';
import {
  ID_API_ENDPOINTS,
  useOnExport,
  useOnSelect,
  usePerPageSelect,
  useRemediationDataProvider,
  useSetPage,
  useSortColumn,
} from '../../Utilities/hooks';
import { intl } from '../../Utilities/IntlProvider';
import AdvisoriesStatusReport from '../../PresentationalComponents/StatusReports/AdvisoriesStatusReport';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HelpIcon } from '@patternfly/react-icons';
import { Button, Content, Popover } from '@patternfly/react-core';
import ExternalLink from '../../PresentationalComponents/Snippets/ExternalLink';
import useFeatureFlag from '../../Utilities/hooks/useFeatureFlag';
import severityFilter from '../../PresentationalComponents/Filters/SeverityFilter';

const Advisories = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chrome = useChrome();
  const isLightspeedEnabled = useFeatureFlag('platform.lightspeed-rebrand');

  useEffect(() => {
    chrome.updateDocumentTitle(`Advisories - Content | RHEL`, true);
  }, [chrome]);

  const dispatch = useDispatch();
  const [firstMount, setFirstMount] = useState(true);
  const advisories = useSelector(({ AdvisoryListStore }) => AdvisoryListStore.rows);
  const expandedRows = useSelector(({ AdvisoryListStore }) => AdvisoryListStore.expandedRows);
  const queryParams = useSelector(({ AdvisoryListStore }) => AdvisoryListStore?.queryParams);
  const selectedRows = useSelector(({ AdvisoryListStore }) => AdvisoryListStore.selectedRows);
  const metadata = useSelector(({ AdvisoryListStore }) => AdvisoryListStore.metadata);
  const status = useSelector(({ AdvisoryListStore }) => AdvisoryListStore.status);
  const areAllSelected = useSelector(({ SystemsStore }) => SystemsStore?.areAllSelected);

  const rows = useMemo(
    () => createAdvisoriesRows(advisories, expandedRows, selectedRows),
    [advisories, expandedRows, selectedRows],
  );

  const [isRemediationLoading, setRemediationLoading] = useState(false);

  useLayoutEffect(() => {
    if (firstMount) {
      apply(decodeQueryparams('?' + searchParams.toString()));
      setFirstMount(false);
    } else {
      navigate(encodeURLParams(queryParams));
      dispatch(fetchApplicableAdvisories(queryParams));
    }
  }, [JSON.stringify(queryParams), firstMount]);

  const onCollapse = useCallback(
    (_, rowId, value) => {
      let changes = [];
      if (rowId === undefined) {
        // toggle all
        changes = advisories.map((advisory) => ({
          rowId: advisory.id,
          value,
        }));
      } else {
        // toggle single
        changes = [
          {
            rowId: getRowIdByIndexExpandable(advisories, rowId),
            value,
          },
        ];
      }

      return dispatch(expandAdvisoryRows(changes));
    },
    [JSON.stringify(advisories)],
  );

  const onSelect = useOnSelect(rows, selectedRows, {
    endpoint: ID_API_ENDPOINTS.advisories,
    queryParams,
    selectionDispatcher: selectAdvisoryRow,
    totalItems: metadata?.total_items,
  });

  const onSort = useSortColumn(advisoriesColumns, apply, 2);
  const sortBy = useMemo(() => createSortBy(advisoriesColumns, metadata.sort, 2), [metadata.sort]);

  const onExport = useOnExport(
    'advisories',
    queryParams,
    {
      csv: exportAdvisoriesCSV,
      json: exportAdvisoriesJSON,
    },
    dispatch,
  );

  const onSetPage = useSetPage(metadata.limit, apply);
  const onPerPageSelect = usePerPageSelect(apply);

  function apply(params) {
    dispatch(changeAdvisoryListParams(params));
  }

  const remediationDataProvider = useRemediationDataProvider(
    selectedRows,
    setRemediationLoading,
    'advisories',
    areAllSelected,
  );

  return (
    <>
      <Header
        title={
          <>
            {intl.formatMessage(messages.titlesPatchAdvisories)}
            <Popover
              headerContent='About advisories'
              bodyContent={
                <Content component='p'>
                  Advisories show all applicable Red Hat and Extra Packages for Enterprise Linux
                  (EPEL) advisories for your RHEL systems checking into{' '}
                  {isLightspeedEnabled ? 'Red Hat Lightspeed' : 'Insights'}.
                </Content>
              }
              footerContent={
                <Content component='p'>
                  <ExternalLink
                    link={
                      'https://docs.redhat.com/en/documentation/red_hat_lightspeed/1-latest' +
                      '/html/managing_system_content_and_patch_updates_on_rhel_systems' +
                      '/patch-service-overview#patching-using-playbooks_patch-service-overview'
                    }
                    text='System Patching Using Remediation Playbooks'
                  />
                </Content>
              }
            >
              <Button
                icon={<HelpIcon style={{ verticalAlign: '-2px' }} />}
                variant='plain'
                aria-label='About advisories'
                className='pf-v6-u-ml-sm'
                style={{ verticalAlign: '2px' }}
              />
            </Popover>
          </>
        }
        headerOUIA='advisories'
      />
      <AdvisoriesStatusReport />
      <Main>
        <TableView
          columns={advisoriesColumns}
          compact
          onCollapse={onCollapse}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          onSort={onSort}
          onExport={onExport}
          selectedRows={selectedRows}
          onSelect={onSelect}
          sortBy={sortBy}
          remediationProvider={remediationDataProvider}
          apply={apply}
          remediationButtonOUIA='toolbar-remediation-button'
          tableOUIA='advisories-table'
          paginationOUIA='advisories-pagination'
          store={{ rows, metadata, status, queryParams }}
          filterConfig={{
            items: [
              searchFilter(
                apply,
                queryParams?.search,
                intl.formatMessage(messages.labelsFiltersSearchAdvisoriesTitle),
                intl.formatMessage(messages.labelsFiltersSearchAdvisoriesPlaceholder),
              ),
              typeFilter(apply, queryParams?.filter),
              severityFilter(apply, queryParams?.filter),
              publishDateFilter(apply, queryParams?.filter),
              rebootFilter(apply, queryParams?.filter),
            ],
          }}
          defaultFilters={pageDefaultFilters.advisories}
          searchChipLabel={intl.formatMessage(messages.labelsFiltersSearchAdvisoriesTitle)}
          isRemediationLoading={isRemediationLoading}
          hasColumnManagement
        />
      </Main>
    </>
  );
};

export default Advisories;
