import { storeListDefaults } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import {
    changeFilters,
    selectRows,
    expandRows,
    fetchPending,
    fetchRejected,
    fetchFulfilled
} from './HelperReducers';

export const AdvisoryListStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_FULFILLED':
            return fetchFulfilled(newState, action);

        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_PENDING':
            return fetchPending(newState);

        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_REJECTED':
            return fetchRejected(newState, action);

        case ActionTypes.CHANGE_ADVISORY_LIST_PARAMS:
            return changeFilters(newState, action);

        case ActionTypes.EXPAND_ADVISORY_ROW:
            return expandRows(newState, action);

        case ActionTypes.SELECT_ADVISORY_ROW:
            return selectRows(newState, action);

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        case ActionTypes.TOGGLE_ALL_SELECTED:
            newState.areAllSelected = action.payload;
            return newState;

        default:
            return state;
    }
};
