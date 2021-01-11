import { inventoryEntitiesReducer, init } from './InventoryEntitiesReducer';
import { sortable } from '@patternfly/react-table/dist/js';

/* eslint-disable */
const store = { SystemsListStore: { rows: [] } };
const testColumns = ['col1', 'col2'];
describe('InventoryEntitiesReducer tests', () => {
    it.each`
    columns          |  state                                                                                | action                                                                         | result
    ${[]}            |  ${undefined}                                                                         | ${{ type: 'LOAD_ENTITIES_FULFILLED', payload: {}, store }}                     | ${{ ...init, columns: [] }}
    ${[]}            |  ${init}                                                                              | ${{ type: 'LOAD_ENTITIES_FULFILLED', payload: {}, store }}                     | ${{ ...init, columns: [] }}
    ${[]}            |  ${init}                                                                              | ${{ type: 'TEST_INVALID_ACTION', payload: {}, store }}                         | ${init}
    ${[]}            |  ${{ ...init, loaded: false }}                                                        | ${{ type: 'LOAD_ENTITIES_FULFILLED', payload: {}, store }}                     | ${{ ...init, loaded: false }}
    ${[]}            |  ${{ ...init, loaded: true, columns: [{ key: 'testCol' }] }}                          | ${{ type: 'LOAD_ENTITIES_FULFILLED', payload: {},  store }}                    | ${{ ...init, loaded: true, columns: [{ transforms: [sortable] }] }}
    ${[]}            |  ${{ ...init, loaded: true, columns: [{ key: 'updated' }] }}                          | ${{ type: 'LOAD_ENTITIES_FULFILLED', payload: {},  store }}                    | ${{ ...init, loaded: true, columns: [{ key: 'updated', transforms: [sortable] }] }}
    ${[{ key: 'testCol' }]}   |  ${{ ...init, loaded: true }}                                                | ${{ type: 'LOAD_ENTITIES_FULFILLED', payload: {},  store }}                    | ${{ ...init, loaded: true, columns: [{ key: 'testCol' }, { transforms: [sortable] }] }}
    
    `('$action', ({ columns, state, action: { type, payload, store }, result }) => {
    const wrapperReducer = inventoryEntitiesReducer(columns, 'SYSTEMS_PAGE');
    const res = wrapperReducer(state, { type, payload, store })
    expect(res).toEqual(result);
});
});
/* eslint-enable */
