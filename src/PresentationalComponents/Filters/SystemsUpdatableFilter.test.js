import systemsUpdatableFilter from './SystemsUpdatableFilter';

const apply = jest.fn();
const currentFilter = { packages_updatable: 'filter' };

describe('SystemsUpdatableFilter', () => {
  it('Should set currentValue to zero and init', () => {
    const response = systemsUpdatableFilter(apply, currentFilter);
    expect(response.filterValues.value).toEqual('filter');
    expect(response.label).toEqual('Patch status');
    expect(response.type).toEqual('singleSelect');
  });

  it('Should call apply with a test value', () => {
    const response = systemsUpdatableFilter(apply, currentFilter);
    response.filterValues.onChange('event', 'testValue');
    expect(apply).toHaveBeenCalledWith({ filter: { packages_updatable: 'testValue' } });
  });

  it('Should call apply with empty string ', () => {
    const response = systemsUpdatableFilter(apply);
    response.filterValues.onChange();
    expect(apply).toHaveBeenCalledWith({ filter: { packages_updatable: 'testValue' } });
  });
});
