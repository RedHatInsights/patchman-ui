import React from 'react';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { publicDateOptions } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import SelectCustomFilter from '../SelectCustomFilter/SelectCustomFilter';
import { findFilterData } from '../../Utilities/Helpers';

const publishDateFilter = (apply, currentFilter = {}) => {
    let { public_date: currentValue } = currentFilter;

    const filterByPublicDate = value => {
        const selectedFilter = findFilterData(value, publicDateOptions);
        apply({ filter: { public_date: selectedFilter.value === 'all' ? '' : selectedFilter.value } });
    };

    return {
        label: intl.formatMessage(messages.labelsFiltersPublishDate),
        type: conditionalFilterType.custom,
        filterValues: {
            children: (
                <SelectCustomFilter
                    filterId='publish_date'
                    options={publicDateOptions}
                    placeholder={intl.formatMessage(messages.labelsFiltersPublishDatePlaceholder)}
                    selectedValue={currentValue ?? 'all'}
                    setFilterData={filterByPublicDate}
                />
            )
        }
    };
};

export default publishDateFilter;
