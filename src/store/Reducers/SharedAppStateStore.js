
// Initial State
export const init = {
    hasInventoryAccess: false
};
// Reducer

export const SharedAppStateStore = (state = init, action) => {
    switch (action.type) {
        case 'TOGGLE_INVENTORY_ACCESS':
            return { ...state, hasInventoryAccess: action.payload };

        default:
            return state;
    }
};
