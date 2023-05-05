import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { Select, SelectOption } from '@patternfly/react-core';

import SelectExistingSets from './SelectExistingSets';
import { initialState } from '../../../store/Reducers/PatchSetsReducer';
import { initMocks } from '../../../Utilities/unitTestingUtilities.js';
import { patchSets } from '../../../Utilities/RawDataForTesting';

initMocks();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

const mockChage = jest.fn((payload) => { return payload; });

jest.mock('@data-driven-forms/react-form-renderer/use-form-api', () => () => ({
    change: mockChage
})
);

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({ PatchSetsStore: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({ PatchSetsStore: state });
};

let wrapper;
let store = initStore(initialState);

beforeEach(() => {
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({
            PatchSetsStore: {
                ...initialState,
                rows: patchSets,
                status: { ...initialState, isLoading: false }
            }
        });
    });
    wrapper = mount(<Provider store={store}>
        <Router>
            <SelectExistingSets
                setSelectedPatchSet={jest.fn()}
                systems={['test-system']}
            />
        </Router>
    </Provider>);
});

describe('SelectExistingSets', () => {
    it('Should fetch patch-sets on mount with limit 10', () =>{
        const actions = store.getActions();
        expect(actions[0].type).toEqual('FETCH_ALL_PATCH_SETS');
    });

    it('Should calculate Select options after patch-sets are loaded', () => {
        const selectOptions = wrapper.find(SelectOption);

        expect(selectOptions).toMatchSnapshot();
    });

    it('Should handle patch-set selection', () => {
        act(() => wrapper.find(Select).props().onSelect(null, 'test-set-1'));
        expect(mockChage).toHaveBeenCalledWith(
            'existing_patch_set',
            { id: 1, name: 'test-set-1', systems: ['test-system'] }
        );
    });
});
