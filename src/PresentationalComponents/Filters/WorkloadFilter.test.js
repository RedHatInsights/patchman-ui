import systemsWorkloadFilter from './WorkloadFilter';
import { workloadOptions } from '../../Utilities/constants';

const apply = jest.fn();

describe('WorkloadFilter', () => {
  it('should return correct label and type', () => {
    const response = systemsWorkloadFilter(apply, {});
    expect(response.label).toEqual('Workload');
    expect(response.type).toEqual('checkbox');
  });

  it('should include all workload options', () => {
    const response = systemsWorkloadFilter(apply, {});
    expect(response.filterValues.items).toEqual(workloadOptions);
  });

  it('should use current workload selection as value', () => {
    const response = systemsWorkloadFilter(apply, { workloads: ['sap', 'ansible'] });
    expect(response.filterValues.value).toEqual(['sap', 'ansible']);
  });

  it('should default value to empty array when no workloads selected', () => {
    const response = systemsWorkloadFilter(apply, {});
    expect(response.filterValues.value).toEqual([]);
  });

  it('should default value to empty array when filter is undefined', () => {
    const response = systemsWorkloadFilter(apply);
    expect(response.filterValues.value).toEqual([]);
  });

  it('should call apply with selected workloads on change', () => {
    const response = systemsWorkloadFilter(apply, {});
    response.filterValues.onChange('event', ['sap', 'rhel_ai']);
    expect(apply).toHaveBeenCalledWith({ filter: { workloads: ['sap', 'rhel_ai'] } });
  });
});
