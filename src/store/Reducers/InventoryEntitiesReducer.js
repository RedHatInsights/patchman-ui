// Initial State
export const init = {
    columns: [],
    rows: [],
    entities: []
};
// Reducer

function modifyInventory(columns, state) {
    if (state.loaded) {
        return {
            ...state,
            columns
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
