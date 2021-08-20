import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import React from 'react';
import { staleSystems } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const systemsStaleFilter = (apply, currentFilter = {}) => {

    let { stale: currentValue } = currentFilter;

    const staleMap = React.useMemo(
        () =>
            staleSystems.map(({ value, label }) => ({
                label,
                value: value.toString()
            })),
        []
    );
    const filterByStale = value => {
        apply({ filter: { stale: value } });
    };

    return {
        label: intl.formatMessage(messages.labelsFiltersStale),
        type: conditionalFilterType.checkbox,
        filterValues: {
            onChange: (event, value) => {
                filterByStale(value);
            },
            items: staleMap,
            value: currentValue,
            placeholder: intl.formatMessage(messages.labelsFiltersStalePlaceholder)
        }
    };
};

export default systemsStaleFilter;
