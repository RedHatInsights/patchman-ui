import { changeListParams } from '../../Utilities/Helpers';
import {
  CHANGE_PATCH_SET_DETAIL_SYSTEMS_PARAMS,
  TRIGGER_GLOBAL_FILTER,
  CHANGE_PATCH_SET_DETAIL_SYSTEMS_METADATA,
  FETCH_PATCH_SET_SYSTEMS_NO_FILTERS,
} from '../ActionTypes';
import { changeFilters } from './HelperReducers';

const initialState = {
  selectedRows: {},
  queryParams: {
    page: 1,
    perPage: 20,
  },
  templateHasSystemsLoading: true,
  templateHasSystems: null,
};

export const PatchSetDetailSystemsStore = (state = initialState, action) => {
  let newState = { ...state };

  switch (action.type) {
    case CHANGE_PATCH_SET_DETAIL_SYSTEMS_PARAMS:
      newState.queryParams = changeListParams(newState.queryParams, action.payload);
      return newState;

    case TRIGGER_GLOBAL_FILTER:
      return changeFilters(newState, action);

    case CHANGE_PATCH_SET_DETAIL_SYSTEMS_METADATA:
      newState.metadata = action.payload;
      return newState;

    case FETCH_PATCH_SET_SYSTEMS_NO_FILTERS + '_PENDING':
      return {
        ...state,
        templateHasSystemsLoading: true,
        templateHasSystems: null,
      };

    case FETCH_PATCH_SET_SYSTEMS_NO_FILTERS + '_FULFILLED':
      return {
        ...state,
        templateHasSystemsLoading: false,
        templateHasSystems: action.payload.data.length > 0,
      };

    case FETCH_PATCH_SET_SYSTEMS_NO_FILTERS + '_REJECTED':
      return {
        ...state,
        templateHasSystemsLoading: false,
        // if we set this to true, Inventory table is shown, which has better error handling
        templateHasSystems: true,
      };

    default:
      return state;
  }
};
