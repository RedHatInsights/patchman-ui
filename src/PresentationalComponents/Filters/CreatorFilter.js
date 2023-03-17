import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const creatorFilter = (apply, currentFilter = {}, items) => {
    const filterByCreator = value => {
        value.length === 0
            ? apply({ filter: { creator: undefined } })
            : apply({ filter: { creator: value } });
    };

    return {
        label: intl.formatMessage(messages.labelsFiltersCreator),
        type: conditionalFilterType.checkbox,
        filterValues: {
            onChange: (event, value) => {
                filterByCreator(value);
            },
            items: items?.filter(item => item !== null).map(item => ({ value: item, label: item })) ?? [],
            value: !currentFilter.creator || Array.isArray(currentFilter.creator)
                ? currentFilter.creator
                : [currentFilter.creator],
            placeholder: intl.formatMessage(messages.labelsFiltersCreatorPlaceholder)
        }
    };
};

export default creatorFilter;
