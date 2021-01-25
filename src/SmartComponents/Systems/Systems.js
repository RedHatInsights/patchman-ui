import React from 'react';
import { Main } from '@redhat-cloud-services/frontend-components';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import { Unavailable } from '@redhat-cloud-services/frontend-components';
import { getStore, register } from '../../store';
import { changeSystemsListParams, fetchSystemsAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import { exportSystemsCSV, exportSystemsJSON } from '../../Utilities/api';
import { STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { createSystemsRows } from '../../Utilities/DataMappers';
import { buildFilterChips, createSortBy } from '../../Utilities/Helpers';
import { setPageTitle, useHandleRefresh, usePagePerPage,
    useRemoveFilter, useSortColumn, useDeepCompareEffect } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import RemediationModal from '../Remediation/RemediationModal';
import { systemsListColumns, systemsRowActions } from './SystemsListAssets';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/components/cjs/Inventory';
import { TableVariant } from '@patternfly/react-table';

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
    const hosts = React.useMemo(() => createSystemsRows(rawSystems), [
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
            searchFilter(apply, search, intl.formatMessage(messages.labelsFiltersSystemsSearch))
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
                            hasCheckbox={false}
                            actions={systemsRowActions(showRemediationModal)}
                            filterConfig={filterConfig}
                            activeFiltersConfig = {activeFiltersConfig}
                            tableProps = {{ areActionsDisabled, onSort, sortBy, variant: TableVariant.compact }}

                        />
                    )
                }
            </Main>
        </React.Fragment>
    );
};

export default Systems;
