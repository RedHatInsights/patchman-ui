import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import propTypes from 'prop-types';
import React, { useCallback, useMemo, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';
import messages from '../../Messages';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import statusFilter from '../../PresentationalComponents/Filters/StatusFilter';
import versionFilter from '../../PresentationalComponents/Filters/VersionFilter';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { defaultReducers } from '../../store';
import { changePackageSystemsParams, clearInventoryReducer,
    clearPackageSystemsReducer, systemSelectAction } from '../../store/Actions/Actions';
import { inventoryEntitiesReducer, modifyPackageSystems } from '../../store/Reducers/InventoryEntitiesReducer';
import {
    exportPackageSystemsCSV,
    exportPackageSystemsJSON, fetchPackageSystems,
    fetchPackageVersions
} from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import {
    arrayFromObj, buildFilterChips, decodeQueryparams, filterRemediatablePackageSystems,
    persistantParams, remediationProviderWithPairs, removeUndefinedObjectKeys
} from '../../Utilities/Helpers';
import { useBulkSelectConfig, useGetEntities, useOnExport, useRemoveFilter } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';
import { packageSystemsColumns } from '../Systems/SystemsListAssets';
import { useOnSelect, ID_API_ENDPOINTS } from '../../Utilities/useOnSelect';
import { combineReducers } from 'redux';

const PackageSystems = ({ packageName }) => {
    const dispatch = useDispatch();
    const store = useStore();
    const history = useHistory();
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

    const metadata = useSelector(
        ({ PackageSystemsStore }) => PackageSystemsStore?.metadata || {}
    );

    const { systemProfile, selectedTags,
        filter, search, sort, page, perPage } = queryParams;

    const apply = useCallback((params) => {
        dispatch(changePackageSystemsParams(params));
    }, []);

    useEffect(async () => {
        apply(decodedParams);
        setPackageVersions(await fetchPackageVersions({ package_name: packageName }));
    }, []);

    useEffect(() => {
        return () => {
            dispatch(clearInventoryReducer());
            dispatch(clearPackageSystemsReducer());
        };
    }, []);

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

    const activeFiltersConfig = useMemo(() => ({
        filters: buildFilterChips(filter, search, intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)),
        onDelete: deleteFilters
    }), [filter, search]);

    const constructFilename = (system) => {
        return `${packageName}-${system.available_evra}`;
    };

    const onSelect = useOnSelect(
        systems,
        selectedRows,
        {
            endpoint: ID_API_ENDPOINTS.packageSystems(packageName),
            queryParams,
            selectionDispatcher: systemSelectAction,
            constructFilename,
            apiResponseTransformer: filterRemediatablePackageSystems
        }
    );

    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

    const onExport = useOnExport(packageName, queryParams, {
        csv: exportPackageSystemsCSV,
        json: exportPackageSystemsJSON
    }, dispatch);

    const prepareRemediationPairs = useCallback((systemIDs) => {
        const pairs = [];

        systemIDs.forEach(id => {
            const packageEvra = selectedRows[id];
            const issueID = `patch-package:${packageEvra}`;
            const index = pairs.findIndex(pair => pair.id === issueID);

            if (index !== -1) {
                pairs[index].systems.push(id);
            } else if (packageEvra) {
                pairs.push({
                    id: issueID,
                    description: packageEvra,
                    systems: [id]
                });
            }
        });

        return pairs.length ? { issues: pairs } : false;
    }, [selectedRows]);

    const getEntites = useGetEntities(fetchPackageSystems, apply, { packageName }, history);

    const remediationDataProvider = () => remediationProviderWithPairs(
        removeUndefinedObjectKeys(selectedRows),
        prepareRemediationPairs,
        remediationIdentifiers.package
    );

    const bulkSelectConfig = useBulkSelectConfig(selectedCount, onSelect, { total_items: totalItems }, systems);

    return (
        <React.Fragment>
            {(status.hasError || metadata?.has_systems === false)
            && <ErrorHandler code={status.code} metadata={metadata}/>
            || (
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
                    paginationProps={{
                        isDisabled: totalItems === 0
                    }}
                    onLoad={({ mergeWithEntities }) => {
                        store.replaceReducer(combineReducers({
                            ...defaultReducers,
                            ...mergeWithEntities(
                                inventoryEntitiesReducer(packageSystemsColumns, modifyPackageSystems),
                                persistantParams({ page, perPage, sort, search }, decodedParams)
                            )
                        }));

                    }}
                    tableProps={{
                        canSelectAll: false,
                        variant: TableVariant.compact, className: 'patchCompactInventory', isStickyHeader: true
                    }}
                    filterConfig={filterConfig}
                    activeFiltersConfig={activeFiltersConfig}
                    bulkSelect={onSelect && bulkSelectConfig}
                    exportConfig={{
                        isDisabled: totalItems === 0,
                        onSelect: onExport
                    }}
                    dedicatedAction={(
                        <AsyncRemediationButton
                            remediationProvider={remediationDataProvider}
                            isDisabled={arrayFromObj(selectedRows).length === 0}
                        />
                    )}
                />
            )}
        </React.Fragment>
    );
};

PackageSystems.propTypes = {
    packageName: propTypes.string
};

export default PackageSystems;
