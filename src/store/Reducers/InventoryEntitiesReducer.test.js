import {
  inventoryEntitiesReducer,
  initialState,
  modifyInventory,
  modifyPackageSystems,
} from './InventoryEntitiesReducer';
import { systemRows } from '../../Utilities/RawDataForTesting';

describe('InventoryEntitiesReducer tests', () => {
  it.each`
    columns | state                                                                | action                                                                                  | result
    ${[]}   | ${{ ...initialState, loaded: false, columns: [{ key: 'testCol' }] }} | ${{ type: 'LOAD_ENTITIES_FULFILLED', payload: {} }}                                     | ${{ ...initialState, loaded: false, columns: [{ key: 'testCol' }] }}
    ${[]}   | ${{ ...initialState, loaded: false, columns: [{ key: 'testCol' }] }} | ${{ type: 'LOAD_ENTITIES_PENDING', payload: {} }}                                       | ${{ ...initialState, loaded: false, status: { isLoading: true, hasError: false }, columns: [{ key: 'testCol' }] }}
    ${[]}   | ${{ ...initialState, loaded: false, columns: [{ key: 'testCol' }] }} | ${{ type: 'LOAD_ENTITIES_REJECTED', payload: { status: 400 } }}                         | ${{ ...initialState, loaded: false, status: { isLoading: false, code: 400, hasError: true }, error: { status: 400 }, metadata: {}, columns: [{ key: 'testCol' }] }}
    ${[]}   | ${{ ...initialState, loaded: false, columns: [{ key: 'testCol' }] }} | ${{ type: 'SELECT_ENTITY', payload: [{ id: '83e97cde-74b4-4752-819d-704687bbc286' }] }} | ${{ ...initialState, loaded: false, columns: [{ key: 'testCol' }], selectedRows: { '83e97cde-74b4-4752-819d-704687bbc286': undefined } }}
  `('$action', ({ columns, state, action: { type, payload }, result }) => {
    const wrapperReducer = inventoryEntitiesReducer(columns, modifyInventory);
    const res = wrapperReducer(state, { type, payload });
    expect(res).toEqual(result);
  });

  it.each`
    columns | state                                                                | action                                              | result
    ${[]}   | ${{ ...initialState, loaded: false, columns: [{ key: 'testCol' }] }} | ${{ type: 'LOAD_ENTITIES_FULFILLED', payload: {} }} | ${{ ...initialState, loaded: false, columns: [{ key: 'testCol' }] }}
  `('$action', ({ columns, state, action: { type, payload }, result }) => {
    const wrapperReducer = inventoryEntitiesReducer(columns, modifyPackageSystems);
    const res = wrapperReducer(state, { type, payload });
    expect(res).toEqual(result);
  });

  it('should modifyInventory nicely', () => {
    const wrapperReducer = inventoryEntitiesReducer([{ key: 'updated' }], modifyInventory);
    const res = wrapperReducer(
      { ...initialState, loaded: true, columns: [{ key: 'testCol' }], rows: systemRows },
      { type: 'LOAD_ENTITIES_FULFILLED', payload: {} },
    );
    expect(res).toEqual({
      ...initialState,
      loaded: true,
      columns: [{ key: 'testCol' }],
      rows: expect.any(Object),
      status: {
        hasError: false,
        isLoading: false,
      },
    });
  });

  it('should use modifyPackageSystems nicely', () => {
    const wrapperReducer = inventoryEntitiesReducer([], modifyPackageSystems);
    const res = wrapperReducer(
      { ...initialState, loaded: true, rows: systemRows },
      { type: 'LOAD_ENTITIES_FULFILLED', payload: {} },
    );
    expect(res).toEqual({
      ...initialState,
      loaded: true,
      columns: [],
      rows: expect.any(Object),
    });
  });

  it('should return initial state on clear', () => {
    const wrapperReducer = inventoryEntitiesReducer([], modifyPackageSystems);

    const res = wrapperReducer(
      { ...initialState, loaded: false, columns: [{ key: 'testCol' }] },
      { type: 'CLEAR_INVENTORY_REDUCER', payload: {} },
    );
    expect(res).toEqual({
      entities: [],
      metadata: {
        limit: 20,
        offset: 0,
        total_items: 0,
      },
      page: 1,
      perPage: 20,
      rows: [],
      selectedRows: {},
      status: {},
    });
  });
});
