// Initial State
export const init = {
    columns: [],
    rows: [],
    entities: []
};
// Reducer

function modifyInventory(columns, state) {
    if (state.loaded) {
        const lastSeenColumn = state.columns.filter(({ key }) => key === 'updated');
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
