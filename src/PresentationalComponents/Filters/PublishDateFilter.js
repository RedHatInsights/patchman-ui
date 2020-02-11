import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { publicDateOptions } from '../../Utilities/constants';

const publishDateFilter = apply => {
    const [type, setType] = React.useState();
    const filterByType = value => {
        apply({ filter: { public_date: value } });
    };

    return {
        label: 'Publish date',
        value: 'public_date',
        type: conditionalFilterType.radio,
        filterValues: {
            onChange: (event, value) => {
                type;
                setType(value);
                filterByType(value);
            },
            items: publicDateOptions
        }
    };
};

export default publishDateFilter;
