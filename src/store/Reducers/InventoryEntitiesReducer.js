import { sortable } from '@patternfly/react-table/dist/js';

// Initial State
export const init = {
    columns: [],
    rows: [],
    entities: []
};
// Reducer

function modifyInventory(columns, state) {
    if (state.loaded) {
        let lastSeenColumn = state.columns.filter(({ key }) => key === 'updated');
        lastSeenColumn = [{ ...lastSeenColumn[0], transforms: [sortable] }];
        return {
            ...state,
            columns: [
                ...columns || [],
                ...lastSeenColumn || []
            ]
        };
    }

    return state;
}

export const inventoryEntitiesReducer = columns => (state = init, action) => {
    switch (action.type) {
        case 'LOAD_ENTITIES_FULFILLED':
            return modifyInventory(columns, state);

        default:
            return state;
    }
};
