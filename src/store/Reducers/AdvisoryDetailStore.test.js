/* eslint-disable */
import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { CLEAR_ADVISORY_DETAILS, FETCH_ADVISORY_DETAILS } from '../ActionTypes';
import { AdvisoryDetailStore, initialState } from './AdvisoryDetailStore';

const action_fulfilled = FETCH_ADVISORY_DETAILS + '_FULFILLED';
const action_rejected = FETCH_ADVISORY_DETAILS + '_REJECTED';
const action_pending = FETCH_ADVISORY_DETAILS + '_PENDING';

const fulfilled_payload = {
    data: []
}

const error = "Error";

describe('AdvisoryDetailStore tests', () => {
    it.each`
    state                    | action                                                   | result
    ${initialState}          | ${{type: action_fulfilled, payload: fulfilled_payload}}  | ${{...fulfilled_payload, status: STATUS_RESOLVED, error: {}}}
    ${initialState}          | ${{ type: action_pending, payload: {} }}                   | ${{ ...initialState, status: { code: undefined, isLoading: true, hasError: false }, error: {}}}
    ${initialState}          | ${{type: CLEAR_ADVISORY_DETAILS, payload: {}}}           | ${initialState}
    ${initialState}          | ${{type: "NONSENSE", payload: {}}}                       | ${initialState}
    `('$action',({state, action: {type, payload}, result}) => {
        const res = AdvisoryDetailStore(state, {type, payload})
        expect(res).toEqual(result);
    });
});

//    ${initialState}          | ${{type: action_rejected, payload: error}}               | ${{...initialState, status: STATUS_REJECTED, error: error}}
/* eslint-enable */
