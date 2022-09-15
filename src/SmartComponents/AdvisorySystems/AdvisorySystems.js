import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import useOsVersionFilter from '../../PresentationalComponents/Filters/OsVersionFilter';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { register } from '../../store';
import { changeAffectedSystemsParams, clearAdvisorySystemsReducer, clearInventoryReducer } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyInventory } from '../../store/Reducers/InventoryEntitiesReducer';
import { exportAdvisorySystemsCSV, exportAdvisorySystemsJSON, fetchAdvisorySystems } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips, decodeQueryparams, filterRemediatableSystems,
    persistantParams, remediationProvider, removeUndefinedObjectKeys, systemsColumnsMerger
} from '../../Utilities/Helpers';
import {
    useBulkSelectConfig, useGetEntities, useOnExport, useOnSelect, useRemoveFilter
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import { systemsListColumns, systemsRowActions } from '../Systems/SystemsListAssets';
import RemediationWizard from '../Remediation/RemediationWizard';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';

const AdvisorySystems = ({ advisoryName }) => {
    const dispatch = useDispatch();
    const [isRemediationOpen, setRemediationOpen] = React.useState(false);
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const history = useHistory();

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

    const activeFiltersConfig = {
        filters: buildFilterChips(filter, search, intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)),
        onDelete: deleteFilters
    };

    async function showRemediationModal(data) {
        const resolvedData = await data;
        setRemediationModalCmp(() =>
            () => <RemediationWizard
                data={resolvedData}
                isRemediationOpen
                setRemediationOpen={setRemediationOpen} />);
        setRemediationOpen(!isRemediationOpen);
    }

    const selectRows = (toSelect) => {
        dispatch(
            { type: 'SELECT_ENTITY', payload: toSelect }
        );
    };

    const fetchAllData = () =>
        fetchAdvisorySystems({ ...queryParams, id: advisoryName, limit: -1 }).then(filterRemediatableSystems);

    const onSelect = useOnSelect(systems, selectedRows, fetchAllData, selectRows);

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
                    columns={(defaultColumns) => systemsColumnsMerger(defaultColumns, false)}
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
                                inventoryEntitiesReducer(systemsListColumns(false), modifyInventory),
                                persistantParams({ page, perPage, sort, search }, decodedParams)
                            )
                        });
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
