import * as ActionTypes from '../ActionTypes';
import { changeFilters, selectRows } from './HelperReducers';
import { createSystemsRows } from '../../Utilities/DataMappers';

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

function modifyInventory(columns, state) {
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
}

function modifyPackageSystems(columns, hosts, state) {
    if (state.loaded) {
        return {
            ...state,
            columns
        };
    }

    return state;
}

export const inventoryEntitiesReducer = (columns) => (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case 'LOAD_ENTITIES_FULFILLED':
            return modifyInventory(columns, state);

        case ActionTypes.CHANGE_ENTITIES_PARAMS:
            delete action.payload?.filter;
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

export const packagesSystemsInventoryReducer = (columns, store) => (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_ENTITIES_FULFILLED':
            return modifyPackageSystems(columns, store?.rows, state);

        default:
            return state;
    }
};
