import { storeListDefaults } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import {
    changeFilters,
    selectRows,
    fetchPending,
    fetchRejected,
    fetchFulfilled
} from './HelperReducers';

let stateInit = { queryParams: { filter: { updatable: 'true' } } };
export const SystemPackageListStore = (state = { ...storeListDefaults, ...stateInit }, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_APPLICABLE_SYSTEM_PACKAGES + '_FULFILLED':
            return fetchFulfilled(newState, action);

        case ActionTypes.FETCH_APPLICABLE_SYSTEM_PACKAGES + '_PENDING':
            return fetchPending(newState);

        case ActionTypes.FETCH_APPLICABLE_SYSTEM_PACKAGES + '_REJECTED':
            return fetchRejected(newState, action);

        case ActionTypes.CHANGE_SYSTEM_PACKAGES_LIST_PARAMS:
            return changeFilters(newState, action);

        case ActionTypes.SELECT_SYSTEM_PACKAGES_ROW:
            return selectRows(newState, action);

        case ActionTypes.CLEAR_SYSTEM_PACKAGES:
            return storeListDefaults;

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        default:
            return state;
    }
};
