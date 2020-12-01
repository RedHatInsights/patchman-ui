import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import statusFilter from '../../PresentationalComponents/Filters/StatusFilter';
import Error from '../../PresentationalComponents/Snippets/Error';
import { NoSystemData } from '../../PresentationalComponents/Snippets/NoSystemData';
import { SystemUpToDate } from '../../PresentationalComponents/Snippets/SystemUpToDate';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { systemPackagesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { changeSystemPackagesParams, clearSystemPackagesStore,
    fetchApplicableSystemPackages, selectSystemPackagesRow } from '../../store/Actions/Actions';
import { fetchApplicablePackagesApi } from '../../Utilities/api';
import { STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { createSystemPackagesRows } from '../../Utilities/DataMappers';
import { arrayFromObj, createSortBy, remediationProvider } from '../../Utilities/Helpers';
import { usePerPageSelect, useSetPage, useSortColumn, useOnSelect } from '../../Utilities/Hooks';

const SystemPackages = () => {
    const dispatch = useDispatch();
    const entity = useSelector(({ entityDetails }) => entityDetails.entity);
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
    const rows = React.useMemo(
        () =>
            createSystemPackagesRows(packages, selectedRows),
        [packages,  selectedRows]
    );

    React.useEffect(() => {
        return () => dispatch(clearSystemPackagesStore());
    }, []);

    React.useEffect(()=> {
        dispatch(fetchApplicableSystemPackages({ id: entity.id, ...queryParams }));
    }, [queryParams]);

    const constructFilename = (pkg) => {
        const pkgUpdates = pkg.updates || [];
        const latestUpdate = pkgUpdates[pkgUpdates.length - 1];
        return latestUpdate && `${pkg.name}-${latestUpdate.evra}`;
    };

    const fetchAllData = () =>
        fetchApplicablePackagesApi({ id: entity.id, limit: -1 });

    const selectRows = (toSelect) => {
        dispatch(selectSystemPackagesRow(toSelect));
    };

    const onSelect = useOnSelect(packages, selectedRows, fetchAllData, selectRows, constructFilename);

    function apply(params) {
        dispatch(changeSystemPackagesParams({ id: entity.id, ...params }));
    }

    const onSort = useSortColumn(systemPackagesColumns, apply, 1);
    const sortBy = React.useMemo(
        () => createSortBy(systemPackagesColumns, metadata.sort, 1),
        [metadata.sort]
    );
    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    const errorState = error.status === 404 ?  <NoSystemData/> : <Error message={error.detail}/>;
    const emptyState = (status === STATUS_RESOLVED && metadata.total_items === 0
                            && Object.keys(queryParams).length === 0) && <SystemUpToDate/>;

    if (status === STATUS_REJECTED && error.status !== 404) {
        dispatch(addNotification({
            variant: 'danger',
            title: error.title,
            description: error.detail
        }));}

    return (
        <React.Fragment>
            <TableView
                columns={systemPackagesColumns}
                store={{ rows, metadata, status, queryParams }}
                onSelect={(packages.length && onSelect) || undefined}
                selectedRows={selectedRows}
                compact
                onSort={onSort}
                sortBy={sortBy}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
                remediationProvider={() =>
                    remediationProvider(arrayFromObj(selectedRows), entity.id)
                }
                apply={apply}
                filterConfig={{
                    items: [
                        searchFilter(apply, queryParams.search, 'Search packages'),
                        statusFilter(apply, queryParams.filter)
                    ]
                }}
                remediationButtonOUIA={'toolbar-remediation-button'}
                tableOUIA={'system-packages-table'}
                paginationOUIA={'system-packages-pagination'}
                errorState={errorState}
                emptyState={emptyState}
            />
        </React.Fragment>
    );
};

export default SystemPackages;

