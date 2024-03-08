import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { packagesListUpdatableTypes } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const packagesListStatusFilter = (apply, currentFilter = {}) => {

    let { systems_applicable: currentValue } = currentFilter;

    const filterByType = value => {
        apply({ filter: { systems_applicable: value } });
    };

    return {
        label: intl.formatMessage(messages.labelsFiltersUpdatable),
        type: conditionalFilterType.checkbox,
        filterValues: {
            onChange: (event, value) => {
                filterByType(value);
            },
            items: packagesListUpdatableTypes,
            value: currentValue,
            placeholder: intl.formatMessage(messages.labelsFiltersUpdatablePlaceholder)
        }
    };
};

export default packagesListStatusFilter;
