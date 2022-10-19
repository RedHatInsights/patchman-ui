import React, { useEffect, useRef } from 'react';
import { TableVariant } from '@patternfly/react-table';
import { Button } from '@patternfly/react-core';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { register } from '../../store';
import { changeSystemsParams, clearInventoryReducer, changeSystemsMetadata, changeTags } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyInventory } from '../../store/Reducers/InventoryEntitiesReducer';
import {
    exportSystemsCSV, exportSystemsJSON, fetchSystems
} from '../../Utilities/api';
import { systemsListDefaultFilters, featureFlags } from '../../Utilities/constants';
import {
    arrayFromObj, decodeQueryparams, persistantParams,
    systemsColumnsMerger, filterSelectedActiveSystemIDs
} from '../../Utilities/Helpers';
import {
    setPageTitle, useBulkSelectConfig, useGetEntities, useOnExport,
    useOnSelect, useRemoveFilter, useFeatureFlag
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import { systemsListColumns, systemsRowActions } from './SystemsListAssets';
import SystemsStatusReport from '../../PresentationalComponents/StatusReports/SystemsStatusReport';
import RemediationWizard from '../Remediation/RemediationWizard';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';
import { fetchAllSystemsCallback, buildFilterConfig, buildActiveFiltersConfig } from './SystemsHelpers';
import useRemediationProvier from '../../Utilities/useRemediationDataProvider';
import usePatchSetState from '../../Utilities/usePatchSetState';
import PatchSetWrapper from '../../PresentationalComponents/PatchSetWrapper/PatchSetWrapper';
import useOsVersionFilter from '../../PresentationalComponents/Filters/OsVersionFilter';

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
    const metadata = useSelector(
        ({ SystemsStore }) => SystemsStore?.metadata || {}
    );
    const areAllSelected = useSelector(
        ({ SystemsStore }) => SystemsStore?.areAllSelected
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

    const filterConfig = buildFilterConfig(search, filter, apply);
    const osFilterConfig = useOsVersionFilter(filter?.os, apply);
    filterConfig.items = [...filterConfig.items, ...osFilterConfig];

    const activeFiltersConfig = buildActiveFiltersConfig(filter, search, deleteFilters);

    const selectRows = (toSelect) => {
        dispatch(
            { type: 'SELECT_ENTITY', payload: toSelect }
        );
    };

    const onSelect = useOnSelect(systems, selectedRows, fetchAllSystemsCallback(queryParams), selectRows);

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const onExport = useOnExport('systems', queryParams, {
        csv: exportSystemsCSV,
        json: exportSystemsJSON
    }, dispatch);

    const getEntities = useGetEntities(fetchSystems, apply, {}, history, applyMetadata, applyGlobalFilter);

    const {
        patchSetState, setPatchSetState, openPatchSetAssignWizard, openUnassignSystemsModal
    } = usePatchSetState(selectedRows);

    useEffect(() => {
        if (patchSetState.shouldRefresh) {
            onSelect('none');
            inventory?.current?.onRefreshData();
        }
    }, [patchSetState.shouldRefresh]);

    const remediationDataProvider = useRemediationProvier(selectedRows, setRemediationLoading, 'systems', areAllSelected);

    const bulkSelectConfig = useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems);

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchSystems)} headerOUIA={'systems'} />
            {(hasError || metadata?.has_systems === false)
            && <ErrorHandler code={code} metadata={metadata}/>
            || <React.Fragment>
                <SystemsStatusReport apply={apply} queryParams={queryParams} />
                {isPatchSetEnabled && <PatchSetWrapper patchSetState={patchSetState} setPatchSetState={setPatchSetState} />}
                {isRemediationOpen && <RemediationModalCmp /> || null}
                <Main>
                    <InventoryTable
                        ref={inventory}
                        isFullView
                        autoRefresh
                        initialLoading
                        hideFilters={{ all: true, tags: false }}
                        columns={(defaultColumns) => systemsColumnsMerger(defaultColumns, isPatchSetEnabled)}
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
                        tableProps={{
                            actionResolver: (row) =>
                                systemsRowActions(
                                    showRemediationModal, openPatchSetAssignWizard,
                                    isPatchSetEnabled, openUnassignSystemsModal, row
                                ),
                            canSelectAll: false,
                            variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true
                        }}
                        bulkSelect={bulkSelectConfig}
                        exportConfig={{
                            isDisabled: totalItems === 0,
                            onSelect: onExport
                        }}
                        actionsConfig={isPatchSetEnabled && {
                            actions: [
                                <Button onClick={openPatchSetAssignWizard}
                                    key='assign-multiple-systems'
                                    isDisabled={selectedCount === 0}>
                                    {intl.formatMessage(messages.titlesTemplateAssign)}
                                </Button>,
                                {
                                    key: 'remove-multiple-systems',
                                    label: intl.formatMessage(messages.titlesTemplateRemoveMultipleButton),
                                    onClick: () => openUnassignSystemsModal(filterSelectedActiveSystemIDs(selectedRows)),
                                    props: { isDisabled: selectedCount === 0 }
                                }
                            ] }
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
