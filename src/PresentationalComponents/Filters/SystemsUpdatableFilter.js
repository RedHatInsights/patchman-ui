import React from 'react';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { SingleSelectFilter } from '@redhat-cloud-services/frontend-components/Filters/';
import { packagesListUpdatableTypes } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
//import SelectCustomFilter from '../SelectCustomFilter/SelectCustomFilter';
import { findFilterData } from '../../Utilities/Helpers';

const systemsUpdatableFilter = (apply, currentFilter = {}) => {

    let { packages_updatable: currentValue } = currentFilter;

    const filterByUpdatableSystems = value => {
        const selectedFilter = findFilterData(value, packagesListUpdatableTypes);
        apply({ filter: { packages_updatable: selectedFilter.value } });
    };

    return {
        label: intl.formatMessage(messages.labelsFiltersUpdatable),
        type: conditionalFilterType.custom,
        filterValues: {
            children: (
                <SingleSelectFilter
                    filterId='publish_date'
                    options={packagesListUpdatableTypes}
                    placeholder={intl.formatMessage(messages.labelsFiltersUpdatablePlaceholder)}
                    selectedValue={currentValue}
                    setFilterData={filterByUpdatableSystems}
                />
            )
        }
    };
};

export default systemsUpdatableFilter;
