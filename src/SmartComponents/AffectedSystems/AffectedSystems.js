import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Error from '../../PresentationalComponents/Snippets/Error';
import { getStore, register } from '../../store';
import { changeAffectedSystemsParams, clearAffectedSystemsStore, fetchAffectedSystemsAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import { STATUS_REJECTED } from '../../Utilities/constants';
import { createSystemsRows } from '../../Utilities/DataMappers';
import { arrayFromObj, buildFilterChips, createSortBy, remediationProvider } from '../../Utilities/Helpers';
import { useHandleRefresh, usePagePerPage, useRemoveFilter, useSortColumn } from '../../Utilities/Hooks';
import RemediationModal from '../Remediation/RemediationModal';
import { systemsListColumns, systemsRowActions } from '../Systems/SystemsListAssets';

const AffectedSystems = ({ advisoryName }) => {
    const dispatch = useDispatch();
    const [InventoryCmp, setInventoryCmp] = React.useState();
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const rawAffectedSystems = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.rows
    );
    const status = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.status
    );
    const error = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.error
    );
    const selectedRows = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.selectedRows
    );
    const hosts = React.useMemo(
        () => createSystemsRows(rawAffectedSystems, selectedRows),
        [rawAffectedSystems]
    );
    const metadata = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.metadata
    );
    const queryParams = useSelector(
        ({ AffectedSystemsStore }) => AffectedSystemsStore.queryParams
    );

    const inventoryColumns = useSelector(
        ({ entities }) => entities && entities.columns
    );

    const handleRefresh = useHandleRefresh(metadata, apply);
    const { filter, search } = queryParams;

    React.useEffect(() => {
        return () => dispatch(clearAffectedSystemsStore());
    }, []);

    React.useEffect(() => {
        dispatch(
            fetchAffectedSystemsAction({ id: advisoryName, ...queryParams })
        );
    }, [queryParams]);

    const fetchInventory = async () => {
        const {
            inventoryConnector,
            mergeWithEntities
        } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReactTable
        });

        register({
            ...mergeWithEntities(inventoryEntitiesReducer(systemsListColumns))
        });
        const { InventoryTable } = inventoryConnector(getStore());
        setInventoryCmp(() => InventoryTable);
    };

    React.useEffect(() => {
        fetchInventory();
    }, []);

    const [page, perPage] = usePagePerPage(metadata.limit, metadata.offset);

    function apply(params) {
        dispatch(changeAffectedSystemsParams(params));
    }

    const removeFilter = useRemoveFilter(filter, apply);

    const filterConfig = {
        items: [
            searchFilter(apply, search, 'Search systems')
        ]
    };

    const activeFiltersConfig = {
        filters: buildFilterChips(filter, search),
        onDelete: removeFilter
    };

    const showRemediationModal = data => {
        setRemediationModalCmp(() => () => <RemediationModal data={data} />);
    };

    const onSelect = React.useCallback((event) => {
        const toSelect = [];
        switch (event) {
            case 'none': {
                Object.keys(selectedRows).forEach(id=>{
                    toSelect.push(
                        {
                            id,
                            selected: false
                        }
                    );
                });
                break;
            }

            case 'page': {
                rawAffectedSystems.forEach(({ id })=>{
                    toSelect.push(
                        {
                            id,
                            selected: true
                        }
                    );});
                break;
            }}

        dispatch(
            { type: 'SELECT_ENTITY', payload: toSelect }
        );}
    );

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
            {status === STATUS_REJECTED ? <Error message={error.detail}/> : InventoryCmp && (
                <InventoryCmp
                    items={hosts}
                    page={page}
                    total={metadata.total_items}
                    perPage={perPage}
                    onRefresh={handleRefresh}
                    actions={systemsRowActions(showRemediationModal)}
                    tableProps = {{ canSelectAll: false, onSort, sortBy }}
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
                            title: `Select page (${perPage})`,
                            onClick: () => {
                                onSelect('page');
                            }
                        }],
                        onSelect: (value) => {
                            value ? onSelect('page') : onSelect('none');
                        },
                        checked: Boolean(selectedCount)
                    }}
                >
                    <reactCore.ToolbarGroup>
                        <reactCore.ToolbarItem>
                            <reactCore.Button
                                isDisabled={
                                    arrayFromObj(selectedRows).length === 0
                                }
                                onClick={() =>
                                    showRemediationModal(
                                        remediationProvider(
                                            advisoryName,
                                            arrayFromObj(selectedRows)
                                        )
                                    )
                                }
                            >
                                <reactIcons.AnsibeTowerIcon/>&nbsp;Remediate
                            </reactCore.Button>
                            <RemediationModalCmp />
                        </reactCore.ToolbarItem>
                    </reactCore.ToolbarGroup>
                </InventoryCmp>
            )}
        </React.Fragment>
    );
};

AffectedSystems.propTypes = {
    advisoryName: propTypes.string
};

export default AffectedSystems;
