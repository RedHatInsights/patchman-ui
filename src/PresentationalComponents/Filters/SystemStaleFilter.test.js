import systemStaleFilter from './SystemStaleFilter';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useMemo: jest.fn(callback => callback())
}));

const apply = jest.fn();
const currentFilter = { stale: 'filter' };

describe('SystemStaleFilter', () => {
    it('Should set currentValue to zero and init', () => {
        const response = systemStaleFilter(apply, currentFilter);
        expect(response.filterValues.value).toEqual(['filter']);
        expect(response.label).toEqual('Status');
        expect(response.type).toEqual('checkbox');
    });

    it('Should call apply with a test value', () => {
        const response = systemStaleFilter(apply, currentFilter);
        response.filterValues.onChange('event', 'testValue');
        expect(apply).toHaveBeenCalledWith({ filter: { stale: 'testValue' } });
    });

    it('Should call apply with empty string ', () => {
        const response = systemStaleFilter(apply);
        response.filterValues.onChange();
        expect(apply).toHaveBeenCalledWith({ filter: { stale: 'testValue' } });
    });
});

