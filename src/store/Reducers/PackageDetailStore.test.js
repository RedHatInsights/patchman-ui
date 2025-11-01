import { fetchPending, fetchRejected } from './HelperReducers';
import { PackageDetailStore } from './PackageDetailStore';
import { FETCH_PACKAGE_DETAILS } from '../ActionTypes';
jest.mock('./HelperReducers', () => ({
  ...jest.requireActual('./HelperReducers'),
  fetchFulfilled: jest.fn(),
  fetchPending: jest.fn(),
  fetchRejected: jest.fn(),
}));

const state = { testObj: 'testVal' };
const actionFulfilled = FETCH_PACKAGE_DETAILS + '_FULFILLED';
const actionRejected = FETCH_PACKAGE_DETAILS + '_REJECTED';
const actionPending = FETCH_PACKAGE_DETAILS + '_PENDING';

describe('PackageListStore', () => {
  it('should start fetching package list', () => {
    const res = PackageDetailStore(state, { type: actionFulfilled, payload: { data: 'testData' } });
    expect(res).toEqual({
      ...state,
      status: { isLoading: false },
      data: 'testData',
      error: {},
    });
  });

  it('should fetch package detail', () => {
    PackageDetailStore(state, { type: actionPending, payload: { search: 'testSearch' } });
    expect(fetchPending).toHaveBeenCalledWith(state);
  });
  it('should handle rejected call', () => {
    PackageDetailStore(state, { type: actionRejected, payload: { search: 'testSearch' } });
    expect(fetchRejected).toHaveBeenCalledWith(state, {
      type: actionRejected,
      payload: { search: 'testSearch' },
    });
  });
  it('should handle clear call', () => {
    const res = PackageDetailStore(state, {
      type: 'CLEAR_PACKAGE_DETAILS',
      payload: { search: 'testSearch' },
    });
    expect(res).toEqual({
      data: {
        attributes: {},
      },
      status: {
        isLoading: true,
      },
    });
  });

  // it('should change params', () => {
  //     PackageDetailStore(state, { type: 'CHANGE_PACKAGES_LIST_PARAMS', payload: { search: 'testSearch' } });
  //     expect(changeFilters).toHaveBeenCalledWith(state,
  //         { type: 'CHANGE_PACKAGES_LIST_PARAMS', payload: { search: 'testSearch' } });
  // });

  // it('should apply global filter', () => {
  //     PackagesListStore(state, { type: 'TRIGGER_GLOBAL_FILTER', payload: { search: 'testSearch' } });
  //     expect(changeFilters).toHaveBeenCalledWith(state,
  //         { type: 'TRIGGER_GLOBAL_FILTER', payload: { search: 'testSearch' } });
  // });
});
