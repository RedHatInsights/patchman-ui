import { storeListDefaults } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import { changeFilters, fetchPending, fetchRejected, fetchFulfilled } from './HelperReducers';

export const CvesListStore = (state = storeListDefaults, action) => {
  let newState = { ...state };
  switch (action.type) {
    case ActionTypes.FETCH_CVES_INFO + '_FULFILLED':
      return fetchFulfilled(newState, action);

    case ActionTypes.FETCH_CVES_INFO + '_PENDING':
      return fetchPending(newState);

    case ActionTypes.FETCH_CVES_INFO + '_REJECTED':
      return fetchRejected(newState, action);

    case ActionTypes.CHANGE_CVES_STORE_PARAMS:
      return changeFilters(newState, action);

    default:
      return state;
  }
};
