import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const VersionFilter = (apply, filter = {}, packageVersions) => {
  const current = Array.isArray(filter?.installed_evra)
    ? filter.installed_evra.map(String)
    : filter.installed_evra
      ? String(filter.installed_evra).split(',').filter(Boolean)
      : [];

  let menuType = conditionalFilterType.singleSelect;
  let items = [
    {
      value: intl.formatMessage(messages.textNoVersionAvailable),
      label: intl.formatMessage(messages.textNoVersionAvailable),
      isDisabled: true,
    },
  ];
  let onChange = undefined;

  if (packageVersions && packageVersions.data) {
    menuType = conditionalFilterType.checkbox;
    items = packageVersions.data
      .sort()
      .map((version) => ({ value: version.evra, label: version.evra }));
    onChange = (_event, value) => {
      const arr = Array.isArray(value) ? value : [value];
      apply({ filter: { installed_evra: arr.length ? arr.join(',') : undefined } });
    };
  }

  return {
    label: intl.formatMessage(messages.labelsFiltersPackageVersionTitle),
    type: menuType,
    filterValues: {
      items,
      onChange,
      value: current,
      placeholder: intl.formatMessage(messages.labelsFiltersPackageVersionPlaceholder),
    },
  };
};

export default VersionFilter;
