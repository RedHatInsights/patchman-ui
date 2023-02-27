import {
    CLEAR_PATCH_SET_DETAIL_SYSTEMS,
    FETCH_PATCH_SET_DETAIL_SYSTEMS,
    CHANGE_PATCH_SET_DETAIL_SYSTEMS_PARAMS
} from '../ActionTypes';
import { fetchPending, fetchRejected, changeFilters } from './HelperReducers';

export let initialState = {
    rows: [],
    selectedRows: [],
    queryParams: {
        page: 1,
        perPage: 20,
        offset: 0,
        filter: {}
    },
    status: { isLoading: true },
    metadata: {
        limit: 20,
        offset: 0,
        total_items: 0
    },
    error: {},
    data: null
};

export const PatchSetDetailSystemsStore = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case FETCH_PATCH_SET_DETAIL_SYSTEMS + '_FULFILLED':
            return {
                ...newState,
                rows: action.payload.data,
                metadata: action.payload.meta || {},
                error: {},
                status: { code: action.payload.status, isLoading: false, hasError: false }
            };

        case FETCH_PATCH_SET_DETAIL_SYSTEMS + '_PENDING':
            return fetchPending(newState);

        case FETCH_PATCH_SET_DETAIL_SYSTEMS + '_REJECTED':
            return fetchRejected(newState, action);

        case CHANGE_PATCH_SET_DETAIL_SYSTEMS_PARAMS:
            return changeFilters(newState, action);

        case CLEAR_PATCH_SET_DETAIL_SYSTEMS:
            return initialState;

        default:
            return state;
    }
};
