
// Initial State
export const init = {
    hasAccess: false
};
// Reducer

export const SharedAppStateStore = (state = init, action) => {
    switch (action.type) {
        case 'TOGGLE_INVENTORY_ACCESS':
            return { ...state, hasAccess: action.payload };

        default:
            return state;
    }
};
