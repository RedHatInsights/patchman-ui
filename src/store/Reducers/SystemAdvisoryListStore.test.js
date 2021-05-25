
/* eslint-disable */
import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED, storeListDefaults } from '../../Utilities/constants';
import { CHANGE_SYSTEM_ADVISORY_LIST_PARAMS, CLEAR_SYSTEM_ADVISORIES, EXPAND_SYSTEM_ADVISORY_ROW, FETCH_APPLICABLE_SYSTEM_ADVISORIES, SELECT_SYSTEM_ADVISORY_ROW } from '../ActionTypes';
import { SystemAdvisoryListStore } from './SystemAdvisoryListStore';
const action_fulfilled = FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_FULFILLED';
const action_rejected = FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_REJECTED';
const action_pending = FETCH_APPLICABLE_SYSTEM_ADVISORIES + '_PENDING';

const fulfilled_payload = {
    data: [],
    meta: {
        limit: 50,
        offset: 25,
        total_items: 50
    }
};

const error = 'Error';

describe('SystemAdvisoryListStore tests', () => {
    it.each`
    state                | action                                                                      | result
    ${storeListDefaults} | ${{ type: action_fulfilled, payload: fulfilled_payload }}                   | ${{ ...storeListDefaults, metadata: fulfilled_payload.meta, rows: fulfilled_payload.data, status: { code: undefined, isLoading: false, hasError: false }, error: {} }}
    ${storeListDefaults} | ${{ type: action_pending, payload: {} }}                                    | ${{ ...storeListDefaults, status: { code: undefined, isLoading: true, hasError: false }, error: {} }}
    ${storeListDefaults} | ${{ type: EXPAND_SYSTEM_ADVISORY_ROW, payload: { rowId: 1, value: true } }} | ${{ ...storeListDefaults, expandedRows: { 1: true } }}
    ${storeListDefaults} | ${{ type: CHANGE_SYSTEM_ADVISORY_LIST_PARAMS, payload: { limit: 10 } }}     | ${{ ...storeListDefaults, queryParams: { limit: 10, offset: 0, page: 1, page_size: 20 } }}
    ${storeListDefaults} | ${{ type: SELECT_SYSTEM_ADVISORY_ROW, payload: { id: 1, selected: true } }} | ${{ ...storeListDefaults, selectedRows: { 1: true } }}
    ${storeListDefaults} | ${{ type: 'NONSENSE', payload: {} }}                                        | ${storeListDefaults}
    ${undefined}         | ${{ type: 'NONSENSE', payload: {} }}                                        | ${storeListDefaults}
    ${storeListDefaults} | ${{type: CLEAR_SYSTEM_ADVISORIES, payload: {}}}                             | ${storeListDefaults}
    `('$action', ({ state, action: { type, payload }, result }) => {
    const res = SystemAdvisoryListStore(state, { type, payload });
    expect(res).toEqual(result);
});
});

// ${ storeListDefaults } | ${ { type: action_rejected, payload: error } }                                | ${ { ...storeListDefaults, status: STATUS_REJECTED, error } }
// ${ storeListDefaults } | ${ { type: action_rejected, payload: error } }                                | ${ { ...storeListDefaults, status: STATUS_REJECTED, error } }
/* eslint-enable */
