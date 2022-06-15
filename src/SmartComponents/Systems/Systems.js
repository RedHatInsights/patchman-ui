import React, { useEffect, useRef } from 'react';
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
    transformPairs, systemsColumnsMerger, filterSelectedActiveSystemIDs
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
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';
import UnassignSystemsModal from '../Modals/UnassignSystemsModal';

const Systems = () => {
    const inventory = useRef(null);
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
    const [patchSetState, setPatchSetState] = React.useState({
        isPatchSetWizardOpen: false,
        isUnassignSystemsModalOpen: false,
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
    const { hasError, code } = useSelector(
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
        const resolvedData = await data;
        setRemediationModalCmp(() =>
            () => <RemediationWizard
                data={resolvedData}
                isRemediationOpen
                setRemediationOpen={setRemediationOpen} />);
        setRemediationOpen(!isRemediationOpen);
    }

    function showBaselineModal(rowData) {
        setPatchSetState({ isPatchSetWizardOpen: true, systemsIDs: [rowData.id] });
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

    const remediationDataProvider = () => {
        setRemediationLoading(true);
        return remediationProviderWithPairs(
            removeUndefinedObjectKeys(selectedRows),
            prepareRemediationPairs,
            transformPairs,
            remediationIdentifiers.advisory
        ).then(result => {
            setRemediationLoading(false);
            return result;
        });
    };

    const assignMultipleSystems = () => {
        setPatchSetState({
            isPatchSetWizardOpen: true,
            systemsIDs: filterSelectedActiveSystemIDs(selectedRows),
            shouldRefresh: false }
        );
    };

    useEffect(() => {
        if (patchSetState.shouldRefresh) {
            onSelect('none');
            inventory?.current?.onRefreshData();
        }
    }, [patchSetState.shouldRefresh]);

    const openUnassignSystemsModal = (systemsIDs) => {
        setPatchSetState({
            isUnassignSystemsModalOpen: true,
            systemsIDs,
            shouldRefresh: false
        });
    };

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchSystems)} headerOUIA={'systems'} />
            {hasError && <ErrorHandler code={code} /> || <React.Fragment>
                <SystemsStatusReport apply={apply} queryParams={queryParams} />
                {(patchSetState.isUnassignSystemsModalOpen && isPatchSetEnabled) && <UnassignSystemsModal
                    unassignSystemsModalState={patchSetState}
                    setUnassignSystemsModalOpen={setPatchSetState}
                    systemsIDs={patchSetState.systemsIDs}
                />}
                {(patchSetState.isPatchSetWizardOpen && isPatchSetEnabled) &&
                    <PatchSetWizard systemsIDs={patchSetState.systemsIDs} setBaselineState={setPatchSetState} />}
                {isRemediationOpen && <RemediationModalCmp /> || null}
                <Main>
                    <InventoryTable
                        ref={inventory}
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
                            }
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
                        actions={systemsRowActions(
                            showRemediationModal, showBaselineModal, isPatchSetEnabled, openUnassignSystemsModal
                        )}
                        tableProps={{
                            actionResolver: (row) => systemsRowActions(
                                showRemediationModal, showBaselineModal, isPatchSetEnabled, openUnassignSystemsModal, row
                            ),
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
                                    {intl.formatMessage(messages.titlesPatchSetAssign)}
                                </Button>,
                                {
                                    key: 'remove-multiple-systems',
                                    label: intl.formatMessage(messages.titlesPatchSetRemoveMultipleButton),
                                    onClick: () => openUnassignSystemsModal(filterSelectedActiveSystemIDs(selectedRows)),
                                    props: { isDisabled: selectedCount === 0 }
                                }
                            ]
                        }
                        }
                        filterConfig={filterConfig}
                        activeFiltersConfig={activeFiltersConfig}
                        dedicatedAction={(
                            <AsyncRemediationButton
                                remediationProvider={remediationDataProvider}
                                isDisabled={
                                    arrayFromObj(selectedRows).length === 0
                                }
                                isLoading={isRemediationLoading}
                            />
                        )}
                    />
                </Main>
            </React.Fragment>}
        </React.Fragment>
    );
};

export default Systems;
