import { STATUS_LOADING, STATUS_RESOLVED } from '../../Utilities/constants';
import { CLEAR_ADVISORY_DETAILS, FETCH_ADVISORY_DETAILS } from '../ActionTypes';

let initialState = {
    data: { attributes: {} },
    status: STATUS_LOADING
};

// Reducer
export const AdvisoryDetailStore = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ADVISORY_DETAILS + '_FULFILLED':
            return {
                ...state,
                status: STATUS_RESOLVED,
                data: action.payload.data
            };
        case FETCH_ADVISORY_DETAILS + '_PENDING':
            return {
                ...state,
                status: STATUS_LOADING
            };
        case CLEAR_ADVISORY_DETAILS:
            return initialState;

        default:
            return state;
    }
};
