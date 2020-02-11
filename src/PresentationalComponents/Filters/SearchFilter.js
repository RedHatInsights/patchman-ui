import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';
import debounce from 'lodash/debounce';
import React from 'react';

const searchFilter = apply => {
    const [searchValue, setSearchValue] = React.useState();
    const [searchAdvisory] = React.useState(() =>
        debounce(value => apply({ search: value }), 400)
    );

    return {
        type: conditionalFilterType.text,
        label: 'Search',
        value: searchValue,
        filterValues: {
            onChange: (event, value) => {
                setSearchValue(value);
                searchAdvisory(value);
            },
            placeholder: 'Search advisories',
            value: searchValue
        }
    };
};

export default searchFilter;
