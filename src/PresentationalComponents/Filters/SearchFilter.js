import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import debounce from 'lodash/debounce';
import React from 'react';

const searchFilter = (apply, search, title, placeholder) => {
    const [searchValue, setSearchValue] = React.useState();
    const [searchAdvisory] = React.useState(() =>
        debounce(value => apply({ search: value }), 400)
    );

    React.useEffect(() => setSearchValue(search), [search]);

    return {
        type: conditionalFilterType.text,
        label: title,
        filterValues: {
            'aria-label': 'search-field',
            onChange: (event, value) => {
                setSearchValue(value);
                searchAdvisory(value);
            },
            placeholder,
            value: searchValue
        }
    };
};

export default searchFilter;
