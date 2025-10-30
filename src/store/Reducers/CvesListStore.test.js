import { changeFilters, fetchFulfilled, fetchPending, fetchRejected } from './HelperReducers';
import { CvesListStore } from './CvesListStore';
import { FETCH_CVES_INFO } from '../ActionTypes';
jest.mock('./HelperReducers', () => ({
  ...jest.requireActual('./HelperReducers'),
  changeFilters: jest.fn(),
  fetchFulfilled: jest.fn(),
  fetchPending: jest.fn(),
  fetchRejected: jest.fn(),
}));

const state = { testObj: 'testVal' };
const actionFulfilled = FETCH_CVES_INFO + '_FULFILLED';
const actionRejected = FETCH_CVES_INFO + '_REJECTED';
const actionPending = FETCH_CVES_INFO + '_PENDING';

describe('PackageListStore', () => {
  it('should start fetching package list', () => {
    CvesListStore(state, { type: actionFulfilled, payload: { search: 'testSearch' } });
    expect(fetchFulfilled).toHaveBeenCalledWith(state, {
      type: actionFulfilled,
      payload: { search: 'testSearch' },
    });
  });
  it('should fetch package list', () => {
    CvesListStore(state, { type: actionPending, payload: { search: 'testSearch' } });
    expect(fetchPending).toHaveBeenCalledWith(state);
  });
  it('should handle rejected call', () => {
    CvesListStore(state, { type: actionRejected, payload: { search: 'testSearch' } });
    expect(fetchRejected).toHaveBeenCalledWith(state, {
      type: actionRejected,
      payload: { search: 'testSearch' },
    });
  });

  it('should change params', () => {
    CvesListStore(state, { type: 'CHANGE_CVES_STORE_PARAMS', payload: { search: 'testSearch' } });
    expect(changeFilters).toHaveBeenCalledWith(state, {
      type: 'CHANGE_CVES_STORE_PARAMS',
      payload: { search: 'testSearch' },
    });
  });
});
