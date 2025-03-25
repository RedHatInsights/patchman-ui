import React from 'react';
import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { combineReducers } from 'redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import { defaultReducers } from '../../store';
import {
    systemSelectAction
} from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyAdvisorySystems } from '../../store/Reducers/InventoryEntitiesReducer';
import { exportAdvisorySystemsCSV, exportAdvisorySystemsJSON, fetchAdvisorySystems } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, persistantParams,
    remediationProvider, removeUndefinedObjectKeys
} from '../../Utilities/Helpers';
import {
    useBulkSelectConfig, useGetEntities, useOnExport, useRemoveFilter, useOnSelect, ID_API_ENDPOINTS
} from '../../Utilities/hooks';
import { intl } from '../../Utilities/IntlProvider';
import { ADVISORY_SYSTEMS_COLUMNS, systemsRowActions } from '../Systems/SystemsListAssets';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';
import { buildActiveFiltersConfig, mergeInventoryColumns } from '../../Utilities/SystemsHelpers';
import advisoryStatusFilter from '../../PresentationalComponents/Filters/AdvisoryStatusFilter';

const AdvisorySystemsTable = ({
    advisoryName,
    apply,
    setSearchParams,
    activateRemediationModal,
    decodedParams
}) => {
    const dispatch = useDispatch();
    const store = useStore();

    const systems = useSelector(({ entities }) => entities?.rows || [], shallowEqual);
    const totalItems = useSelector(
        ({ entities }) => entities?.total || 0
    );
    const queryParams = useSelector(
        ({ AdvisorySystemsStore }) => AdvisorySystemsStore?.queryParams || {}
    );
    const selectedRows = useSelector(
        ({ entities }) => entities?.selectedRows || []
    );

    const { systemProfile, selectedTags,
        filter, search, page, perPage, sort } = queryParams;

    const [deleteFilters] = useRemoveFilter({ search, ...filter }, apply);

    const filterConfig = {
        items: [
            searchFilter(apply, search,
                intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
                intl.formatMessage(messages.labelsFiltersSystemsSearchPlaceholder)
            ),
            advisoryStatusFilter(apply, filter)
        ]
    };

    const activeFiltersConfig = buildActiveFiltersConfig(filter, search, deleteFilters);

    const onSelect = useOnSelect(
        systems,
        selectedRows,
        {
            endpoint: ID_API_ENDPOINTS.advisorySystems(advisoryName),
            queryParams,
            selectionDispatcher: systemSelectAction,
            totalItems
        }
    );

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const getEntites = useGetEntities(fetchAdvisorySystems, apply, { id: advisoryName }, setSearchParams);

    const onExport = useOnExport(advisoryName, queryParams, {
        csv: exportAdvisorySystemsCSV,
        json: exportAdvisorySystemsJSON
    }, dispatch);

    const remediationDataProvider = () => remediationProvider(
        advisoryName,
        removeUndefinedObjectKeys(selectedRows),
        remediationIdentifiers.advisory
    );

    const bulkSelectConfig = useBulkSelectConfig(
        selectedCount, onSelect, { total_items: totalItems }, systems, null, queryParams
    );

    return (
        <InventoryTable
            isFullView
            autoRefresh
            initialLoading
            ignoreRefresh
            hideFilters={{ all: true, tags: false, operatingSystem: false }}
            columns={(inventoryColumns) => mergeInventoryColumns(ADVISORY_SYSTEMS_COLUMNS, inventoryColumns)}
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
                        inventoryEntitiesReducer(ADVISORY_SYSTEMS_COLUMNS, modifyAdvisorySystems),
                        persistantParams({ page, perPage, sort, search }, decodedParams)
                    )
                }));
            }}
            getEntities={getEntites}
            tableProps={{
                actionResolver: (row) => systemsRowActions(activateRemediationModal, undefined, undefined, row),
                canSelectAll: false,
                variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true
            }}
            filterConfig={filterConfig}
            activeFiltersConfig={activeFiltersConfig}
            exportConfig={{
                isDisabled: totalItems === 0,
                onSelect: onExport
            }}
            bulkSelect={onSelect && bulkSelectConfig}
            dedicatedAction={(
                <AsyncRemediationButton
                    remediationProvider={remediationDataProvider}
                    isDisabled={
                        arrayFromObj(selectedRows).length === 0
                    }
                />
            )}

        />
    );
};

AdvisorySystemsTable.propTypes = {
    advisoryName: propTypes.string,
    apply: propTypes.func,
    setSearchParams: propTypes.func,
    activateRemediationModal: propTypes.func,
    decodedParams: propTypes.object
};

export default AdvisorySystemsTable;
