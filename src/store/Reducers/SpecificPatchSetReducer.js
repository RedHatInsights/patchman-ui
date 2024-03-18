import * as ActionTypes from '../ActionTypes';
import {
    fetchPending,
    fetchRejected
} from './HelperReducers';

export const initialState = {
    patchSet: {
        config: {}
    },
    assignedSystems: [],
    status: {},
    error: {}
};

export const SpecificPatchSetReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_PATCH_SET + '_FULFILLED': {
            const { attributes: { config, name, description }, id } = action.payload?.data || { config: {} };

            return {
                ...state,
                patchSet: { name, description, config: config || {}, id },
                status: { code: action.payload.status, isLoading: false, hasError: false }
            };
        }

        case ActionTypes.FETCH_PATCH_SET + '_PENDING':
            return fetchPending(state);

        case ActionTypes.FETCH_PATCH_SET + '_REJECTED':
            return fetchRejected(state, action);

        case ActionTypes.CLEAR_PATCH_SET:
            return initialState;

        default:
            return state;
    }
};
