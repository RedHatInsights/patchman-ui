import React, { useMemo, useEffect } from 'react';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import propTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import statusFilter from '../../PresentationalComponents/Filters/StatusFilter';
import { SystemUpToDate } from '../../PresentationalComponents/Snippets/SystemUpToDate';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { systemPackagesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import {
    changeSystemPackagesParams, clearSystemPackagesStore,
    fetchApplicableSystemPackages, selectSystemPackagesRow
} from '../../store/Actions/Actions';
import { exportSystemPackagesCSV, exportSystemPackagesJSON } from '../../Utilities/api';
import { remediationIdentifiers, systemPackagesDefaultFilters } from '../../Utilities/constants';
import { createSystemPackagesRows } from '../../Utilities/DataMappers';
import { arrayFromObj, createSortBy, remediationProvider } from '../../Utilities/Helpers';
import { usePerPageSelect, useSetPage, useSortColumn, useOnExport } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import { useOnSelect, ID_API_ENDPOINTS } from '../../Utilities/useOnSelect';

const SystemPackages = ({ handleNoSystemData, inventoryId, shouldRefresh }) => {
    const dispatch = useDispatch();
    const packages = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.rows
    );
    const queryParams = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.queryParams
    );
    const selectedRows = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.selectedRows
    );
    const metadata = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.metadata
    );
    const status = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.status
    );
    const error = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.error
    );
    const rows = useMemo(
        () =>
            createSystemPackagesRows(packages, selectedRows),
        [packages,  selectedRows]
    );

    useEffect(() => {
        return () => dispatch(clearSystemPackagesStore());
    }, []);

    useEffect(()=> {
        dispatch(fetchApplicableSystemPackages({ id: inventoryId, ...queryParams }));
    }, [queryParams]);

    useEffect(() => {
        if (shouldRefresh) {
            dispatch(fetchApplicableSystemPackages({ id: inventoryId, ...queryParams }));
        }
    }, [shouldRefresh]);

    const constructFilename = (pkg) => {
        const pkgUpdates = pkg.updates || [];
        const latestUpdate = pkgUpdates[pkgUpdates.length - 1];
        return latestUpdate && `${pkg.name}-${latestUpdate.evra}`;
    };

    const transformKey = (row) => {
        return `${row.name}-${row.evra}`;
    };

    const onSelect = useOnSelect(
        packages,
        selectedRows,
        {
            endpoint: ID_API_ENDPOINTS.systemPackages(inventoryId),
            queryParams,
            selectionDispatcher: selectSystemPackagesRow,
            constructFilename,
            transformKey
        }
    );

    function apply(params) {
        dispatch(changeSystemPackagesParams({ id: inventoryId, ...params }));
    }

    const onSort = useSortColumn(systemPackagesColumns, apply, 1);
    const sortBy = useMemo(
        () => createSortBy(systemPackagesColumns, metadata.sort, 1),
        [metadata.sort]
    );
    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    const errorState = error.status === 404 ?  handleNoSystemData() : <Unavailable/>;
    const emptyState = (!status.isLoading && !status.hasError && metadata.total_items === 0
                            && Object.keys(queryParams).length === 0) && <SystemUpToDate/>;
    const onExport = useOnExport(inventoryId, queryParams, {
        csv: exportSystemPackagesCSV,
        json: exportSystemPackagesJSON
    }, dispatch);

    return (
        <React.Fragment>
            <TableView
                columns={systemPackagesColumns}
                store={{ rows, metadata, status, queryParams }}
                onSelect={onSelect}
                selectedRows={selectedRows}
                compact
                onSort={onSort}
                sortBy={sortBy}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
                onExport={onExport}
                remediationProvider={() =>
                    remediationProvider(
                        arrayFromObj(selectedRows),
                        inventoryId,
                        remediationIdentifiers.package
                    )
                }
                apply={apply}
                filterConfig={{
                    items: [
                        searchFilter(apply, queryParams.search,
                            intl.formatMessage(messages.labelsFiltersPackagesSearchTitle),
                            intl.formatMessage(messages.labelsFiltersPackagesSearchPlaceHolder)
                        ),
                        statusFilter(apply, queryParams.filter)
                    ]
                }}
                defaultFilters = {systemPackagesDefaultFilters}
                remediationButtonOUIA={'toolbar-remediation-button'}
                tableOUIA={'system-packages-table'}
                paginationOUIA={'system-packages-pagination'}
                errorState={errorState}
                emptyState={emptyState}
                searchChipLabel={intl.formatMessage(messages.labelsFiltersPackagesSearchTitle)}
            />
        </React.Fragment>
    );
};

SystemPackages.propTypes = {
    handleNoSystemData: propTypes.func,
    inventoryId: propTypes.string.isRequired,
    shouldRefresh: propTypes.bool
};
export default SystemPackages;

