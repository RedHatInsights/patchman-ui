import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import React from 'react';
import { rebootRequired } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const rebootFilter = (apply, currentFilter = {}) => {
  let { reboot_required: currentValue } = currentFilter;

  const rebootMap = React.useMemo(
    () =>
      rebootRequired.map(({ value, label }) => ({
        label,
        value: value.toString(),
      })),
    [],
  );

  const currentValueStringType =
    currentValue &&
    ((Array.isArray(currentValue) && currentValue.map((value) => value.toString())) || [
      currentValue.toString(),
    ]);

  const filterByReboot = (value) => {
    apply({ filter: { reboot_required: value } });
  };

  return {
    label: intl.formatMessage(messages.labelsFiltersReboot),
    type: conditionalFilterType.checkbox,
    filterValues: {
      onChange: (event, value) => {
        filterByReboot(value);
      },
      items: rebootMap,
      value: currentValueStringType,
      placeholder: intl.formatMessage(messages.labelsFiltersRebootPlaceholder),
    },
  };
};

export default rebootFilter;
