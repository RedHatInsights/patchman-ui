import { storeListDefaults } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import { changeFilters, fetchFulfilled, fetchPending, fetchRejected } from './HelperReducers';

export const PackagesListStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_PACKAGES_LIST + '_PENDING':
            return fetchPending(newState);

        case ActionTypes.FETCH_PACKAGES_LIST + '_FULFILLED':
            return fetchFulfilled(newState, action);

        case ActionTypes.FETCH_PACKAGES_LIST + '_REJECTED':
            return fetchRejected(newState, action);

        case ActionTypes.CHANGE_PACKAGES_LIST_PARAMS:
            return changeFilters(newState, action);

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        default:
            return state;
    }
};
