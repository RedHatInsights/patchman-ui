import * as ActionTypes from '../ActionTypes';
import {
    changeFilters,
    selectRows,
    fetchPending,
    fetchRejected
} from './HelperReducers';

// Initial State. It should not include page and perPage to persist them dynamically
export const initialState = {
    rows: [],
    selectedRows: [],
    queryParams: {
        page: 1,
        perPage: 20,
        filter: {}
    },
    status: {},
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 0
    },
    error: {}
};

export const PatchSetsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_ALL_PATCH_SETS + '_FULFILLED':
            return {
                ...state,
                rows: action.payload.data.map(set => ({ ...set.attributes, id: set.id })),
                metadata: action.payload.meta || {},
                error: {},
                status: { code: action.payload.status, isLoading: false, hasError: false }
            };

        case ActionTypes.FETCH_ALL_PATCH_SETS + '_PENDING':
            return fetchPending(state);

        case ActionTypes.FETCH_ALL_PATCH_SETS + '_REJECTED':
            return fetchRejected(state, action);

        case ActionTypes.CHANGE_PATCH_SET_PARAMS:
            console.log('changepara', action);
            return changeFilters(state, action);

        case ActionTypes.SELECT_PATCH_SET_ROW:
            return selectRows(state, action);

        default:
            return state;
    }
};
