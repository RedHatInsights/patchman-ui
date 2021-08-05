import { storeListDefaults, systemPackagesDefaultFilters } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import { changeFilters, fetchFulfilled, fetchPending, fetchRejected, selectRows } from './HelperReducers';

let initializeState = { queryParams: systemPackagesDefaultFilters };

export const SystemPackageListStore = (state = { ...storeListDefaults, ...initializeState }, action) => {
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

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        default:
            return state;
    }
};
