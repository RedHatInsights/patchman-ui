import { addOrRemoveItemFromSet } from '../../Utilities/Helpers';
import * as ActionTypes from '../ActionTypes';

export const initialState = {
    rows: [],
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 0
    },
    expandedRows: {},
    selectedRows: {},
    queryParams: {}
};

export const SystemAdvisoryListStore = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_FULFILLED': {
            newState.rows = action.payload.data;
            newState.metadata = action.payload.meta;
            newState.isLoading = false;
            return newState;
        }

        case ActionTypes.FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_PENDING':
            newState.isLoading = true;
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
                action.payload
            );
            newState = { ...newState, expandedRows: expandedUpdated };
            return newState;
        }

        case ActionTypes.SELECT_SYSTEM_ADVISORY_ROW: {
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
