import severityFilter from './SeverityFilter';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn((callback) => callback()),
}));

const currentFilterInteger = { severity: [2] };
const currentFilterEmpty = { severity: [] };

let apply;
const renderFilter = (filter = {}) => severityFilter(apply, filter);
const rehydrateFilter = (value) =>
  severityFilter(apply, value === undefined ? {} : { severity: value });

describe('SeverityFilter', () => {
  beforeEach(() => {
    apply = jest.fn();
  });

  it('returns checkbox metadata seeded from existing severities', () => {
    const response = renderFilter(currentFilterInteger);
    expect(response.filterValues.value).toEqual(['2']);
    expect(response.label).toEqual('Severity');
    expect(response.type).toEqual('checkbox');
  });

  it('converts selected integer severities into raw values before dispatch', () => {
    const response = renderFilter(currentFilterInteger);
    response.filterValues.onChange('event', ['2']);
    expect(apply).toHaveBeenCalledWith({ filter: { severity: [2] } });
    // Rehydrate with the store snapshot that would come back after dispatching `[2]`
    const rehydratedResponse = rehydrateFilter([2]);
    // ConditionalFilter checkboxes compare option ids as strings
    expect(rehydratedResponse.filterValues.value).toEqual(['2']);
  });

  it('converts the "None" selection into a null severity', () => {
    const response = renderFilter(currentFilterEmpty);
    response.filterValues.onChange('event', ['null']);
    expect(apply).toHaveBeenCalledWith({ filter: { severity: null } });
    // Rehydrate with the store snapshot that would come back after dispatching `null`
    const rehydratedResponse = rehydrateFilter(null);
    expect(rehydratedResponse.filterValues.value).toEqual(['null']);
  });

  it('dispatches undefined severity when onChange receives no payload', () => {
    const response = renderFilter(currentFilterEmpty);
    response.filterValues.onChange();
    expect(apply).toHaveBeenCalledWith({ filter: { severity: undefined } });
    const rehydratedResponse = rehydrateFilter(undefined);
    expect(rehydratedResponse.filterValues.value).toBeUndefined();
  });

  it('dispatches undefined severity when the selection is cleared explicitly', () => {
    const response = renderFilter(currentFilterEmpty);
    response.filterValues.onChange('event', []); // Clear the filter
    expect(apply).toHaveBeenCalledWith({ filter: { severity: undefined } });
    const rehydratedResponse = rehydrateFilter(undefined);
    expect(rehydratedResponse.filterValues.value).toBeUndefined();
  });
});
