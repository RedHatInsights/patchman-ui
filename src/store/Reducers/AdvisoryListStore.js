import { STATUS_LOADING, STATUS_RESOLVED, storeListDefaults } from '../../Utilities/constants';
import { addOrRemoveItemFromSet, changeListParams } from '../../Utilities/Helpers';
import * as ActionTypes from '../ActionTypes';

export const AdvisoryListStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_FULFILLED': {
            newState.rows = action.payload.data;
            newState.metadata = action.payload.meta;
            newState.status = STATUS_RESOLVED;
            return newState;
        }

        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_PENDING':
            newState.status = STATUS_LOADING;
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
            const selectedUpdated = addOrRemoveItemFromSet(
                newState.selectedRows,
                action.payload
            );
            newState = { ...newState, selectedRows: selectedUpdated };
            return newState;
        }

        default:
            return state;
    }
};
