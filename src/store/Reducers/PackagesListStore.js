import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED, storeListDefaults } from '../../Utilities/constants';
import { changeListParams } from '../../Utilities/Helpers';
import * as ActionTypes from '../ActionTypes';

export const PackagesListStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_PACKAGES_LIST + '_PENDING':
            newState.status = STATUS_LOADING;
            newState.error = {};
            return newState;

        case ActionTypes.FETCH_PACKAGES_LIST + '_FULFILLED':
            newState.rows = action.payload.data;
            newState.metadata = action.payload.meta;
            newState.status = STATUS_RESOLVED;
            newState.error = {};
            return newState;

        case ActionTypes.FETCH_PACKAGES_LIST + '_REJECTED':
            newState.status = STATUS_REJECTED;
            newState.error = action.payload;
            return newState;

        case ActionTypes.CHANGE_PACKAGES_LIST_PARAMS:
            newState.queryParams = changeListParams(
                newState.queryParams,
                action.payload
            );
            return newState;

        default:
            return state;
    }
};
