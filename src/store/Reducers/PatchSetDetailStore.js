import { CLEAR_PATCH_SET, FETCH_PATCH_SET } from '../ActionTypes';
import { fetchPending, fetchRejected } from './HelperReducers';

export let initialState = {
    data: { attributes: {} },
    status: { isLoading: true }
};

export const PatchSetDetailStore = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case FETCH_PATCH_SET + '_FULFILLED':
            return {
                ...state,
                status: { isLoading: false },
                data: action.payload.data,
                error: {}
            };

        case FETCH_PATCH_SET + '_PENDING':
            return fetchPending(newState);

        case FETCH_PATCH_SET + '_REJECTED':
            return fetchRejected(newState, action);

        case CLEAR_PATCH_SET:
            return initialState;

        default:
            return state;
    }
};
