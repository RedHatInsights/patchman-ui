import {
    Table as PfTable,
    TableBody,
    TableHeader,
    TableGridBreakpoint,
    cellWidth,
    TableVariant,
    sortable,
    expandable,
    SortByDirection
} from '@patternfly/react-table/dist/js';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import Error from '../../PresentationalComponents/Snippets/Error';
import { getStore, register } from '../../store';
import { changeSystemsListParams, fetchSystemsAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import { exportSystemsCSV, exportSystemsJSON } from '../../Utilities/api';
import { STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { createSystemsRows } from '../../Utilities/DataMappers';
import { buildFilterChips, createSortBy } from '../../Utilities/Helpers';
import { useHandleRefresh, usePagePerPage, useRemoveFilter, useSortColumn } from '../../Utilities/Hooks';
import RemediationModal from '../Remediation/RemediationModal';
import { systemsListColumns, systemsRowActions } from './SystemsListAssets';

const Systems = () => {
    const dispatch = useDispatch();
    const [InventoryCmp, setInventoryCmp] = React.useState();
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const rawSystems = useSelector(
        ({ SystemsListStore }) => SystemsListStore.rows
    );
    const hosts = React.useMemo(() => createSystemsRows(rawSystems), [
        rawSystems
    ]);
    const error = useSelector(
        ({ SystemsListStore }) => SystemsListStore.error
    );
    const status = useSelector(
        ({ SystemsListStore }) => SystemsListStore.status
    );
    const metadata = useSelector(
        ({ SystemsListStore }) => SystemsListStore.metadata
    );
    const queryParams = useSelector(
        ({ SystemsListStore }) => SystemsListStore.queryParams
    );

    const inventoryColumns = useSelector(
        ({ entities }) => entities && entities.columns
    );

    const { filter, search } = queryParams;

    const handleRefresh = useHandleRefresh(metadata, apply);

    React.useEffect(() => {
        dispatch(fetchSystemsAction(queryParams));
    }, [queryParams]);

    const fetchInventory = async () => {
        const {
            inventoryConnector,
            mergeWithEntities
        } = await insights.loadInventory({
            ReactRedux,
            React,
            reactRouterDom,
            pfReactTable: {
                Table: PfTable,
                TableBody,
                TableHeader,
                TableGridBreakpoint,
                cellWidth,
                TableVariant,
                sortable,
                expandable,
                SortByDirection
            }
        });

        register({
            ...mergeWithEntities(inventoryEntitiesReducer(systemsListColumns))
        });
        const { InventoryTable } = inventoryConnector(getStore());
        setInventoryCmp(() => InventoryTable);
    };

    React.useEffect(() => {
        fetchInventory();
    }, []);

    const [page, perPage] = usePagePerPage(metadata.limit, metadata.offset);

    const showRemediationModal = data => {
        setRemediationModalCmp(() => () => <RemediationModal data={data} />);
    };

    function apply(params) {
        dispatch(changeSystemsListParams(params));
    }

    const removeFilter = useRemoveFilter(filter, apply);

    const filterConfig = {
        items: [
            searchFilter(apply, search, 'Search systems')
        ]
    };

    const activeFiltersConfig = {
        filters: buildFilterChips(filter, search),
        onDelete: removeFilter
    };

    // This is used ONLY for sorting purposes
    const getMangledColumns = () => {
        let updated = inventoryColumns && inventoryColumns.filter(({ key }) => key === 'updated')[0];
        updated = { ...updated, key: 'last_upload' };
        return [...systemsListColumns, updated];
    };

    const onSort = useSortColumn(getMangledColumns(), apply);
    const sortBy = React.useMemo(
        () => createSortBy(getMangledColumns(), metadata.sort, 0),
        [metadata.sort]
    );

    const onExport = (_, format) => {
        const date = new Date().toISOString().replace(/[T:]/g, '-').split('.')[0] + '-utc';
        const filename = `systems-${date}`;
        if (format === 'csv') {
            exportSystemsCSV(queryParams).then(data => downloadFile(data, filename, 'csv'));
        }
        else {
            exportSystemsJSON(queryParams).then(data => downloadFile(JSON.stringify(data), filename, 'json'));
        }
    };

    const areActionsDisabled = (rowData) => {
        // eslint-disable-next-line camelcase
        const { applicable_advisories } = rowData;
        return applicable_advisories.every(typeSum => typeSum === 0);
    };

    return (
        <React.Fragment>

            <Header title={'Systems'} />
            <RemediationModalCmp />
            <Main>
                {status === STATUS_REJECTED ? <Error message={error.detail}/> :
                    InventoryCmp && (
                        <InventoryCmp
                            items={hosts}
                            page={page}
                            total={metadata.total_items}
                            perPage={perPage}
                            isLoaded={status === STATUS_RESOLVED}
                            onRefresh={handleRefresh}
                            exportConfig={{ onSelect: onExport }}
                            hasCheckbox={false}
                            actions={systemsRowActions(showRemediationModal)}
                            filterConfig={filterConfig}
                            activeFiltersConfig = {activeFiltersConfig}
                            tableProps = {{ areActionsDisabled, onSort, sortBy }}

                        />
                    )
                }
            </Main>
        </React.Fragment>
    );
};

export default Systems;
