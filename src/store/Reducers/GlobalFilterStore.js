import * as ActionTypes from '../ActionTypes';

export const GlobalFilterStore = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.CHANGE_TAGS:
            return {
                ...state,
                tagsFilter: action.payload
            };

        case ActionTypes.CHANGE_WORKLOADS: console.log('workloads', action.payload);
            return {
                ...state,
                workloadsFilter: action.payload
            };

        case ActionTypes.CHANGE_SIDS:
            return {
                ...state,
                sidsFilter: action.payload
            };

        default:
            return state;
    }
};
