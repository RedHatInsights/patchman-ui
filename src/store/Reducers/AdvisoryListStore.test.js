
/* eslint-disable */
import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED, storeListDefaults } from '../../Utilities/constants';
import { CHANGE_ADVISORY_LIST_PARAMS, EXPAND_ADVISORY_ROW, FETCH_APPLICABLE_ADVISORIES, SELECT_ADVISORY_ROW } from '../ActionTypes';
import { AdvisoryListStore } from './AdvisoryListStore';
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

// eslint-disable-next-line
const advisoryListStoreDefaults = {
    ...storeListDefaults,
    queryParams: {}
};

const error = 'Error';

describe('AdvisoryListStore tests', () => {
    it.each`
    state                | action                                                               | result
    ${advisoryListStoreDefaults} | ${{ type: action_fulfilled, payload: fulfilled_payload }}            | ${{ ...advisoryListStoreDefaults, metadata: fulfilled_payload.meta, rows: fulfilled_payload.data, status: { code: undefined, isLoading: false, hasError: false }, error: {} }}
    ${advisoryListStoreDefaults} | ${{ type: action_pending, payload: {} }}                             | ${{ ...advisoryListStoreDefaults, status: { code: undefined, isLoading: true, hasError: false }, error: {} }}
    ${advisoryListStoreDefaults} | ${{ type: EXPAND_ADVISORY_ROW, payload: { rowId: 1, value: true } }} | ${{ ...advisoryListStoreDefaults, expandedRows: { 1: true } }}
    ${advisoryListStoreDefaults} | ${{ type: CHANGE_ADVISORY_LIST_PARAMS, payload: { limit: 10 } }}     | ${{ ...advisoryListStoreDefaults, queryParams: { limit: 10, offset: 0 } }}
    ${advisoryListStoreDefaults} | ${{ type: SELECT_ADVISORY_ROW, payload: { id: 1, selected: true } }} | ${{ ...advisoryListStoreDefaults, selectedRows: { 1: true } }}
    ${advisoryListStoreDefaults} | ${{ type: 'NONSENSE', payload: {} }}                                 | ${advisoryListStoreDefaults}
    ${undefined}         | ${{ type: 'NONSENSE', payload: {} }}                                 | ${advisoryListStoreDefaults}
    `('$action', ({ state, action: { type, payload }, result }) => {
    const res = AdvisoryListStore(state, { type, payload });
    expect(res).toEqual(result);
});
});

// ${ storeListDefaults } | ${ { type: action_rejected, payload: error } }                         | ${ { ...storeListDefaults, status: STATUS_REJECTED, error } }
// ${ storeListDefaults } | ${ { type: action_rejected, payload: error } }                         | ${ { ...storeListDefaults, status: STATUS_REJECTED, error } }
/* eslint-enable */
