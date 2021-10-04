import packageListStatusFilter from './PackagesListStatusFilter';

const apply = jest.fn();
const currentFilter = { systems_updatable: 'filter' };

describe('PackageListStatusFilter', () => {
    it('Should set currentValue to zero and init', () => {
        const response = packageListStatusFilter(apply, currentFilter);
        expect(response.filterValues.value).toEqual('filter');
        expect(response.label).toEqual('Status');
        expect(response.type).toEqual('checkbox');
    });

    it('Should call apply with a date', () => {
        const response = packageListStatusFilter(apply, currentFilter);
        response.filterValues.onChange('event', 'testValue');
        expect(apply).toHaveBeenCalledWith({ filter: { systems_updatable: 'testValue' } });
    });

    it('Should call apply with empty string ', () => {
        const response = packageListStatusFilter(apply);
        response.filterValues.onChange();
        expect(apply).toHaveBeenCalledWith({ filter: { systems_updatable: 'testValue' } });
    });
});

