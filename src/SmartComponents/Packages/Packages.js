/* eslint-disable no-unused-vars */
import { Main } from '@redhat-cloud-services/frontend-components';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import Error from '../../PresentationalComponents/Snippets/Error';
import { NoSystemData } from '../../PresentationalComponents/Snippets/NoSystemData';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { packagesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { changePackagesListParams, fetchPackagesAction } from '../../store/Actions/Actions';
import { STATUS_REJECTED } from '../../Utilities/constants';
import { createPackagesRows } from '../../Utilities/DataMappers';
import { buildFilterChips, createSortBy } from '../../Utilities/Helpers';
import { usePerPageSelect, useRemoveFilter, useSetPage, useSortColumn, setPageTitle } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const Packages = () => {
    const dispatch = useDispatch();
    const pageTitle = 'Packages';
    setPageTitle(pageTitle);
    const packageRows = useSelector(
        ({ PackagesListStore }) => PackagesListStore.rows
    );
    const rows = React.useMemo(() => createPackagesRows(packageRows), [packageRows]);

    const error = useSelector(
        ({ PackagesListStore }) => PackagesListStore.error
    );
    const status = useSelector(
        ({ PackagesListStore }) => PackagesListStore.status
    );
    const metadata = useSelector(
        ({ PackagesListStore }) => PackagesListStore.metadata
    );
    const queryParams = useSelector(
        ({ PackagesListStore }) => PackagesListStore.queryParams
    );

    const { filter, search } = queryParams;

    React.useEffect(() => {
        dispatch(fetchPackagesAction(queryParams));
    }, [queryParams]);

    function apply(params) {
        dispatch(changePackagesListParams(params));
    }

    const removeFilter = useRemoveFilter(filter, apply);

    const activeFiltersConfig = {
        filters: buildFilterChips(filter, search),
        onDelete: removeFilter
    };

    const onSort = useSortColumn(packagesColumns, apply);
    const sortBy = React.useMemo(
        () => createSortBy(packagesColumns, metadata.sort, 0),
        [metadata.sort]
    );
    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    const errorState = error.status === 404 ?  <NoSystemData/> : <Error message={error.detail}/>;

    if (status === STATUS_REJECTED && error.status !== 404) {
        dispatch(addNotification({
            variant: 'danger',
            title: error.title,
            description: error.detail
        }));}

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.pageTitlesPackages)} headerOUIA={'packages'}/>
            <Main>
                <TableView
                    columns={packagesColumns}
                    store={{ rows, metadata, status, queryParams }}
                    onSort={onSort}
                    sortBy={sortBy}
                    onSetPage={onSetPage}
                    onPerPageSelect={onPerPageSelect}
                    compact
                    apply={apply}
                    filterConfig={{
                        items: [
                            searchFilter(apply, queryParams.search, intl.formatMessage(messages.searchPackages))
                        ]
                    }}
                    remediationButtonOUIA={'toolbar-remediation-button'}
                    tableOUIA={'package-details-table'}
                    paginationOUIA={'package-details-pagination'}
                    errorState={errorState}
                />
            </Main>
        </React.Fragment>
    );
};

export default Packages;
