import { storeListDefaults } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import {
    changeFilters,
    fetchPending,
    fetchRejected,
    fetchFulfilled
} from './HelperReducers';

export const SystemsListStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_SYSTEMS + '_PENDING':
            return fetchPending(newState);

        case ActionTypes.FETCH_SYSTEMS + '_FULFILLED':
            return fetchFulfilled(newState, action);

        case ActionTypes.FETCH_SYSTEMS + '_REJECTED':
            return fetchRejected(newState, action);

        case ActionTypes.CHANGE_SYSTEMS_LIST_PARAMS:
            return changeFilters(newState, action);

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        default:
            return state;
    }
};
