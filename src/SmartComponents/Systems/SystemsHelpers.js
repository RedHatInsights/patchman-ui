import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import staleFilter from '../../PresentationalComponents/Filters/SystemStaleFilter';
import systemsUpdatableFilter from '../../PresentationalComponents/Filters/SystemsUpdatableFilter';
import { fetchSystems } from '../../Utilities/api';
import {
    filterRemediatableSystems,
    buildFilterChips
} from '../../Utilities/Helpers';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const fetchAllSystemsCallback = (queryParams) => () =>
    fetchSystems({ ...queryParams, limit: -1 }).then(filterRemediatableSystems);

export const buildFilterConfig = (search, filter, apply) => ({
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
        systemsUpdatableFilter(apply, filter)
    ]
});

export const buildActiveFiltersConfig = (filter, search, deleteFilters) => ({
    filters: buildFilterChips(filter, search, intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)),
    onDelete: deleteFilters,
    deleteTitle: intl.formatMessage(messages.labelsFiltersReset)
});
