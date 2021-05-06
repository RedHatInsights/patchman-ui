import { TableVariant } from '@patternfly/react-table';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import { getStore, register } from '../../store';
import { changeSystemsListParams, fetchSystemsAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import {
    exportSystemsCSV, exportSystemsJSON, fetchApplicableAdvisoriesApi,
    fetchSystems, fetchViewAdvisoriesSystems
} from '../../Utilities/api';
import { STATUS_RESOLVED } from '../../Utilities/constants';
import { createSystemsRows } from '../../Utilities/DataMappers';
import {
    arrayFromObj, buildFilterChips, createSortBy,
    remediationProviderWithPairs, transformPairs
} from '../../Utilities/Helpers';
import {
    setPageTitle,
    useDeepCompareEffect, useHandleRefresh, useOnSelect, usePagePerPage,
    useRemoveFilter, useSortColumn, useBulkSelectConfig
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import PatchRemediationButton from '../Remediation/PatchRemediationButton';
import RemediationModal from '../Remediation/RemediationModal';
import { systemsListColumns, systemsRowActions } from './SystemsListAssets';
import GeneralComponent from '../../PresentationalComponents/Snippets/GeneralComponent';

const Systems = () => {
    const pageTitle = intl.formatMessage(messages.titlesSystems);

    setPageTitle(pageTitle);

    const dispatch = useDispatch();
    const [isRemediationLoading, setRemediationLoading] = React.useState(false);
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const rawSystems = useSelector(
        ({ SystemsListStore }) => SystemsListStore.rows
    );
    const selectedRows = useSelector(
        ({ SystemsListStore }) => SystemsListStore.selectedRows
    );
    const hosts = React.useMemo(() => createSystemsRows(rawSystems, selectedRows), [
        rawSystems
    ]);
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

    useDeepCompareEffect(() => {
        dispatch(fetchSystemsAction(queryParams));
    }, [queryParams]);

    const [page, perPage] = usePagePerPage(metadata.limit, metadata.offset);

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

    const onSelect = useOnSelect(hosts,  selectedRows, fetchAllData, selectRows);

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
        const { applicable_advisories } = rowData;
        return applicable_advisories.every(typeSum => typeSum === 0);
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
                <GeneralComponent status={status}>
                    <InventoryTable
                        disableDefaultColumns
                        onLoad={({ mergeWithEntities }) => {
                            const store = getStore();
                            register({
                                ...mergeWithEntities(
                                    inventoryEntitiesReducer(systemsListColumns, store.getState().SystemsListStore)
                                )
                            });
                        }}
                        isFullView
                        items={hosts}
                        page={page}
                        total={metadata.total_items}
                        perPage={perPage}
                        isLoaded={status === STATUS_RESOLVED}
                        onRefresh={handleRefresh}
                        exportConfig={{
                            isDisabled: metadata.total_items === 0,
                            onSelect: onExport
                        }}
                        bulkSelect={onSelect && useBulkSelectConfig(selectedCount, onSelect, metadata, hosts)}
                        actions={systemsRowActions(showRemediationModal)}
                        filterConfig={filterConfig}
                        activeFiltersConfig={activeFiltersConfig}
                        tableProps={{
                            areActionsDisabled,
                            onSort: metadata.total_items && onSort,
                            sortBy: metadata.total_items && sortBy,
                            canSelectAll: false,
                            variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true
                        }}
                        dedicatedAction={(
                            <PatchRemediationButton
                                onClick={() =>
                                    showRemediationModal(
                                        remediationProviderWithPairs(
                                            Object.keys(selectedRows).filter(row => selectedRows[row]),
                                            prepareRemediationPairs, transformPairs)
                                    )}
                                isDisabled={arrayFromObj(selectedRows).length === 0 || isRemediationLoading}
                                isLoading={isRemediationLoading}
                                ouia={'toolbar-remediation-button'}
                            />)}

                    >
                    </InventoryTable>
                </GeneralComponent>
            </Main>
        </React.Fragment>
    );
};

export default Systems;
