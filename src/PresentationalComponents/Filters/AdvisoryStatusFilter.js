import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { advisoryStatuses } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const advisoryStatusFilter = (apply, currentFilter = {}) => {
  const filterByStatus = (value) => {
    value.length === 0
      ? apply({ filter: { status: undefined } })
      : apply({ filter: { status: value } });
  };

  return {
    label: intl.formatMessage(messages.labelsFiltersStatus),
    type: conditionalFilterType.checkbox,
    filterValues: {
      onChange: (event, value) => {
        filterByStatus(value);
      },
      items: advisoryStatuses,
      value:
        !currentFilter.status || Array.isArray(currentFilter.status)
          ? currentFilter.status
          : [currentFilter.status],
      placeholder: intl.formatMessage(messages.labelsColumnsStatusPlaceholder),
    },
  };
};

export default advisoryStatusFilter;
