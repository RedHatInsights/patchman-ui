import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED, storeListDefaults } from '../../Utilities/constants';
import { changeListParams, getNewSelectedItems } from '../../Utilities/Helpers';
import * as ActionTypes from '../ActionTypes';

export const SystemPackageListStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_APPLICABLE_SYSTEM_PACKAGES + '_FULFILLED': {
            newState.rows = action.payload.data;
            newState.metadata = action.payload.meta;
            newState.status = STATUS_RESOLVED;
            return newState;
        }

        case ActionTypes.FETCH_APPLICABLE_SYSTEM_PACKAGES + '_PENDING':
            newState.status = STATUS_LOADING;
            return newState;

        case ActionTypes.FETCH_APPLICABLE_SYSTEM_PACKAGES + '_REJECTED':
            newState.status = STATUS_REJECTED;
            newState.error = action.payload;
            return newState;

        case ActionTypes.CHANGE_SYSTEM_PACKAGES_LIST_PARAMS:
            newState.queryParams = changeListParams(
                newState.queryParams,
                action.payload
            );
            return newState;

        case ActionTypes.SELECT_SYSTEM_PACKAGES_ROW: {
            const selectedUpdated = getNewSelectedItems(action.payload, newState.selectedRows);
            newState = { ...newState, selectedRows: selectedUpdated };
            return newState;
        }

        case ActionTypes.CLEAR_SYSTEM_PACKAGES: {
            return storeListDefaults;
        }

        default:
            return state;
    }
};
