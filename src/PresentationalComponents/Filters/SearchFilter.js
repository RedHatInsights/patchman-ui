import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import debounce from 'lodash/debounce';
import { useState, useEffect, useCallback } from 'react';

const searchFilter = (apply, search, title, placeholder) => {
  const [searchValue, setSearchValue] = useState(search);
  const debouncedRequest = useCallback(
    debounce((value) => apply({ search: value }), 400),
    [],
  );

  useEffect(() => setSearchValue(search), [search]);

  return {
    type: conditionalFilterType.text,
    label: title,
    filterValues: {
      'aria-label': 'search-field',
      onChange: (event, value) => {
        setSearchValue(value);
        debouncedRequest(value);
      },
      placeholder,
      value: searchValue,
    },
  };
};

export default searchFilter;
