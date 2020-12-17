import { Button, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { AnsibeTowerIcon } from '@patternfly/react-icons';
import { cellWidth, expandable, sortable, SortByDirection,
    Table as PfTable, TableBody, TableGridBreakpoint, TableHeader, TableVariant } from '@patternfly/react-table/dist/js';
import { reactCore } from '@redhat-cloud-services/frontend-components-utilities/files/inventoryDependencies';
import propTypes from 'prop-types';
import React from 'react';
import * as ReactRedux from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import statusFilter from '../../PresentationalComponents/Filters/StatusFilter';
import Error from '../../PresentationalComponents/Snippets/Error';
import { getStore, register } from '../../store';
import { changePackageSystemsParams, clearPackageSystemsStore, fetchPackageSystemsAction } from '../../store/Actions/Actions';
import { packagesSystemsInventoryReducer } from '../../store/Reducers/InventoryEntitiesReducer';
import { fetchPackageSystems } from '../../Utilities/api';
import { STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { createPackageSystemsRows } from '../../Utilities/DataMappers';
import { arrayFromObj, buildFilterChips, createSortBy, remediationProvider } from '../../Utilities/Helpers';
import { useHandleRefresh, usePagePerPage, useRemoveFilter, useSortColumn, useOnSelect } from '../../Utilities/Hooks';
import RemediationModal from '../Remediation/RemediationModal';
import { packageSystemsColumns } from '../Systems/SystemsListAssets';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const PackageSystems = ({ packageName }) => {
    const dispatch = useDispatch();
    const enableRemediation = false;
    const [InventoryCmp, setInventoryCmp] = React.useState();
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const rawPackageSystems = useSelector(
        ({ PackageSystemsStore }) => PackageSystemsStore.rows
    );
    const status = useSelector(
        ({ PackageSystemsStore }) => PackageSystemsStore.status
    );
    const error = useSelector(
        ({ PackageSystemsStore }) => PackageSystemsStore.error
    );
    const selectedRows = useSelector(
        ({ PackageSystemsStore }) => PackageSystemsStore.selectedRows
    );
    const hosts = React.useMemo(
        () => createPackageSystemsRows(rawPackageSystems, selectedRows),
        [rawPackageSystems]
    );
    const metadata = useSelector(
        ({ PackageSystemsStore }) => PackageSystemsStore.metadata
    );
    const queryParams = useSelector(
        ({ PackageSystemsStore }) => PackageSystemsStore.queryParams
    );

    const inventoryColumns = useSelector(
        ({ entities }) => entities && entities.columns
    );

    const handleRefresh = useHandleRefresh(metadata, apply);
    const { filter, search } = queryParams;

    React.useEffect(() => {
        return () => dispatch(clearPackageSystemsStore());
    }, []);

    React.useEffect(() => {
        dispatch(
            fetchPackageSystemsAction({ id: packageName, ...queryParams })
        );
    }, [queryParams]);

    const fetchInventory = async () => {
        const {
            inventoryConnector,
            mergeWithEntities
        } = await insights.loadInventory({
            ReactRedux,
            React,
            reactRouterDom,
            pfReactTable: {
                Table: PfTable,
                TableBody,
                TableHeader,
                TableGridBreakpoint,
                cellWidth,
                TableVariant,
                sortable,
                expandable,
                SortByDirection
            },
            pfReact: reactCore
        });

        register({
            ...mergeWithEntities(packagesSystemsInventoryReducer(packageSystemsColumns))
        });
        const { InventoryTable } = inventoryConnector(getStore());
        setInventoryCmp(() => InventoryTable);
    };

    React.useEffect(() => {
        fetchInventory();
    }, []);

    const [page, perPage] = usePagePerPage(metadata.limit, metadata.offset);

    function apply(params) {
        dispatch(changePackageSystemsParams(params));
    }

    const removeFilter = useRemoveFilter(filter, apply);

    const filterConfig = {
        items: [
            searchFilter(apply, search, intl.formatMessage(messages.searchSystems)),
            statusFilter(apply, filter)
        ]
    };

    const activeFiltersConfig = {
        filters: buildFilterChips(filter, search),
        onDelete: removeFilter
    };

    const showRemediationModal = data => {
        setRemediationModalCmp(() => () => <RemediationModal data={data} />);
    };

    const constructFilename = (system) => {
        return `${packageName}-${system.available_evra}`;
    };

    const fetchAllData = () =>
        fetchPackageSystems({ id: packageName, limit: 999999 });

    const selectRows = (toSelect) => {
        dispatch({ type: 'SELECT_ENTITY', payload: toSelect });
    };

    const onSelect = enableRemediation && useOnSelect(rawPackageSystems,  selectedRows,
        fetchAllData, selectRows, constructFilename);

    // This is used ONLY for sorting purposes
    const getMangledColumns = () => {
        let updated = inventoryColumns && inventoryColumns.filter(({ key }) => key === 'updated')[0];
        updated = { ...updated, key: 'last_upload' };
        return [...packageSystemsColumns, updated];
    };

    const onSort = useSortColumn(getMangledColumns(), apply, 0);
    const sortBy = React.useMemo(
        () => createSortBy(getMangledColumns(), metadata.sort, 0),
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
                    isLoaded={status === STATUS_RESOLVED}
                    tableProps = {{ canSelectAll: false, onSort, sortBy, onSelect }}
                    filterConfig={filterConfig}
                    activeFiltersConfig = {activeFiltersConfig}
                    bulkSelect={enableRemediation && onSelect && {
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
                        onSelect: (value) => {
                            value ? onSelect('all') : onSelect('none');
                        },
                        toggleProps: {
                            'data-ouia-component-type': 'bulk-select-toggle-button'
                        },
                        checked: selectedCount === metadata.total_items ? true : selectedCount === 0 ? false : null
                    }}
                >
                    {enableRemediation &&
                    <ToolbarGroup>
                        <ToolbarItem>
                            <Button
                                className={'remediationButtonPatch'}
                                isDisabled={
                                    arrayFromObj(selectedRows).length === 0
                                }
                                onClick={() =>
                                    showRemediationModal(
                                        remediationProvider(
                                            packageName,
                                            Object.keys(selectedRows)
                                        )
                                    )
                                }
                                ouiaId={'toolbar-remediation-button'}
                            >
                                <AnsibeTowerIcon/>&nbsp;{intl.formatMessage(messages.remediate)}
                            </Button>
                            <RemediationModalCmp />
                        </ToolbarItem>
                    </ToolbarGroup>
                    }
                </InventoryCmp>
            )}
        </React.Fragment>
    );
};

PackageSystems.propTypes = {
    packageName: propTypes.string
};

export default PackageSystems;
