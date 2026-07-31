import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { workloadOptions } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const systemsWorkloadFilter = (apply, currentFilter = {}) => {
  const { workloads: currentValue } = currentFilter;

  return {
    label: intl.formatMessage(messages.labelsFiltersWorkload),
    type: conditionalFilterType.checkbox,
    filterValues: {
      onChange: (_event, value) => {
        apply({ filter: { workloads: value } });
      },
      items: workloadOptions,
      value: currentValue || [],
      placeholder: intl.formatMessage(messages.labelsFiltersWorkloadPlaceholder),
    },
  };
};

export default systemsWorkloadFilter;
