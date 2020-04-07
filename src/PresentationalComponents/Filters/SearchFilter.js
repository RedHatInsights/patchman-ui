import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';
import debounce from 'lodash/debounce';
import React from 'react';

const searchFilter = (apply, search, placeholder) => {
    const [searchValue, setSearchValue] = React.useState();
    const [searchAdvisory] = React.useState(() =>
        debounce(value => apply({ search: value }), 400)
    );

    React.useEffect(() => setSearchValue(search), [search]);

    return {
        type: conditionalFilterType.text,
        label: 'Search',
        filterValues: {
            onChange: (event, value) => {
                setSearchValue(value);
                searchAdvisory(value);
            },
            placeholder: placeholder || 'Search advisories',
            value: searchValue
        }
    };
};

export default searchFilter;
