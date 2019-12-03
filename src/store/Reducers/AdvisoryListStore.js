import { addOrRemoveItemFromSet } from '../../Utilities/Helpers';
import * as ActionTypes from '../ActionTypes';

export const initialState = {
    rows: [],
    expandedRows: {},
    selectedRows: {}
};

export const AdvisoryListStore = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_FULFILLED':
            newState.rows = action.payload.data;
            newState.loading = false;
            return newState;

        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_PENDING':
            newState.loading = true;
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
