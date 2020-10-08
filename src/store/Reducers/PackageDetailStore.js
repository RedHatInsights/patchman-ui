import { STATUS_LOADING, STATUS_RESOLVED } from '../../Utilities/constants';
import { CLEAR_PACKAGE_DETAILS, FETCH_PACKAGE_DETAILS } from '../ActionTypes';
import { fetchPending, fetchRejected } from './HelperReducers';

export let initialState = {
    data: { attributes: {} },
    status: STATUS_LOADING
};

// Reducer
export const PackageDetailStore = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case FETCH_PACKAGE_DETAILS + '_FULFILLED':
            return {
                ...state,
                status: STATUS_RESOLVED,
                data: action.payload.data,
                error: {}
            };

        case FETCH_PACKAGE_DETAILS + '_PENDING':
            return fetchPending(newState);

        case FETCH_PACKAGE_DETAILS + '_REJECTED':
            return fetchRejected(newState, action);

        case CLEAR_PACKAGE_DETAILS:
            return initialState;

        default:
            return state;
    }
};
