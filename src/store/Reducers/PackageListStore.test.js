import { changeFilters, fetchFulfilled, fetchPending, fetchRejected } from './HelperReducers';
import { PackagesListStore } from './PackagesListStore';
import { FETCH_PACKAGES_LIST } from '../ActionTypes';
jest.mock('./HelperReducers', () => ({
  ...jest.requireActual('./HelperReducers'),
  changeFilters: jest.fn(),
  fetchFulfilled: jest.fn(),
  fetchPending: jest.fn(),
  fetchRejected: jest.fn(),
}));

const state = { testObj: 'testVal' };
const actionFulfilled = FETCH_PACKAGES_LIST + '_FULFILLED';
const actionRejected = FETCH_PACKAGES_LIST + '_REJECTED';
const actionPending = FETCH_PACKAGES_LIST + '_PENDING';

describe('PackageListStore', () => {
  it('should start fetching package list', () => {
    PackagesListStore(state, { type: actionFulfilled, payload: { search: 'testSearch' } });
    expect(fetchFulfilled).toHaveBeenCalledWith(state, {
      type: actionFulfilled,
      payload: { search: 'testSearch' },
    });
  });
  it('should fetch package list', () => {
    PackagesListStore(state, { type: actionPending, payload: { search: 'testSearch' } });
    expect(fetchPending).toHaveBeenCalledWith(state);
  });
  it('should handle rejected call', () => {
    PackagesListStore(state, { type: actionRejected, payload: { search: 'testSearch' } });
    expect(fetchRejected).toHaveBeenCalledWith(state, {
      type: actionRejected,
      payload: { search: 'testSearch' },
    });
  });

  it('should change params', () => {
    PackagesListStore(state, {
      type: 'CHANGE_PACKAGES_LIST_PARAMS',
      payload: { search: 'testSearch' },
    });
    expect(changeFilters).toHaveBeenCalledWith(state, {
      type: 'CHANGE_PACKAGES_LIST_PARAMS',
      payload: { search: 'testSearch' },
    });
  });

  it('should apply global filter', () => {
    PackagesListStore(state, { type: 'TRIGGER_GLOBAL_FILTER', payload: { search: 'testSearch' } });
    expect(changeFilters).toHaveBeenCalledWith(state, {
      type: 'TRIGGER_GLOBAL_FILTER',
      payload: { search: 'testSearch' },
    });
  });
});
