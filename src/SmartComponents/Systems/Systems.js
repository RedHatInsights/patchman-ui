/* eslint-disable no-unused-vars */
import { nowrap, TableVariant } from '@patternfly/react-table';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import { register } from '../../store';
import { changeSystemsListParams } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import {
    exportSystemsCSV, exportSystemsJSON, fetchApplicableAdvisoriesApi,
    fetchSystems, fetchViewAdvisoriesSystems
} from '../../Utilities/api';
import { STATUS_REJECTED } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips, createSortBy,
    remediationProviderWithPairs, transformPairs, filterSelectedRowIDs
} from '../../Utilities/Helpers';
import {
    setPageTitle, useOnSelect, useSortColumn, useRemoveFilter, useBulkSelectConfig
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import PatchRemediationButton from '../Remediation/PatchRemediationButton';
import RemediationModal from '../Remediation/RemediationModal';
import { systemsListColumns, systemsRowActions } from './SystemsListAssets';

const createColumns = (defaultColumns) => {
    let [nameColumn, ...restColumns] = systemsListColumns;
    let lastSeenColumn = defaultColumns.filter(({ key }) => key === 'updated');

    lastSeenColumn = { ...lastSeenColumn[0], cellTransforms: [nowrap], props: { width: 20 } };

    let mergedColumns = [nameColumn, ...restColumns, lastSeenColumn];
    console.log(mergedColumns);
    return mergedColumns;
};

const Systems = () => {
    const pageTitle = intl.formatMessage(messages.titlesSystems);

    setPageTitle(pageTitle);

    const dispatch = useDispatch();
    const [isRemediationLoading, setRemediationLoading] = React.useState(false);
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);

    const systems = useSelector(({ entities }) => entities?.rows || [], shallowEqual);

    const selectedRows = useSelector(
        ({ entities }) => entities?.selectedRows || []
    );

    const status = useSelector(
        ({ entities }) => entities?.status
    );
    const metadata = useSelector(
        ({ entities }) => entities?.metadata || {}
    );
    const queryParams = useSelector(
        ({ entities }) => entities?.queryParams || {}
    );

    const inventoryColumns = useSelector(
        ({ entities }) => entities && entities.columns
    );

    const { filter, search } = queryParams;

    async function showRemediationModal(data) {
        setRemediationLoading(true);
        const resolvedData = await data;
        setRemediationModalCmp(() => () => <RemediationModal data={resolvedData} />);
        setRemediationLoading(false);
    }

    function apply(params) {
        dispatch(changeSystemsListParams(params));
    }

    const [deleteFilters] = useRemoveFilter(filter, apply);

    const filterConfig = {
        items: [
            searchFilter(apply, search,
                intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
                intl.formatMessage(messages.labelsFiltersSystemsSearchPlaceholder)
            )
        ]
    };

    const activeFiltersConfig = {
        filters: buildFilterChips(filter, search),
        onDelete: deleteFilters
    };

    // This is used ONLY for sorting purposes
    const getMangledColumns = () => {
        let updated = inventoryColumns && inventoryColumns.filter(({ key }) => key === 'updated')[0];
        updated = { ...updated, key: 'last_upload' };
        return [...systemsListColumns, updated];
    };

    const fetchAllData = () =>
        fetchSystems({ ...queryParams, limit: -1 });

    const selectRows = (toSelect) => {
        dispatch(
            { type: 'SELECT_ENTITY', payload: toSelect }
        );
    };

    const onSelect = useOnSelect(systems,  selectedRows, fetchAllData, selectRows);

    const onSort = useSortColumn(getMangledColumns(), apply, 1);
    const sortBy = React.useMemo(
        () => createSortBy(getMangledColumns(), metadata.sort, 1),
        [metadata.sort]
    );
    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

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
        const { applicable_advisories: ad } = rowData;
        return ad && ad.every(typeSum => typeSum === 0);
    };

    const prepareRemediationPairs = (systems) => {
        return fetchApplicableAdvisoriesApi({ limit: -1 }).then(
            ({ data }) => fetchViewAdvisoriesSystems(
                {
                    advisories: data.map(advisory=> advisory.id),
                    systems
                }
            ));
    };

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchSystems)} headerOUIA={'systems'}/>
            <RemediationModalCmp />
            <Main>
                {status === STATUS_REJECTED ? <Unavailable/> :
                    (
                        <InventoryTable
                            disableDefaultColumns
                            onLoad={({ mergeWithEntities }) => {
                                register({
                                    ...mergeWithEntities(
                                        inventoryEntitiesReducer(systemsListColumns),
                                        {
                                            page: Number(queryParams.page || 1),
                                            perPage: Number(queryParams.page_size || 20),
                                            ...(queryParams.sort && {
                                                sortBy: {
                                                    key: queryParams.sort.replace(/^-/, ''),
                                                    direction: queryParams.sort.match(/^-/) ? 'desc' : 'asc'
                                                }
                                            })
                                        }
                                    )
                                });
                            }}
                            isFullView
                            autoRefresh
                            ignoreRefresh
                            initialLoading
                            customFilters={{
                                search: queryParams.search,
                                filter: queryParams.filter
                            }}
                            getEntities={async (
                                _items,
                                { orderBy, orderDirection, page, per_page: perPage, filters }
                            ) => {

                                apply({
                                    page,
                                    per_page: perPage,
                                    ...filters
                                });

                                const items = await fetchSystems({
                                    page,
                                    per_page: perPage,
                                    ...filters
                                });

                                return Promise.resolve({
                                    results: items.data.map(row => ({ id: row.id, ...row.attributes })),
                                    total: items.meta?.total_itmes,
                                    page,
                                    perPage,
                                    metadata
                                });
                            }}
                            hideFilters={{ all: true }}
                            columns={(defaultColumns) => createColumns(defaultColumns)}
                            exportConfig={{
                                isDisabled: metadata.total_items === 0,
                                onSelect: onExport
                            }}
                            actions={systemsRowActions(showRemediationModal)}
                            filterConfig={filterConfig}
                            activeFiltersConfig = {activeFiltersConfig}
                            tableProps={{
                                areActionsDisabled,
                                onSort: metadata.total_items && onSort,
                                sortBy: metadata.total_items && sortBy,
                                canSelectAll: false,
                                variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true }}
                            dedicatedAction={(
                                <PatchRemediationButton
                                    onClick={() =>
                                        showRemediationModal(
                                            remediationProviderWithPairs(
                                                filterSelectedRowIDs(selectedRows),
                                                prepareRemediationPairs, transformPairs)
                                        )}
                                    isDisabled={arrayFromObj(selectedRows).length === 0 || isRemediationLoading}
                                    isLoading={isRemediationLoading}
                                    ouia={'toolbar-remediation-button'}
                                />)}

                        >
                        </InventoryTable>
                    )
                }
            </Main>
        </React.Fragment>
    );
};

export default Systems;
