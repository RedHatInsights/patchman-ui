import React, { useEffect } from 'react';
import { TableVariant } from '@patternfly/react-table';
import { Button } from '@patternfly/react-core';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import staleFilter from '../../PresentationalComponents/Filters/SystemStaleFilter';
import osVersionFilter from '../../PresentationalComponents/Filters/OsVersionFilter';
import systemsUpdatableFilter from '../../PresentationalComponents/Filters/SystemsUpdatableFilter';
import Header from '../../PresentationalComponents/Header/Header';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { register } from '../../store';
import { changeSystemsParams, clearInventoryReducer, changeSystemsMetadata, changeTags } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyInventory } from '../../store/Reducers/InventoryEntitiesReducer';
import {
    exportSystemsCSV, exportSystemsJSON, fetchApplicableAdvisoriesApi,
    fetchSystems, fetchViewAdvisoriesSystems
} from '../../Utilities/api';
import { remediationIdentifiers, systemsListDefaultFilters, featureFlags } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips,
    decodeQueryparams, filterRemediatableSystems, persistantParams, remediationProviderWithPairs, removeUndefinedObjectKeys,
    transformPairs, systemsColumnsMerger
} from '../../Utilities/Helpers';
import {
    setPageTitle, useBulkSelectConfig, useGetEntities, useOnExport,
    useOnSelect, useRemoveFilter, useFeatureFlag
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import { systemsListColumns, systemsRowActions } from './SystemsListAssets';
import SystemsStatusReport from '../../PresentationalComponents/StatusReports/SystemsStatusReport';
import PatchSetWizard from '../PatchSetWizard/PatchSetWizard';
import RemediationWizard from '../Remediation/RemediationWizard';
import PatchRemediationButton from '../Remediation/PatchRemediationButton';

const Systems = () => {
    const pageTitle = intl.formatMessage(messages.titlesSystems);

    setPageTitle(pageTitle);

    const history = useHistory();
    const dispatch = useDispatch();
    const [isRemediationOpen, setRemediationOpen] = React.useState(false);
    const [isRemediationLoading, setRemediationLoading] = React.useState(false);
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const [patchSetState, setBaselineState] = React.useState({
        isOpen: false,
        shouldRefresh: false,
        systemsIDs: []
    });

    const isPatchSetEnabled = useFeatureFlag(featureFlags.patch_set);

    const decodedParams = decodeQueryparams(history.location.search);
    const systems = useSelector(({ entities }) => entities?.rows || [], shallowEqual);
    const totalItems = useSelector(
        ({ entities }) => entities?.total || 0
    );

    const selectedRows = useSelector(
        ({ entities }) => entities?.selectedRows || []
    );
    const status = useSelector(
        ({ entities }) => entities?.status || {}
    );
    const queryParams = useSelector(
        ({ SystemsStore }) => SystemsStore?.queryParams || {}
    );

    const { systemProfile, selectedTags,
        filter, search, page, perPage, sort } = queryParams;

    React.useEffect(() => {
        apply(decodedParams);
        return () => dispatch(clearInventoryReducer());
    }, []);

    async function showRemediationModal(data) {
        setRemediationLoading(true);
        const resolvedData = await data;
        setRemediationModalCmp(() =>
            () => <RemediationWizard
                data={resolvedData}
                isRemediationOpen
                setRemediationOpen={setRemediationOpen} />);
        setRemediationOpen(!isRemediationOpen);
        setRemediationLoading(false);
    }

    function showBaselineModal(rowData) {
        setBaselineState({ isOpen: true, systemsIDs: [rowData.id] });
    }

    function apply(queryParams) {
        dispatch(changeSystemsParams(queryParams));
    }

    const applyMetadata = (metadata) => {
        dispatch(changeSystemsMetadata(metadata));
    };

    const applyGlobalFilter = (tags) => {
        dispatch(changeTags(tags));
    };

    const [deleteFilters] = useRemoveFilter({ search, ...filter }, apply, systemsListDefaultFilters);

    const filterConfig = {
        items: [
            searchFilter(apply, search,
                intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
                intl.formatMessage(messages.labelsFiltersSystemsSearchPlaceholder)
            ),
            staleFilter(apply, filter),
            systemsUpdatableFilter(apply, filter),
            osVersionFilter(filter, apply)
        ]
    };

    const activeFiltersConfig = {
        filters: buildFilterChips(filter, search, intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)),
        onDelete: deleteFilters,
        deleteTitle: intl.formatMessage(messages.labelsFiltersReset)
    };

    const fetchAllData = () =>
        fetchSystems({ ...queryParams, limit: -1 }).then(filterRemediatableSystems);

    const selectRows = (toSelect) => {
        dispatch(
            { type: 'SELECT_ENTITY', payload: toSelect }
        );
    };

    const onSelect = useOnSelect(systems, selectedRows, fetchAllData, selectRows);

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const onExport = useOnExport('systems', queryParams, {
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

    const getEntities = useGetEntities(fetchSystems, apply, {}, history, applyMetadata, applyGlobalFilter);

    const remediationDataProvider = () => remediationProviderWithPairs(
        removeUndefinedObjectKeys(selectedRows),
        prepareRemediationPairs,
        transformPairs,
        remediationIdentifiers.advisory
    );

    const assignMultipleSystems = () => {
        setBaselineState({ isOpen: true, systemsIDs: Object.keys(selectedRows) });
    };

    useEffect(() => patchSetState.shouldRefresh && onSelect('none'), [patchSetState.shouldRefresh]);

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchSystems)} headerOUIA={'systems'} />
            <SystemsStatusReport apply={apply} queryParams={queryParams}/>
            {(patchSetState.isOpen && isPatchSetEnabled) &&
                <PatchSetWizard systemsIDs={patchSetState.systemsIDs} setBaselineState={setBaselineState}/>}
            {isRemediationOpen && <RemediationModalCmp /> || null}
            <Main>
                {status.hasError && <ErrorHandler code={status.code} /> ||
                    (
                        <InventoryTable
                            isFullView
                            autoRefresh
                            initialLoading
                            hideFilters={{ all: true, tags: false }}
                            columns={(defaultColumns) => systemsColumnsMerger(defaultColumns, true)}
                            showTags
                            customFilters={{
                                patchParams: {
                                    search,
                                    filter,
                                    systemProfile,
                                    selectedTags
                                },
                                shouldRefresh: patchSetState.shouldRefresh === true
                            }}
                            paginationProps={{
                                isDisabled: totalItems === 0
                            }}
                            onLoad={({ mergeWithEntities }) => {
                                register({
                                    ...mergeWithEntities(
                                        inventoryEntitiesReducer(systemsListColumns(isPatchSetEnabled), modifyInventory),
                                        persistantParams({ page, perPage, sort, search }, decodedParams)
                                    )
                                });
                            }}
                            getEntities={getEntities}
                            actions={systemsRowActions(showRemediationModal, showBaselineModal, isPatchSetEnabled)}
                            tableProps={{
                                areActionsDisabled,
                                canSelectAll: false,
                                variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true
                            }}
                            bulkSelect={useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems)}
                            exportConfig={{
                                isDisabled: totalItems === 0,
                                onSelect: onExport
                            }}
                            actionsConfig={isPatchSetEnabled && {
                                actions: [
                                    <Button onClick={assignMultipleSystems}
                                        key='assign-multiple-systems'
                                        isDisabled={selectedCount === 0}>
                                        {intl.formatMessage(messages.titlesPatchSetAssignMultipleButton)}
                                    </Button>]
                            }}
                            filterConfig={filterConfig}
                            activeFiltersConfig={activeFiltersConfig}
                            dedicatedAction={(
                                <PatchRemediationButton
                                    isDisabled={
                                        arrayFromObj(selectedRows).length === 0
                                    }
                                    onClick={() =>
                                        showRemediationModal(remediationDataProvider())
                                    }
                                    ouia={'toolbar-remediation-button'}
                                    isLoading={isRemediationLoading}
                                >
                                    {intl.formatMessage(messages.labelsRemediate)}
                                </PatchRemediationButton>
                            )}
                        />
                    )
                }
            </Main>
        </React.Fragment>
    );
};

export default Systems;
