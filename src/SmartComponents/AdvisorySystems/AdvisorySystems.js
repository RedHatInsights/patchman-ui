import { AnsibeTowerIcon } from '@patternfly/react-icons';
import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import { register } from '../../store';
import { changeEntitiesParams, clearEntitiesStore } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, initialState, modifyInventory } from '../../store/Reducers/InventoryEntitiesReducer';
import { fetchAdvisorySystems, exportAdvisorySystemsCSV, exportAdvisorySystemsJSON } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips,
    remediationProvider, filterSelectedRowIDs
} from '../../Utilities/Helpers';
import {
    useOnSelect, useRemoveFilter,
    useBulkSelectConfig, useGetEntities, useOnExport
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import PatchRemediationButton from '../Remediation/PatchRemediationButton';
import RemediationModal from '../Remediation/RemediationModal';
import { systemsListColumns, systemsRowActions } from '../Systems/SystemsListAssets';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';

const AdvisorySystems = ({ advisoryName }) => {
    const dispatch = useDispatch();
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);

    const systems = useSelector(({ entities }) => entities?.rows || [], shallowEqual);
    const status = useSelector(
        ({ entities }) => entities?.status || {}
    );
    const selectedRows = useSelector(
        ({ entities }) => entities?.selectedRows || []
    );
    const totalItems = useSelector(
        ({ entities }) => entities?.total || 0
    );
    const queryParams = useSelector(
        ({ entities }) => entities?.queryParams || {}
    );

    const { filter, search, systemProfile, selectedTags } = queryParams;

    React.useEffect(() => {
        return () => dispatch(clearEntitiesStore());
    }, []);

    function apply(params) {
        dispatch(changeEntitiesParams(params));
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

    const showRemediationModal = data => {
        setRemediationModalCmp(() => () => <RemediationModal data={data} />);
    };

    const selectRows = (toSelect) => {
        dispatch(
            { type: 'SELECT_ENTITY', payload: toSelect }
        );
    };

    const fetchAllData = () =>
        fetchAdvisorySystems({ ...queryParams, id: advisoryName, limit: -1 });

    const onSelect = useOnSelect(systems,  selectedRows, fetchAllData, selectRows);

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const getEntites = useGetEntities(fetchAdvisorySystems, apply, { id: advisoryName });

    const onExport = useOnExport(advisoryName, queryParams, {
        csv: exportAdvisorySystemsCSV,
        json: exportAdvisorySystemsJSON
    }, dispatch);

    return (
        <React.Fragment>
            {status.hasError && <ErrorHandler code={status.code}/> ||
                <InventoryTable
                    disableDefaultColumns
                    isFullView
                    autoRefresh
                    initialLoading
                    ignoreRefresh
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
                                initialState
                            )
                        });
                    }}
                    exportConfig={{
                        isDisabled: totalItems === 0,
                        onSelect: onExport
                    }}
                    getEntities={getEntites}
                    actions={systemsRowActions(showRemediationModal)}
                    tableProps = {{ canSelectAll: false,
                        variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true }}
                    filterConfig={filterConfig}
                    activeFiltersConfig = {activeFiltersConfig}
                    bulkSelect={onSelect && useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems)}
                    dedicatedAction={(<PatchRemediationButton
                        isDisabled={
                            arrayFromObj(selectedRows).length === 0
                        }
                        onClick={() =>
                            showRemediationModal(
                                remediationProvider(
                                    advisoryName,
                                    filterSelectedRowIDs(selectedRows),
                                    remediationIdentifiers.advisory
                                )
                            )
                        }
                        ouia={'toolbar-remediation-button'}
                        isLoading={false}
                    >
                        <AnsibeTowerIcon />&nbsp;{intl.formatMessage(messages.labelsRemediate)}
                    </PatchRemediationButton>
                    )}
                >
                    <RemediationModalCmp />
                </InventoryTable>
            }
        </React.Fragment>
    );
};

AdvisorySystems.propTypes = {
    advisoryName: propTypes.string
};

export default AdvisorySystems;
