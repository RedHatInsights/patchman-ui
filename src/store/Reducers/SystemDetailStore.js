let initialState = {
    loaded: false
};

// Reducer
export const SystemDetailStore = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'FETCH_SYSTEM_DETAIL_FULFILLED':
            state.hasThirdPartyRepo = payload.data?.attributes.third_party;
            state.patchSetName = payload.data?.attributes.baseline_name;
            state.patchSetId = payload.data?.attributes.baseline_id;
            return state;
        case 'LOAD_ENTITY_PENDING':
            return {
                ...state,
                loaded: false
            };
        case 'LOAD_ENTITY_FULFILLED':
            return {
                ...state,
                loaded: true
            };
        case 'LOAD_ENTITY_REJECTED':
            return {
                ...state,
                loaded: true
            };
        default:
            return state;
    }
};
