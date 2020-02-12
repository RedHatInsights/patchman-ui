import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import { publicDateOptions } from '../../Utilities/constants';

const publishDateFilter = apply => {
    const [, setPublicDate] = React.useState();
    const filterByPublicDate = value => {
        apply({ filter: { public_date: (value !== '0' && value) || '' } });
    };

    return {
        label: 'Publish date',
        type: conditionalFilterType.radio,
        filterValues: {
            onChange: (event, value) => {
                setPublicDate(value);
                filterByPublicDate(value);
            },
            items: publicDateOptions
        }
    };
};

export default publishDateFilter;
