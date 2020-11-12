import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/components/cjs/ConditionalFilter';
import { publicDateOptions } from '../../Utilities/constants';

const publishDateFilter = (apply, currentFilter = {}) => {
    let { public_date: currentValue } = currentFilter;

    const filterByPublicDate = value => {
        apply({ filter: { public_date: (value !== 'all' && value) || '' } });
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
