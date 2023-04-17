import { changeListParams } from '../../Utilities/Helpers';
import {
    CHANGE_PATCH_SET_DETAIL_SYSTEMS_PARAMS,
    TRIGGER_GLOBAL_FILTER,
    CHANGE_PATCH_SET_DETAIL_SYSTEMS_METADATA
} from '../ActionTypes';
import { changeFilters } from './HelperReducers';

const initialState = {
    selectedRows: {},
    queryParams: {
        page: 1,
        perPage: 20
    }
};

export const PatchSetDetailSystemsStore = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case CHANGE_PATCH_SET_DETAIL_SYSTEMS_PARAMS:
            newState.queryParams = changeListParams(newState.queryParams, action.payload);
            return newState;

        case TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        case CHANGE_PATCH_SET_DETAIL_SYSTEMS_METADATA:
            newState.metadata = action.payload;
            return newState;

        default:
            return state;
    }
};

