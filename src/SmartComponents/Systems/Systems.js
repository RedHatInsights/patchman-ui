import React, { useEffect, useRef } from 'react';
import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { defaultReducers } from '../../store';
import { changeSystemsParams, clearInventoryReducer,
    changeSystemsMetadata, changeTags, systemSelectAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyInventory } from '../../store/Reducers/InventoryEntitiesReducer';
import {
    exportSystemsCSV, exportSystemsJSON, fetchSystems
} from '../../Utilities/api';
import { DEFAULT_PATCH_TITLE, systemsListDefaultFilters } from '../../Utilities/constants';
import {
    arrayFromObj, decodeQueryparams, persistantParams, filterSelectedActiveSystemIDs
} from '../../Utilities/Helpers';
import { useBulkSelectConfig, useGetEntities, useOnExport,
    useRemoveFilter, useRemediationDataProvider, usePatchSetState, useOnSelect, ID_API_ENDPOINTS
} from '../../Utilities/hooks';
import { intl } from '../../Utilities/IntlProvider';
import { systemsListColumns, systemsRowActions, useActivateRemediationModal } from './SystemsListAssets';
import SystemsStatusReport from '../../PresentationalComponents/StatusReports/SystemsStatusReport';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';
import { buildFilterConfig, buildActiveFiltersConfig } from '../../Utilities/SystemsHelpers';
import PatchSetWrapper from '../../PresentationalComponents/PatchSetWrapper/PatchSetWrapper';
import { combineReducers } from 'redux';
import { systemsColumnsMerger } from '../../Utilities/SystemsHelpers';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

const Systems = () => {
    const store = useStore();
    const inventory = useRef(null);

    const chrome = useChrome();
    useEffect(()=>{
        chrome.updateDocumentTitle(`${intl.formatMessage(messages.titlesSystems)}${DEFAULT_PATCH_TITLE}`);
    }, [chrome, intl]);

    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const [isRemediationOpen, setRemediationOpen] = React.useState(false);
    const [isRemediationLoading, setRemediationLoading] = React.useState(false);
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);

    const decodedParams = decodeQueryparams('?' + searchParams.toString());
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

    const { hasAccess: hasTemplateAccess } = usePermissionsWithContext([
        'patch:*:*',
        'patch:template:write'
    ]);

    const { systemProfile, selectedTags,
        filter, search, page, perPage, sort } = queryParams;

    React.useEffect(() => {
        apply(decodedParams);
        return () => dispatch(clearInventoryReducer());
    }, []);

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

    const activeFiltersConfig = buildActiveFiltersConfig(filter, search, deleteFilters);

    const onSelect = useOnSelect(
        systems,
        selectedRows,
        {
            endpoint: ID_API_ENDPOINTS.systems,
            queryParams,
            selectionDispatcher: systemSelectAction
        }
    );

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const onExport = useOnExport('systems', queryParams, {
        csv: exportSystemsCSV,
        json: exportSystemsJSON
    }, dispatch);

    const getEntities = useGetEntities(fetchSystems, apply, {}, setSearchParams, applyMetadata, applyGlobalFilter);

    const {
        patchSetState, setPatchSetState, openUnassignSystemsModal, openAssignSystemsModal
    } = usePatchSetState(selectedRows);

    useEffect(() => {
        if (patchSetState.shouldRefresh) {
            onSelect('none');
            // timestamp is used to force inventory to refresh
            // if it wasn't there inventory might ignore request to refresh because parameters are the same
            inventory?.current?.onRefreshData({ timestamp: Date.now() });
        }
    }, [patchSetState.shouldRefresh]);

    const remediationDataProvider = useRemediationDataProvider(selectedRows, setRemediationLoading, 'systems', areAllSelected);

    const bulkSelectConfig = useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems);
    const activateRemediationModal = useActivateRemediationModal(
        setRemediationModalCmp,
        setRemediationOpen
    );

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchSystems)} headerOUIA={'systems'} />
            {(hasError || metadata?.has_systems === false)
            && <ErrorHandler code={code} metadata={metadata}/>
            || <React.Fragment>
                <SystemsStatusReport apply={apply} queryParams={queryParams} />
                <PatchSetWrapper patchSetState={patchSetState} setPatchSetState={setPatchSetState} />
                {isRemediationOpen && <RemediationModalCmp /> || null}
                <Main>
                    <InventoryTable
                        ref={inventory}
                        isFullView
                        autoRefresh
                        initialLoading
                        hideFilters={{ all: true, tags: false, hostGroupFilter: false, operatingSystem: false }}
                        columns={(defaultColumns) => systemsColumnsMerger(defaultColumns, systemsListColumns)}
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
                            store.replaceReducer(combineReducers({
                                ...defaultReducers,
                                ...mergeWithEntities(
                                    inventoryEntitiesReducer(systemsListColumns(), modifyInventory),
                                    persistantParams({ page, perPage, sort, search }, decodedParams)
                                )
                            }));
                        }}
                        getEntities={getEntities}
                        tableProps={{
                            actionResolver: (row) =>
                                systemsRowActions(
                                    activateRemediationModal,
                                    openAssignSystemsModal,
                                    openUnassignSystemsModal,
                                    row,
                                    hasTemplateAccess
                                ),
                            canSelectAll: false,
                            variant: TableVariant.compact,
                            className: 'patchCompactInventory',
                            isStickyHeader: true
                        }}
                        bulkSelect={bulkSelectConfig}
                        exportConfig={{
                            isDisabled: totalItems === 0,
                            onSelect: onExport
                        }}
                        actionsConfig={{
                            actions: [
                                <AsyncRemediationButton
                                    key='remediate-multiple-systems'
                                    remediationProvider={remediationDataProvider}
                                    isDisabled={
                                        arrayFromObj(selectedRows).length === 0 || isRemediationLoading
                                    }
                                    isLoading={isRemediationLoading}
                                />,
                                {
                                    key: 'assign-multiple-systems',
                                    label: intl.formatMessage(messages.titlesTemplateAssign),
                                    onClick: () => openAssignSystemsModal(selectedRows),
                                    props: { isDisabled: !hasTemplateAccess || selectedCount === 0 }
                                },
                                {
                                    key: 'remove-multiple-systems',
                                    label: intl.formatMessage(messages.titlesTemplateRemoveMultipleButton),
                                    onClick: () => openUnassignSystemsModal(filterSelectedActiveSystemIDs(selectedRows)),
                                    props: { isDisabled: !hasTemplateAccess || selectedCount === 0 }
                                }
                            ]
                        }}
                        filterConfig={filterConfig}
                        activeFiltersConfig={activeFiltersConfig}
                    />
                </Main>
            </React.Fragment>}
        </React.Fragment>
    );
};

export default Systems;
