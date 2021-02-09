
/* eslint-disable */
import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED, storeListDefaults } from '../../Utilities/constants';
import { CHANGE_AFFECTED_SYSTEMS_PARAMS, CLEAR_AFFECTED_SYSTEMS, FETCH_AFFECTED_SYSTEMS } from '../ActionTypes';
import { AdvisorySystemsStore } from './AdvisorySystemsStore';
import { selectionPayload } from '../../Utilities/RawDataForTesting';
const action_fulfilled = FETCH_AFFECTED_SYSTEMS + '_FULFILLED';
const action_rejected = FETCH_AFFECTED_SYSTEMS + '_REJECTED';
const action_pending = FETCH_AFFECTED_SYSTEMS + '_PENDING';

const fulfilled_payload = {
    data: [],
    meta: {
        limit: 50,
        offset: 25,
        total_items: 50
    }
};

const error = 'Error';

describe('AdvisorySystemsStore tests', () => {
    it.each`
    state                | action                                                              | result
    ${storeListDefaults} | ${{ type: action_fulfilled, payload: fulfilled_payload }}           | ${{ ...storeListDefaults, metadata: fulfilled_payload.meta, rows: fulfilled_payload.data, status: STATUS_RESOLVED, error: {} }}
    ${storeListDefaults} | ${{ type: action_pending, payload: {} }}                            | ${{ ...storeListDefaults, status: STATUS_LOADING, error: {} }}
    ${storeListDefaults} | ${{ type: action_rejected, payload: error }}                        | ${{ ...storeListDefaults, status: STATUS_REJECTED, error }}
    ${storeListDefaults} | ${{ type: action_rejected, payload: error }}                        | ${{ ...storeListDefaults, status: STATUS_REJECTED, error }}
    ${storeListDefaults} | ${{ type: CHANGE_AFFECTED_SYSTEMS_PARAMS, payload: { limit: 10 } }} | ${{ ...storeListDefaults, queryParams: { limit: 10, offset: 0 } }}
    ${storeListDefaults} | ${{ type: CLEAR_AFFECTED_SYSTEMS, payload: {} }}                    | ${storeListDefaults}
    ${storeListDefaults} | ${{ type: 'SELECT_ENTITY', payload: selectionPayload }}             | ${{ ...storeListDefaults, selectedRows: { 1: true } }}
    ${storeListDefaults} | ${{ type: 'NONSENSE', payload: {} }}                                | ${storeListDefaults}
    ${undefined}         | ${{ type: 'NONSENSE', payload: {} }}                                | ${storeListDefaults}
    `('$action', ({ state, action: { type, payload }, result }) => {
    const res = AdvisorySystemsStore(state, { type, payload });
    expect(res).toEqual(result);
});
});
/* eslint-enable */

