import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { advisoryTypes } from '../../Utilities/constants';

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
        label: 'Type',
        type: conditionalFilterType.checkbox,
        filterValues: {
            onChange: (event, value) => {
                filterByType(value);
            },
            items: advisoryTypesMap,
            value: currentFilter.advisory_type
        }
    };
};

export default typeFilter;
