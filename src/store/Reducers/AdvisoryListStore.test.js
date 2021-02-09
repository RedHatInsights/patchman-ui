
/* eslint-disable */
import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED, storeListDefaults } from '../../Utilities/constants';
import { CHANGE_ADVISORY_LIST_PARAMS, EXPAND_ADVISORY_ROW, FETCH_APPLICABLE_ADVISORIES, SELECT_ADVISORY_ROW } from '../ActionTypes';
import { AdvisoryListStore } from './AdvisoryListStore';
import { selectionPayload } from '../../Utilities/RawDataForTesting';
const action_fulfilled = FETCH_APPLICABLE_ADVISORIES + '_FULFILLED';
const action_rejected = FETCH_APPLICABLE_ADVISORIES + '_REJECTED';
const action_pending = FETCH_APPLICABLE_ADVISORIES + '_PENDING';

const fulfilled_payload = {
    data: [],
    meta: {
        limit: 50,
        offset: 25,
        total_items: 50
    }
};

const error = 'Error';

describe('AdvisoryListStore tests', () => {
    it.each`
    state                | action                                                               | result
    ${storeListDefaults} | ${{ type: action_fulfilled, payload: fulfilled_payload }}            | ${{ ...storeListDefaults, metadata: fulfilled_payload.meta, rows: fulfilled_payload.data, status: STATUS_RESOLVED, error: {} }}
    ${storeListDefaults} | ${{ type: action_pending, payload: {} }}                             | ${{ ...storeListDefaults, status: STATUS_LOADING, error: {} }}
    ${storeListDefaults} | ${{ type: action_rejected, payload: error }}                         | ${{ ...storeListDefaults, status: STATUS_REJECTED, error }}
    ${storeListDefaults} | ${{ type: action_rejected, payload: error }}                         | ${{ ...storeListDefaults, status: STATUS_REJECTED, error }}
    ${storeListDefaults} | ${{ type: EXPAND_ADVISORY_ROW, payload: { rowId: 1, value: true } }} | ${{ ...storeListDefaults, expandedRows: { 1: true } }}
    ${storeListDefaults} | ${{ type: CHANGE_ADVISORY_LIST_PARAMS, payload: { limit: 10 } }}     | ${{ ...storeListDefaults, queryParams: { limit: 10, offset: 0 } }}
    ${storeListDefaults} | ${{ type: SELECT_ADVISORY_ROW, payload: selectionPayload } }         | ${{ ...storeListDefaults, selectedRows: { 1: true } }}
    ${storeListDefaults} | ${{ type: 'NONSENSE', payload: {} }}                                 | ${storeListDefaults}
    ${undefined}         | ${{ type: 'NONSENSE', payload: {} }}                                 | ${storeListDefaults}
    `('$action', ({ state, action: { type, payload }, result }) => {
    const res = AdvisoryListStore(state, { type, payload });
    expect(res).toEqual(result);
});
});
/* eslint-enable */
