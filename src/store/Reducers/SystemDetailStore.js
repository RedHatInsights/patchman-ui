import React from 'react';
import SystemDetail from '../../SmartComponents/SystemDetail/SystemDetail';

let initialState = {
    loaded: false
};

// Reducer
export const SystemDetailStore = (state = initialState, action) => {
    switch (action.type) {
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
                //we have to send empty object if there is not entity so that inventory does not throw error
                entity: state.entity && state.entity || {},
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
