import { storeListDefaults } from '../../Utilities/constants';
import {
    addOrRemoveItemFromSet,
    changeListParams
} from '../../Utilities/Helpers';
import * as ActionTypes from '../ActionTypes';

export const AffectedSystemsStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_AFFECTED_SYSTEMS + '_PENDING':
            newState.isLoading = true;
            return newState;

        case 'SELECT_ENTITY': {
            const selectedUpdated = addOrRemoveItemFromSet(
                newState.selectedRows,
                [{ rowId: action.payload.id, value: action.payload.selected }]
            );
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
            newState.isLoading = false;
            return newState;

        case ActionTypes.CLEAR_AFFECTED_SYSTEMS:
            newState.queryParams = {
                ...newState.queryParams,
                ...action.payload
            };
            return newState;

        default:
            return state;
    }
};
