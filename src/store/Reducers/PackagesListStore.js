import { storeListDefaults, packagesListDefaultFilters } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import { changeFilters, fetchFulfilled, fetchPending, fetchRejected } from './HelperReducers';

const initialStore = { ...storeListDefaults,  queryParams: packagesListDefaultFilters };

export const PackagesListStore = (state = initialStore, action) => {
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
