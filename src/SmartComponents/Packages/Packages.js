import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import packagesListStatusFilter from '../../PresentationalComponents/Filters/PackagesListStatusFilter';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { packagesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { changePackagesListParams, fetchPackagesAction } from '../../store/Actions/Actions';
import { exportPackagesCSV, exportPackagesJSON } from '../../Utilities/api/api';
import { pageDefaultFilters } from '../../Utilities/constants';
import { createPackagesRows } from '../../Utilities/DataMappers';
import { createSortBy, decodeQueryparams, encodeURLParams } from '../../Utilities/Helpers';
import { useOnExport, usePerPageSelect, useSetPage, useSortColumn } from '../../Utilities/hooks';
import { intl } from '../../Utilities/IntlProvider';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useSearchParams } from 'react-router-dom';

const Packages = () => {
  const dispatch = useDispatch();
  const [firstMount, setFirstMount] = useState(true);
  const chrome = useChrome();
  useEffect(() => {
    chrome.updateDocumentTitle(`Packages - Content | RHEL`, true);
  }, [chrome]);

  const [searchParams, setSearchParams] = useSearchParams();
  const packageRows = useSelector(({ PackagesListStore }) => PackagesListStore.rows);
  const rows = useMemo(() => createPackagesRows(packageRows), [packageRows]);

  const status = useSelector(({ PackagesListStore }) => PackagesListStore.status);
  const metadata = useSelector(({ PackagesListStore }) => PackagesListStore.metadata);
  const queryParams = useSelector(({ PackagesListStore }) => PackagesListStore.queryParams);

  useLayoutEffect(() => {
    if (firstMount) {
      apply(decodeQueryparams('?' + searchParams.toString()));
      setFirstMount(false);
    } else {
      setSearchParams(encodeURLParams(queryParams));
      dispatch(fetchPackagesAction(queryParams));
    }
  }, [JSON.stringify(queryParams), firstMount]);

  function apply(params) {
    dispatch(changePackagesListParams(params));
  }

  const onExport = useOnExport(
    'packages',
    queryParams,
    {
      csv: exportPackagesCSV,
      json: exportPackagesJSON,
    },
    dispatch,
  );

  const onSort = useSortColumn(packagesColumns, apply);
  const sortBy = useMemo(() => createSortBy(packagesColumns, metadata.sort, 0), [metadata.sort]);
  const onSetPage = useSetPage(metadata.limit, apply);
  const onPerPageSelect = usePerPageSelect(apply);

  return (
    <>
      <Header title={intl.formatMessage(messages.titlesPatchPackages)} headerOUIA='packages' />
      <Main>
        <TableView
          columns={packagesColumns}
          store={{ rows, metadata, status, queryParams }}
          onSort={onSort}
          onExport={onExport}
          sortBy={sortBy}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          compact
          apply={apply}
          filterConfig={{
            items: [
              searchFilter(
                apply,
                queryParams.search,
                intl.formatMessage(messages.labelsFiltersPackagesSearchTitle),
                intl.formatMessage(messages.labelsFiltersPackagesSearchPlaceHolder),
              ),
              packagesListStatusFilter(apply, queryParams.filter),
            ],
          }}
          remediationButtonOUIA='toolbar-remediation-button'
          tableOUIA='package-details-table'
          paginationOUIA='package-details-pagination'
          defaultFilters={pageDefaultFilters.packages}
          searchChipLabel={intl.formatMessage(messages.labelsFiltersPackagesSearchTitle)}
        />
      </Main>
    </>
  );
};

export default Packages;
