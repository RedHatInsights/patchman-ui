import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { publicDateOptions } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const publishDateFilter = (apply, currentFilter = {}) => {
    let { public_date: currentValue } = currentFilter;

    const filterByPublicDate = value => {
        apply({ filter: { public_date: value === 'all' ? '' : value } });
    };

    return {
        label: intl.formatMessage(messages.labelsFiltersPublishDate),
        type: conditionalFilterType.singleSelect,
        filterValues: {
            onChange: (event, value) => {
                filterByPublicDate(value);
            },
            items: publicDateOptions,
            value: currentValue ?? 'all',
            placeholder: intl.formatMessage(messages.labelsFiltersPublishDatePlaceholder)
        }
    };
};

export default publishDateFilter;
