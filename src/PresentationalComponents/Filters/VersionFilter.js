import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const VersionFilter = (apply, filter = {}, packageVersions) => {
  const current = Array.isArray(filter?.installed_evra)
    ? filter.installed_evra.map(String)
    : filter.installed_evra
      ? String(filter.installed_evra).split(',').filter(Boolean)
      : [];

  const items =
    packageVersions && packageVersions.data
      ? packageVersions.data.sort().map((version) => ({ value: version.evra, label: version.evra }))
      : [
          {
            value: intl.formatMessage(messages.textNoVersionAvailable),
            label: intl.formatMessage(messages.textNoVersionAvailable),
            disabled: true,
          },
        ];

  return {
    label: intl.formatMessage(messages.labelsFiltersPackageVersionTitle),
    type: conditionalFilterType.checkbox,
    filterValues: {
      items,
      onChange: (_event, value) => {
        const arr = Array.isArray(value) ? value : [value];
        const cleaned = arr.filter(
          (v) => v && v !== intl.formatMessage(messages.textNoVersionAvailable),
        );
        apply({ filter: { installed_evra: cleaned.length ? cleaned.join(',') : undefined } });
      },
      value: current,
      placeholder: intl.formatMessage(messages.labelsFiltersPackageVersionPlaceholder),
    },
  };
};

export default VersionFilter;
