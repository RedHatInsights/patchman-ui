import typeFilter from './TypeFilter';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useMemo: jest.fn(callback => callback())
}));

const apply = jest.fn();
const currentFilter = { advisory_type: 'filter' };

describe('TypeFilter', () => {
    it('Should set currentValue to zero and init', () => {
        const response = typeFilter(apply, currentFilter);
        expect(response.filterValues.value).toEqual('filter');
        expect(response.label).toEqual('Type');
        expect(response.type).toEqual('checkbox');
    });

    it('Should call apply with a test value', () => {
        const response = typeFilter(apply, currentFilter);
        response.filterValues.onChange('event', 'testValue');
        expect(apply).toHaveBeenCalledWith({ filter: { advisory_type: 'testValue' } });
    });

    it('Should call apply with empty string ', () => {
        const response = typeFilter(apply);
        response.filterValues.onChange();
        expect(apply).toHaveBeenCalledWith({ filter: { advisory_type: 'testValue' } });
    });
});

