import searchFilter from '../PresentationalComponents/Filters/SearchFilter';
import staleFilter from '../PresentationalComponents/Filters/SystemStaleFilter';
import systemsUpdatableFilter from '../PresentationalComponents/Filters/SystemsUpdatableFilter';
import { buildFilterChips } from './Helpers';
import { intl } from './IntlProvider';
import messages from '../Messages';
import { systemsListColumns, packageSystemsColumns } from '../SmartComponents/Systems/SystemsListAssets';
import { compoundSortValues } from './constants';

export const buildFilterConfig = (search, filter, apply, osFilterConfig) => ({
    items: [
        searchFilter(
            apply,
            search,
            intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
            intl.formatMessage(
                messages.labelsFiltersSystemsSearchPlaceholder
            )
        ),
        staleFilter(apply, filter),
        systemsUpdatableFilter(apply, filter),
        ...osFilterConfig
    ]
});

export const buildActiveFiltersConfig = (filter, search, deleteFilters) => ({
    filters: buildFilterChips(filter, search, intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)),
    onDelete: deleteFilters,
    deleteTitle: intl.formatMessage(messages.labelsFiltersReset)
});

export const systemsColumnsMerger = (defaultColumns, isPatchSetEnabled) => {
    let lastSeen = defaultColumns.filter(({ key }) => key === 'updated');
    lastSeen = [{ ...lastSeen[0], key: 'last_upload', sortKey: 'last_upload' }];

    let nameAndTag = defaultColumns.filter(({ key }) => key === 'display_name' || key === 'tags');

    return [...nameAndTag, ...systemsListColumns(isPatchSetEnabled), lastSeen[0]];
};

export const createSystemsSortBy = (orderBy, orderDirection, hasLastUpload) => {
    orderBy = (orderBy === 'updated' && !hasLastUpload) && 'last_upload' ||
        (orderBy === 'updated' && hasLastUpload) && packageSystemsColumns[0].key || orderBy;

    let sort = `${orderDirection === 'ASC' ? '' : '-'}${orderBy}`;

    //if orderBy is for a compound column reset sort value to relative compound sort value
    Object.keys(compoundSortValues).forEach(col => {
        if (col === orderBy) {
            sort = compoundSortValues[col][orderDirection.toLowerCase()];
        }
    });

    return sort;
};
