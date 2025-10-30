import publishDateFilter from './PublishDateFilter';

const apply = jest.fn();
const currentFilter = { public_date: 'filter' };

describe('PublishDateFilter', () => {
  it('Should set currentValue to "all" by default', () => {
    const response = publishDateFilter(apply);
    expect(response.filterValues.value).toEqual('all');
    expect(response.label).toEqual('Publish date');
    expect(response.type).toEqual('singleSelect');
  });

  it('Should call apply with a date', () => {
    const response = publishDateFilter(apply, currentFilter);
    response.filterValues.onChange('event', 'testValue');
    expect(apply).toHaveBeenCalledWith({ filter: { public_date: 'testValue' } });
  });

  it('Should call apply with undefined', () => {
    const response = publishDateFilter(apply);
    response.filterValues.onChange();
    expect(apply).toHaveBeenCalledWith({ filter: { public_date: undefined } });
  });
});
