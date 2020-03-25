import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED, storeListDefaults } from '../../Utilities/constants';
import { addOrRemoveItemFromSet, getNewSelectedItems } from '../../Utilities/Helpers';
import * as ActionTypes from '../ActionTypes';

export const SystemAdvisoryListStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_FULFILLED': {
            newState.rows = action.payload.data;
            newState.metadata = action.payload.meta;
            newState.status = STATUS_RESOLVED;
            return newState;
        }

        case ActionTypes.FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_PENDING':
            newState.status = STATUS_LOADING;
            return newState;

        case ActionTypes.FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_REJECTED':
            newState.status = STATUS_REJECTED;
            newState.error = action.payload;
            return newState;

        case ActionTypes.CHANGE_SYSTEM_ADVISORY_LIST_PARAMS:
            newState.queryParams = {
                ...newState.queryParams,
                ...action.payload
            };
            return newState;

        case ActionTypes.EXPAND_SYSTEM_ADVISORY_ROW: {
            const expandedUpdated = addOrRemoveItemFromSet(
                newState.expandedRows,
                [].concat(action.payload)
            );
            newState = { ...newState, expandedRows: expandedUpdated };
            return newState;
        }

        case ActionTypes.SELECT_SYSTEM_ADVISORY_ROW: {
            const selectedUpdated = getNewSelectedItems(action.payload, newState.selectedRows);
            newState = { ...newState, selectedRows: selectedUpdated };
            return newState;
        }

        case ActionTypes.CLEAR_SYSTEM_ADVISORIES: {
            return storeListDefaults;
        }

        default:
            return state;
    }
};
