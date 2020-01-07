import React from 'react';
import SystemAdvisories from '../../SmartComponents/SystemAdvisories/SystemAdvisories';

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
                        title: 'System Patching',
                        name: 'patch',
                        component: () => <SystemAdvisories />
                    }
                ]
            };
        case 'LOAD_ENTITY_REJECTED':
            return {
                ...state,
                loaded: true,
                activeApps: [
                    {
                        title: 'System Patching',
                        name: 'patch',
                        component: () => <SystemAdvisories />
                    }
                ]
            };
        default:
            return state;
    }
};
