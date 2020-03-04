import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED, storeListDefaults } from '../../Utilities/constants';
import { changeListParams, getNewSelectedItems } from '../../Utilities/Helpers';
import * as ActionTypes from '../ActionTypes';

export const AffectedSystemsStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_AFFECTED_SYSTEMS + '_PENDING':
            newState.status = STATUS_LOADING;
            newState.error = {};
            return newState;

        case ActionTypes.FETCH_AFFECTED_SYSTEMS + '_REJECTED':
            newState.status = STATUS_REJECTED;
            newState.error = action.payload;
            return newState;

        case 'SELECT_ENTITY': {
            const selectedUpdated = getNewSelectedItems(action.payload, newState.selectedRows);
            newState = { ...newState, selectedRows: selectedUpdated };
            return newState;
        }

        case ActionTypes.CHANGE_AFFECTED_SYSTEMS_PARAMS:
            return {
                ...state,
                queryParams: changeListParams(state.queryParams, action.payload)
            };

        case ActionTypes.FETCH_AFFECTED_SYSTEMS + '_FULFILLED':
            newState.rows = action.payload.data;
            newState.metadata = action.payload.meta;
            newState.status = STATUS_RESOLVED;
            newState.error = {};
            return newState;

        case ActionTypes.CLEAR_AFFECTED_SYSTEMS:
            return storeListDefaults;

        default:
            return state;
    }
};
