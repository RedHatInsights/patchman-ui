import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { combineReducers } from 'redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { defaultReducers } from '../../store';
import { changeAffectedSystemsParams, clearAdvisorySystemsReducer,
    clearInventoryReducer, systemSelectAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyAdvisorySystems } from '../../store/Reducers/InventoryEntitiesReducer';
import { exportAdvisorySystemsCSV, exportAdvisorySystemsJSON, fetchAdvisorySystems } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, decodeQueryparams, persistantParams,
    remediationProvider, removeUndefinedObjectKeys
} from '../../Utilities/Helpers';
import {
    useBulkSelectConfig, useGetEntities, useOnExport, useRemoveFilter
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import { advisorySystemsColumns, systemsRowActions } from '../Systems/SystemsListAssets';
import RemediationWizard from '../Remediation/RemediationWizard';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';
import { useOnSelect, ID_API_ENDPOINTS } from '../../Utilities/useOnSelect';
import { systemsColumnsMerger, buildActiveFiltersConfig } from '../../Utilities/SystemsHelpers';
import advisoryStatusFilter from '../../PresentationalComponents/Filters/AdvisoryStatusFilter';
import { useSearchParams } from 'react-router-dom';

const AdvisorySystems = ({ advisoryName }) => {
    const dispatch = useDispatch();
    const store = useStore();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isRemediationOpen, setRemediationOpen] = React.useState(false);
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);

    const decodedParams = decodeQueryparams('?' + searchParams.toString());
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
        <React.Fragment>
            {isRemediationOpen && <RemediationModalCmp /> || null}
            {(status.hasError || metadata?.has_systems === false)
                && <ErrorHandler code={status.code} metadata={metadata} />
                || <InventoryTable
                    isFullView
                    autoRefresh
                    initialLoading
                    ignoreRefresh
                    hideFilters={{ all: true, tags: false, operatingSystem: false }}
                    columns={(defaultColumns) => systemsColumnsMerger(defaultColumns, advisorySystemsColumns)}
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
                                inventoryEntitiesReducer(advisorySystemsColumns(false), modifyAdvisorySystems),
                                persistantParams({ page, perPage, sort, search }, decodedParams)
                            )
                        }));
                    }}
                    getEntities={getEntites}
                    tableProps={{
                        actionResolver: (row) => systemsRowActions(showRemediationModal, undefined, undefined, row),
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
