import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED, storeListDefaults } from '../../Utilities/constants';
import { addOrRemoveItemFromSet, changeListParams, getNewSelectedItems } from '../../Utilities/Helpers';
import * as ActionTypes from '../ActionTypes';

export const AdvisoryListStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_FULFILLED': {
            newState.rows = action.payload.data;
            newState.metadata = action.payload.meta;
            newState.error = {};
            newState.status = STATUS_RESOLVED;
            return newState;
        }

        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_PENDING':
            newState.error = {};
            newState.status = STATUS_LOADING;
            return newState;

        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_REJECTED':
            newState.status = STATUS_REJECTED;
            newState.error = action.payload;
            return newState;

        case ActionTypes.CHANGE_ADVISORY_LIST_PARAMS:
            newState.queryParams = changeListParams(
                newState.queryParams,
                action.payload
            );

            return newState;

        case ActionTypes.EXPAND_ADVISORY_ROW: {
            const expandedUpdated = addOrRemoveItemFromSet(
                newState.expandedRows,
                action.payload
            );
            newState = { ...newState, expandedRows: expandedUpdated };
            return newState;
        }

        case ActionTypes.SELECT_ADVISORY_ROW: {
            const selectedUpdated = getNewSelectedItems(action.payload, newState.selectedRows);
            newState = { ...newState, selectedRows: selectedUpdated };
            return newState;
        }

        default:
            return state;
    }
};
