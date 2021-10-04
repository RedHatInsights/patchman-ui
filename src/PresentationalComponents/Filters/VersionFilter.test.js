/* eslint-disable no-unused-vars */
import versionFilter from './VersionFilter';
import { packageVersions } from '../../Utilities/RawDataForTesting';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const apply = jest.fn();
const currentFilter = { installed_evra: undefined };

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn().mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([2, () => { }])
    .mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([2, () => { }])
    .mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([2, () => { }])
    .mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([2, () => { }])
    .mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([2, () => { }])
}));

describe('Version filter', () => {
    it('should initialize the filter', () => {
        const response = versionFilter(apply, currentFilter, packageVersions);

        expect(response.label).toEqual(intl.formatMessage(messages.labelsFiltersPackageVersionTitle));
        expect(response.value).toEqual('custom');
        expect(response.type).toEqual('custom');
        expect(response.filterValues.children.props.typeAheadAriaLabel).toEqual(
            intl.formatMessage(messages.labelsFiltersPackageVersionPlaceholder)
        );
        expect(response.filterValues.children.props.isOpen).toBeFalsy();
        expect(response.filterValues.children.props.children.length).toEqual(2);
    });

    it('should call apply when onSelect is fired', () => {
        const response = versionFilter(apply, currentFilter, packageVersions);
        response.filterValues.children.props.onSelect(null, packageVersions.data[0].evra);

        expect(apply).toHaveBeenCalledWith({ filter: { installed_evra: packageVersions.data[0].evra } });
    });

    it('should call apply when onSelect is fired and append previously selected versions into new selection', () => {
        const response = versionFilter(apply, { installed_evra: 'testVerions' }, packageVersions);
        response.filterValues.children.props.onSelect(null, packageVersions.data[0].evra);

        expect(apply).toHaveBeenCalledWith({ filter: { installed_evra: `testVerions,${packageVersions.data[0].evra}` } });
    });

    it('should send installed_evra: undefined when previously selected version and new version are the same', () => {
        const response = versionFilter(apply, { installed_evra: packageVersions.data[1].evra }, packageVersions);
        response.filterValues.children.props.onSelect(null, packageVersions.data[1].evra);

        expect(apply).toHaveBeenCalledWith({ filter: { installed_evra: undefined } });
    });

    it('should call apply when onSelect is fired and deselect the version', () => {
        const response = versionFilter(apply,
            { installed_evra: `${packageVersions.data[0].evra},${packageVersions.data[1].evra}` }, packageVersions);
        response.filterValues.children.props.onSelect(null, packageVersions.data[0].evra);

        expect(apply).toHaveBeenCalledWith({ filter:
            { installed_evra: `${packageVersions.data[0].evra}` }
        });
    });

});
