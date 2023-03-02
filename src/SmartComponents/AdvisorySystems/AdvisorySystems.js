import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { combineReducers } from 'redux';
import { useHistory } from 'react-router-dom';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import useOsVersionFilter from '../../PresentationalComponents/Filters/OsVersionFilter';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { defaultReducers } from '../../store';
import { changeAffectedSystemsParams, clearAdvisorySystemsReducer,
    clearInventoryReducer, systemSelectAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyInventory } from '../../store/Reducers/InventoryEntitiesReducer';
import { exportAdvisorySystemsCSV, exportAdvisorySystemsJSON, fetchAdvisorySystems } from '../../Utilities/api';
import { featureFlags, remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, decodeQueryparams, persistantParams,
    remediationProvider, removeUndefinedObjectKeys
} from '../../Utilities/Helpers';
import {
    useBulkSelectConfig, useFeatureFlag, useGetEntities, useOnExport, useRemoveFilter
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import { systemsListColumns, systemsRowActions } from '../Systems/SystemsListAssets';
import RemediationWizard from '../Remediation/RemediationWizard';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';
import { useOnSelect, ID_API_ENDPOINTS } from '../../Utilities/useOnSelect';
import { systemsColumnsMerger, buildActiveFiltersConfig } from '../../Utilities/SystemsHelpers';

const AdvisorySystems = ({ advisoryName }) => {
    const dispatch = useDispatch();
    const store = useStore();
    const [isRemediationOpen, setRemediationOpen] = React.useState(false);
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const history = useHistory();

    const isPatchSetEnabled = useFeatureFlag(featureFlags.patch_set);

    const decodedParams = decodeQueryparams(history.location.search);
    const systems = useSelector(({ entities }) => entities?.rows || [], shallowEqual);
    const status = useSelector(
        ({ entities }) => entities?.status || {}
    );
    const totalItems = useSelector(
        ({ entities }) => entities?.total || 0
    );
    const queryParams = useSelector(
        ({ AdvisorySystemsStore }) => AdvisorySystemsStore?.queryParams || {}
    );
    const selectedRows = useSelector(
        ({ entities }) => entities?.selectedRows || []
    );
    const metadata = useSelector(
        ({ AdvisorySystemsStore }) => AdvisorySystemsStore?.metadata || {}
    );

    const { systemProfile, selectedTags,
        filter, search, page, perPage, sort } = queryParams;

    React.useEffect(() => {
        apply(decodedParams);
        return () => {
            dispatch(clearInventoryReducer());
            dispatch(clearAdvisorySystemsReducer());
        };
    }, []);

    function apply(params) {
        dispatch(changeAffectedSystemsParams(params));
    }

    const [deleteFilters] = useRemoveFilter({ search, ...filter }, apply);

    const osFilterConfig = useOsVersionFilter(filter?.os, apply);
    const filterConfig = {
        items: [
            searchFilter(apply, search,
                intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
                intl.formatMessage(messages.labelsFiltersSystemsSearchPlaceholder)
            ),
            ...osFilterConfig
        ]
    };

    const activeFiltersConfig = buildActiveFiltersConfig(filter, search, deleteFilters);

    const showRemediationModal = useCallback(async (data) => {
        const resolvedData = await data;
        setRemediationModalCmp(() =>
            () => <RemediationWizard
                data={resolvedData}
                isRemediationOpen
                setRemediationOpen={setRemediationOpen} />);
        setRemediationOpen(!isRemediationOpen);
    }, [isRemediationOpen]);

    const onSelect = useOnSelect(
        systems,
        selectedRows,
        {
            endpoint: ID_API_ENDPOINTS.advisorySystems(advisoryName),
            queryParams,
            selectionDispatcher: systemSelectAction
        }
    );

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const getEntites = useGetEntities(fetchAdvisorySystems, apply, { id: advisoryName }, history);

    const onExport = useOnExport(advisoryName, queryParams, {
        csv: exportAdvisorySystemsCSV,
        json: exportAdvisorySystemsJSON
    }, dispatch);

    const remediationDataProvider = () => remediationProvider(
        advisoryName,
        removeUndefinedObjectKeys(selectedRows),
        remediationIdentifiers.advisory
    );

    const bulkSelectConfig = useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems);

    return (
        <React.Fragment>
            {isRemediationOpen && <RemediationModalCmp /> || null}
            {(status.hasError || metadata?.has_systems === false)
                && <ErrorHandler code={status.code} metadata={metadata} />
                || <InventoryTable
                    isFullView
                    autoRefresh
                    initialLoading
                    ignoreRefresh
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
                        store.replaceReducer(combineReducers({
                            ...defaultReducers,
                            ...mergeWithEntities(
                                inventoryEntitiesReducer(systemsListColumns(false), modifyInventory),
                                persistantParams({ page, perPage, sort, search }, decodedParams)
                            )
                        }));
                    }}
                    getEntities={getEntites}
                    actions={systemsRowActions(showRemediationModal)}
                    tableProps={{
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
            }
        </React.Fragment>
    );
};

AdvisorySystems.propTypes = {
    advisoryName: propTypes.string
};

export default AdvisorySystems;
