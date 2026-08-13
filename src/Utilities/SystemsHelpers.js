import staleFilter from '../PresentationalComponents/Filters/SystemStaleFilter';
import systemsUpdatableFilter from '../PresentationalComponents/Filters/SystemsUpdatableFilter';
import systemsWorkloadFilter from '../PresentationalComponents/Filters/WorkloadFilter';
import { buildActiveFilterConfig } from './Helpers';
import { intl } from './IntlProvider';
import messages from '../Messages';
import { defaultCompoundSortValues } from './constants';

export const workloadToSystemProfile = (workloads = []) => ({
  ...(workloads.includes('sap') && { sap_system: true }),
  ...(workloads.includes('ansible') && { ansible: { controller_version: 'not_nil' } }),
  ...(workloads.includes('mssql') && { mssql: { version: 'not_nil' } }),
  ...(workloads.includes('crowdstrike') && { crowdstrike: true }),
  ...(workloads.includes('ibm_db2') && { ibm_db2: true }),
  ...(workloads.includes('intersystems') && { intersystems: true }),
  ...(workloads.includes('oracle_db') && { oracle_db: true }),
  ...(workloads.includes('rhel_ai') && { rhel_ai: true }),
  ...(workloads.includes('satellite') && { satellite: true }),
});

export const buildFilterConfig = (filter, apply) => ({
  items: [
    staleFilter(apply, filter),
    systemsUpdatableFilter(apply, filter),
    systemsWorkloadFilter(apply, filter),
  ],
});

export const buildActiveFiltersConfig = (filter, search, deleteFilters, defaultFilters) =>
  buildActiveFilterConfig(
    filter,
    search,
    deleteFilters,
    intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
    defaultFilters,
  );

export const mergeInventoryColumns = (patchmanColumns, inventoryColumns) =>
  patchmanColumns.map((column) => ({
    ...inventoryColumns.find(
      (inventoryColumn) => inventoryColumn.key === (column.inventoryKey ?? column.key),
    ),
    ...column,
  }));

export const createSystemsSortBy = (orderBy, orderDirection, hasLastUpload) => {
  if (orderBy === 'updated') {
    if (!hasLastUpload) {
      orderBy = 'last_upload';
    } else {
      orderBy = 'os';
    }
  } else if (orderBy === 'group_name') {
    orderBy = 'groups'; // patch API service uses 'groups' instead of 'group_name' sort parameter
  }

  let sort = `${orderDirection === 'ASC' ? '' : '-'}${orderBy}`;

  // if orderBy is for a compound column reset sort value to relative compound sort value
  Object.keys(defaultCompoundSortValues).forEach((col) => {
    if (col === orderBy) {
      sort = defaultCompoundSortValues[col][orderDirection.toLowerCase()];
    }
  });

  return sort;
};

export const osParamParser = (paramValue) =>
  paramValue
    .replace('in:', '')
    .split(',')
    .reduce((osFilter, os) => {
      const [osName, osVersion] = os.split(' ');
      const [major] = osVersion.split('.');

      return {
        ...osFilter,
        [`${osName}-${major}`]: {
          ...(osFilter[`${osName}-${major}`] || {}),
          [`${osName}-${major}-${osVersion}`]: true,
        },
      };
    }, {});
