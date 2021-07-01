import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { register } from '../../store';
import { changeSystemsParams, clearSystemsStore } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyInventory } from '../../store/Reducers/InventoryEntitiesReducer';
import {
    exportSystemsCSV, exportSystemsJSON, fetchApplicableAdvisoriesApi,
    fetchSystems, fetchViewAdvisoriesSystems
} from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips,
    filterSelectedRowIDs, remediationProviderWithPairs,
    transformPairs, persistantParams, filterRemediatableSystems
} from '../../Utilities/Helpers';
import {
    setPageTitle, useBulkSelectConfig, useGetEntities, useOnExport, useOnSelect, useRemoveFilter
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
        ({ entities }) => entities?.status || {}
    );
    const queryParams = useSelector(
        ({ entities }) => entities?.queryParams || {}
    );
    const systemsParams = useSelector(
        ({ entities }) => entities?.systemsParams || {}
    );
    const totalItems = useSelector(
        ({ entities }) => entities?.total || 0
    );

    const { systemProfile, selectedTags } = queryParams;
    const { filter, search, page, perPage, sort } = systemsParams;

    React.useEffect(() => {
        return () => dispatch(clearSystemsStore());
    }, []);

    async function showRemediationModal(data) {
        setRemediationLoading(true);
        const resolvedData = await data;
        setRemediationModalCmp(() => () => <RemediationModal data={resolvedData} />);
        setRemediationLoading(false);
    }

    function apply(params) {
        dispatch(changeSystemsParams(params));
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

    const fetchAllData = (queryParams) =>
        fetchSystems({ ...queryParams, ...systemsParams, limit: -1 }).then(filterRemediatableSystems);

    const selectRows = (toSelect) => {
        dispatch(
            { type: 'SELECT_ENTITY', payload: toSelect }
        );
    };

    const onSelect = useOnSelect(systems, selectedRows, fetchAllData, selectRows);

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const onExport = useOnExport('systems', { ...queryParams, ...systemsParams }, {
        csv: exportSystemsCSV,
        json: exportSystemsJSON
    }, dispatch);

    const areActionsDisabled = (rowData) => {
        const { applicable_advisories: applicableAdvisories } = rowData;
        return applicableAdvisories && applicableAdvisories.every(typeSum => typeSum === 0);
    };

    const prepareRemediationPairs = (systems) => {
        return fetchApplicableAdvisoriesApi({ limit: -1 }).then(
            ({ data }) => fetchViewAdvisoriesSystems(
                {
                    advisories: data.map(advisory => advisory.id),
                    systems
                }
            ));
    };

    const getEntities = useGetEntities(fetchSystems, apply);

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchSystems)} headerOUIA={'systems'} />
            <RemediationModalCmp />
            <Main>
                {status.hasError && <ErrorHandler code={status.code} /> ||
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
                                    filter,
                                    systemProfile,
                                    selectedTags
                                }
                            }}
                            onLoad={({ mergeWithEntities }) => {
                                register({
                                    ...mergeWithEntities(
                                        inventoryEntitiesReducer(systemsListColumns, modifyInventory),
                                        persistantParams(page, perPage, sort)
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
                            activeFiltersConfig={activeFiltersConfig}
                            tableProps={{
                                areActionsDisabled,
                                canSelectAll: false,
                                variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true
                            }}
                            dedicatedAction={(
                                <PatchRemediationButton
                                    onClick={() =>
                                        showRemediationModal(
                                            remediationProviderWithPairs(
                                                filterSelectedRowIDs(selectedRows),
                                                prepareRemediationPairs,
                                                transformPairs,
                                                remediationIdentifiers.advisory)
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
