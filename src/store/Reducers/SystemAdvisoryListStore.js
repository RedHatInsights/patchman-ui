import { storeListDefaults } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import {
    changeFilters,
    selectRows,
    fetchPending,
    fetchRejected,
    fetchFulfilled,
    expandRows
} from './HelperReducers';

export const SystemAdvisoryListStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_FULFILLED':
            return fetchFulfilled(newState, action);

        case ActionTypes.FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_PENDING':
            return fetchPending(newState);

        case ActionTypes.FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_REJECTED':
            return fetchRejected(newState, action);

        case ActionTypes.CHANGE_SYSTEM_ADVISORY_LIST_PARAMS:
            return changeFilters(newState, action);

        case ActionTypes.EXPAND_SYSTEM_ADVISORY_ROW:
            return expandRows(newState, action);

        case ActionTypes.SELECT_SYSTEM_ADVISORY_ROW:
            return selectRows(newState, action);

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        default:
            return state;
    }
};
