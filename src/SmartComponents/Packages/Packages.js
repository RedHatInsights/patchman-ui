/* eslint-disable no-unused-vars */
import TableView from '../../PresentationalComponents/TableView/TableView';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import Error from '../../PresentationalComponents/Snippets/Error';
import { changePackagesListParams, fetchPackagesAction } from '../../store/Actions/Actions';
import { STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { createPackagesRows } from '../../Utilities/DataMappers';
import { buildFilterChips, createSortBy } from '../../Utilities/Helpers';
import { usePerPageSelect, useSetPage, useRemoveFilter, useSortColumn } from '../../Utilities/Hooks';
import { packagesColumns } from './PackagesAssets';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
import { NoSystemData } from '../../PresentationalComponents/Snippets/NoSystemData';
import statusFilter from '../../PresentationalComponents/Filters/StatusFilter';

const Packages = () => {
    const dispatch = useDispatch();
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

    const MainComponent = () => {
        return (
            <React.Fragment>
                <Header title={'Package Updates'} />
                <Main>
                    {status === STATUS_REJECTED ? errorState :
                        (status === STATUS_RESOLVED ? <TableView
                            columns={packagesColumns}
                            store={{ rows, metadata, status, queryParams }}
                            onSort={onSort}
                            sortBy={sortBy}
                            onSetPage={onSetPage}
                            onPerPageSelect={onPerPageSelect}
                            apply={apply}
                            filterConfig={{
                                items: [
                                    searchFilter(apply, queryParams.search, 'Search packages')
                                ]
                            }}
                        /> : ''
                        )
                    }
                </Main>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            {status === STATUS_REJECTED ? errorState : <MainComponent/>}
        </React.Fragment>
    );
};

export default Packages;
