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
import { changePackageSystemsParams, clearInventoryReducer, clearPackageSystemsReducer } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyPackageSystems } from '../../store/Reducers/InventoryEntitiesReducer';
import { fetchPackageSystems, exportPackageSystemsCSV,
    exportPackageSystemsJSON, fetchPackageVersions } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips, decodeQueryparams, filterRemediatablePackageSystems,
    removeUndefinedObjectKeys, persistantParams, remediationProviderWithPairs, transformPairs
} from '../../Utilities/Helpers';
import { useBulkSelectConfig, useGetEntities, useOnExport, useOnSelect, useRemoveFilter } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import PatchRemediationButton from '../Remediation/PatchRemediationButton';
import RemediationModal from '../Remediation/RemediationModal';
import { packageSystemsColumns } from '../Systems/SystemsListAssets';
import versionFilter from '../../PresentationalComponents/Filters/VersionFilter';
import { useHistory } from 'react-router-dom';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { Fragment } from 'react';

const PackageSystems = ({ packageName }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const [packageVersions, setPackageVersions] = React.useState([]);

    const decodedParams = decodeQueryparams(history.location.search);
    const systems = useSelector(({ entities }) => entities?.rows || [], shallowEqual);
    const status = useSelector(
        ({ entities }) => entities?.status || {}
    );
    const totalItems = useSelector(
        ({ entities }) => entities?.total || 0
    );
    const selectedRows = useSelector(
        ({ entities }) => entities?.selectedRows || []
    );
    const queryParams = useSelector(
        ({ PackageSystemsStore }) => PackageSystemsStore?.queryParams || {}
    );

    const [isRemediationLoading, setRemediationLoading] = React.useState(false);
    const { systemProfile, selectedTags,
        filter, search, sort, page, perPage } = queryParams;

    React.useEffect(async () => {
        apply(decodedParams);
        setPackageVersions(await fetchPackageVersions({ package_name: packageName }));
    }, []);

    React.useEffect(() => {
        return () => {
            dispatch(clearInventoryReducer());
            dispatch(clearPackageSystemsReducer());
        };
    }, []);

    function apply(params) {
        dispatch(changePackageSystemsParams(params));
    }

    const [deleteFilters] = useRemoveFilter({ ...filter, search }, apply);

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

    ;

    const constructFilename = (system) => {
        return `${packageName}-${system.available_evra}`;
    };

    const fetchAllData = () => {
        return fetchPackageSystems({
            ...queryParams,
            package_name: packageName,
            limit: -1 })
        .then(filterRemediatablePackageSystems);
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
        removeUndefinedObjectKeys(selectedRows).forEach(system => {
            if (pairs[selectedRows[system]]) {
                pairs[selectedRows[system]].push(system);
            }
            else {
                pairs[selectedRows[system]] = [system];
            }
        });
        return { data: pairs };
    };

    const getEntites = useGetEntities(fetchPackageSystems, apply, { packageName }, history);
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
                                persistantParams({ page, perPage, sort, search }, decodedParams)
                            )
                        });

                    }}
                    tableProps={{
                        canSelectAll: false,
                        variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true
                    }}
                >
                    <Fragment>
                        {status.isLoading !== undefined && <PrimaryToolbar
                            className="patch-systems-primary-toolbar"
                            filterConfig={filterConfig}
                            activeFiltersConfig={activeFiltersConfig}
                            bulkSelect={useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems)}
                            exportConfig={{
                                isDisabled: totalItems === 0,
                                onSelect: onExport
                            }}
                            dedicatedAction={(
                                <PatchRemediationButton
                                    onClick={() =>
                                        showRemediationModal(
                                            remediationProviderWithPairs(
                                                removeUndefinedObjectKeys(selectedRows),
                                                prepareRemediationPairs,
                                                transformPairs,
                                                remediationIdentifiers.package)

                                        )}
                                    isDisabled={arrayFromObj(selectedRows).length === 0 || isRemediationLoading}
                                    isLoading={isRemediationLoading}
                                    ouia={'toolbar-remediation-button'}
                                />)}
                        />}
                        <RemediationModalCmp />

                    </Fragment>

                </InventoryTable>
            )}
        </React.Fragment>
    );
};

PackageSystems.propTypes = {
    packageName: propTypes.string
};

export default PackageSystems;
