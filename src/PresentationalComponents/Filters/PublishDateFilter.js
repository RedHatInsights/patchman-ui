import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';
import { publicDateOptions } from '../../Utilities/constants';

const publishDateFilter = (apply, currentFilter = {}) => {
    let { public_date: currentValue } = currentFilter;

    // Empty string value is not supported by PF Radio at the moment
    if (currentValue === '' || !currentValue) {
        currentValue = '0';
    }

    const filterByPublicDate = value => {
        apply({ filter: { public_date: (value !== '0' && value) || '' } });
    };

    return {
        label: 'Publish date',
        type: conditionalFilterType.radio,
        filterValues: {
            onChange: (event, value) => {
                filterByPublicDate(value);
            },
            items: publicDateOptions,
            value: currentValue
        }
    };
};

export default publishDateFilter;
