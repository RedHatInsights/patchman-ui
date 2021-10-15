import osVersionFilter from './OsVersionFilter';
import { osFilterTypes } from '../../Utilities/constants';

const apply = jest.fn();
const currentFilter = { os: '' };

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn()
    .mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([4, () => { }])
    .mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([8, () => { }])
    .mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([4, () => { }])
    .mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([4, () => { }])
    .mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([4, () => { }])
}));

describe('OsVersionFilter', () => {
    it('Should set currentValue to zero and init', () => {
        const response = osVersionFilter(currentFilter, apply);
        expect(response.value).toEqual('custom');
        expect(response.label).toEqual('Operating system');
        expect(response.type).toEqual('custom');
        expect(response.filterValues.children.props.loadingVariant).toBeDefined();
    });

    it('Should call apply with a date', () => {
        const response = osVersionFilter(currentFilter, apply);
        response.filterValues.children.props.onSelect('event', 'testValue');
        expect(apply).toHaveBeenCalledWith({ filter: { os: 'testValue' } });
    });

    it('should call apply when onSelect is fired and append previously selected versions into new selection', () => {
        const response = osVersionFilter({ os: osFilterTypes[0].value }, apply);
        response.filterValues.children.props.onSelect(null, osFilterTypes[1].value);

        expect(apply).toHaveBeenCalledWith({ filter: { os: `${osFilterTypes[0].value},${osFilterTypes[1].value}` } });
    });

    it('should send undefined when previously selected version and new version are the same', () => {
        const response = osVersionFilter({ os: osFilterTypes[0].value }, apply);
        response.filterValues.children.props.onSelect(null, osFilterTypes[0].value);

        expect(apply).toHaveBeenCalledWith({ filter: { os: undefined } });
    });

    it('should call apply when onSelect is fired and deselect only current version', () => {
        const response = osVersionFilter({ os: `${osFilterTypes[0].value},${osFilterTypes[1].value}` }, apply);
        response.filterValues.children.props.onSelect(null, osFilterTypes[0].value);

        expect(apply).toHaveBeenCalledWith({
            filter:
                { os: `${osFilterTypes[1].value}` }
        });
    });

});

