import { TableVariant } from '@patternfly/react-table';
import { Main, Unavailable } from '@redhat-cloud-services/frontend-components';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/components/cjs/Inventory';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import { getStore, register } from '../../store';
import { changeSystemsListParams, fetchSystemsAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import { exportSystemsCSV, exportSystemsJSON, fetchSystems } from '../../Utilities/api';
import { STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { createSystemsRows } from '../../Utilities/DataMappers';
import { arrayFromObj, buildFilterChips, createSortBy } from '../../Utilities/Helpers';
import {
    setPageTitle,
    useDeepCompareEffect, useHandleRefresh, useOnSelect, usePagePerPage,
    useRemoveFilter, useSortColumn
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import RemediationModal from '../Remediation/RemediationModal';
import { systemsListColumns, systemsRowActions } from './SystemsListAssets';

const Systems = () => {
    const pageTitle = intl.formatMessage(messages.titlesSystems);

    setPageTitle(pageTitle);

    const dispatch = useDispatch();

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

    const showRemediationModal = data => {
        setRemediationModalCmp(() => () => <RemediationModal data={data} />);
    };

    function apply(params) {
        dispatch(changeSystemsListParams(params));
    }

    const removeFilter = useRemoveFilter(filter, apply);

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
        onDelete: removeFilter
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

    const onSelect = useOnSelect(rawSystems,  selectedRows, fetchAllData, selectRows);

    const onSort = useSortColumn(getMangledColumns(), apply);
    const sortBy = React.useMemo(
        () => createSortBy(getMangledColumns(), metadata.sort, 0),
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

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchSystems)} headerOUIA={'systems'}/>
            <RemediationModalCmp />
            <Main>
                {status === STATUS_REJECTED ? <Unavailable/> :
                    (
                        <InventoryTable
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
                            exportConfig={{ onSelect: onExport }}
                            bulkSelect={onSelect && {
                                count: selectedCount,
                                items: [{
                                    title: `Select none (0)`,
                                    onClick: () => {
                                        onSelect('none');
                                    }
                                }, {
                                    title: `Select page (${hosts.length})`,
                                    onClick: () => {
                                        onSelect('page');
                                    }
                                },
                                {
                                    title: `Select all (${metadata.total_items})`,
                                    onClick: () => {
                                        onSelect('all');
                                    }
                                }],
                                onSelect: (value) => {
                                    value ? onSelect('all') : onSelect('none');
                                },
                                toggleProps: {
                                    'data-ouia-component-type': 'bulk-select-toggle-button'
                                },
                                checked: selectedCount === metadata.total_items ? true : selectedCount === 0 ? false : null
                            }}
                            actions={systemsRowActions(showRemediationModal)}
                            filterConfig={filterConfig}
                            activeFiltersConfig = {activeFiltersConfig}
                            tableProps = {{ areActionsDisabled, onSort, sortBy, canSelectAll: false,
                                variant: TableVariant.compact, className: 'patchCompactInventory' }}

                        />
                    )
                }
            </Main>
        </React.Fragment>
    );
};

export default Systems;
