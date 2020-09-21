import { storeListDefaults } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import {
    changeFilters,
    selectRows,
    fetchPending,
    fetchRejected,
    fetchFulfilled
} from './HelperReducers';

export const AffectedSystemsStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_AFFECTED_SYSTEMS + '_PENDING':
            return fetchPending(newState);

        case ActionTypes.FETCH_AFFECTED_SYSTEMS + '_REJECTED':
            return fetchRejected(newState, action);

        case 'SELECT_ENTITY':
            return selectRows(newState, action);

        case ActionTypes.CHANGE_AFFECTED_SYSTEMS_PARAMS:
            return changeFilters(newState, action);

        case ActionTypes.FETCH_AFFECTED_SYSTEMS + '_FULFILLED':
            return fetchFulfilled(newState, action);

        case ActionTypes.CLEAR_AFFECTED_SYSTEMS:
            return storeListDefaults;

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        default:
            return state;
    }
};
