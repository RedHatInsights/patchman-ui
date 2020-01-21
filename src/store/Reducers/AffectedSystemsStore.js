import * as ActionTypes from '../ActionTypes';

// Initial State
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
// Reducer

export const AffectedSystemsStore = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_AFFECTED_SYSTEMS + '_PENDING':
            newState.isLoading = true;
            return newState;

        case ActionTypes.FETCH_AFFECTED_SYSTEMS + '_FULFILLED':
            newState.rows = action.payload.data;
            newState.metadata = action.payload.meta;
            newState.isLoading = false;
            return newState;

        case ActionTypes.CHANGE_AFFECTED_SYSTEMS_PARAMS:
            newState.queryParams = {
                ...newState.queryParams,
                ...action.payload
            };
            return newState;

        default:
            return state;
    }
};
