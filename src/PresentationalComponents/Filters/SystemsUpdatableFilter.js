import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { packagesListUpdatableTypes } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const systemsUpdatableFilter = (apply, currentFilter = {}) => {

    let { packages_updatable: currentValue } = currentFilter;

    const filterByUpdatableSystems = value => {
        apply({ filter: { packages_updatable: value } });
    };

    return {
        label: intl.formatMessage(messages.labelsFiltersUpdatable),
        type: conditionalFilterType.radio,
        filterValues: {
            onChange: (event, value) => {
                filterByUpdatableSystems(value);
            },
            items: packagesListUpdatableTypes,
            value: currentValue,
            placeholder: intl.formatMessage(messages.labelsFiltersUpdatablePlaceholder)
        }
    };
};

export default systemsUpdatableFilter;
