import { addOrRemoveItemFromSet, changeListParams, getNewSelectedItems } from '../../Utilities/Helpers';
import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';

export const changeFilters = (state, action) => {
    state.queryParams = changeListParams(
        state.queryParams,
        action.payload
    );

    return state;
};

export const selectRows = (state, action) => {
    const selectedUpdated = getNewSelectedItems(action.payload, state.selectedRows);
    state = { ...state, selectedRows: selectedUpdated };
    return state;
};

export const expandRows = (state, action) => {
    const expandedUpdated = addOrRemoveItemFromSet(
        state.expandedRows,
        [].concat(action.payload)
    );
    state = { ...state, expandedRows: expandedUpdated };
    return state;
};

export const fetchPending = (state) => {
    state.error = {};
    state.status = STATUS_LOADING;
    return state;
};

export const fetchRejected = (state, action) => {
    state.status = STATUS_REJECTED;
    state.error = action.payload;
    return state;
};

export const fetchFulfilled = (state, action) => {
    state.rows = action.payload.data;
    state.metadata = action.payload.meta;
    state.error = {};
    state.status = STATUS_RESOLVED;
    return state;
};
