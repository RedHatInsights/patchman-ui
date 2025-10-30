/* eslint-disable no-unused-vars */
import versionFilter from './VersionFilter';
import { packageVersions } from '../../Utilities/RawDataForTesting';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const apply = jest.fn();
const currentFilter = { installed_evra: undefined };

describe('Version filter', () => {
  it('should initialize the filter', () => {
    const response = versionFilter(apply, currentFilter, packageVersions);
    expect(response.label).toEqual(intl.formatMessage(messages.labelsFiltersPackageVersionTitle));
    expect(response.type).toEqual('checkbox');
    expect(Array.isArray(response.filterValues.items)).toBe(true);
    expect(response.filterValues.value).toEqual([]);
    expect(response.filterValues.items).toHaveLength(packageVersions.data.length);
  });

  it('should call apply when selecting a single version', () => {
    const response = versionFilter(apply, currentFilter, packageVersions);
    response.filterValues.onChange(null, packageVersions.data[0].evra);

    expect(apply).toHaveBeenCalledWith({
      filter: { installed_evra: packageVersions.data[0].evra },
    });
  });

  it('should call apply when onChange is fired and append previously selected versions into new selection', () => {
    const existing = 'testVersions';

    const response = versionFilter(apply, { installed_evra: existing }, packageVersions);
    response.filterValues.onChange(null, [existing, packageVersions.data[0].evra]);

    expect(apply).toHaveBeenCalledWith({
      filter: { installed_evra: `${existing},${packageVersions.data[0].evra}` },
    });
  });

  it('should send installed_evra: undefined when previously selected version and new version are the same', () => {
    const response = versionFilter(
      apply,
      { installed_evra: packageVersions.data[1].evra },
      packageVersions,
    );
    response.filterValues.onChange(null, []);

    expect(apply).toHaveBeenCalledWith({ filter: { installed_evra: undefined } });
  });

  it('should call apply when onChange is fired and deselect the version', () => {
    const package1 = packageVersions.data[0].evra;
    const package2 = packageVersions.data[1].evra;

    const response = versionFilter(
      apply,
      { installed_evra: `${package1},${package2}` },
      packageVersions,
    );
    response.filterValues.onChange(null, [package1]);

    expect(apply).toHaveBeenCalledWith({ filter: { installed_evra: package1 } });
  });
});
