import * as ActionTypes from '../ActionTypes';

// Initial State. It should not include page and perPage to persist them dynamically
export const initialState = {
    patchSets: [],
    selectedRows: [],
    queryParams: {
        page: 1,
        perPage: 20,
        filter: {}
    }
};

export const PatchSetsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_ALL_PATCH_SETS + '_FULFILLED':
            return {
                ...state,
                patchSets: action.payload.data.map(set => ({ ...set.attributes, id: set.id }))
            };

        default:
            return state;
    }
};
