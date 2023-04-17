import advisoryStatusFilter from './AdvisoryStatusFilter';

const apply = jest.fn();
const currentFilter = { status: 'Installable' };

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useMemo: jest.fn(callback => callback())
}));

describe('StatusFilter', () => {
    it('Should set currentValue to zero and init', () => {
        const response = advisoryStatusFilter(apply, currentFilter);
        expect(response.filterValues.value).toEqual('Installable');
        expect(response.label).toEqual('Status');
        expect(response.type).toEqual('checkbox');
    });

    it('Should call apply with a date', () => {
        const response = advisoryStatusFilter(apply, currentFilter);
        response.filterValues.onChange('event', 'Applicable');
        expect(apply).toHaveBeenCalledWith({ filter: { status: 'Applicable' } });
    });

    it('Should call apply with empty string ', () => {
        const response = advisoryStatusFilter(apply);
        response.filterValues.onChange();
        expect(apply).toHaveBeenCalledWith({ filter: { status: 'Applicable' } });
    });
});
