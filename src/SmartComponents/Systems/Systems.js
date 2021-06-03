import { TableVariant } from '@patternfly/react-table';
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
import { changeEntitiesParams, clearEntitiesStore } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, initialState } from '../../store/Reducers/InventoryEntitiesReducer';
import {
    exportSystemsCSV, exportSystemsJSON, fetchApplicableAdvisoriesApi,
    fetchSystems, fetchViewAdvisoriesSystems
} from '../../Utilities/api';
import { STATUS_REJECTED } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips, remediationProviderWithPairs,
    transformPairs, filterSelectedRowIDs
} from '../../Utilities/Helpers';
import {
    setPageTitle, useOnSelect, useRemoveFilter, useBulkSelectConfig, useGetEntities
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import PatchRemediationButton from '../Remediation/PatchRemediationButton';
import RemediationModal from '../Remediation/RemediationModal';
import { systemsListColumns, systemsRowActions } from './SystemsListAssets';

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
    const queryParams = useSelector(
        ({ entities }) => entities?.queryParams || {}
    );
    const totalItems = useSelector(
        ({ entities }) => entities?.total || 0
    );

    const { filter, search } = queryParams;

    React.useEffect(() => {
        return () => dispatch(clearEntitiesStore());
    }, []);

    async function showRemediationModal(data) {
        setRemediationLoading(true);
        const resolvedData = await data;
        setRemediationModalCmp(() => () => <RemediationModal data={resolvedData} />);
        setRemediationLoading(false);
    }

    function apply(params) {
        dispatch(changeEntitiesParams(params));
    }

    const [deleteFilters] = useRemoveFilter({ search }, apply);

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

    const fetchAllData = () =>
        fetchSystems({ ...queryParams, limit: -1 });

    const selectRows = (toSelect) => {
        dispatch(
            { type: 'SELECT_ENTITY', payload: toSelect }
        );
    };

    const onSelect = useOnSelect(systems,  selectedRows, fetchAllData, selectRows);

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
        const { applicable_advisories: applicableAdvisories } = rowData;
        return applicableAdvisories && applicableAdvisories.every(typeSum => typeSum === 0);
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

    const getEntities = useGetEntities(fetchSystems, apply);

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchSystems)} headerOUIA={'systems'}/>
            <RemediationModalCmp />
            <Main>
                {status === STATUS_REJECTED ? <Unavailable/> :
                    (
                        <InventoryTable
                            disableDefaultColumns
                            isFullView
                            autoRefresh
                            initialLoading
                            hideFilters={{ all: true }}
                            customFilters={{
                                patchParams: {
                                    search,
                                    filter
                                }
                            }}
                            onLoad={({ mergeWithEntities }) => {
                                register({
                                    ...mergeWithEntities(
                                        inventoryEntitiesReducer(systemsListColumns),
                                        initialState
                                    )
                                });
                            }}
                            getEntities={getEntities}
                            bulkSelect={useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems)}
                            exportConfig={{
                                isDisabled: totalItems === 0,
                                onSelect: onExport
                            }}
                            actions={systemsRowActions(showRemediationModal)}
                            filterConfig={filterConfig}
                            activeFiltersConfig = {activeFiltersConfig}
                            tableProps={{
                                areActionsDisabled,
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
