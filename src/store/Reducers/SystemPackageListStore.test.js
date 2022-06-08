
/* eslint-disable */
import { storeListDefaults } from '../../Utilities/constants';
import { CHANGE_SYSTEM_PACKAGES_LIST_PARAMS, SELECT_SYSTEM_PACKAGES_ROW, 
    FETCH_APPLICABLE_SYSTEM_PACKAGES, TRIGGER_GLOBAL_FILTER, CLEAR_SYSTEM_PACKAGES } from '../ActionTypes';
import { SystemPackageListStore } from './SystemPackageListStore';
const action_fulfilled = FETCH_APPLICABLE_SYSTEM_PACKAGES + '_FULFILLED';
const action_rejected = FETCH_APPLICABLE_SYSTEM_PACKAGES + '_REJECTED';
const action_pending = FETCH_APPLICABLE_SYSTEM_PACKAGES + '_PENDING';

const fulfilled_payload = {
    data: [],
    meta: {
        limit: 50,
        offset: 25,
        total_items: 50
    }
};

const error = 'Error';

describe('SystemPackageListStore tests', () => {
    it.each`
    state                | action                                                               | result
    ${storeListDefaults} | ${{ type: action_fulfilled, payload: fulfilled_payload }}            | ${{ ...storeListDefaults, metadata: fulfilled_payload.meta, rows: fulfilled_payload.data, status: { code: undefined, isLoading: false, hasError: false }, error: {} }}
    ${storeListDefaults} | ${{ type: action_pending, payload: {} }}                             | ${{ ...storeListDefaults, status: { code: undefined, isLoading: true, hasError: false }, error: {} }}
    ${storeListDefaults} | ${{ type: CLEAR_SYSTEM_PACKAGES, payload: {} }}                             | ${{ ...storeListDefaults, status: { isLoading: true }, error: {}, queryParams: { filter: { updatable: ['true']} } }}
    ${ storeListDefaults} | ${{ type: action_rejected, payload: error }}                        | ${{ ...storeListDefaults, status: { isLoading: false, hasError: true, code: undefined }, error, metadata: {} }}
    ${storeListDefaults} | ${{ type: action_rejected, payload: error }}                         | ${{ ...storeListDefaults, status: { isLoading: false, hasError: true, code: undefined  }, error, metadata: {} } }

    ${storeListDefaults} | ${{ type: CHANGE_SYSTEM_PACKAGES_LIST_PARAMS, payload: { limit: 10 } }}     | ${{ ...storeListDefaults, queryParams: { limit: 10, offset: 0, page: 1, page_size: 20 } }}
    ${storeListDefaults} | ${{ type: TRIGGER_GLOBAL_FILTER, payload: { limit: 10 } }}           | ${{ ...storeListDefaults, queryParams: { limit: 10, offset: 0, page: 1, page_size: 20 } }}
    ${storeListDefaults} | ${{ type: SELECT_SYSTEM_PACKAGES_ROW, payload: { id: 1, selected: true } }} | ${{ ...storeListDefaults, selectedRows: { 1: true } }}
    ${storeListDefaults} | ${{ type: 'NONSENSE', payload: {} }}                                 | ${storeListDefaults}
    ${undefined}         | ${{ type: 'NONSENSE', payload: {} }}                                 | ${{ ...storeListDefaults, queryParams: { filter: { updatable: ['true'] } } }}
    `('$action', ({ state, action: { type, payload }, result }) => {
        const res = SystemPackageListStore(state, { type, payload });
        expect(res).toEqual(result);
    });
});

/* eslint-enable */
