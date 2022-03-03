import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import statusFilter from '../../PresentationalComponents/Filters/StatusFilter';
import versionFilter from '../../PresentationalComponents/Filters/VersionFilter';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { register } from '../../store';
import { changePackageSystemsParams, clearInventoryReducer, clearPackageSystemsReducer } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyPackageSystems } from '../../store/Reducers/InventoryEntitiesReducer';
import {
    exportPackageSystemsCSV,
    exportPackageSystemsJSON, fetchPackageSystems,
    fetchPackageVersions
} from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips, decodeQueryparams, filterRemediatablePackageSystems,
    persistantParams, remediationProviderWithPairs, removeUndefinedObjectKeys, transformPairs
} from '../../Utilities/Helpers';
import { useBulkSelectConfig, useGetEntities, useOnExport, useOnSelect, useRemoveFilter } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import PatchRemediationButton from '../Remediation/PatchRemediationButton';
import RemediationModal from '../Remediation/RemediationModal';
import { packageSystemsColumns } from '../Systems/SystemsListAssets';

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
        filters: buildFilterChips(filter, search, intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)),
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
            limit: -1
        })
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
            <RemediationModalCmp/>
            {status.hasError && <ErrorHandler code={status.code} /> || (
                <InventoryTable
                    disableDefaultColumns={['system_profile', 'updated']}
                    isFullView
                    autoRefresh
                    initialLoading
                    hideFilters={{ all: true, tags: false }}
                    columns={packageSystemsColumns}
                    showTags
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
                />
            )}
        </React.Fragment>
    );
};

PackageSystems.propTypes = {
    packageName: propTypes.string
};

export default PackageSystems;
