import * as ActionTypes from '../ActionTypes';
import { changeFilters, selectRows } from './HelperReducers';
import { createSystemsRows } from '../../Utilities/DataMappers';
import { createPackageSystemsRows } from '../../Utilities/DataMappers';
import { changeListParams } from '../../Utilities/Helpers';

// Initial State. It should not include page and perPage to persist them dynamically
export const initialState = {
    rows: [],
    entities: [],
    selectedRows: [],
    queryParams: {},
    systemsParams: {},
    affectedSystemsParams: {},
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

        case ActionTypes.CHANGE_SYSTEMS_PARAMS:
            delete action.payload?.filter;
            newState.systemsParams = changeListParams(newState.systemsParams, action.payload);
            return newState;

        case ActionTypes.CHANGE_AFFECTED_SYSTEMS_PARAMS:
            delete action.payload?.filter;
            newState.affectedSystemsParams =  changeListParams(newState.affectedSystemsParams, action.payload);
            return newState;

        case ActionTypes.CHANGE_PACKAGE_SYSTEMS_PARAMS:
            delete action.payload?.filter;
            newState.packageSystemsParams = changeListParams(newState.packageSystemsParams, action.payload);
            return newState;

        case 'SELECT_ENTITY':
            return selectRows(newState, action);

        case ActionTypes.TRIGGER_GLOBAL_FILTER:
            return changeFilters(newState, action);

        case ActionTypes.CLEAR_SYSTEMS_PARAMS:
            return { ...initialState, systemsParams: newState.systemsParams };
        case ActionTypes.CLEAR_AFFECTED_SYSTEMS_PARAMS:
            return { ...initialState, affectedSystemsParams: newState.affectedSystemsParams };
        case ActionTypes.CLEAR_PACKAGE_SYSTEMS_PARAMS:
            return { ...initialState, packageSystemsParams: newState.packageSystemsParams };

        default:
            return state;
    }
};
