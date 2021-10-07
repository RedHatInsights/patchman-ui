import osVersionFilter from './OsVersionFilter';

const apply = jest.fn();
const currentFilter = { os: 'filter' };

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn().mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([4, () => { }])
    .mockReturnValueOnce([false, () => { }]).mockReturnValueOnce([8, () => { }])
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
});

