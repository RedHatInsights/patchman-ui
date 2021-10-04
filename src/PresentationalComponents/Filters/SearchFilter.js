import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import debounce from 'lodash/debounce';
import { useState, useEffect } from 'react';

const searchFilter = (apply, search, title, placeholder) => {
    const [searchValue, setSearchValue] = useState();
    const [searchAdvisory] = useState(() =>
        debounce(value => apply({ search: value }), 400)
    );

    useEffect(() => setSearchValue(search), [search]);

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
