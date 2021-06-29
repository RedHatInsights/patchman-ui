import { Button, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { AnsibeTowerIcon } from '@patternfly/react-icons';
import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import statusFilter from '../../PresentationalComponents/Filters/StatusFilter';
import { register } from '../../store';
import { changePackageSystemsParams, clearPackageSystemsStore } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyPackageSystems } from '../../store/Reducers/InventoryEntitiesReducer';
import { fetchPackageSystems, exportPackageSystemsCSV, exportPackageSystemsJSON } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import { arrayFromObj, buildFilterChips, remediationProvider,
    filterSelectedRowIDs, persistantParams
} from '../../Utilities/Helpers';
import {
    useOnSelect, useRemoveFilter, useBulkSelectConfig, useOnExport, useGetEntities
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import RemediationModal from '../Remediation/RemediationModal';
import { packageSystemsColumns } from '../Systems/SystemsListAssets';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';

const PackageSystems = ({ packageName }) => {
    const dispatch = useDispatch();
    const enableRemediation = false;
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
    const queryParams = useSelector(
        ({ entities }) => entities?.queryParams || {}
    );
    const packageSystemsParams = useSelector(
        ({ entities }) => entities?.packageSystemsParams || {}
    );
    const totalItems = useSelector(
        ({ entities }) => entities?.total || 0
    );

    const { systemProfile, selectedTags } = queryParams;
    const { filter, search, sort, page, perPage } = packageSystemsParams;
    React.useEffect(() => {
        return () => dispatch(clearPackageSystemsStore());
    }, []);

    function apply(params) {
        dispatch(changePackageSystemsParams(params));
    }

    const [deleteFilters] = useRemoveFilter(filter, apply);

    const filterConfig = {
        items: [
            searchFilter(apply, search,
                intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
                intl.formatMessage(messages.labelsFiltersSystemsSearchPlaceholder)
            ),
            statusFilter(apply, filter)
        ]
    };

    const activeFiltersConfig = {
        filters: buildFilterChips(filter, search),
        onDelete: deleteFilters
    };

    const showRemediationModal = data => {
        setRemediationModalCmp(() => () => <RemediationModal data={data} />);
    };

    const constructFilename = (system) => {
        return `${packageName}-${system.available_evra}`;
    };

    const fetchAllData = () => {
        return fetchPackageSystems({ package_name: packageName, limit: -1 });
    };

    const selectRows = (toSelect) => {
        dispatch({ type: 'SELECT_ENTITY', payload: toSelect });
    };

    const onSelect = useOnSelect(systems, selectedRows,
        fetchAllData, selectRows, constructFilename);

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const onExport = useOnExport(packageName, queryParams, {
        csv: exportPackageSystemsCSV,
        json: exportPackageSystemsJSON
    }, dispatch);

    const getEntites = useGetEntities(fetchPackageSystems, apply, { packageName });
    return (
        <React.Fragment>
            {status.hasError && <ErrorHandler code={status.code} /> || (
                <InventoryTable
                    disableDefaultColumns
                    isFullView
                    autoRefresh
                    initialLoading
                    hideFilters={{ all: true }}
                    getEntities={getEntites}
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
                                inventoryEntitiesReducer(packageSystemsColumns, modifyPackageSystems),
                                persistantParams(page, perPage, sort)
                            )
                        });

                    }}
                    exportConfig={{
                        isDisabled: totalItems === 0,
                        onSelect: onExport
                    }}
                    tableProps={{
                        canSelectAll: false,
                        onSelect, variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true
                    }}
                    filterConfig={filterConfig}
                    activeFiltersConfig={activeFiltersConfig}
                    bulkSelect={useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems)}
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
                                                filterSelectedRowIDs(selectedRows),
                                                remediationIdentifiers.package
                                            )
                                        )
                                    }
                                    ouiaId={'toolbar-remediation-button'}
                                >
                                    <AnsibeTowerIcon />&nbsp;{intl.formatMessage(messages.labelsRemediate)}
                                </Button>
                                <RemediationModalCmp />
                            </ToolbarItem>
                        </ToolbarGroup>
                    }
                </InventoryTable>
            )}
        </React.Fragment>
    );
};

PackageSystems.propTypes = {
    packageName: propTypes.string
};

export default PackageSystems;
