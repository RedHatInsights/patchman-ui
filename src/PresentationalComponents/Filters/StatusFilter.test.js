import statusFilter from './StatusFilter';

const apply = jest.fn();
const currentFilter = { updatable: 'filter' };

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useMemo: jest.fn(callback => callback())
}));

describe('StatusFilter', () => {
    it('Should set currentValue to zero and init', () => {
        const response = statusFilter(apply, currentFilter);
        expect(response.filterValues.value).toEqual('filter');
        expect(response.label).toEqual('Status');
        expect(response.type).toEqual('checkbox');
    });

    it('Should call apply with a date', () => {
        const response = statusFilter(apply, currentFilter);
        response.filterValues.onChange('event', 'testValue');
        expect(apply).toHaveBeenCalledWith({ filter: { updatable: 'testValue' } });
    });

    it('Should call apply with empty string ', () => {
        const response = statusFilter(apply);
        response.filterValues.onChange();
        expect(apply).toHaveBeenCalledWith({ filter: { updatable: 'testValue' } });
    });
});
