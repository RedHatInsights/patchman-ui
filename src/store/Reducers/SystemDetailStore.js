import React from 'react';
import SystemDetail from '../../SmartComponents/SystemDetail/SystemDetail';

let initialState = {
    loaded: false
};

// Reducer
export const SystemDetailStore = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'FETCH_SYSTEM_DETAIL_FULFILLED':
            state.hasThirdPartyRepo = payload.data?.attributes.third_party;
            state.patchSetName = payload.data?.attributes.baseline_name;
            return state;
        case 'LOAD_ENTITY_FULFILLED':
            return {
                ...state,
                loaded: true,
                activeApps: [
                    {
                        title: 'Patch',
                        name: 'patch',
                        component: () => <SystemDetail />
                    }
                ]
            };
        case 'LOAD_ENTITY_REJECTED':
            return {
                ...state,
                loaded: true,
                activeApps: [
                    {
                        title: 'Patch',
                        name: 'patch',
                        component: () => <SystemDetail />
                    }
                ]
            };
        default:
            return state;
    }
};
