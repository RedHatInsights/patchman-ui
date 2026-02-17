import {
  createAdvisorySystemsRows,
  createSystemsRows,
  createPackageSystemsRows,
} from '../../Utilities/DataMappers';
import { selectRows, fetchRejected } from './HelperReducers';
import * as ActionTypes from '../ActionTypes';

// Initial State. It should not include page and perPage to persist them dynamically
const initialState = {
  rows: [],
  entities: [],
  selectedRows: {},
  status: {},
  page: 1,
  perPage: 20,
  metadata: {
    limit: 20,
    offset: 0,
    total_items: 0,
  },
};
// Reducer

export const modifyInventory = (columns, state) => {
  if (state.loaded) {
    return {
      ...state,
      status: { isLoading: false, hasError: false },
      rows: createSystemsRows(state.rows, state.selectedRows),
    };
  }

  return state;
};

export const modifyPackageSystems = (columns, state, lastAction) => {
  // this is pretty scuffed, but trust me it cannot be solved more elegantly because
  // single item select actions are triggered by Inventory and contain only system id
  // but we also need to match available_evra for each selected system for remediations
  // this does not happen with bulk select action because they are implemented by Patchman
  // the id-evra mapping is cached to minimize O(n^2) time complexity of id-evra matching
  if (lastAction === 'SELECT_ENTITY') {
    let idToEvraMapping = state.packageEvraCache;

    if (idToEvraMapping === undefined) {
      idToEvraMapping = {};
      state.rows.forEach((row) => (idToEvraMapping[row.id] = row.available_evra));
      state.packageEvraCache = idToEvraMapping;
    }

    state.selectedRows = state.selectedRows
      ? Object.fromEntries(
          Object.entries(state.selectedRows).map(([id, value]) =>
            value === true ? [id, idToEvraMapping[id]] : [id, value],
          ),
        )
      : state.selectedRows;
  }

  if (lastAction === 'LOAD_ENTITIES_FULFILLED') {
    state.packageEvraCache = undefined;
  }

  if (state.loaded) {
    return {
      ...state,
      columns,
      rows: createPackageSystemsRows(state.rows, state.selectedRows),
    };
  }

  return state;
};

export const modifyAdvisorySystems = (columns, state) => {
  if (state.loaded) {
    return {
      ...state,
      status: { isLoading: false, hasError: false },
      rows: createAdvisorySystemsRows(state.rows, state.selectedRows),
    };
  }

  return state;
};

export const inventoryEntitiesReducer =
  (columns, inventoryModifier) =>
  (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
      case 'LOAD_ENTITIES_FULFILLED':
        return inventoryModifier(columns, newState, action.type);

      case 'LOAD_ENTITIES_PENDING':
        newState.status = { isLoading: true, hasError: false };
        return newState;

      case 'LOAD_ENTITIES_REJECTED':
        return fetchRejected(newState, action);

      case 'SELECT_ENTITY': {
        const stateAfterSelection = selectRows(newState, action);
        return inventoryModifier(columns, stateAfterSelection, action.type);
      }

      case ActionTypes.CLEAR_INVENTORY_REDUCER:
        return initialState;

      default:
        return state;
    }
  };
