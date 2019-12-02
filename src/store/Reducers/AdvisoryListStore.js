import * as ActionTypes from '../ActionTypes';

export const initialState = {
    rows: [],
    expandedRows: {}
};

export const AdvisoryListStore = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_FULFILLED':
            newState.rows = action.payload.data;
            newState.loading = false;
            return newState;

        case ActionTypes.FETCH_APPLICABLE_ADVISORIES + '_PENDING':
            newState.loading = true;
            return newState;

        case ActionTypes.EXPAND_ADVISORY_ROW: {
            const rowState = action.payload;
            rowState.forEach(({ rowId, isOpen }) => {
                const rowName = newState.rows[rowId / 2].id;
                newState = {
                    ...newState,
                    expandedRows: {
                        ...newState.expandedRows,
                        [rowName]: isOpen || undefined
                    }
                };
            });
            return newState;
        }

        default:
            return state;
    }
};
