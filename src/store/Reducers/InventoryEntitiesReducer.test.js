import { inventoryEntitiesReducer, initialState } from './InventoryEntitiesReducer';
import { modifyInventory } from './InventoryEntitiesReducer';
/* eslint-disable */
describe('InventoryEntitiesReducer tests', () => {
    it.each`
    columns          |  state                                                                                | action                                                                         | result
    ${[]}            |  ${{ ...initialState, loaded: false, columns: [{ key: 'testCol' }] }}                  | ${{ type: 'LOAD_ENTITIES_FULFILLED', payload: {} }}                     | ${{ ...initialState, loaded: false, columns: [{ key: 'testCol' }] }}

    
    `('$action', ({ columns, state, action: { type, payload }, result }) => {
        const wrapperReducer = inventoryEntitiesReducer(columns, modifyInventory);
    const res = wrapperReducer(state, { type, payload })
    expect(res).toEqual(result);
});
});
/* eslint-enable */
