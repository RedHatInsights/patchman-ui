import { inventoryEntitiesReducer, initialState } from './InventoryEntitiesReducer';

/* eslint-disable */
describe('InventoryEntitiesReducer tests', () => {
    it.each`
    columns          |  state                                                                                | action                                                                         | result
    ${[]}            |  ${{ ...initialState, loaded: true, columns: [{ key: 'testCol' }] }}                  | ${{ type: 'LOAD_ENTITIES_FULFILLED', payload: {} }}                     | ${{ ...initialState, loaded: true, columns: [{ key: 'last_upload' }] }}

    
    `('$action', ({ columns, state, action: { type, payload }, result }) => {
    const wrapperReducer = inventoryEntitiesReducer(columns);
    const res = wrapperReducer(state, { type, payload })
    expect(res).toEqual(result);
});
});
/* eslint-enable */
