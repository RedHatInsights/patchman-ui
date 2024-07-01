import React, { useEffect, useRef, useState } from 'react';
import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import messages from '../../Messages';
import { defaultReducers } from '../../store';
import { changeSystemsMetadata, changeTags, systemSelectAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyInventory } from '../../store/Reducers/InventoryEntitiesReducer';
import {
    exportSystemsCSV, exportSystemsJSON, fetchSystems
} from '../../Utilities/api';
import { systemsListDefaultFilters, NO_ADVISORIES_TEXT } from '../../Utilities/constants';
import {
    arrayFromObj, persistantParams, filterSelectedActiveSystemIDs
} from '../../Utilities/Helpers';
import { useBulkSelectConfig, useGetEntities, useOnExport,
    useRemoveFilter, useRemediationDataProvider, useOnSelect, ID_API_ENDPOINTS
} from '../../Utilities/hooks';
import { intl } from '../../Utilities/IntlProvider';
import { systemsListColumns, systemsRowActions } from './SystemsListAssets';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';
import { buildFilterConfig, buildActiveFiltersConfig } from '../../Utilities/SystemsHelpers';
import { combineReducers } from 'redux';
import { systemsColumnsMerger } from '../../Utilities/SystemsHelpers';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import propTypes from 'prop-types';

const SystemsTable = ({
    apply,
    patchSetState,
    openAssignSystemsModal,
    openUnassignSystemsModal,
    setSearchParams,
    activateRemediationModal,
    decodedParams
}) => {
    const store = useStore();
    const inventory = useRef(null);

    const dispatch = useDispatch();
    const [isRemediationLoading, setRemediationLoading] = useState(false);
    const systems = useSelector(({ entities }) => entities?.rows || [], shallowEqual);
    const totalItems = useSelector(
        ({ entities }) => entities?.total || 0
    );

    const selectedRows = useSelector(
        ({ entities }) => entities?.selectedRows || []
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
        filter: queryParamsFilter, search, page, perPage, sort
    } = queryParams;
    const { os: operatingSystemFilter, ...filter } = queryParamsFilter || {};
    const osFilter = operatingSystemFilter && [{
        osFilter: operatingSystemFilter.reduce((osFilter, os) => {
            const [osName, osVersion] = os.split(' ');
            const [major] = osVersion.split('.');

            return {
                ...osFilter,
                [`${osName}-${major}`]: {
                    ...osFilter[`${osName}-${major}`] || {},
                    [`${osName}-${major}-${osVersion}`]: true
                }
            };
        }, {})
    }];

    const applyMetadata = (metadata) => {
        dispatch(changeSystemsMetadata(metadata));
    };

    const applyGlobalFilter = (tags) => {
        dispatch(changeTags(tags));
    };

    const [deleteFilters] = useRemoveFilter(
        { search, ...filter },
        apply,
        systemsListDefaultFilters
    );
    const filterConfig = buildFilterConfig(search, filter, apply);

    const activeFiltersConfig = buildActiveFiltersConfig(filter, search, deleteFilters);

    const onSelect = useOnSelect(
        systems,
        selectedRows,
        {
            endpoint: ID_API_ENDPOINTS.systems,
            queryParams,
            selectionDispatcher: systemSelectAction,
            totalItems
        }
    );

    useEffect(() => {
        if (patchSetState.shouldRefresh) {
            onSelect('none');
            // timestamp is used to force inventory to refresh
            // if it wasn't there inventory might ignore request to refresh because parameters are the same
            inventory?.current?.onRefreshData({ timestamp: Date.now() });
        }
    }, [patchSetState.shouldRefresh]);

    const onExport = useOnExport(
        'systems',
        queryParams,
        {
            csv: exportSystemsCSV,
            json: exportSystemsJSON
        }, dispatch
    );

    const getEntities = useGetEntities(
        fetchSystems,
        apply,
        {},
        setSearchParams,
        applyMetadata,
        applyGlobalFilter
    );

    const remediationDataProvider = useRemediationDataProvider(
        selectedRows,
        setRemediationLoading,
        'systems',
        areAllSelected
    );

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const bulkSelectConfig = useBulkSelectConfig(
        selectedCount,
        onSelect,
        { total_items: totalItems },
        systems
    );

    return (
        <InventoryTable
            ref={inventory}
            isFullView
            autoRefresh
            initialLoading
            hideFilters={{ all: true, tags: false, hostGroupFilter: false, operatingSystem: false }}
            columns={(defaultColumns) => systemsColumnsMerger(defaultColumns, systemsListColumns)}
            showTags
            customFilters={{
                ...operatingSystemFilter ? {
                    filters: [...(osFilter || [])]
                } : {},
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
                        patchNoAdvisoryText={NO_ADVISORIES_TEXT}
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
    );
};

SystemsTable.propTypes = {
    apply: propTypes.func.isRequired,
    patchSetState: propTypes.object.isRequired,
    openAssignSystemsModal: propTypes.func.isRequired,
    openUnassignSystemsModal: propTypes.func.isRequired,
    setSearchParams: propTypes.func.isRequired,
    activateRemediationModal: propTypes.func.isRequired,
    decodedParams: propTypes.func.isRequired
};
export default SystemsTable;
