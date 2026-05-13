import React, { Fragment, useRef, useState } from 'react';
import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import isDeepEqualReact from 'fast-deep-equal/react';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { defaultReducers } from '../../store';
import { changeSystemsMetadata, changeTags, systemSelectAction } from '../../store/Actions/Actions';
import {
  inventoryEntitiesReducer,
  modifyInventory,
} from '../../store/Reducers/InventoryEntitiesReducer';
import { exportSystemsCSV, exportSystemsJSON, fetchSystems } from '../../Utilities/api/api';
import { pageDefaultFilters, NO_ADVISORIES_TEXT } from '../../Utilities/constants';
import { arrayFromObj, hasActiveInventoryFilters, persistantParams } from '../../Utilities/Helpers';
import {
  useBulkSelectConfig,
  useGetEntities,
  useOnExport,
  useRemoveFilter,
  useRemediationDataProvider,
  useOnSelect,
  ID_API_ENDPOINTS,
  useColumnManagement,
} from '../../Utilities/hooks';
import { SYSTEMS_LIST_COLUMNS, systemsRowActions } from './SystemsListAssets';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';
import {
  buildFilterConfig,
  buildActiveFiltersConfig,
  mergeInventoryColumns,
} from '../../Utilities/SystemsHelpers';
import { combineReducers } from 'redux';
import propTypes from 'prop-types';

const buildInventorySnapshot = (filters = {}, selectedTags = [], systemProfile = {}) => ({
  filters,
  selectedTags: selectedTags || [],
  systemProfile: systemProfile || {},
});

const SystemsTable = ({ apply, setSearchParams, activateRemediationModal, decodedParams }) => {
  const store = useStore();
  const inventory = useRef(null);

  const dispatch = useDispatch();
  const [isRemediationLoading, setRemediationLoading] = useState(false);
  const systems = useSelector(({ entities }) => entities?.rows || [], shallowEqual);
  const totalItems = useSelector(({ entities }) => entities?.total || 0);

  const selectedRows = useSelector(({ entities }) => entities?.selectedRows || []);
  const areAllSelected = useSelector(({ SystemsStore }) => SystemsStore?.areAllSelected);
  const queryParams = useSelector(({ SystemsStore }) => SystemsStore?.queryParams || {});

  const [appliedColumns, setAppliedColumns] = React.useState(SYSTEMS_LIST_COLUMNS);
  const [ColumnManagementModal, setColumnManagementModalOpen] = useColumnManagement(
    appliedColumns,
    (newColumns) => setAppliedColumns(newColumns),
  );

  const {
    systemProfile,
    selectedTags,
    filter: queryParamsFilter,
    search,
    page,
    perPage,
    sort,
  } = queryParams;
  const { os: operatingSystemFilter, ...filter } = queryParamsFilter || {};
  const osFilter = operatingSystemFilter && [
    {
      osFilter: operatingSystemFilter.reduce((osFilter, os) => {
        const [osName, osVersion] = os.split(' ');
        const [major] = osVersion.split('.');

        return {
          ...osFilter,
          [`${osName}-${major}`]: {
            ...(osFilter[`${osName}-${major}`] || {}),
            [`${osName}-${major}-${osVersion}`]: true,
          },
        };
      }, {}),
    },
  ];
  const [inventorySnapshot, setInventorySnapshot] = useState(() =>
    buildInventorySnapshot(
      operatingSystemFilter ? { osFilter: osFilter?.[0]?.osFilter || {} } : {},
      selectedTags,
      systemProfile,
    ),
  );

  const applyMetadata = (metadata) => {
    dispatch(changeSystemsMetadata(metadata));
  };

  const applyGlobalFilter = (tags) => {
    dispatch(changeTags(tags));
  };

  const [deleteFilters] = useRemoveFilter({ search, ...filter }, apply, pageDefaultFilters.systems);
  const filterConfig = buildFilterConfig(search, filter, apply);
  const applyInventorySnapshot = React.useCallback((nextSnapshot) => {
    setInventorySnapshot((previousSnapshot) =>
      isDeepEqualReact(previousSnapshot, nextSnapshot) ? previousSnapshot : nextSnapshot,
    );
  }, []);
  const hasInventoryFilterDeviation =
    hasActiveInventoryFilters(inventorySnapshot.filters) ||
    Boolean(inventorySnapshot.selectedTags?.length) ||
    Boolean(
      inventorySnapshot.systemProfile && Object.keys(inventorySnapshot.systemProfile).length > 0,
    );

  const activeFiltersConfig = React.useMemo(() => {
    const config = buildActiveFiltersConfig(
      filter,
      search,
      deleteFilters,
      pageDefaultFilters.systems,
    );

    return {
      ...config,
      showDeleteButton: config.showDeleteButton || hasInventoryFilterDeviation,
    };
  }, [deleteFilters, filter, hasInventoryFilterDeviation, search]);

  const onSelect = useOnSelect(systems, selectedRows, {
    endpoint: ID_API_ENDPOINTS.systems,
    queryParams,
    selectionDispatcher: systemSelectAction,
    totalItems,
  });

  const onExport = useOnExport(
    'systems',
    queryParams,
    {
      csv: exportSystemsCSV,
      json: exportSystemsJSON,
    },
    dispatch,
  );

  const getEntities = useGetEntities(
    fetchSystems,
    apply,
    {},
    setSearchParams,
    applyMetadata,
    applyGlobalFilter,
    applyInventorySnapshot,
  );

  const remediationDataProvider = useRemediationDataProvider(
    selectedRows,
    setRemediationLoading,
    'systems',
    areAllSelected,
  );

  const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

  const bulkSelectConfig = useBulkSelectConfig(
    selectedCount,
    onSelect,
    { total_items: totalItems },
    systems,
  );

  return (
    <Fragment>
      {ColumnManagementModal}

      <InventoryTable
        ref={inventory}
        isFullView
        autoRefresh
        initialLoading
        hideFilters={{ all: true, tags: false, hostGroupFilter: false, operatingSystem: false }}
        columns={(inventoryColumns) =>
          mergeInventoryColumns(
            appliedColumns.filter((column) => column.isShown),
            inventoryColumns,
          )
        }
        showTags
        customFilters={{
          ...(operatingSystemFilter
            ? {
                filters: [...(osFilter || [])],
              }
            : {}),
          patchParams: {
            search,
            filter,
            systemProfile,
            selectedTags,
          },
        }}
        paginationProps={{
          isDisabled: totalItems === 0,
        }}
        onLoad={({ mergeWithEntities }) => {
          store.replaceReducer(
            combineReducers({
              ...defaultReducers,
              ...mergeWithEntities(
                inventoryEntitiesReducer(SYSTEMS_LIST_COLUMNS, modifyInventory),
                persistantParams({ page, perPage, sort, search }, decodedParams),
              ),
            }),
          );
        }}
        getEntities={getEntities}
        tableProps={{
          actionResolver: (row) => systemsRowActions(activateRemediationModal, row),
          canSelectAll: false,
          variant: TableVariant.compact,
          className: 'patchCompactInventory',
          isStickyHeader: true,
        }}
        bulkSelect={bulkSelectConfig}
        exportConfig={{
          isDisabled: totalItems === 0,
          onSelect: onExport,
        }}
        actionsConfig={{
          actions: [
            <AsyncRemediationButton
              key='remediate-multiple-systems'
              remediationProvider={remediationDataProvider}
              isDisabled={arrayFromObj(selectedRows).length === 0 || isRemediationLoading}
              isLoading={isRemediationLoading}
              patchNoAdvisoryText={NO_ADVISORIES_TEXT}
              hasSelected={arrayFromObj(selectedRows).length > 0}
            />,
            {
              label: 'Manage columns',
              onClick: () => setColumnManagementModalOpen(true),
            },
          ],
        }}
        filterConfig={filterConfig}
        activeFiltersConfig={activeFiltersConfig}
      />
    </Fragment>
  );
};

SystemsTable.propTypes = {
  apply: propTypes.func.isRequired,
  setSearchParams: propTypes.func.isRequired,
  activateRemediationModal: propTypes.func.isRequired,
  decodedParams: propTypes.object.isRequired,
};
export default SystemsTable;
