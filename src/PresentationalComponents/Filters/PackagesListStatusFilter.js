import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { packagesListUpdatableTypes } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const packagesListStatusFilter = (apply, currentFilter = {}) => {

    let { systems_updatable: currentValue } = currentFilter;

    const filterByType = value => {
        apply({ filter: { systems_updatable: value } });
    };

    return {
        label: intl.formatMessage(messages.labelsFiltersStatus),
        type: conditionalFilterType.checkbox,
        filterValues: {
            onChange: (event, value) => {
                filterByType(value);
            },
            items: packagesListUpdatableTypes,
            value: currentValue,
            placeholder: intl.formatMessage(messages.labelsColumnsStatusPlaceholder)
        }
    };
};

export default packagesListStatusFilter;
