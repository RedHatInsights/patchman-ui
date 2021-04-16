import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import React from 'react';
import { advisoryTypes } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const typeFilter = (apply, currentFilter = {}) => {
    const advisoryTypesMap = React.useMemo(
        () =>
            advisoryTypes.map(({ value, label }) => ({
                label,
                value: value.toString()
            })),
        []
    );
    const filterByType = value => {
        apply({ filter: { advisory_type: value } });
    };

    return {
        label: intl.formatMessage(messages.labelsFiltersType),
        type: conditionalFilterType.checkbox,
        filterValues: {
            onChange: (event, value) => {
                filterByType(value);
            },
            items: advisoryTypesMap,
            value: currentFilter.advisory_type,
            placeholder: intl.formatMessage(messages.labelsFiltersTypePlaceholder)
        }
    };
};

export default typeFilter;
