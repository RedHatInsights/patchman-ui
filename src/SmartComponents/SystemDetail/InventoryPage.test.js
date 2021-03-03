import InventoryPage from './InventoryPage';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import { entityDetail } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';

/* eslint-disable */
initMocks()


jest.mock('../../store', () => ({
    ...jest.requireActual('../../store'),
    getStore: jest.fn(),
    register: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

const mockState = { ...entityDetail };

const initStore = (state) => {
    const customMiddleWare = store => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({  entityDetails: state });
        });
        next(action);
    };
    const mockStore = configureStore([customMiddleWare]);
    return mockStore({  entityDetails: state });
}

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    console.error = () => {};
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ entityDetails: mockState });
    });
    wrapper = mount(<Provider store={store}>
            <Router><InventoryPage match = {{ params: { inventoryId: 'test' } }}/></Router>
        </Provider>); 
});

afterEach(() => {
    useSelector.mockClear();
});

describe('InventoryPage.js', () => {
    it('Should match the snapshots', () => {
        expect(toJson(wrapper.update())).toMatchSnapshot();
    });
});
/* eslint-enable */
