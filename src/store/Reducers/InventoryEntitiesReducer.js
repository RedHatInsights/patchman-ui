import { sortable } from '@patternfly/react-table/dist/js';
import * as ActionTypes from '../ActionTypes';
import { changeFilters } from './HelperReducers';
import { createSystemsRows } from '../../Utilities/DataMappers';
// Initial State
export const init = {
    columns: [],
    rows: [],
    entities: [],
    status: 'loading',
    selectedRows: [],
    queryParams: {
        page: 1,
        per_page: 20,
        sort: '-last_upload'
    },
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 0
    },
    error: {}
};
// Reducer

function modifyInventory(columns, state) {
    if (state.loaded) {
        let lastSeenColumn = state.columns.filter(({ key }) => key === 'updated');
        lastSeenColumn = [{ ...lastSeenColumn[0], transforms: [sortable] }];
        console.log('state', { ...state,
            columns: [
                ...columns || [],
                ...lastSeenColumn || []
            ],
            rows: createSystemsRows(state.rows) });
        return {
            ...state,
            columns: [
                ...columns || [],
                ...lastSeenColumn || []
            ],
            rows: createSystemsRows(state.rows)
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

export const inventoryEntitiesReducer = (columns) => (state = init, action) => {
    switch (action.type) {
        case 'LOAD_ENTITIES_FULFILLED':
            return modifyInventory(columns, state);

        case ActionTypes.CHANGE_SYSTEMS_LIST_PARAMS:
            return changeFilters(state, action);

        default:
            return state;
    }
};

export const packagesSystemsInventoryReducer = (columns, store) => (state = init, action) => {
    switch (action.type) {
        case 'LOAD_ENTITIES_FULFILLED':
            return modifyPackageSystems(columns, store?.rows, state);

        default:
            return state;
    }
};
