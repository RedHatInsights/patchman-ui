import { initialState, SystemDetailStore } from './SystemDetailStore';

/* eslint-disable */

const stateAfterAction = {
    loaded: true
};
describe('SystemDetailStore', () => {
    it.each`
    state                                               | action                                               | result
    ${initialState}                                     | ${{ type: 'TEST_INVALID_ACTION', payload: {} }}      | ${{ loaded: false }}
    ${undefined}                                        | ${{ type: 'LOAD_ENTITY_FULFILLED', payload: {} }}    | ${{ ...initialState, ...stateAfterAction }}
    ${{ ...initialState, test: 'testState' }}           | ${{ type: 'LOAD_ENTITY_FULFILLED', payload: {} }}    | ${{ ...initialState, ...stateAfterAction, test: 'testState' }}
    ${undefined}                                        | ${{ type: 'LOAD_ENTITY_REJECTED', payload: {} }}     | ${{ ...initialState, ...stateAfterAction, }}
    ${{ ...initialState, test: 'testState' }}           | ${{ type: 'LOAD_ENTITY_REJECTED', payload: {} }}     | ${{ ...initialState, ...stateAfterAction, test: 'testState' }}
    ${initialState}                                     | ${{ type: 'LOAD_ENTITY_FULFILLED', payload: { data: { attributes: { third_party: true } } } }}    | ${{ ...initialState, loaded: true }}
    `('$action', ({ state, action: { type, payload }, result }) => {
        const res = SystemDetailStore(state, { type, payload });
        expect(res).toEqual(result);
    });
});

/* eslint-enable */
