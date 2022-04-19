import InventoryDetail from './InventoryDetail';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import { entityDetail } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFeatureFlag } from '../../Utilities/Hooks';

initMocks();

jest.mock('../../Utilities/Hooks', () => ({
    ...jest.requireActual('../../Utilities/Hooks'),
    useFeatureFlag: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
    ...jest.requireActual('@redhat-cloud-services/frontend-components/Inventory'),
    InventoryTable: jest.fn(() => <div className='testInventroyComponent'><div>This is child</div></div>),
    InventoryDetailHead: jest.fn(() => <div className='testInventoryDetailHead'><div>This is child</div></div>),
    AppInfo: jest.fn(() => <div className='testInventroyAppInfo'><div>This is child</div></div>),
    DetailWrapper: jest.fn(({ children }) => <div className='testDetailWrapper'><div>{children}</div></div>)
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
        expect(toJson(wrapper.update())).toMatchSnapshot();
    });

    describe('test patch-set: ', () => {
        it('Should hide actions dropdown for patch-set when flag is disabled', () => {
            useFeatureFlag.mockReturnValue(false);

            const tempWrapper = mount(<Provider store={store}>
                <Router><InventoryDetail match={{ params: { inventoryId: 'test' } }} /></Router>
            </Provider>);

            const { actions } = tempWrapper.find('.testInventoryDetailHead').parent().props();

            expect(actions).toBeFalsy();
            expect(tempWrapper.update().find('.patch-set').length).toBe(0);
        });

        it('Should show actions dropdown for patch-set when flag is enabled', () => {
            useFeatureFlag.mockReturnValue(true);

            const tempWrapper = mount(<Provider store={store}>
                <Router><InventoryDetail match={{ params: { inventoryId: 'test' } }} /></Router>
            </Provider>);

            const { actions } = tempWrapper.find('.testInventoryDetailHead').parent().props();
            actions[0].onClick();

            expect(actions.length).toEqual(1);
            expect(tempWrapper.update().find('.patch-set').length).toBe(2);
        });
    });
});

