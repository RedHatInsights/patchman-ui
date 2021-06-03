import { storeListDefaults } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import {
    changeFilters,

    fetchFulfilled, fetchPending,
    fetchRejected,
    selectRows
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

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        case 'SELECT_ENTITY':
            return selectRows(newState, action);

        default:
            return state;
    }
};
