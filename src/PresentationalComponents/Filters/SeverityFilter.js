import React from 'react';
import { advisorySeverities } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

// Backend: bare `filter[severity]=null` for "None" only; mixed selection uses `in:1,2,null`.
// Keep UI state as string arrays for PatternFly checkboxes, but collapse `[null]` to bare `null`.

const severityFilter = (apply, currentFilter = {}) => {
  const advisorySeverityMap = React.useMemo(
    () =>
      advisorySeverities.map(({ value, label }) => ({
        label,
        value: String(value),
      })),
    [],
  );

  const currentSeverityValue = (() => {
    const { severity } = currentFilter ?? {};

    if (severity === undefined) {
      return undefined;
    }

    // Treat "None" as an array too (for consistency in the UI), even though the API requires it to be `null`
    if (severity === null) {
      return ['null'];
    }

    const severityArray = Array.isArray(severity) ? severity : [severity];

    return severityArray.map((value) => String(value));
  })();

  const filterBySeverity = (severityStrings = []) => {
    if (severityStrings.length === 0) {
      apply({ filter: { severity: undefined } });
      return;
    }

    // Scalar `null` for "None" alone; otherwise an array that may include `null` (encoded as in:1,2,null)
    const mappedSeverities = severityStrings.map((item) =>
      item === 'null' ? null : parseInt(item, 10),
    );

    if (mappedSeverities.length === 1 && mappedSeverities[0] === null) {
      apply({ filter: { severity: null } });
      return;
    }

    apply({ filter: { severity: mappedSeverities } });
  };

  return {
    label: intl.formatMessage(messages.labelsFiltersSeverity),
    type: conditionalFilterType.checkbox,
    filterValues: {
      onChange: (event, value) => {
        filterBySeverity(value);
      },
      items: advisorySeverityMap,
      value: currentSeverityValue,
      placeholder: intl.formatMessage(messages.labelsFiltersSeverityPlaceholder),
    },
  };
};

export default severityFilter;
