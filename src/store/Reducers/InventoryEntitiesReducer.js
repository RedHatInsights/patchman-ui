import { sortable } from '@patternfly/react-table/dist/js';

// Initial State
export const init = {
    columns: [],
    rows: [],
    entities: []
};
// Reducer

function replaceLastUpdated (InventoryHosts, PatchHosts) {
    return InventoryHosts.map((InventoryRow) => {
        const patchLastSeen = PatchHosts && PatchHosts.find(patchRow=> patchRow.id === InventoryRow.id);
        return {
            ...InventoryRow,
            updated: patchLastSeen && patchLastSeen.attributes.last_upload || InventoryRow.updated
        };
    });
}

function modifyInventory(columns, hosts, state) {
    if (state.loaded) {
        let lastSeenColumn = state.columns.filter(({ key }) => key === 'updated');
        lastSeenColumn = [{ ...lastSeenColumn[0], transforms: [sortable] }];
        return {
            ...state,
            columns: [
                ...columns || [],
                ...lastSeenColumn || []
            ],
            rows: replaceLastUpdated(state.rows, hosts)
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

export const inventoryEntitiesReducer = (columns, store) => (state = init, action) => {
    switch (action.type) {
        case 'LOAD_ENTITIES_FULFILLED':
            return modifyInventory(columns, store?.rows, state);

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
