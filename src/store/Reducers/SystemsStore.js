import * as ActionTypes from '../ActionTypes';
import { changeFilters } from './HelperReducers';
import { changeListParams } from '../../Utilities/Helpers';

// Initial State. It should not include page and perPage to persist them dynamically
const initialState = {
    selectedRows: {},
    queryParams: {
        page: 1,
        perPage: 20,
        filter: {
            stale: [true, false]
        }
    }
};

// Reducer
export const SystemsStore = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {

        case ActionTypes.CHANGE_SYSTEMS_PARAMS:
            newState.queryParams = changeListParams(newState.queryParams, action.payload);
            return newState;

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        case ActionTypes.CHANGE_SYSTEMS_METADATA:
            newState.metadata = action.payload;
            return newState;

        default:
            return state;
    }
};

