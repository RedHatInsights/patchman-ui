/* eslint-disable no-unused-vars */
import { AdvisorySystemsStore, initialState } from './AdvisorySystemsStore';
import { SystemsStore } from './SystemsStore';
import { PackageSystemsStore } from './PackageSystemsStore';
import { systemRows, systemsStoreState } from '../../Utilities/RawDataForTesting';

const state = { ...initialState, loaded: true, columns: [{ key: 'testCol' }], rows: systemRows };

/* eslint-disable */
describe('InventoryEntitiesReducer tests', () => {
  it('should change AdvisorySystemsStore nicely', () => {
    const res = AdvisorySystemsStore(state, {
      type: 'CHANGE_AFFECTED_SYSTEMS_PARAMS',
      payload: { search: 'testSearch' },
    });
    expect(res).toEqual(systemsStoreState);
  });

  it('should change SystemsStore nicely', () => {
    const res = SystemsStore(state, {
      type: 'CHANGE_SYSTEMS_PARAMS',
      payload: { search: 'testSearch' },
    });
    expect(res).toEqual(systemsStoreState);
  });

  it('should change PackageSystemsStore nicely', () => {
    const res = PackageSystemsStore(state, {
      type: 'CHANGE_PACKAGE_SYSTEMS_PARAMS',
      payload: { search: 'testSearch' },
    });
    expect(res).toEqual(systemsStoreState);
  });

  it('should change AdvisorySystemsStore on global filter', () => {
    const res = AdvisorySystemsStore(state, {
      type: 'TRIGGER_GLOBAL_FILTER',
      payload: { search: 'testSearch' },
    });
    expect(res).toEqual(systemsStoreState);
  });

  it('should change SystemsStore on global filter', () => {
    const res = SystemsStore(state, {
      type: 'TRIGGER_GLOBAL_FILTER',
      payload: { search: 'testSearch' },
    });
    expect(res).toEqual(systemsStoreState);
  });

  it('should change PackageSystemsStore on global filter', () => {
    const res = PackageSystemsStore(state, {
      type: 'TRIGGER_GLOBAL_FILTER',
      payload: { search: 'testSearch' },
    });
    expect(res).toEqual(systemsStoreState);
  });

  it('should clear AdvisorySystemsStore nicely', () => {
    const res = AdvisorySystemsStore(state, {
      type: 'CLEAR_ADVISORY_SYSTEMS_REDUCER',
      payload: {},
    });
    expect(res).toEqual(initialState);
  });

  it('should clear PackageSystemsStore nicely', () => {
    const res = PackageSystemsStore(state, { type: 'CLEAR_PACKAGE_SYSTEMS_REDUCER', payload: {} });
    expect(res).toEqual(initialState);
  });

  it('should change SystemsStore metadata on CHANGE_SYSTEMS_METADATA', () => {
    const res = SystemsStore(state, {
      type: 'CHANGE_SYSTEMS_METADATA',
      payload: { metadata: 'testMetadata' },
    });
    expect(res).toEqual({ ...state, metadata: { metadata: 'testMetadata' } });
  });
});
/* eslint-enable */
