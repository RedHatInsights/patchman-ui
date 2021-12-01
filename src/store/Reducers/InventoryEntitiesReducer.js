import { createSystemsRows } from '../../Utilities/DataMappers';
import { createPackageSystemsRows } from '../../Utilities/DataMappers';
import { selectRows } from './HelperReducers';
import * as ActionTypes from '../ActionTypes';

// Initial State. It should not include page and perPage to persist them dynamically
const initialState = {
    rows: [],
    entities: [],
    selectedRows: {},
    status: {},
    page: 1,
    perPage: 20,
    metadata: {
        limit: 20,
        offset: 0,
        total_items: 0
    }
};
// Reducer

export const modifyInventory = (columns, state) => {
    if (state.loaded) {
        return {
            ...state,
            status: { isLoading: false, hasError: false },
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
            return inventoryModifier(columns, newState);

        case 'LOAD_ENTITIES_PENDING':
            newState.status = { isLoading: true, hasError: false };
            return newState;

        case 'LOAD_ENTITIES_REJECTED':
            newState.status = { isLoading: true, hasError: true };
            return newState;

        case 'SELECT_ENTITY': {
            const stateAfterSelection = selectRows(newState, action);
            return inventoryModifier(columns, stateAfterSelection);
        }

        case ActionTypes.CLEAR_INVENTORY_REDUCER:
            return initialState;

        default:
            return state;
    }
};
