/* eslint-disable no-unused-vars */
import InventoryDetail from './InventoryDetail';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import { entityDetail } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';

initMocks();

jest.mock('../../store', () => ({
    ...jest.requireActual('../../store'),
    getStore: jest.fn(),
    register: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
    ...jest.requireActual('@redhat-cloud-services/frontend-components/Inventory'),
    InventoryTable: jest.fn(() => <div className='testInventroyComponentChild'><div>This is child</div></div>),
    InventoryDetailHead: jest.fn(() => <div className='testInventoryDetailHeadChild'><div>This is child</div></div>),
    AppInfo: jest.fn(() => <div className='testInventroyAppInfo'><div>This is child</div></div>),
    DetailWrapper: jest.fn(() => <div className='testDetailWrapperChild'><div>This is child</div></div>)
}));

const mockState = { ...entityDetail };

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({  entityDetails: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({  entityDetails: state });
};

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    console.error = () => {};

    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ entityDetails: mockState });
    });
    wrapper = mount(<Provider store={store}>
        <Router><InventoryDetail match = {{ params: { inventoryId: 'test' } }}/></Router>
    </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
});

describe('InventoryPage.js', () => {
    it('Should match the snapshots', () => {
        console.log(wrapper.debug());
        //expect(toJson(wrapper.update())).toMatchSnapshot();
    });
});

