import { AnsibeTowerIcon } from '@patternfly/react-icons';
import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import { register } from '../../store';
import { changeAffectedSystemsParams, clearInventoryReducer, clearAdvisorySystemsReducer } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyInventory } from '../../store/Reducers/InventoryEntitiesReducer';
import { fetchAdvisorySystems, exportAdvisorySystemsCSV, exportAdvisorySystemsJSON } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips, decodeQueryparams, filterRemediatableSystems,
    remediationProvider, removeUndefinedObjectKeys, persistantParams
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
import { useHistory } from 'react-router-dom';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { Fragment } from 'react';

const AdvisorySystems = ({ advisoryName }) => {
    const dispatch = useDispatch();
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
        filters: buildFilterChips(filter, search, intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)),
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
        fetchAdvisorySystems({ ...queryParams, id: advisoryName, limit: -1 }).then(filterRemediatableSystems);

    const onSelect = useOnSelect(systems, selectedRows, fetchAllData, selectRows);

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const getEntites = useGetEntities(fetchAdvisorySystems, apply, { id: advisoryName }, history);

    const onExport = useOnExport(advisoryName, queryParams, {
        csv: exportAdvisorySystemsCSV,
        json: exportAdvisorySystemsJSON
    }, dispatch);

    return (
        <React.Fragment>
            {status.hasError && <ErrorHandler code={status.code} /> ||
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

                >   <Fragment>
                        {status.isLoading !== undefined && <PrimaryToolbar
                            className="patch-systems-primary-toolbar"
                            filterConfig={filterConfig}
                            activeFiltersConfig={activeFiltersConfig}
                            exportConfig={{
                                isDisabled: totalItems === 0,
                                onSelect: onExport
                            }}
                            bulkSelect={
                                onSelect && useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems)
                            }
                            dedicatedAction={(<PatchRemediationButton
                                isDisabled={
                                    arrayFromObj(selectedRows).length === 0
                                }
                                onClick={() =>
                                    showRemediationModal(
                                        remediationProvider(
                                            advisoryName,
                                            removeUndefinedObjectKeys(selectedRows),
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
                        />}
                        <RemediationModalCmp />
                    </Fragment>

                </InventoryTable>
            }
        </React.Fragment>
    );
};

AdvisorySystems.propTypes = {
    advisoryName: propTypes.string
};

export default AdvisorySystems;
