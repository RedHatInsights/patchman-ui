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

// eslint-disable-next-line
const { queryParams: _queryParams, ...storeListDefaultsModified } = storeListDefaults;

export const AdvisoryListStore = (state = storeListDefaultsModified, action) => {
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

        default:
            return state;
    }
};
