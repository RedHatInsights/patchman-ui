import { storeListDefaults } from '../../Utilities/constants';
import * as ActionTypes from '../ActionTypes';

export const SystemsListStore = (state = storeListDefaults, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_SYSTEMS + '_PENDING':
            newState.isLoading = true;
            return newState;

        case ActionTypes.FETCH_SYSTEMS + '_FULFILLED':
            newState.rows = action.payload.data;
            newState.metadata = action.payload.meta;
            newState.isLoading = false;
            return newState;

        case ActionTypes.CHANGE_SYSTEMS_LIST_PARAMS:
            newState.queryParams = {
                ...newState.queryParams,
                ...action.payload
            };
            return newState;

        default:
            return state;
    }
};
