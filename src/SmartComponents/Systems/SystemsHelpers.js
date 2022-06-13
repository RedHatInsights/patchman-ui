import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import staleFilter from '../../PresentationalComponents/Filters/SystemStaleFilter';
import osVersionFilter from '../../PresentationalComponents/Filters/OsVersionFilter';
import systemsUpdatableFilter from '../../PresentationalComponents/Filters/SystemsUpdatableFilter';
import {
    fetchApplicableAdvisoriesApi,
    fetchViewAdvisoriesSystems,
    fetchSystems
} from '../../Utilities/api';
import {
    filterRemediatableSystems,
    buildFilterChips
} from '../../Utilities/Helpers';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const prepareRemediationPairs = (systems) => {
    return fetchApplicableAdvisoriesApi({ limit: -1 }).then(
        ({ data }) => fetchViewAdvisoriesSystems(
            {
                advisories: data.map(advisory => advisory.id),
                systems
            }
        ));
};

export const fetchAllSystemsCallback = (queryParams) => () =>
    fetchSystems({ ...queryParams, limit: -1 }).then(filterRemediatableSystems);

export const buildFilterConfig = (search, filter, apply) => ({
    items: [
        searchFilter(apply, search,
            intl.formatMessage(messages.labelsFiltersSystemsSearchTitle),
            intl.formatMessage(messages.labelsFiltersSystemsSearchPlaceholder)
        ),
        staleFilter(apply, filter),
        systemsUpdatableFilter(apply, filter),
        osVersionFilter(filter, apply)
    ]
});

export const buildActiveFiltersConfig = (filter, search, deleteFilters) => ({
    filters: buildFilterChips(filter, search, intl.formatMessage(messages.labelsFiltersSystemsSearchTitle)),
    onDelete: deleteFilters,
    deleteTitle: intl.formatMessage(messages.labelsFiltersReset)
});
