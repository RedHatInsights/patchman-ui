import * as ActionTypes from '../ActionTypes';

const initialState = {
    selectedGlobalTags: [],
    selectedTags: [],
    systemProfile: undefined
};

export const GlobalFilterStore = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.CHANGE_TAGS:
            return {
                ...state,
                selectedTags: action.payload
            };

        case ActionTypes.CHANGE_GLOBAL_TAGS:
            return {
                ...state,
                selectedGlobalTags: action.payload
            };

        case ActionTypes.CHANGE_PROFILE:
            return {
                ...state,
                systemProfile: action.payload
            };

        default:
            return state;
    }
};
