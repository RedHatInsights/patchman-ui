import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';
import debounce from 'lodash/debounce';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const searchFilter = (apply, search, placeholder) => {
    const [searchValue, setSearchValue] = React.useState();
    const [searchAdvisory] = React.useState(() =>
        debounce(value => apply({ search: value }), 400)
    );

    React.useEffect(() => setSearchValue(search), [search]);

    return {
        type: conditionalFilterType.text,
        label: intl.formatMessage(messages.labelsFiltersSearch),
        filterValues: {
            'aria-label': 'search-field',
            onChange: (event, value) => {
                setSearchValue(value);
                searchAdvisory(value);
            },
            placeholder: placeholder || intl.formatMessage(messages.labelsFiltersSearchAdvisories),
            value: searchValue
        }
    };
};

export default searchFilter;
