import React from 'react';
import { advisorySeverities } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

// Backend note: Patch handles `filter[severity]=null` as an `IS NULL` predicate and ignores `IN (...)` lists
// that contain NULL. We keep the UI state as arrays for PatternFly (ConditionalFilter checkbox) but collapse
// `[null]` to bare `null` before dispatching so the API stays on the supported code path

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

    // Convert each string into its respective raw value before passing it to the API
    // The engine expects a scalar `null` for the "None" case and integer arrays for actual severities
    const mappedSeverities = severityStrings.map((item) =>
      item === 'null' ? null : parseInt(item, 10),
    );

    // Send a bare `null` so we use the API's `IS NULL` path instead of an unsupported `IN (NULL)` clause
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
