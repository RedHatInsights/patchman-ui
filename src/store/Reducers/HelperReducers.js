import {
  addOrRemoveItemFromSet,
  changeListParams,
  getNewSelectedItems,
} from '../../Utilities/Helpers';

export const changeFilters = (state, action) => {
  state.queryParams = changeListParams(state.queryParams, action.payload);

  return state;
};

export const selectRows = (state, action) => {
  const selectedUpdated = getNewSelectedItems(action.payload, state.selectedRows);
  state = { ...state, selectedRows: selectedUpdated };
  return state;
};

export const expandRows = (state, action) => {
  const expandedUpdated = addOrRemoveItemFromSet(state.expandedRows, [].concat(action.payload));
  state = { ...state, expandedRows: expandedUpdated };
  return state;
};

export const fetchPending = (state) => {
  state.error = {};
  state.status = { isLoading: true, hasError: false, code: undefined };
  return state;
};

export const fetchRejected = (state, action) => {
  state.metadata = action.payload.meta || {};
  state.error = action.payload;
  state.status = { code: action.payload.status, isLoading: false, hasError: true };
  return state;
};

export const fetchFulfilled = (state, action) => {
  state.rows = action.payload.data;
  state.metadata = action.payload.meta || {};
  state.error = {};
  state.status = { code: action.payload.status, isLoading: false, hasError: false };
  return state;
};
