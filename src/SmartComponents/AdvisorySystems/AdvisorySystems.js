import { AnsibeTowerIcon } from '@patternfly/react-icons';
import { TableVariant } from '@patternfly/react-table';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import { getStore, register } from '../../store';
import { changeAdvisorySystemsParams, clearAdvisorySystemsStore, fetchAdvisorySystemsAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import { fetchAdvisorySystems } from '../../Utilities/api';
import { remediationIdentifiers, STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { createSystemsRows } from '../../Utilities/DataMappers';
import { arrayFromObj, buildFilterChips, createSortBy, remediationProvider } from '../../Utilities/Helpers';
import {
    useDeepCompareEffect, useHandleRefresh, useOnSelect, usePagePerPage, useRemoveFilter,
    useSortColumn
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import PatchRemediationButton from '../Remediation/PatchRemediationButton';
import RemediationModal from '../Remediation/RemediationModal';
import { systemsListColumns, systemsRowActions } from '../Systems/SystemsListAssets';

const AdvisorySystems = ({ advisoryName }) => {
    const dispatch = useDispatch();
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const rawAdvisorySystems = useSelector(
        ({ AdvisorySystemsStore }) => AdvisorySystemsStore.rows
    );
    const status = useSelector(
        ({ AdvisorySystemsStore }) => AdvisorySystemsStore.status
    );

    const selectedRows = useSelector(
        ({ AdvisorySystemsStore }) => AdvisorySystemsStore.selectedRows
    );
    const hosts = React.useMemo(
        () => createSystemsRows(rawAdvisorySystems, selectedRows),
        [rawAdvisorySystems]
    );
    const metadata = useSelector(
        ({ AdvisorySystemsStore }) => AdvisorySystemsStore.metadata
    );
    const queryParams = useSelector(
        ({ AdvisorySystemsStore }) => AdvisorySystemsStore.queryParams
    );

    const inventoryColumns = useSelector(
        ({ entities }) => entities && entities.columns
    );

    const handleRefresh = useHandleRefresh(metadata, apply);
    const { filter, search } = queryParams;

    React.useEffect(() => {
        return () => dispatch(clearAdvisorySystemsStore());
    }, []);

    useDeepCompareEffect(() => {
        dispatch(
            fetchAdvisorySystemsAction({ id: advisoryName, ...queryParams })
        );
    }, [queryParams]);

    const [page, perPage] = usePagePerPage(metadata.limit, metadata.offset);

    function apply(params) {
        dispatch(changeAdvisorySystemsParams(params));
    }

    const [deleteFilters] = useRemoveFilter(filter, apply);

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

    const onSelect = useOnSelect(rawAdvisorySystems,  selectedRows, fetchAllData, selectRows);

    // This is used ONLY for sorting purposes
    const getMangledColumns = () => {
        let updated = inventoryColumns && inventoryColumns.filter(({ key }) => key === 'updated')[0];
        updated = { ...updated, key: 'last_upload' };
        return [...systemsListColumns, updated];
    };

    const onSort = useSortColumn(getMangledColumns(), apply, 1);
    const sortBy = React.useMemo(
        () => createSortBy(getMangledColumns(), metadata.sort, 1),
        [metadata.sort]
    );

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    return (
        <React.Fragment>
            {status === STATUS_REJECTED ? <Unavailable/> : (
                <InventoryTable
                    onLoad={({ mergeWithEntities }) => {
                        const store = getStore();
                        register({
                            ...mergeWithEntities(
                                inventoryEntitiesReducer(systemsListColumns, store.getState().AdvisorySystemsStore)
                            )
                        });
                    }}
                    items={hosts}
                    page={page}
                    total={metadata.total_items}
                    perPage={perPage}
                    onRefresh={handleRefresh}
                    isLoaded={status === STATUS_RESOLVED}
                    actions={systemsRowActions(showRemediationModal)}
                    tableProps = {{ canSelectAll: false,
                        onSort: metadata.total_items && onSort,
                        sortBy: metadata.total_items && sortBy,
                        variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true }}
                    filterConfig={filterConfig}
                    activeFiltersConfig = {activeFiltersConfig}
                    bulkSelect={onSelect && {
                        count: selectedCount,
                        items: [{
                            title: `Select none (0)`,
                            onClick: () => {
                                onSelect('none');
                            }
                        }, {
                            title: `Select page (${hosts.length})`,
                            onClick: () => {
                                onSelect('page');
                            }
                        },
                        {
                            title: `Select all (${metadata.total_items})`,
                            onClick: () => {
                                onSelect('all');
                            }
                        }],
                        onSelect: () => {
                            selectedCount === 0 ? onSelect('all') : onSelect('none');
                        },
                        toggleProps: {
                            'data-ouia-component-type': 'bulk-select-toggle-button'
                        },
                        checked: selectedCount === 0 ? false : selectedCount === metadata.total_items ? true : null,
                        isDisabled: metadata.total_items === 0 && selectedCount === 0
                    }}
                    dedicatedAction={(<PatchRemediationButton
                        isDisabled={
                            arrayFromObj(selectedRows).length === 0
                        }
                        onClick={() =>
                            showRemediationModal(
                                remediationProvider(
                                    advisoryName,
                                    Object.keys(selectedRows),
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
            )}
        </React.Fragment>
    );
};

AdvisorySystems.propTypes = {
    advisoryName: propTypes.string
};

export default AdvisorySystems;
