import type { SystemsViewProps } from '../../SystemsView';
import { advisoryStatuses } from '../../Utilities/constants';
import { mapGlobalFilters } from '../../Utilities/Helpers';
import type { AdvisoryFilterParams, AdvisorySystem } from './types';

type AdvisorySystemsFilters = SystemsViewProps<AdvisorySystem, AdvisoryFilterParams>['filters'];

/** SystemsView stores `RHEL8.2`. Patch expects `RHEL 8.2`. */
const toPatchOsValue = (token: string) => {
  const match = token.match(/^(.+?)(\d+\.\d+)$/);
  return match ? `${match[1]} ${match[2]}` : token;
};

const filters: AdvisorySystemsFilters = (catalog) => [
  catalog.hostname({
    updateFilterParams(params, value) {
      return { ...params, search: value };
    },
  }),
  catalog.operatingSystem({
    updateFilterParams(params, value) {
      const restFilter = { ...params.filter };
      delete restFilter.os;

      return {
        ...params,
        filter:
          value.length > 0
            ? { ...restFilter, os: value.map(toPatchOsValue).join(',') }
            : restFilter,
      };
    },
  }),
  catalog.tags({
    updateFilterParams(params, value) {
      const rest = { ...params };
      delete rest.selectedTags;
      const next = mapGlobalFilters(value).selectedTags;

      return next.length > 0 ? { ...rest, selectedTags: next } : rest;
    },
  }),
  catalog.custom<AdvisoryFilterParams, string[]>(
    {
      type: 'checkbox',
      filterId: 'status',
      title: 'Status',
      defaultValue: [],
      placeholder: 'Filter by status',
      options: advisoryStatuses,
    },
    {
      updateFilterParams(params, value) {
        const restFilter = { ...params.filter };
        delete restFilter.status;

        return {
          ...params,
          filter: value.length > 0 ? { ...restFilter, status: value } : restFilter,
        };
      },
    },
  ),
];

export default filters;
