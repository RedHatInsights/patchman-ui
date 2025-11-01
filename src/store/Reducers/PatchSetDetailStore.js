import { FETCH_TEMPLATE_DETAIL, CLEAR_TEMPLATE_DETAIL } from '../ActionTypes';
import { fetchPending, fetchRejected } from './HelperReducers';

export let initialState = {
  data: { attributes: {} },
  status: { isLoading: true },
};

export const PatchSetDetailStore = (state = initialState, action) => {
  let newState = { ...state };

  switch (action.type) {
    case FETCH_TEMPLATE_DETAIL + '_FULFILLED':
      return {
        ...state,
        status: { isLoading: false },
        data: action.payload.data,
        error: {},
      };

    case FETCH_TEMPLATE_DETAIL + '_PENDING':
      return fetchPending(newState);

    case FETCH_TEMPLATE_DETAIL + '_REJECTED':
      return fetchRejected(newState, action);

    case CLEAR_TEMPLATE_DETAIL:
      return initialState;

    default:
      return state;
  }
};
