import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { updatableTypes } from '../../Utilities/constants';

const statusFilter = (apply, currentFilter = {}) => {

    let { updatable: currentValue } = currentFilter;
    // Empty string value is not supported by PF Radio at the moment
    if (currentValue === '' || !currentValue) {
        currentValue = '0';
    }

    const updatableTypesMap = React.useMemo(
        () =>
            updatableTypes.map(({ value, label }) => ({
                label,
                value: value.toString()
            })),
        []
    );
    const filterByType = value => {
        apply({ filter: { updatable: (value !== '0' && value) || '' } });
    };

    return {
        label: 'Status',
        type: conditionalFilterType.radio,
        filterValues: {
            onChange: (event, value) => {
                filterByType(value);
            },
            items: updatableTypesMap,
            value: currentValue
        }
    };
};

export default statusFilter;
