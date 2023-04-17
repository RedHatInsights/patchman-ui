import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { advisoryStatuses } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const advisoryStatusFilter = (apply, currentFilter = {}) => {
    let { status: currentValue } = currentFilter;

    const filterByType = value => {
        apply({ filter: { status: value } });
    };

    return {
        label: intl.formatMessage(messages.labelsFiltersStatus),
        type: conditionalFilterType.checkbox,
        filterValues: {
            onChange: (event, value) => {
                filterByType(value);
            },
            items: advisoryStatuses,
            value: currentValue,
            placeholder: intl.formatMessage(messages.labelsColumnsStatusPlaceholder)
        }
    };
};

export default advisoryStatusFilter;
