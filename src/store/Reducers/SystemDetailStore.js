let initialState = {
    loaded: false
};

// Reducer
export const SystemDetailStore = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'FETCH_SYSTEM_DETAIL_FULFILLED':
            return {
                ...state,
                hasThirdPartyRepo: payload.data?.attributes.third_party,
                satelliteManaged: payload.data?.attributes.satellite_managed,
                patchSetName: payload.data?.attributes.baseline_name,
                patchSetId: payload.data?.attributes.baseline_id
            };
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
