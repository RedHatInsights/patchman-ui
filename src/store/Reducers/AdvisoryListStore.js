import * as ActionTypes from '../ActionTypes';

export const initialState = {
    rows: []
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
        default:
            return state;
    }
};
