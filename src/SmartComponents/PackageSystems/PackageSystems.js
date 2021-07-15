import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import statusFilter from '../../PresentationalComponents/Filters/StatusFilter';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { register } from '../../store';
import { changePackageSystemsParams, clearPackageSystemsStore } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyPackageSystems } from '../../store/Reducers/InventoryEntitiesReducer';
import { fetchPackageSystems, exportPackageSystemsCSV,
    exportPackageSystemsJSON, fetchPackageVersions } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips,
    filterSelectedRowIDs, persistantParams, remediationProviderWithPairs, transformPairs
} from '../../Utilities/Helpers';
import { useBulkSelectConfig, useGetEntities, useOnExport, useOnSelect, useRemoveFilter } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import PatchRemediationButton from '../Remediation/PatchRemediationButton';
import RemediationModal from '../Remediation/RemediationModal';
import { packageSystemsColumns } from '../Systems/SystemsListAssets';
import versionFilter from '../../PresentationalComponents/Filters/VersionFilter';

const PackageSystems = ({ packageName }) => {
    const dispatch = useDispatch();
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const [packageVersions, setPackageVersions] = React.useState([]);
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
    const [isRemediationLoading, setRemediationLoading] = React.useState(false);
    React.useEffect(async () => {
        setPackageVersions(await fetchPackageVersions({ package_name: packageName }));
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
            statusFilter(apply, filter),
            versionFilter(apply, filter, packageVersions)
        ]
    };

    const activeFiltersConfig = {
        filters: buildFilterChips(filter, search),
        onDelete: deleteFilters
    };

    async function showRemediationModal(data) {
        setRemediationLoading(true);
        const resolvedData = await data;
        setRemediationModalCmp(() => () => <RemediationModal data={resolvedData} />);
        setRemediationLoading(false);
    }

    }

    ;

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

    const prepareRemediationPairs = () => {
        let pairs = {};
        filterSelectedRowIDs(selectedRows).forEach(system => {
            if (pairs[selectedRows[system]]) {
                pairs[selectedRows[system]].push(system);
            }
            else {
                pairs[selectedRows[system]] = [system];
            }
        });
        return { data: pairs };
    };

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
                        variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true
                    }}
                    filterConfig={filterConfig}
                    activeFiltersConfig={activeFiltersConfig}
                    bulkSelect={useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems)}
                    dedicatedAction={(
                        <PatchRemediationButton
                            onClick={() =>
                                showRemediationModal(
                                    remediationProviderWithPairs(
                                        filterSelectedRowIDs(selectedRows),
                                        prepareRemediationPairs,
                                        transformPairs,
                                        remediationIdentifiers.package)

                                )}
                            isDisabled={arrayFromObj(selectedRows).length === 0 || isRemediationLoading}
                            isLoading={isRemediationLoading}
                            ouia={'toolbar-remediation-button'}
                        />)}
                >
                    <RemediationModalCmp />
                </InventoryTable>
            )}
        </React.Fragment>
    );
};

PackageSystems.propTypes = {
    packageName: propTypes.string
};

export default PackageSystems;
