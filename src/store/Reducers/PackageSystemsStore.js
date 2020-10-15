import { storeListDefaults } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';
import { changeFilters, fetchFulfilled, fetchPending, fetchRejected, selectRows } from './HelperReducers';

export const PackageSystemsStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_PACKAGE_SYSTEMS + '_PENDING':
            return fetchPending(newState);

        case ActionTypes.FETCH_PACKAGE_SYSTEMS + '_REJECTED':
            return fetchRejected(newState, action);

        case 'SELECT_ENTITY':
            return selectRows(newState, action);

        case ActionTypes.CHANGE_PACKAGE_SYSTEMS_PARAMS:
            return changeFilters(newState, action);

        case ActionTypes.FETCH_PACKAGE_SYSTEMS + '_FULFILLED':
            return fetchFulfilled(newState, action);

        case ActionTypes.CLEAR_PACKAGE_SYSTEMS:
            return storeListDefaults;

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        default:
            return state;
    }
};
