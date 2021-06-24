import * as ActionTypes from '../ActionTypes';
import { changeFilters, selectRows } from './HelperReducers';
import { createSystemsRows } from '../../Utilities/DataMappers';
import { createPackageSystemsRows } from '../../Utilities/DataMappers';

// Initial State
export const initialState = {
    rows: [],
    entities: [],
    selectedRows: [],
    page: 1,
    perPage: 20,
    queryParams: {
        sort: '-last_upload'
    },
    metadata: {
        limit: 20,
        offset: 0,
        total_items: 0
    }
};
// Reducer

export const modifyInventory = (columns, state) => {
    if (state.loaded) {
        let lastSeenColumn = state.columns.filter(({ key }) => key === 'updated');
        lastSeenColumn = [{ ...lastSeenColumn[0], key: 'last_upload' }];

        return {
            ...state,
            columns: [
                ...columns || [],
                ...lastSeenColumn || []
            ],
            rows: createSystemsRows(state.rows, state.selectedRows)
        };
    }

    return state;
};

export const modifyPackageSystems = (columns, state) => {
    if (state.loaded) {
        return {
            ...state,
            columns,
            rows: createPackageSystemsRows(state.rows, state.selectedRows)
        };
    }

    return state;
};

export const inventoryEntitiesReducer = (columns, inventoryModifier) => (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case 'LOAD_ENTITIES_FULFILLED':
            return inventoryModifier(columns, state);

        case ActionTypes.CHANGE_ENTITIES_PARAMS:
            return changeFilters(newState, action);

        case 'SELECT_ENTITY':
            return selectRows(newState, action);

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        case 'CLEAR_ENTITIES':
            return initialState;

        default:
            return state;
    }
};
